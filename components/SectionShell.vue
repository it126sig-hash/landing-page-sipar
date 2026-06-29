<script setup>
defineProps({
  id: { type: String, default: null },
  bg: { type: String, default: 'bg-white' },
});
</script>

<template>
  <section :id="id" class="px-4 py-20 sm:px-5 sm:py-24 lg:px-10 lg:py-32" :class="bg">
    <div class="mx-auto max-w-[1200px]">
      <slot />
    </div>
  </section>
</template>
