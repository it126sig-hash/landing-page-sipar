<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useContent } from '~/composables/useContent';
import MemberGetMemberModal from './MemberGetMemberModal.vue';

const { wa } = useContent();
const href = wa('konsultasi');

const isScrolled = ref(false);
const isDesktop = ref(false);

const isMenuOpen = ref(false);
const isModalOpen = ref(false);

const checkState = () => {
  if (typeof window === 'undefined') return;
  isScrolled.value = window.scrollY > 100;
  isDesktop.value = window.innerWidth >= 1024;
  if (!isScrolled.value && isDesktop.value) {
    isMenuOpen.value = false;
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const openModal = () => {
  isModalOpen.value = true;
  isMenuOpen.value = false;
};

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
  <!-- Mode Header: Desktop, belum scroll -->
  <Transition
    enter-active-class="transition-all duration-500 ease-in-out"
    enter-from-class="opacity-0 -translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-400 ease-in-out"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-95"
  >
    <a
      v-if="isDesktop && !isScrolled"
      :href="href"
      target="_blank"
      rel="noopener"
      class="fixed z-50 top-3 right-20 inline-flex items-center justify-center gap-2 font-body rounded-lg bg-[#142b20] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0f1f17] shadow-none"
    >
      <span>WhatsApp</span>
    </a>
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
    <div
      v-if="!isDesktop || isScrolled"
      class="fixed z-50 bottom-5 right-5 flex flex-col items-end gap-3"
    >
      <!-- Expanded Floating Menu Options -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-3 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-3 scale-95"
      >
        <div v-if="isMenuOpen" class="flex flex-col items-end gap-2.5">
          <!-- Button 1: Konsultasi Sekarang -->
          <a
            :href="href"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2.5 font-body rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-[#20ba5a] transition-all whitespace-nowrap"
            @click="isMenuOpen = false"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Konsultasi Sekarang</span>
          </a>

          <!-- Button 2: Isi Form Member Get Member -->
          <button
            type="button"
            class="inline-flex items-center gap-2.5 font-body rounded-full bg-[#142B20] px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-[#0f1f17] transition-all whitespace-nowrap"
            @click="openModal"
          >
            <svg class="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Isi Form Member Get Member</span>
          </button>
        </div>
      </Transition>

      <!-- Main Toggle Floating Button -->
      <button
        type="button"
        aria-label="Toggle WhatsApp Menu"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white shadow-[0_10px_22px_-10px_rgba(238,131,34,0.7)] animate-floatPulse hover:bg-[#D66F1A] transition-all"
        @click="toggleMenu"
      >
        <svg
          v-if="!isMenuOpen"
          class="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <svg
          v-else
          class="w-6 h-6 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>

  <!-- Member Get Member Modal -->
  <MemberGetMemberModal
    :is-open="isModalOpen"
    @close="isModalOpen = false"
  />
</template>

