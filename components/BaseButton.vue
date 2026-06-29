<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost
  href: { type: String, default: null },
});

const variants = {
  primary: 'bg-orange text-white hover:bg-[#D66F1A] hover:shadow-[0_4px_12px_rgba(238,131,34,0.3)] active:bg-[#B8580E] disabled:opacity-50',
  secondary: 'bg-transparent text-forest-medium border-2 border-forest-medium hover:bg-sage-pale active:bg-[#D0E5C2]',
  ghost: 'bg-transparent text-forest-deep border border-charcoal-gray hover:bg-off-white hover:text-forest-deep active:border-forest-deep active:text-forest-deep',
};
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    class="inline-flex items-center justify-center gap-2 rounded-btn px-5 py-3 font-jakarta font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
    :class="variants[variant]"
  >
    <slot />
  </component>
</template>
