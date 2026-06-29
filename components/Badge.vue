<script setup>
defineProps({
  label: { type: String, required: true },
  variant: { type: String, default: 'status' }, // status | warning
});

const variants = {
  status: 'bg-sage-pale text-forest-medium border-sage-mist',
  warning: 'bg-[#FFF4E6] text-orange-light border-orange-light',
};
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-jakarta font-semibold"
    :class="variants[variant]"
  >
    {{ label }}
  </span>
</template>
