<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { useContent } from '~/composables/useContent';

const { content } = useContent();

const isLoading = ref(true);
const rootEl = ref(null);

onMounted(() => {
  if (document.readyState === 'complete') {
    fadeOut();
  } else {
    window.addEventListener('load', fadeOut, { once: true });
  }
});

function fadeOut() {
  gsap.to(rootEl.value, {
    autoAlpha: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => { isLoading.value = false; },
  });
}
</script>

<template>
  <div v-if="isLoading" ref="rootEl" class="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-forest-deep">
    <img :src="content.meta.logo" :alt="`Logo ${content.meta.projectName}`" class="h-16 w-16 object-contain" />
    <span class="font-sora text-sm font-bold uppercase tracking-wide text-off-white">{{ content.meta.projectName }}</span>
    <span class="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent"></span>
  </div>
</template>
