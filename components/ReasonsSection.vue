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

const listRef = ref(null);
const gridRef = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    [listRef.value, gridRef.value].forEach((el) => {
      if (!el) return;
      gsap.from(el.children, {
        autoAlpha: 0,
        y: REVEAL_Y_OFFSET,
        scale: REVEAL_SCALE_FROM,
        duration: REVEAL_DURATION,
        ease: REVEAL_EASE,
        stagger: REVEAL_STAGGER,
        scrollTrigger: {
          trigger: el,
          start: SCROLL_START,
          toggleActions: 'play none none none',
        },
      });
    });
  });
});

onUnmounted(() => ctx?.revert());
</script>

<template>
  <SectionShell id="alasan">
    <SectionHeading class="mx-auto text-center" eyebrow="Kenapa SIPAR"
      title="5 Alasan Memilih <br /> Sanggar Indah Parahyangan"
      subtitle="Lokasi strategis, lingkungan aman, dan nilai investasi yang terus bertumbuh." />
    <div ref="listRef"
      class="divide-y divide-cream-light rounded-[18px] border border-cream-light bg-off-white sm:hidden">
      <div v-for="r in content.reasons" :key="r.id" class="flex items-start gap-4 p-[18px_20px]">
        <div
          class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-mint-pale font-display text-base font-extrabold text-forest-deep">
          {{ r.num }}
        </div>
        <div>
          <h3 class="font-display text-base font-bold text-forest-deep">{{ r.title }}</h3>
          <p class="mt-1 font-body text-sm text-charcoal-gray">{{ r.desc }}</p>
        </div>
      </div>
    </div>
    <div ref="gridRef" class="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-5">
      <FeatureCard v-for="r in content.reasons" :key="r.id" :num="r.num" :title="r.title" :desc="r.desc" />
    </div>
  </SectionShell>
</template>
