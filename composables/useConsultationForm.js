import { ref, computed, nextTick } from 'vue';
import { useContent } from '~/composables/useContent';

// Dipakai bersama oleh semua pemanggil composable (ConsultationModal &
// MemberGetMemberModal) supaya script Google hanya diunduh sekali.
let recaptchaScriptPromise = null;

// Jaringan seluler bisa jauh lebih lambat dari WiFi. Timeout 10 detik yang lama
// sering habis duluan di HP sehingga verifikasi tidak pernah tampil padahal
// script-nya sebenarnya baik-baik saja, cuma telat.
const RECAPTCHA_LOAD_TIMEOUT_MS = 25000;

export function useConsultationForm() {
  const { content } = useContent();
  const config = useRuntimeConfig();

  const state = ref('idle'); // idle | editing | captcha | submitting | success | error | notConfigured
  const captchaToken = ref(null);
  const pendingPayload = ref(null);
  const captchaLoading = ref(false);
  const captchaErrorMsg = ref('');

  let submissionInProgress = false;
  let recaptchaWidgetId = null;
  // Catatan: reCAPTCHA bisa gagal diam-diam kalau domain belum didaftarkan di
  // Google reCAPTCHA Admin Console. Kasus itu ditangani lewat `error-callback`
  // Google plus verifyWidgetVisible() — pengecekan yang hanya melihat apakah
  // iframe widget benar-benar terpasang, jadi user yang sekadar lambat mengisi
  // tidak ikut kena peringatan palsu. Sebagai pengaman terakhir, tombol
  // "Muat Ulang Verifikasi" + fallback WhatsApp selalu tampil di langkah captcha.

  const isSubmitting = computed(() => state.value === 'submitting');
  const isSuccess = computed(() => state.value === 'success');
  const isError = computed(() => state.value === 'error');
  const isCaptchaStep = computed(() => state.value === 'captcha');
  const isNotConfigured = computed(() => state.value === 'notConfigured');

  const waFallbackUrl = computed(() => {
    const number = content.meta.whatsapp.number;
    const project = content.meta.projectName;
    const msg = content.meta.whatsapp.templates.konsultasiForm?.replace('{project}', project)
      || `Halo, saya ingin konsultasi mengenai ${project}.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  });

  const captchaSiteKey = computed(() => config.public.captchaSiteKey || '');
  const sheetEndpoint = computed(() => config.public.sheetEndpoint || '');

  function submit(payload) {
    pendingPayload.value = payload;
    captchaErrorMsg.value = '';
    state.value = 'captcha';
  }

  function onCaptchaSuccess(token) {
    if (token === 'DEV_BYPASS' && !import.meta.dev) {
      console.warn('[useConsultationForm] DEV bypass ditolak di production.');
      state.value = 'notConfigured';
      return;
    }
    captchaToken.value = token;
    captchaErrorMsg.value = '';
    sendToSpreadsheet();
  }

  function onCaptchaError(reason) {
    console.error('[useConsultationForm] CAPTCHA Error:', reason);
    if (reason === 'not_configured') {
      state.value = 'notConfigured';
    } else if (reason === 'expired') {
      captchaErrorMsg.value = content.consultationForm.messages.captchaExpired;
      resetRecaptchaWidget();
    } else {
      captchaErrorMsg.value = content.consultationForm.messages.captchaFailed;
    }
  }

  /**
   * Loader script Google reCAPTCHA. Idempoten: dipanggil berapa kali pun,
   * script hanya diunduh sekali dan semua pemanggil menunggu promise yang sama.
   */
  function loadRecaptchaScript() {
    if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      return Promise.resolve(window.grecaptcha);
    }
    if (recaptchaScriptPromise) return recaptchaScriptPromise;

    recaptchaScriptPromise = new Promise((resolve, reject) => {
      let settled = false;
      let pollId = null;
      const settle = (fn, arg) => {
        if (settled) return;
        settled = true;
        if (pollId) clearInterval(pollId);
        fn(arg);
      };
      const tryResolve = () => {
        if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
          settle(resolve, window.grecaptcha);
          return true;
        }
        return false;
      };

      let script = document.querySelector('script[src*="recaptcha/api.js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      // Script tag-nya sudah dipasang di nuxt.config.ts, jadi cabang di atas
      // jarang jalan. Listener error tetap dipasang ke tag yang sudah ada supaya
      // ad-blocker / jaringan yang memblokir www.google.com kebaca sebagai error
      // eksplisit, bukan sekadar timeout.
      script.addEventListener('error', () => settle(reject, new Error('RECAPTCHA_SCRIPT_BLOCKED')));

      // api.js selesai diunduh belum tentu berarti grecaptcha.render sudah ada
      // (api.js masih menarik bundle turunannya), jadi tetap dipoll sampai siap.
      const deadline = Date.now() + RECAPTCHA_LOAD_TIMEOUT_MS;
      pollId = setInterval(() => {
        if (tryResolve()) return;
        if (Date.now() > deadline) settle(reject, new Error('RECAPTCHA_TIMEOUT'));
      }, 150);

      tryResolve();
    });

    // Dinolkan lagi kalau gagal, supaya tombol "Muat Ulang Verifikasi"
    // benar-benar mencoba dari nol dan tidak nyangkut di promise yang sudah reject.
    recaptchaScriptPromise.catch(() => { recaptchaScriptPromise = null; });
    return recaptchaScriptPromise;
  }

  /**
   * Widget reCAPTCHA ukuran "normal" lebarnya tetap 304px. Modal punya padding
   * 24px kiri-kanan, jadi di viewport < 352px widget itu meluber. Solusinya
   * memakai varian resmi "compact" (164px) — BUKAN CSS transform: scale(),
   * karena transform apa pun pada elemen leluhur membuat popup challenge
   * (position: fixed) ikut terkurung di kotak widget dan tidak pernah terlihat.
   */
  function pickCaptchaSize() {
    if (typeof window === 'undefined') return 'normal';
    return window.innerWidth < 352 ? 'compact' : 'normal';
  }

  /**
   * grecaptcha.render() bisa "berhasil" tapi iframe-nya tidak pernah muncul,
   * misalnya kalau domain belum terdaftar di reCAPTCHA Admin Console. Tanpa cek
   * ini user hanya melihat kotak kosong tanpa penjelasan apa pun.
   */
  function verifyWidgetVisible(containerEl) {
    setTimeout(() => {
      if (state.value !== 'captcha' || captchaErrorMsg.value) return;
      const iframe = containerEl.querySelector('iframe');
      if (!iframe || iframe.offsetHeight === 0) {
        captchaErrorMsg.value = content.consultationForm.messages.captchaStuck;
      }
    }, 6000);
  }

  /**
   * Render widget reCAPTCHA ke elemen DOM
   */
  async function renderRecaptchaWidget(containerEl) {
    if (!containerEl) return;
    if (!captchaSiteKey.value) {
      captchaLoading.value = false;
      onCaptchaError('not_configured');
      return;
    }

    captchaLoading.value = true;
    captchaErrorMsg.value = '';

    let grecaptcha;
    try {
      grecaptcha = await loadRecaptchaScript();
    } catch (err) {
      console.error('[useConsultationForm] load script error:', err);
      captchaLoading.value = false;
      captchaErrorMsg.value = content.consultationForm.messages.captchaFailed;
      return;
    }

    const doRender = () => {
      try {
        containerEl.innerHTML = '';
        recaptchaWidgetId = grecaptcha.render(containerEl, {
          sitekey: captchaSiteKey.value,
          size: pickCaptchaSize(),
          callback: (token) => onCaptchaSuccess(token),
          'expired-callback': () => onCaptchaError('expired'),
          'error-callback': () => onCaptchaError('error'),
        });
        captchaLoading.value = false;
        verifyWidgetVisible(containerEl);
      } catch (renderErr) {
        console.error('[useConsultationForm] render error:', renderErr);
        captchaLoading.value = false;
        captchaErrorMsg.value = content.consultationForm.messages.captchaRenderFailed;
      }
    };

    if (typeof grecaptcha.ready === 'function') grecaptcha.ready(doRender);
    else doRender();
  }

  function resetRecaptchaWidget() {
    if (recaptchaWidgetId !== null && typeof window !== 'undefined' && window.grecaptcha?.reset) {
      try {
        window.grecaptcha.reset(recaptchaWidgetId);
      } catch (e) {
        console.warn('Error resetting widget:', e);
      }
    }
    recaptchaWidgetId = null;
  }

  async function sendToSpreadsheet() {
    if (submissionInProgress) return;
    const endpoint = sheetEndpoint.value;
    if (!endpoint) {
      state.value = 'notConfigured';
      return;
    }
    if (!captchaToken.value || !pendingPayload.value) {
      state.value = 'error';
      return;
    }

    state.value = 'submitting';
    submissionInProgress = true;

    try {
      const payload = {
        ...pendingPayload.value,
        timestamp: new Date().toISOString(),
        source: pendingPayload.value.source || 'landing-page-sipar',
        captchaToken: captchaToken.value,
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        try {
          const result = await res.json();
          if (result.success) {
            state.value = 'success';
          } else {
            console.error('[useConsultationForm] Server error:', result);
            state.value = 'error';
          }
        } catch {
          state.value = 'success';
        }
      } else {
        state.value = 'error';
      }
    } catch (_err) {
      console.error('[useConsultationForm] Fetch error:', _err);
      state.value = 'error';
    } finally {
      submissionInProgress = false;
    }
  }

  function reset() {
    state.value = 'idle';
    captchaToken.value = null;
    pendingPayload.value = null;
    captchaLoading.value = false;
    captchaErrorMsg.value = '';
    submissionInProgress = false;
    resetRecaptchaWidget();
  }

  /** Render ulang widget reCAPTCHA dari nol (dipakai tombol "Muat Ulang Verifikasi"). */
  async function retryCaptcha(containerEl) {
    captchaErrorMsg.value = '';
    captchaToken.value = null;
    resetRecaptchaWidget();
    if (containerEl) {
      containerEl.innerHTML = '';
      await renderRecaptchaWidget(containerEl);
    }
  }

  function devBypassCaptcha() {
    if (!import.meta.dev) return;
    onCaptchaSuccess('DEV_BYPASS');
  }

  return {
    state,
    captchaToken,
    isSubmitting,
    isSuccess,
    isError,
    isCaptchaStep,
    isNotConfigured,
    waFallbackUrl,
    captchaSiteKey,
    sheetEndpoint,
    captchaLoading,
    captchaErrorMsg,
    submit,
    onCaptchaSuccess,
    onCaptchaError,
    reset,
    renderRecaptchaWidget,
    resetRecaptchaWidget,
    retryCaptcha,
    devBypassCaptcha,
  };
}
