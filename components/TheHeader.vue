<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-cream-light bg-off-white/90 backdrop-blur-md">
    <div class="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-5 lg:px-10">
      <a href="#" class="flex items-center gap-3">
        <img :src="content.meta.logo" :alt="`Logo ${content.meta.projectName}`" class="h-10 w-10 object-contain" />
        <span class="flex flex-col leading-tight">
          <strong class="font-sora text-base font-bold text-forest-deep">Sanggar Indah</strong>
          <span class="font-sora text-[0.66rem] font-semibold tracking-[0.26em] text-orange">PARAHYANGAN</span>
        </span>
      </a>

      <!-- ponytail: nav links disembunyikan di mobile (tanpa hamburger), tambah jika ada permintaan menu mobile -->
      <nav class="hidden items-center gap-2 md:flex">
        <a
          v-for="item in content.meta.nav"
          :key="item.id"
          :href="`#${item.id}`"
          class="rounded px-3 py-2 font-jakarta text-forest-medium transition-colors hover:text-forest-deep focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
        >
          {{ item.label }}
        </a>
      </nav>

      <WhatsAppButton message-key="konsultasi" variant="primary" class="!rounded-full !px-4 !py-2 text-sm">
        <span class="h-2 w-2 rounded-full bg-white"></span>WhatsApp
      </WhatsAppButton>
    </div>
  </header>
</template>
