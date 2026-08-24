import { ref, computed, nextTick } from 'vue';
import { useContent } from '~/composables/useContent';

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
  // Google reCAPTCHA Admin Console. Kasus itu SUDAH tertangani karena
  // `error-callback` Google terpanggil dan pesannya kini benar-benar dirender di
  // modal (sebelumnya captchaErrorMsg tidak pernah ditampilkan sama sekali).
  // Sengaja TIDAK memakai timer "stuck" buta: user yang sekadar lambat mengisi
  // akan ikut kena peringatan palsu. Sebagai pengaman terakhir, tombol
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
   * Loader script Google reCAPTCHA yang aman dan mendukung semua browser
   */
  function loadRecaptchaScript() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('SSR'));

      // Jika grecaptcha.render sudah ada
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        return resolve(window.grecaptcha);
      }

      // Pasang global callback
      window.__onRecaptchaLoaded = function() {
        if (window.grecaptcha) {
          resolve(window.grecaptcha);
        }
      };

      // Cek apakah script sudah ada
      let script = document.querySelector('script[src*="recaptcha/api.js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoaded&render=explicit';
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error('Gagal mengunduh script Google reCAPTCHA (mungkin terblokir ad-blocker)'));
        document.head.appendChild(script);
      }

      // Polling fallback jika callback tidak terpanggil
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
          clearInterval(checkInterval);
          resolve(window.grecaptcha);
        } else if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
          window.grecaptcha.ready(() => {
            if (typeof window.grecaptcha.render === 'function') {
              clearInterval(checkInterval);
              resolve(window.grecaptcha);
            }
          });
        }

        if (attempts > 50) { // 10 detik
          clearInterval(checkInterval);
          reject(new Error('Timeout memuat Google reCAPTCHA'));
        }
      }, 200);
    });
  }

  /**
   * Render widget reCAPTCHA ke elemen DOM
   */
  async function renderRecaptchaWidget(containerEl) {
    if (!containerEl) return;
    if (!captchaSiteKey.value) {
      captchaLoading.value = false;
      return;
    }

    captchaLoading.value = true;
    captchaErrorMsg.value = '';

    try {
      const grecaptcha = await loadRecaptchaScript();
      
      // Tunggu grecaptcha.ready
      grecaptcha.ready(() => {
        try {
          containerEl.innerHTML = '';
          recaptchaWidgetId = grecaptcha.render(containerEl, {
            sitekey: captchaSiteKey.value,
            callback: (token) => {
              onCaptchaSuccess(token);
            },
            'expired-callback': () => {
              onCaptchaError('expired');
            },
            'error-callback': () => {
              onCaptchaError('error');
            },
          });
          captchaLoading.value = false;
        } catch (renderErr) {
          console.error('[useConsultationForm] render error inside ready:', renderErr);
          captchaLoading.value = false;
          captchaErrorMsg.value = content.consultationForm.messages.captchaRenderFailed;
        }
      });
    } catch (err) {
      console.error('[useConsultationForm] load script error:', err);
      captchaLoading.value = false;
      captchaErrorMsg.value = content.consultationForm.messages.captchaFailed;
    }
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
