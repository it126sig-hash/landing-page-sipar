<script setup>
import { useContent } from '~/composables/useContent';

const { wa } = useContent();
const href = wa('konsultasi');
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener"
    class="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-orange px-5 py-3 font-jakarta text-sm font-bold text-white shadow-[0_10px_22px_-10px_rgba(238,131,34,0.7)] animate-floatPulse transition-colors hover:bg-[#D66F1A]"
  >
    <span class="h-[10px] w-[10px] rounded-full bg-white"></span>
    Konsultasi Sekarang
  </a>
</template>
