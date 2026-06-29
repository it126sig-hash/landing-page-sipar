<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <SectionShell id="lokasi" bg="bg-off-white">
    <SectionHeading class="mx-auto text-center" eyebrow="Lokasi Strategis" title="Akses Mudah ke Pusat Pertumbuhan" />

    <div class="grid gap-6 sm:grid-cols-3">
      <FeatureCard v-for="loc in content.locations" :key="loc.id" :stat="loc.time ? `${loc.time} mnt` : null"
        :title="loc.place" :desc="loc.sub" />
    </div>

    <div class="mt-10">
      <h3 class="font-sora text-lg font-bold text-forest-deep">Fasilitas Sekitar</h3>
      <div class="mt-3 flex flex-wrap gap-2 mx-auto text-center">
        <Chip v-for="(f, i) in content.facilities" :key="i" :label="f" />
      </div>
    </div>
  </SectionShell>
</template>
