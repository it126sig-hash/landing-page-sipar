<script setup>
defineProps({ label: { type: String, required: true } });
</script>

<template>
  <span class="inline-flex items-center rounded-full border border-cream-light bg-off-white px-3 py-1 text-sm font-jakarta text-forest-deep">
    {{ label }}
  </span>
</template>
