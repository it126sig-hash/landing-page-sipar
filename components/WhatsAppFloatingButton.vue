<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useContent } from '~/composables/useContent';
import MemberGetMemberModal from './MemberGetMemberModal.vue';
import KprTermsModal from './KprTermsModal.vue';
import ReferralWelcomeModal from './ReferralWelcomeModal.vue';

const { wa, content, withBase } = useContent();

const isScrolled = ref(false);
const isDesktop = ref(false);

// Modal states
const isKprModalOpen = ref(false);
const kprModalTitle = ref('');
const isMemberModalOpen = ref(false);

// Menu state — toggled by orange button
const isMenuOpen = ref(false);

const checkState = () => {
  if (typeof window === 'undefined') return;
  isScrolled.value = window.scrollY > 100;
  isDesktop.value = window.innerWidth >= 1024;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const openKprModal = (title) => {
  kprModalTitle.value = title;
  isKprModalOpen.value = true;
  closeMenu();
};

const openMemberModal = () => {
  isMemberModalOpen.value = true;
  closeMenu();
};

/** "Hubungi Kami" — langsung buka WhatsApp, tidak buka form */
const openWhatsAppDirect = () => {
  const number = content.meta.whatsapp.number;
  const project = content.meta.projectName;
  const msg = content.meta.whatsapp.templates.konsultasi?.replace('{project}', project)
    || `Halo, saya ingin konsultasi mengenai ${project}.`;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  closeMenu();
};

// Close menu when any modal opens
watch([isKprModalOpen, isMemberModalOpen], () => {
  closeMenu();
});

onMounted(() => {
  checkState();
  window.addEventListener('scroll', checkState, { passive: true });
  window.addEventListener('resize', checkState, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkState);
  window.removeEventListener('resize', checkState);
});
</script>

<template>
  <!--
    WhatsApp Floating Button — Final UX:
    Klik tombol orange → expand menu 4 pilihan:
      1. Syarat KPR BCA
      2. Syarat KPR BTN
      3. Isi Form Member Get Member
      4. Hubungi Kami (→ WhatsApp langsung)
  -->

  <!-- Mode Header: Desktop, belum scroll → dark button di navbar area -->
  <Transition
    enter-active-class="transition-all duration-500 ease-in-out"
    enter-from-class="opacity-0 -translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-400 ease-in-out"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-95"
  >
    <button
      v-if="isDesktop && !isScrolled"
      type="button"
      aria-label="Konsultasi dengan tim kami"
      class="fixed z-50 top-3 right-20 inline-flex items-center justify-center gap-2 font-body rounded-lg bg-[#142b20] bg-grad-forest px-6 py-2.5 text-sm font-semibold text-white shadow-btn-forest hover:bg-grad-forest-hover hover:-translate-y-0.5 hover:shadow-btn-forest-lg active:translate-y-0 transition-all duration-200"
      @click="openWhatsAppDirect"
    >
      <span>WhatsApp</span>
    </button>
  </Transition>

  <!-- Mode Floating: Mobile / setelah scroll -->
  <Transition
    enter-active-class="transition-all duration-500 ease-in-out"
    enter-from-class="opacity-0 translate-y-4 scale-90"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-300 ease-in-out"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-90"
  >
    <!--
      JANGAN pasang overflow-y-auto di container ini.

      Diukur langsung di browser: isinya 234,x px sehingga clientWidth
      dibulatkan ke bawah jadi 234 dan scrollWidth ke atas jadi 235. Selisih
      1 piksel dari pembulatan sub-piksel itu sudah cukup memunculkan
      scrollbar — dan karena menurut aturan CSS menyetel satu sumbu ke nilai
      non-visible membuat sumbu lainnya ikut jadi `auto`, yang muncul bukan
      satu tapi DUA scrollbar, horizontal dan vertikal, menempel di sebelah
      tombol WhatsApp.

      Isinya cuma 242px sementara ruang tersedia 820px, jadi kemampuan
      menggulir tidak pernah terpakai. max-h tetap dipertahankan sebagai
      pengaman kalau menunya bertambah banyak; kalau nanti benar-benar
      melebihi layar, kembalikan overflow-y-auto DAN pasangkan dengan
      overflow-x-hidden supaya kasus di atas tidak terulang.
    -->
    <div
      v-if="!isDesktop || isScrolled"
      class="fixed z-50 bottom-5 right-5 flex flex-col items-end gap-3 max-h-[calc(100vh-5rem)]"
      :style="{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }"
    >
      <!-- 4-item Menu -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-3 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-3 scale-95"
      >
        <div v-if="isMenuOpen" class="flex flex-col items-end gap-2.5">

          <!-- 1. Syarat KPR BCA -->
          <button
            type="button"
            class="inline-flex items-center gap-2.5 font-body rounded-full bg-[#142b20] bg-grad-forest px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-grad-forest-hover hover:-translate-y-0.5 hover:shadow-btn-forest-lg active:translate-y-0 shadow-btn-forest transition-all duration-200 whitespace-nowrap"
            @click="openKprModal('Syarat KPR BCA')"
          >
            <!-- Ikon dokumen generik diganti logo bank supaya dua tombol ini bisa
                 dibedakan sekilas — teksnya cuma beda tiga huruf di ujung. Logo
                 berlatar terang, jadi butuh alas putih agar terbaca di atas tombol
                 hijau tua. aria-hidden + alt kosong: nama banknya sudah diucapkan
                 oleh teks tombol di sebelahnya, kalau logo ikut dibacakan pembaca
                 layar akan menyebut "BCA" dua kali. -->
            <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-0.5" aria-hidden="true">
              <img :src="withBase('/assets/images/bank/bca.webp')" alt="" class="h-full w-full object-contain" />
            </span>
            <span>Syarat KPR BCA</span>
          </button>

          <!-- 2. Syarat KPR BTN -->
          <button
            type="button"
            class="inline-flex items-center gap-2.5 font-body rounded-full bg-[#142b20] bg-grad-forest px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-grad-forest-hover hover:-translate-y-0.5 hover:shadow-btn-forest-lg active:translate-y-0 shadow-btn-forest transition-all duration-200 whitespace-nowrap"
            @click="openKprModal('Syarat KPR BTN')"
          >
            <!-- Ikon dokumen generik diganti logo bank supaya dua tombol ini bisa
                 dibedakan sekilas — teksnya cuma beda tiga huruf di ujung. Logo
                 berlatar terang, jadi butuh alas putih agar terbaca di atas tombol
                 hijau tua. aria-hidden + alt kosong: nama banknya sudah diucapkan
                 oleh teks tombol di sebelahnya, kalau logo ikut dibacakan pembaca
                 layar akan menyebut "BCA" dua kali. -->
            <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-0.5" aria-hidden="true">
              <img :src="withBase('/assets/images/bank/btn.webp')" alt="" class="h-full w-full object-contain" />
            </span>
            <span>Syarat KPR BTN</span>
          </button>

          <!-- 3. Isi Form Member Get Member -->
          <button
            type="button"
            class="inline-flex items-center gap-2.5 font-body rounded-full bg-[#142b20] bg-grad-forest px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-grad-forest-hover hover:-translate-y-0.5 hover:shadow-btn-forest-lg active:translate-y-0 shadow-btn-forest transition-all duration-200 whitespace-nowrap"
            @click="openMemberModal"
          >
            <svg class="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Isi Form Member Get Member</span>
          </button>

          <!-- 4. Hubungi Kami → WhatsApp langsung -->
          <button
            type="button"
            class="inline-flex items-center gap-2.5 font-body rounded-full bg-[#25D366] bg-grad-wa px-4 py-2.5 text-xs font-bold text-white shadow-btn-wa hover:bg-grad-wa-hover hover:-translate-y-0.5 hover:shadow-btn-wa-lg active:translate-y-0 transition-all duration-200 whitespace-nowrap"
            @click="openWhatsAppDirect"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Hubungi Kami</span>
          </button>

        </div>
      </Transition>

      <!-- Orange WhatsApp button + Close/Menu toggle -->
      <div class="flex items-center gap-2">

        <!-- Close button (X) — hanya muncul saat menu terbuka -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-75"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-75"
        >
          <button
            v-if="isMenuOpen"
            type="button"
            aria-label="Tutup menu"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-[#142B20]/80 text-white hover:bg-[#142B20] transition-all shadow-md"
            @click="closeMenu"
          >
            <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Transition>

        <!-- PRIMARY: Orange WA button — toggles 4-item menu -->
        <button
          type="button"
          :aria-label="isMenuOpen ? 'Tutup menu' : 'Buka menu layanan'"
          :aria-expanded="isMenuOpen"
          class="flex h-14 w-14 items-center justify-center rounded-full bg-[#EE8322] bg-grad-orange text-white shadow-btn-orange hover:bg-grad-orange-hover hover:shadow-btn-orange-lg hover:scale-105 active:scale-100 transition-all duration-200"
          @click="toggleMenu"
        >
          <svg
            class="w-7 h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>

  <!-- ── Modals ─────────────────────────────────────────────── -->

  <!-- KPR Terms Modal (BTN & BCA — same dataset) -->
  <KprTermsModal
    :is-open="isKprModalOpen"
    :title="kprModalTitle"
    @close="isKprModalOpen = false"
  />

  <!-- Member Get Member Modal -->
  <MemberGetMemberModal
    :is-open="isMemberModalOpen"
    @close="isMemberModalOpen = false"
  />

  <!-- Sambutan untuk pengunjung yang masuk lewat QR / tautan berkode referral.
       Ditempatkan di sini karena komponen inilah pemilik isMemberModalOpen,
       jadi tombol "Lengkapi Data Saya" bisa langsung membuka formulirnya tanpa
       state tambahan yang dioper lintas komponen. -->
  <ReferralWelcomeModal @open-form="isMemberModalOpen = true" />
</template>
