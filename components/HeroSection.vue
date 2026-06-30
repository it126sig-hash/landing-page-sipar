<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { useContent } from '~/composables/useContent';

const { content, houseTypes } = useContent();

const primaryType = computed(() => houseTypes.find(t => t.id === content.hero.primaryTypeId));

const heroSpecs = computed(() => primaryType.value ? [
  { label: 'LB', value: primaryType.value.lb },
  { label: 'LT', value: primaryType.value.lt },
  { label: 'K. Tidur', value: primaryType.value.kt },
  { label: 'K. Mandi', value: primaryType.value.km },
] : []);

// --- tunable load-in timeline constants ---
const HERO_DURATION = 0.7;
const HERO_EASE = 'power3.out';
const HERO_STAGGER = 0.15;
const HERO_Y_OFFSET = 24;

const badgeRef = ref(null);
const headlineRef = ref(null);
const subRef = ref(null);
const chipsRef = ref(null);
const statRef = ref(null);
const ctaRef = ref(null);

let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.timeline({ defaults: { duration: HERO_DURATION, ease: HERO_EASE } })
      .from(badgeRef.value, { autoAlpha: 0, y: HERO_Y_OFFSET })
      .from(headlineRef.value.children, { autoAlpha: 0, y: HERO_Y_OFFSET, stagger: HERO_STAGGER }, '-=0.4')
      .from(subRef.value, { autoAlpha: 0, y: HERO_Y_OFFSET }, '-=0.3')
      .from(chipsRef.value.children, { autoAlpha: 0, y: HERO_Y_OFFSET, stagger: HERO_STAGGER }, '-=0.3')
      .from(statRef.value, { autoAlpha: 0, y: HERO_Y_OFFSET }, '-=0.2')
      .from(ctaRef.value.children, { autoAlpha: 0, y: HERO_Y_OFFSET, stagger: HERO_STAGGER }, '-=0.2');
  });
});

onUnmounted(() => ctx?.revert());
</script>

<template>
  <section class="relative flex min-h-screen items-center overflow-hidden px-4 py-16 sm:px-5 lg:px-10">
    <div class="absolute inset-0 bg-[url('/assets/images/hero.webp')] bg-cover bg-center"></div>
    <div class="absolute inset-0 bg-forest-deep/90 lg:bg-forest-deep/50 lg:bg-gradient-to-r lg:from-forest-deep/70 lg:via-forest-deep/35 lg:to-forest-deep/0"></div>

    <div class="relative mx-auto grid w-full max-w-[1200px] gap-10 pb-8 lg:grid-cols-2 lg:items-center">
      <div>
        <span ref="badgeRef"
          class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-jakarta text-xs font-semibold uppercase tracking-wide text-white">
          <span class="h-[7px] w-[7px] rounded-full bg-orange"></span>{{ content.hero.badge }}
        </span>

        <h1 ref="headlineRef" class="mt-4 font-sora text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          <span v-for="(line, i) in content.hero.headlineLines" :key="i" class="block"
            :class="{ 'text-orange': i === content.hero.headlineLines.length - 1 }">
            {{ line }}
          </span>
        </h1>
        <p ref="subRef" class="mt-4 max-w-md font-jakarta text-lg text-sage-mist">{{ content.hero.sub }}</p>

        <div ref="chipsRef" class="mt-6 flex flex-wrap gap-2">
          <span v-for="chip in content.hero.chips" :key="chip.id"
            class="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-jakarta text-white">
            {{ chip.label }}
          </span>
        </div>

        <div ref="statRef" class="mt-6 flex flex-wrap items-center gap-5 rounded-2xl bg-white/10 px-6 py-5">
          <div>
            <div class="font-jakarta text-xs font-bold uppercase tracking-wide text-sage-medium">Cicilan Mulai</div>
            <div class="flex items-baseline gap-1.5 font-sora text-white">
              <span class="text-3xl font-extrabold sm:text-4xl">{{ content.installment.stat }}</span>
              <span class="font-jakarta text-base text-sage-mist">{{ content.installment.statSuffix }}</span>
            </div>
          </div>
          <div class="h-full w-px self-stretch bg-white/15"></div>
          <p class="max-w-[180px] font-jakarta text-sm leading-snug text-sage-mist">
            Flat sepanjang tenor<br><span class="opacity-70">{{ content.installment.disclaimer }}</span>
          </p>
        </div>

        <div ref="ctaRef" class="mt-6 flex flex-wrap gap-3">
          <WhatsAppButton message-key="konsultasi" variant="primary">
            Konsultasi via WhatsApp →
          </WhatsAppButton>
          <BaseButton href="#tipe" variant="secondary" class="!border-white !text-white hover:!bg-white/10">Lihat Tipe
            Rumah</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
