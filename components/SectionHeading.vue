<script setup>
defineProps({
  eyebrow: { type: String, default: null },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
});
</script>

<template>
  <div class="mb-8 max-w-2xl">
    <p v-if="eyebrow" class="mb-2 font-jakarta text-sm font-semibold uppercase tracking-wide text-orange">{{ eyebrow }}</p>
    <h2 class="font-sora text-3xl font-extrabold text-forest-deep sm:text-4xl" v-html="title"></h2>
    <p v-if="subtitle" class="mt-3 font-jakarta text-charcoal-gray">{{ subtitle }}</p>
  </div>
</template>
