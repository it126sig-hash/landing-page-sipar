<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost
  href: { type: String, default: null },
});

const variants = {
  primary: 'bg-orange text-white hover:bg-[#D66F1A] hover:shadow-[0_4px_12px_rgba(238,131,34,0.3)] active:bg-[#B8580E] disabled:opacity-50',
  // Varian baru, sengaja TIDAK mengubah `primary` karena varian itu dipakai
  // tombol lain di seluruh situs. Resepnya sama dengan tombol "Lihat Detail":
  // gradasi dari hue yang sama dengan beda lightness tipis, inset highlight 1px
  // di sisi atas untuk kesan timbul, dan shadow berwarna oranye yang digelapkan
  // — bukan hitam, karena shadow hitam membuat oranye terlihat kotor.
  primaryGradient: [
    'text-white bg-[linear-gradient(135deg,#E2761A_0%,#F6A24A_100%)]',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_-6px_rgba(180,90,15,0.6)]',
    'hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#EE8322_0%,#FFB45F_100%)]',
    'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_12px_24px_-10px_rgba(180,90,15,0.7)]',
    'active:translate-y-0 active:shadow-[inset_0_2px_4px_rgba(140,70,10,0.35)]',
    'disabled:opacity-50',
  ].join(' '),
  secondary: 'bg-transparent text-forest-medium border-2 border-forest-medium hover:bg-sage-pale active:bg-[#D0E5C2]',
  ghost: 'bg-transparent text-forest-deep border border-charcoal-gray hover:bg-off-white hover:text-forest-deep active:border-forest-deep active:text-forest-deep',
};
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    class="inline-flex items-center justify-center gap-2 rounded-btn px-5 py-3 font-body font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
    :class="variants[variant]"
  >
    <slot />
  </component>
</template>
