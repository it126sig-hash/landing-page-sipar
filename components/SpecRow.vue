<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
});
</script>

<template>
  <div class="flex justify-between border-b border-cream-light py-2 text-sm font-jakarta last:border-b-0">
    <span class="text-charcoal-gray">{{ label }}</span>
    <span class="font-semibold text-forest-deep">{{ value }}</span>
  </div>
</template>
