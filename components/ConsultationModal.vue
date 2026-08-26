<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useContent } from '~/composables/useContent';
import { useConsultationForm } from '~/composables/useConsultationForm';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);

const { content } = useContent();
const cf = content.consultationForm;

const {
  state,
  isCaptchaStep,
  isSubmitting,
  isSuccess,
  isError,
  isNotConfigured,
  waFallbackUrl,
  captchaSiteKey,
  captchaLoading,
  captchaErrorMsg,
  retryCaptcha,
  submit: submitToEngine,
  reset: resetEngine,
  renderRecaptchaWidget,
} = useConsultationForm();

// ── Form State & Validation ────────────────────────────────────
const form = ref({
  name: '',
  phone: '',
  need: '',
  message: '',
});
const errors = ref({});

function normalizePhone(phone) {
  let p = (phone || '').trim().replace(/[\s\-().]/g, '').replace(/\D/g, '');
  if (p.startsWith('0')) p = '62' + p.slice(1);
  if (p.startsWith('8')) p = '62' + p;
  return p;
}

function isValidIndonesianPhone(phone) {
  const p = normalizePhone(phone);
  return /^62[0-9]{8,13}$/.test(p);
}

function validateForm() {
  const errs = {};
  const { validation } = cf;

  const name = (form.value.name || '').trim();
  if (!name) errs.name = validation.nameRequired;
  else if (name.length < 2) errs.name = validation.nameMin;

  const phone = (form.value.phone || '').trim();
  if (!phone) errs.phone = validation.phoneRequired;
  else if (!isValidIndonesianPhone(phone)) errs.phone = validation.phoneInvalid;

  if (!form.value.need) errs.need = validation.needRequired;

  errors.value = errs;
  return Object.keys(errs).length === 0;
}

function handleSubmit() {
  state.value = 'editing';
  if (!validateForm()) return;
  
  submitToEngine({
    formType: 'consultation',
    name: form.value.name.trim(),
    phone: normalizePhone(form.value.phone),
    need: form.value.need,
    message: (form.value.message || '').trim(),
    source: 'landing-page-sipar'
  });
}

function resetForm() {
  form.value = { name: '', phone: '', need: '', message: '' };
  errors.value = {};
  resetEngine();
}

const recaptchaContainer = ref(null);

// ── Keyboard & scroll lock ────────────────────────────────────
function onKeydown(e) {
  if (e.key === 'Escape' && props.isOpen) emit('close');
}
onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));

watch(() => props.isOpen, (open) => {
  if (open) {
    resetForm();
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  } else {
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }
});

function handleClose() {
  if (typeof document !== 'undefined') document.body.style.overflow = '';
  emit('close');
}

// ── Watch state: render reCAPTCHA saat masuk state 'captcha' ──
watch(state, async (s) => {
  if (s === 'captcha') {
    await nextTick();
    if (recaptchaContainer.value) {
      renderRecaptchaWidget(recaptchaContainer.value);
    }
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 overflow-y-auto"
        aria-modal="true"
        role="dialog"
        :aria-label="cf.title"
        @click.self="handleClose"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-full sm:translate-y-0 sm:scale-95 opacity-0"
          enter-to-class="translate-y-0 sm:scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 sm:scale-100 opacity-100"
          leave-to-class="translate-y-full sm:translate-y-0 sm:scale-95 opacity-0"
        >
          <div
            v-if="isOpen"
            class="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 md:p-8 shadow-2xl focus:outline-none sm:my-auto max-h-[90vh] overflow-y-auto"
            tabindex="-1"
          >
            <!-- Close Button -->
            <button
              type="button"
              aria-label="Tutup form konsultasi"
              class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF2ED] text-emerald-900 transition-colors hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#142B20]"
              @click="handleClose"
            >
              <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- ══════════════════════════════════════ -->
            <!-- STATE: idle / editing — Form           -->
            <!-- ══════════════════════════════════════ -->
            <div v-if="state === 'idle' || state === 'editing'">
              <div class="pr-8 mb-5">
                <h2 class="font-display text-2xl font-bold text-[#142B20]">{{ cf.title }}</h2>
                <p class="mt-1.5 text-sm text-gray-500 leading-relaxed">{{ cf.microcopy }}</p>
              </div>

              <form id="consultation-form" novalidate @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Nama -->
                <div>
                  <label for="cf-name" class="block text-sm font-semibold text-gray-800 mb-1.5">
                    {{ cf.labels.name }} <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cf-name"
                    v-model="form.name"
                    type="text"
                    autocomplete="name"
                    :placeholder="cf.placeholders.name"
                    :aria-invalid="!!errors.name"
                    :aria-describedby="errors.name ? 'cf-name-error' : undefined"
                    class="w-full rounded-xl border bg-[#FAF8F5] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition"
                    :class="errors.name ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:border-emerald-600 focus:ring-emerald-200'"
                  />
                  <p v-if="errors.name" id="cf-name-error" class="mt-1.5 text-xs text-red-500" role="alert">{{ errors.name }}</p>
                </div>

                <!-- Nomor WhatsApp -->
                <div>
                  <label for="cf-phone" class="block text-sm font-semibold text-gray-800 mb-1.5">
                    {{ cf.labels.phone }} <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cf-phone"
                    v-model="form.phone"
                    type="tel"
                    autocomplete="tel"
                    inputmode="tel"
                    :placeholder="cf.placeholders.phone"
                    :aria-invalid="!!errors.phone"
                    :aria-describedby="errors.phone ? 'cf-phone-error' : undefined"
                    class="w-full rounded-xl border bg-[#FAF8F5] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition"
                    :class="errors.phone ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:border-emerald-600 focus:ring-emerald-200'"
                  />
                  <p v-if="errors.phone" id="cf-phone-error" class="mt-1.5 text-xs text-red-500" role="alert">{{ errors.phone }}</p>
                </div>

                <!-- Kebutuhan -->
                <div>
                  <label for="cf-need" class="block text-sm font-semibold text-gray-800 mb-1.5">
                    {{ cf.labels.need }} <span class="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div class="relative">
                    <select
                      id="cf-need"
                      v-model="form.need"
                      :aria-invalid="!!errors.need"
                      :aria-describedby="errors.need ? 'cf-need-error' : undefined"
                      class="w-full appearance-none rounded-xl border bg-[#FAF8F5] px-4 py-3 text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 transition pr-10"
                      :class="errors.need ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:border-emerald-600 focus:ring-emerald-200'"
                    >
                      <option value="" disabled>{{ cf.placeholders.need }}</option>
                      <option v-for="cat in cf.categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                  <p v-if="errors.need" id="cf-need-error" class="mt-1.5 text-xs text-red-500" role="alert">{{ errors.need }}</p>
                </div>

                <!-- Pesan -->
                <div>
                  <label for="cf-message" class="block text-sm font-semibold text-gray-800 mb-1.5">
                    {{ cf.labels.message }}
                  </label>
                  <textarea
                    id="cf-message"
                    v-model="form.message"
                    rows="3"
                    :placeholder="cf.placeholders.message"
                    class="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 transition resize-none"
                  />
                </div>

                <!-- Submit -->
                <button type="submit" class="w-full rounded-full bg-[#EE8322] px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-[#d9741a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE8322]/60 mt-2">
                  {{ cf.submitLabel }}
                </button>
                <p class="text-center text-xs text-gray-400 pt-0.5">{{ cf.disclaimer }}</p>
              </form>
            </div>

            <!-- ══════════════════════════════════════ -->
            <!-- STATE: captcha — Security Check        -->
            <!-- ══════════════════════════════════════ -->
            <div v-else-if="isCaptchaStep" class="py-2">
              <div class="pr-8 mb-5">
                <h2 class="font-display text-xl font-bold text-[#142B20]">Verifikasi Keamanan</h2>
                <p class="mt-1 text-sm text-gray-500 leading-relaxed">Centang verifikasi berikut untuk mengirim pesan Anda.</p>
              </div>

              <!-- reCAPTCHA container -->
              <div class="my-4">
                <div v-if="captchaLoading" class="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div class="h-8 w-8 animate-spin rounded-full border-4 border-[#142B20] border-t-transparent"></div>
                  <p class="mt-2 text-sm text-gray-500">Memuat verifikasi reCAPTCHA...</p>
                </div>
                
                <!--
                  Widget reCAPTCHA punya lebar tetap 304px sehingga meluber keluar modal di layar <390px
                  (menimbulkan scroll horizontal di dalam modal). Wrapper di bawah menyusutkan widget secara
                  visual dan MENGUNCI kotak layout ke ukuran hasil scale, jadi tidak ada konten yang hilang
                  dan parameter render reCAPTCHA sama sekali tidak diubah.
                -->
                <!--
                  JANGAN bungkus container ini dengan overflow-hidden atau CSS transform.
                  Popup challenge (pilih gambar) dirender Google sebagai anak dari container
                  ini dengan position: fixed. overflow-hidden memotongnya, dan transform apa
                  pun (mis. scale) membuat position: fixed terkurung di dalam kotak widget —
                  dua-duanya bikin challenge tidak pernah terlihat, terutama di layar HP yang
                  jauh lebih sering dapat challenge gambar daripada desktop.
                  Lebar widget diatur lewat opsi `size` reCAPTCHA di useConsultationForm.js.
                -->
                <div class="flex justify-center">
                  <div ref="recaptchaContainer"></div>
                </div>
                <!-- Pesan error reCAPTCHA + jalan keluar.
                     Sebelumnya captchaErrorMsg tidak pernah dirender, sehingga kalau reCAPTCHA
                     gagal (domain belum terdaftar / script diblokir) user cuma lihat kotak mati. -->
                <p v-if="captchaErrorMsg" class="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs leading-relaxed text-amber-800" role="alert">
                  {{ captchaErrorMsg }}
                </p>
                <div class="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
                  <button type="button" class="w-full rounded-full border-2 border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors" @click="retryCaptcha(recaptchaContainer)">
                    {{ cf.captcha.retry }}
                  </button>
                  <p class="text-center text-[11px] text-gray-400">{{ cf.captcha.fallbackIntro }}</p>
                  <a :href="waFallbackUrl" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#20ba5a] transition-colors">
                    {{ cf.captcha.fallbackCta }}
                  </a>
                </div>

              </div>
            </div>

            <!-- ══════════════════════════════════════ -->
            <!-- STATE: submitting                      -->
            <!-- ══════════════════════════════════════ -->
            <div v-else-if="isSubmitting" class="py-8 flex flex-col items-center gap-4">
              <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#142B20] border-t-transparent"></div>
              <p class="text-sm font-medium text-gray-700">{{ cf.messages.submitting }}</p>
            </div>

            <!-- ══════════════════════════════════════ -->
            <!-- STATE: success                         -->
            <!-- ══════════════════════════════════════ -->
            <div v-else-if="isSuccess" class="py-4 flex flex-col items-center text-center gap-4">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 class="font-display text-xl font-bold text-[#142B20] mb-2">Pesan Terkirim!</h3>
                <p class="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{{ cf.messages.success }}</p>
              </div>
              <div class="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <a :href="waFallbackUrl" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:bg-[#20ba5a] transition-colors">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  {{ cf.successCtaWa }}
                </a>
                <button type="button" class="flex-1 rounded-full border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors" @click="handleClose">
                  {{ cf.successCtaClose }}
                </button>
              </div>
            </div>

            <!-- ══════════════════════════════════════ -->
            <!-- STATE: error                           -->
            <!-- ══════════════════════════════════════ -->
            <!-- ══════════════════════════════════════ -->
            <!-- STATE: notConfigured                   -->
            <!-- Tanpa cabang ini modal tampil KOSONG   -->
            <!-- kalau endpoint/site key belum ter-set. -->
            <!-- ══════════════════════════════════════ -->
            <div v-else-if="isNotConfigured" class="py-4 flex flex-col items-center text-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              </div>
              <div>
                <h3 class="font-display text-xl font-bold text-[#142B20] mb-2">{{ cf.notConfiguredTitle }}</h3>
                <p class="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{{ cf.messages.notConfigured }}</p>
              </div>
              <a :href="waFallbackUrl" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:bg-[#20ba5a] transition-colors">
                {{ cf.errorCtaWa }}
              </a>
            </div>
            <div v-else-if="isError" class="py-4 flex flex-col items-center text-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <div>
                <h3 class="font-display text-xl font-bold text-[#142B20] mb-2">Pengiriman Gagal</h3>
                <p class="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{{ cf.messages.error }}</p>
              </div>
              <div class="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <button type="button" class="flex-1 rounded-full bg-[#142B20] px-5 py-3 text-sm font-bold text-white hover:bg-[#0f1f17] transition-colors" @click="() => { state = 'idle'; }">
                  {{ cf.errorCtaRetry }}
                </button>
                <a :href="waFallbackUrl" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:bg-[#20ba5a] transition-colors">
                  {{ cf.errorCtaWa }}
                </a>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
