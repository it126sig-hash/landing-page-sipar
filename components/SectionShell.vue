<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

defineProps({
  id: { type: String, default: null },
  bg: { type: String, default: 'bg-white' },
});

// --- tunable reveal constants ---
const REVEAL_DURATION = 0.7;
const REVEAL_EASE = 'power2.out';
const REVEAL_Y_OFFSET = 40;
const SCROLL_START = 'top 85%';

const sectionRef = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(sectionRef.value, {
      autoAlpha: 0,
      y: REVEAL_Y_OFFSET,
      duration: REVEAL_DURATION,
      ease: REVEAL_EASE,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: SCROLL_START,
        toggleActions: 'play none none none',
      },
    });
  }, sectionRef);
});

onUnmounted(() => ctx?.revert());
</script>

<template>
  <section :id="id" ref="sectionRef" class="scroll-mt-16 px-4 py-20 sm:px-5 sm:py-24 lg:px-10 lg:py-32" :class="bg">
    <div class="mx-auto max-w-[1200px]">
      <slot />
    </div>
  </section>
</template>
