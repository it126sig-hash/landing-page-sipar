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
        <div class="flex flex-wrap justify-center gap-2">
          <span
            v-for="(chip, i) in content.finalCta.chips"
            :key="i"
            class="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-white/20 px-3.5 py-1.5 font-body text-sm font-medium text-[#142b20]"
          >
            <svg class="w-4 h-4 text-[#142b20]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            {{ chip }}
          </span>
        </div>
        <a
          :href="`https://wa.me/${content.meta.whatsapp.number}?text=${encodeURIComponent(content.meta.whatsapp.templates.survey.replace('{project}', content.meta.projectName))}`"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-full bg-[#142b20] px-7 py-2.5 font-body text-sm font-semibold text-white hover:bg-[#1a3829] transition-colors mt-1"
        >
          Konsultasi & Survey Lokasi Sekarang →
        </a>
      </div>
    </div>
  </section>
</template>
