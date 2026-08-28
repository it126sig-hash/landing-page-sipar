<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost
  href: { type: String, default: null },
});

const variants = {
  // `primary` kini bergradasi. Resepnya terpusat di tailwind.config.js.
  primary: [
    'text-white bg-[#EE8322] bg-grad-orange shadow-btn-orange',
    'hover:-translate-y-0.5 hover:bg-grad-orange-hover hover:shadow-btn-orange-lg',
    'active:translate-y-0 active:shadow-[inset_0_2px_4px_rgba(140,70,10,0.35)]',
    'disabled:opacity-50',
  ].join(' '),
  // Alias supaya pemanggil lama tidak rusak; keduanya kini identik.
  primaryGradient: [
    'text-white bg-[#EE8322] bg-grad-orange shadow-btn-orange',
    'hover:-translate-y-0.5 hover:bg-grad-orange-hover hover:shadow-btn-orange-lg',
    'active:translate-y-0 active:shadow-[inset_0_2px_4px_rgba(140,70,10,0.35)]',
    'disabled:opacity-50',
  ].join(' '),
  // Hijau WhatsApp. Resep gradasi & shadow-nya sudah ada di tailwind.config.js
  // (grad-wa / btn-wa) tapi sebelumnya tidak dipakai variant mana pun.
  // Dipakai untuk tombol yang membuka WhatsApp, supaya warnanya cocok dengan
  // tujuan tombolnya dan tidak bersaing dengan CTA oranye di halaman yang sama.
  whatsapp: [
    'text-white bg-[#25D366] bg-grad-wa shadow-btn-wa',
    'hover:-translate-y-0.5 hover:bg-grad-wa-hover hover:shadow-btn-wa-lg',
    'active:translate-y-0 active:shadow-[inset_0_2px_4px_rgba(15,110,55,0.35)]',
    'disabled:opacity-50',
  ].join(' '),
  // `secondary` dan `ghost` SENGAJA tetap bergaris tepi tanpa isian gradasi.
  // Tombol sekunder gunanya justru untuk mengalah dari tombol utama; memberinya
  // gradasi penuh membuat dua tombol berebut perhatian dan hierarkinya hilang.
  // Yang ditambahkan hanya isian gradasi lembut saat hover.
  secondary: 'bg-transparent text-forest-medium border-2 border-forest-medium hover:bg-[linear-gradient(135deg,#E4EFDD_0%,#CFE6C8_100%)] active:bg-[#D0E5C2]',
  ghost: 'bg-transparent text-forest-deep border border-charcoal-gray hover:bg-[linear-gradient(135deg,#FBFAF6_0%,#ECEAE1_100%)] hover:text-forest-deep active:border-forest-deep active:text-forest-deep',
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
