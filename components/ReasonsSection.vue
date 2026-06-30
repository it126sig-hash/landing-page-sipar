<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { useContent } from '~/composables/useContent';

const { content } = useContent();

// --- tunable scroll-reveal constants ---
const REVEAL_DURATION = 0.6;
const REVEAL_EASE = 'power2.out';
const REVEAL_Y_OFFSET = 30;
const REVEAL_SCALE_FROM = 0.92;
const REVEAL_STAGGER = 0.1;
const SCROLL_START = 'top 85%';

const gridRef = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(gridRef.value.children, {
      autoAlpha: 0,
      y: REVEAL_Y_OFFSET,
      scale: REVEAL_SCALE_FROM,
      duration: REVEAL_DURATION,
      ease: REVEAL_EASE,
      stagger: REVEAL_STAGGER,
      scrollTrigger: {
        trigger: gridRef.value,
        start: SCROLL_START,
        toggleActions: 'play none none none',
      },
    });
  }, gridRef);
});

onUnmounted(() => ctx?.revert());
</script>

<template>
  <SectionShell id="alasan">
    <SectionHeading class="mx-auto text-center" eyebrow="Kenapa SIPAR"
      title="5 Alasan Memilih <br /> Sanggar Indah Parahyangan"
      subtitle="Lokasi strategis, lingkungan aman, dan nilai investasi yang terus bertumbuh." />
    <div ref="gridRef" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      <FeatureCard v-for="r in content.reasons" :key="r.id" :num="r.num" :title="r.title" :desc="r.desc" />
    </div>
  </SectionShell>
</template>
