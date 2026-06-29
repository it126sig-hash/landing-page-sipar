<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <SectionShell id="cicilan" bg="bg-gradient-to-br from-forest-deep to-[#143A20]">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <p class="font-jakarta text-sm font-bold uppercase tracking-wide text-orange-light">Cicilan Flat</p>
        <h2 class="mt-3 font-sora text-3xl font-extrabold text-white sm:text-4xl">{{ content.installment.headline }}</h2>
        <p class="mt-4 max-w-md font-jakarta text-base text-sage-mist">{{ content.installment.intro }}</p>
        <WhatsAppButton message-key="simulasi" variant="primary" class="mt-6">Tanya Simulasi Cicilan →</WhatsAppButton>
      </div>

      <div class="rounded-3xl border border-white/15 bg-white/[0.06] p-7 text-center sm:p-10">
        <div class="font-jakarta text-xs font-semibold uppercase tracking-wide text-sage-mist">Mulai dari</div>
        <div class="mt-1 font-sora text-5xl font-extrabold text-white sm:text-6xl">{{ content.installment.stat }}</div>
        <div class="mt-1 font-jakarta text-lg font-bold text-orange-light">{{ content.installment.statSuffix?.replace('/', 'per ') }}</div>
        <div class="my-6 h-px bg-white/15"></div>
        <div class="grid grid-cols-2 gap-3.5 text-left">
          <div v-for="(point, i) in content.installment.points" :key="i" class="flex items-start gap-2">
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange text-[0.7rem] font-bold text-white">✓</span>
            <span class="font-jakarta text-sm text-sage-pale">{{ point }}</span>
          </div>
        </div>
        <div class="mt-4 font-jakarta text-xs text-sage-mist">{{ content.installment.disclaimer }}</div>
      </div>
    </div>
  </SectionShell>
</template>
