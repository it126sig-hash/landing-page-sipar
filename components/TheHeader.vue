<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useContent } from '~/composables/useContent';

const { content } = useContent();
const isSidebarOpen = ref(false);
const isScrolled = ref(false);

const checkScroll = () => {
  if (typeof window === 'undefined') return;
  isScrolled.value = window.scrollY > 100;
};

const onKeydown = (e) => {
  if (e.key === 'Escape' && isSidebarOpen.value) closeSidebar();
};

onMounted(() => {
  checkScroll();
  window.addEventListener('scroll', checkScroll, { passive: true });
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
  document.removeEventListener('keydown', onKeydown);
  if (typeof document !== 'undefined') document.body.style.overflow = '';
});

// Kunci scroll body selama drawer terbuka agar background tidak ikut ter-scroll di mobile.
watch(isSidebarOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
});

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-100">
    <div class="mx-auto flex h-16 w-full items-center justify-between px-4 md:px-20">
      <!-- Logo Left -->
      <a href="#" class="flex min-w-0 items-center gap-2 sm:gap-3">
        <img :src="content.meta.logo" :alt="`Logo ${content.meta.projectName}`"
          class="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
        <span class="flex flex-col leading-tight">
          <span class="font-body text-xs text-black sm:text-sm">Sanggar Indah</span>
          <span class="font-display text-base font-semibold text-black tracking-tight sm:text-lg lg:text-xl">PARAHYANGAN</span>
        </span>

        <!--
          Logo pengembang. Sengaja menempel pada logo proyek dan hanya dipisah garis
          tipis: kedekatan inilah yang membaca "satu pihak" tanpa perlu label teks.

          Tinggi dipilih dari keterbacaan, bukan dari rasio: baris "Sanggar Indah Group"
          hanya 18% tinggi aset, jadi butuh ~40px agar teksnya terbaca (~7,3px).
          Karena aset ini lebar-rendah (rasio 2,1), pada 40px ia tetap terbaca sebagai
          logo pendamping — bobot visualnya di bawah logo proyek meski selisih
          tingginya kecil.
        -->
        <span class="h-6 w-px shrink-0 bg-[#dedcd2] min-[400px]:h-7 sm:h-8 lg:h-9" aria-hidden="true"></span>
        <img :src="content.meta.logoGroupDark" :alt="content.meta.developer"
          class="h-5 w-auto shrink-0 object-contain min-[400px]:h-7 sm:h-9 lg:h-10" />
      </a>

      <!-- Center Empty Space -->
      <div class="flex-1"></div>

      <!-- Navigation Right (Desktop) -->
      <nav
        class="hidden items-center gap-8 lg:flex transition-[margin] duration-500 ease-in-out"
        :class="isScrolled ? 'mr-0' : 'mr-[154px]'"
      >
        <a href="#tentang" class="font-body text-base font-medium text-black hover:text-gray-700 transition-colors">
          Tentang Kami
        </a>
        <a href="#tipe" class="font-body text-base font-medium text-black hover:text-gray-700 transition-colors">
          Tipe Rumah
        </a>
        <a href="#lokasi" class="font-body text-base font-medium text-black hover:text-gray-700 transition-colors">
          Lokasi
        </a>
      </nav>

      <!-- Hamburger Button (Mobile & Tablet) -->
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center p-2 rounded-lg text-black hover:bg-gray-100 focus:outline-none lg:hidden ml-4"
        aria-label="Buka Menu"
        @click="isSidebarOpen = true"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile & Tablet Sidebar Drawer -->
    <Teleport to="body">
      <!-- Backdrop Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300 ease-linear"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300 ease-linear"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          @click="closeSidebar"
        ></div>
      </Transition>

      <!-- Drawer Content -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-in-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in-out"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="isSidebarOpen"
          class="fixed inset-y-0 right-0 z-[60] w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col justify-between p-6 lg:hidden overflow-y-auto"
        >
          <div>
            <!-- Header Sidebar (Logo & Close Button) -->
            <div class="flex items-center justify-between pb-6 border-b border-gray-100">
              <span class="font-display text-lg font-bold text-[#142b20]">SIPAR</span>
              <button
                type="button"
                class="p-2 text-gray-500 hover:text-black rounded-lg focus:outline-none"
                aria-label="Tutup Menu"
                @click="closeSidebar"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Navigation Links -->
            <nav class="flex flex-col gap-5 pt-6">
              <a
                href="#tentang"
                class="font-body text-lg font-medium text-black hover:text-[#c9a84c] transition-colors"
                @click="closeSidebar"
              >
                Tentang Kami
              </a>
              <a
                href="#tipe"
                class="font-body text-lg font-medium text-black hover:text-[#c9a84c] transition-colors"
                @click="closeSidebar"
              >
                Tipe Rumah
              </a>
              <a
                href="#lokasi"
                class="font-body text-lg font-medium text-black hover:text-[#c9a84c] transition-colors"
                @click="closeSidebar"
              >
                Lokasi
              </a>
            </nav>
          </div>

          <!-- Bottom Sidebar Content -->
          <div class="pt-6 border-t border-gray-100">
            <WhatsAppButton
              message-key="konsultasi"
              class="w-full justify-center !bg-[#142b20] !bg-grad-forest !text-white hover:!bg-grad-forest-hover !py-3 !text-base !rounded-lg"
              @click="closeSidebar"
            >
              Hubungi WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>
