<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <SectionShell>
    <SectionHeading eyebrow="Potensi Investasi" class="mx-auto text-center"
      title="Mengapa Layak Jadi Pilihan Investasi" />
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
      <FeatureCard v-for="i in content.invest" :key="i.id" :title="i.title" :desc="i.desc"
        class="border-t-[3px] border-t-forest-light" />
    </div>
  </SectionShell>
</template>
