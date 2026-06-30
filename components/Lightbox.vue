<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useLightbox } from '~/composables/useLightbox';

const { image, closeLightbox } = useLightbox();

function onKeydown(e) {
  if (e.key === 'Escape') closeLightbox();
}
onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="image"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 p-4"
      role="dialog"
      aria-modal="true"
      :aria-label="image.alt"
      @click.self="closeLightbox"
    >
      <button
        type="button"
        aria-label="Tutup"
        class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream-light bg-white text-xl text-forest-deep transition-colors hover:text-orange focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
        @click="closeLightbox"
      >
        ✕
      </button>
      <img :src="image.src" :alt="image.alt" class="max-h-[90vh] max-w-[90vw] rounded-xl object-contain" />
    </div>
  </Transition>
</template>
