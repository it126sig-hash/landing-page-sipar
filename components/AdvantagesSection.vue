<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { useContent } from '~/composables/useContent';
import FeatureCard from '~/components/FeatureCard.vue';

const { content } = useContent();

const advantagesRef = ref(null);
const statsRef = ref(null);

const REVEAL_DURATION = 0.6;
const REVEAL_EASE = 'power2.out';
const REVEAL_Y_OFFSET = 30;
const SCROLL_START = 'top 85%';

let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    [advantagesRef.value, statsRef.value].forEach((el) => {
      if (!el) return;
      gsap.from(el.children, {
        autoAlpha: 0,
        y: REVEAL_Y_OFFSET,
        duration: REVEAL_DURATION,
        ease: REVEAL_EASE,
        stagger: 0.1,
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
  <SectionShell id="keunggulan">
    <SectionHeading class="mx-auto text-center" eyebrow="Keunggulan" title="Mengapa Sanggar Indah Parahyangan?" subtitle="Lokasi strategis, lingkungan aman, dan potensi investasi yang terus tumbuh." />
    
    <div ref="advantagesRef" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <FeatureCard v-for="a in content.advantages" :key="a.id" :title="a.title" :desc="a.desc" :icon="a.icon" />
    </div>

    <div ref="statsRef" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <FeatureCard v-for="s in content.stats" :key="s.id" :stat="s.stat" :title="s.title" :desc="s.desc" />
    </div>
  </SectionShell>
</template>