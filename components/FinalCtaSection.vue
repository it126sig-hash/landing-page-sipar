<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <SectionShell bg="bg-gradient-to-br from-forest-deep to-[#143A20]">
    <div class="flex flex-col items-center gap-6 text-center">
      <h2 class="font-sora text-3xl font-extrabold text-white sm:text-4xl">{{ content.finalCta.headline }}</h2>
      <div class="flex flex-wrap justify-center gap-2.5">
        <span
          v-for="(chip, i) in content.finalCta.chips"
          :key="i"
          class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-2.5 font-jakarta text-sm font-semibold text-sage-pale"
        >
          <span class="text-orange-light">✓</span>{{ chip }}
        </span>
      </div>
      <WhatsAppButton message-key="survey" variant="primary">Konsultasi & Survey Lokasi Sekarang →</WhatsAppButton>
      <p class="font-jakarta text-sm text-sage-mist">{{ content.finalCta.phoneDisplay }}</p>
    </div>
  </SectionShell>
</template>
