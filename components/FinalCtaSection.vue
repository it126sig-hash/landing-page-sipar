<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <section class="relative bg-gradient-to-br from-[#c9a84c] to-[#b89743] py-8 md:py-10">
    <div class="container mx-auto px-4 md:px-20">
      <div class="flex flex-col items-center gap-3 text-center max-w-3xl mx-auto">
        <h2 class="font-display text-2xl md:text-3xl text-[#142b20] leading-tight font-medium">
          {{ content.finalCta.headline }}
        </h2>
      </div>
    </div>
  </section>
</template>
