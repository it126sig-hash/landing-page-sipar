<script setup>
defineProps({
  faq: { type: Object, required: true },
  open: { type: Boolean, default: false },
});
const emit = defineEmits(['toggle']);
</script>

<template>
  <div class="overflow-hidden rounded-[14px] border border-cream-light bg-white">
    <button
      type="button"
      :aria-expanded="open"
      class="flex w-full items-center justify-between px-5 py-[18px] text-left font-jakarta font-semibold text-forest-deep transition-colors hover:text-orange focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
      @click="emit('toggle', faq.id)"
    >
      {{ faq.question }}
      <span
        class="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mint-pale text-lg font-bold text-forest-deep transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      >
        {{ open ? '−' : '+' }}
      </span>
    </button>
    <p v-if="open" class="px-5 pb-5 font-jakarta text-sm leading-relaxed text-charcoal-gray">{{ faq.answer }}</p>
  </div>
</template>
