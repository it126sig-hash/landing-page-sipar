<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useContent } from '~/composables/useContent';
import { useReferralFromUrl } from '~/composables/useReferralFromUrl';

/**
 * Sambutan untuk pengunjung yang datang lewat QR / tautan berkode referral.
 *
 * Syarat munculnya ketat: HANYA kalau ada ?kode= di URL DAN kodenya sudah
 * dikonfirmasi server. Pengunjung biasa — yang mengetik alamat situs langsung
 * atau datang dari Google — tidak pernah melihat apa pun di sini.
 */
const emit = defineEmits(['open-form']);

const { content } = useContent();
const copy = content.referralWelcome;
const { urlData, isUrlReferralValid } = useReferralFromUrl();

const isOpen = ref(false);
const primaryBtn = ref(null);

// Halaman punya layar pemuatan sendiri (LoadingScreen, memudar 0,6 detik setelah
// event `load`). Sambutan ditahan sampai itu lewat supaya tidak menumpuk di atas
// spinner dan terasa seperti dua lapis yang berebut perhatian.
const pageReady = ref(false);

/** Kunci penanda "sudah pernah dilihat", dipisah per kode. */
const seenKey = computed(() => `sipar:referral-welcome:${urlData.value?.kode_referal || ''}`);

function alreadySeen() {
  try {
    return sessionStorage.getItem(seenKey.value) === '1';
  } catch {
    // Mode penyamaran / penyimpanan diblokir. Bukan alasan untuk menyembunyikan
    // sambutan — paling banter ia tampil lagi kalau halaman dimuat ulang.
    return false;
  }
}

function rememberSeen() {
  try {
    sessionStorage.setItem(seenKey.value, '1');
  } catch { /* diabaikan, alasannya sama seperti di alreadySeen() */ }
}

/**
 * `kavling_dimiliki` datang lengkap dengan nama proyek di depannya, mis.
 * "SANGGAR INDAH PARAHYANGAN — CIKUR 1 No. 1". Nama proyeknya sudah tampil di
 * baris bawah, jadi yang disisakan hanya alamat kavlingnya. Kalau formatnya
 * berubah dan pemisahnya tidak ketemu, teks aslinya ditampilkan apa adanya.
 */
const kavlingShort = computed(() => {
  const raw = (urlData.value?.kavling_dimiliki || '').trim();
  if (!raw) return '';
  const parts = raw.split(/\s*[—–]\s*/);
  return parts.length > 1 ? parts.slice(1).join(' — ').trim() : raw;
});

const bodyText = computed(() =>
  copy.body.replace('{code}', urlData.value?.kode_referal || '')
);

function lockScroll(on) {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = on ? 'hidden' : '';
}

function dismiss() {
  isOpen.value = false;
  rememberSeen();
  lockScroll(false);
}

function openForm() {
  dismiss();
  emit('open-form');
}

function onKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) dismiss();
}

// Muncul begitu DUA syaratnya terpenuhi, tidak peduli mana yang tiba lebih dulu:
// halaman selesai dimuat, dan kode dari URL selesai diverifikasi.
watch([isUrlReferralValid, pageReady], ([valid, ready]) => {
  if (!valid || !ready || isOpen.value) return;
  if (alreadySeen()) return;
  isOpen.value = true;
  lockScroll(true);
  requestAnimationFrame(() => primaryBtn.value?.focus());
}, { immediate: true });

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
  const markReady = () => setTimeout(() => { pageReady.value = true; }, 700);
  if (document.readyState === 'complete') markReady();
  else window.addEventListener('load', markReady, { once: true });
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  lockScroll(false);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
      enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <!-- z-[65]: di atas LoadingScreen (z-60), tapi di bawah modal formulir
           (z-70) supaya saat sambutan menutup dan formulir membuka, formulirnya
           yang berada di depan. -->
      <div v-if="isOpen"
        class="fixed inset-0 z-[65] flex items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6"
        @click.self="dismiss">

        <Transition
          enter-active-class="transition duration-300 ease-out motion-reduce:transition-none"
          enter-from-class="scale-95 opacity-0 translate-y-3"
          enter-to-class="scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in motion-reduce:transition-none"
          leave-from-class="scale-100 opacity-100 translate-y-0"
          leave-to-class="scale-95 opacity-0 translate-y-3"
          appear>
          <div role="dialog" aria-modal="true" aria-labelledby="referral-welcome-name"
            class="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">

            <!-- Kop undangan.
                 Nama perujuk sengaja jadi satu-satunya elemen berukuran besar dan
                 satu-satunya yang memakai huruf display: yang membuat undangan ini
                 bernilai adalah bahwa ada ORANG yang mengundang, bukan promonya. -->
            <div class="relative bg-[#142b20] bg-grad-forest px-7 pb-8 pt-7 text-center">
              <button type="button" :aria-label="copy.closeLabel"
                class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
                @click="dismiss">
                <svg class="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <p class="font-body text-[10px] font-bold uppercase tracking-[0.24em] text-sage-mist">
                {{ copy.eyebrow }}
              </p>

              <p class="mt-6 font-body text-xs text-white/55">{{ copy.invitedBy }}</p>
              <p id="referral-welcome-name"
                class="mt-1 font-display text-[2rem] font-bold leading-tight text-white">
                {{ urlData?.nama_konsumen }}
              </p>

              <!-- Garis oranye tipis sebagai "segel" undangan. -->
              <span class="mx-auto mt-4 block h-px w-10 bg-orange" aria-hidden="true"></span>

              <!-- Alamat kavling = bukti bahwa yang mengundang benar-benar warga
                   di sini, bukan sekadar tautan afiliasi. -->
              <p v-if="kavlingShort" class="mt-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-mist">
                {{ kavlingShort }}
              </p>
              <p v-if="urlData?.nama_proyek" class="mt-0.5 font-body text-[11px] capitalize tracking-wide text-white/40">
                {{ urlData.nama_proyek.toLowerCase() }}
              </p>
            </div>

            <!-- Badan: satu kalimat yang menjelaskan apa yang SUDAH terjadi,
                 lalu satu langkah berikutnya yang jelas. -->
            <div class="px-7 py-6">
              <p class="text-center font-body text-sm leading-relaxed text-gray-600">
                {{ bodyText }}
              </p>

              <div class="mt-6 flex flex-col gap-2.5">
                <button ref="primaryBtn" type="button"
                  class="w-full rounded-full bg-[#EE8322] bg-grad-orange px-6 py-3.5 text-base font-bold text-white shadow-btn-orange transition-all duration-200 hover:-translate-y-0.5 hover:bg-grad-orange-hover hover:shadow-btn-orange-lg focus:outline-none focus:ring-2 focus:ring-orange/50 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                  @click="openForm">
                  {{ copy.primaryCta }}
                </button>
                <button type="button"
                  class="w-full rounded-full px-6 py-2.5 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  @click="dismiss">
                  {{ copy.secondaryCta }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
