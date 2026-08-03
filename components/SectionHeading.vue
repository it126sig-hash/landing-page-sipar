<script setup>
defineProps({
  eyebrow: { type: String, default: null },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
});
</script>

<template>
  <div class="mb-8 max-w-2xl">
    <p v-if="eyebrow" class="mb-2 font-body text-sm font-semibold uppercase tracking-wide text-orange">{{ eyebrow }}</p>
    <h2 class="font-display text-size-3 text-forest-deep sm:text-size-2" v-html="title"></h2>
    <p v-if="subtitle" class="mt-3 font-body text-charcoal-gray">{{ subtitle }}</p>
  </div>
</template>
