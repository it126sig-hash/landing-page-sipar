<script setup>
defineProps({
  num: { type: String, default: null },
  icon: { type: String, default: null },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  stat: { type: String, default: null },
});
</script>

<template>
  <div class="rounded-[18px] border border-cream-light bg-off-white p-[26px_22px] shadow-[0_2px_8px_rgba(35,39,31,0.04)] transition-transform duration-200 hover:-translate-y-1">
    <div v-if="stat" class="mb-2 font-sora text-2xl font-extrabold text-forest-deep">{{ stat }}</div>
    <div
      v-else-if="num"
      class="mb-2 flex h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-mint-pale font-sora text-xl font-extrabold text-forest-deep"
    >
      {{ num }}
    </div>
    <div v-else-if="icon" class="mb-2 text-2xl">{{ icon }}</div>
    <h3 class="font-sora text-lg font-bold text-forest-deep">{{ title }}</h3>
    <p class="mt-1 font-jakarta text-sm text-charcoal-gray">{{ desc }}</p>
  </div>
</template>
