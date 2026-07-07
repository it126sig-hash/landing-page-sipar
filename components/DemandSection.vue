<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <SectionShell bg="bg-mint-pale">
    <SectionHeading class="text-center mx-auto" eyebrow="Tingginya Permintaan"
      title="Kawasan dengan Permintaan Tinggi" />
    <div class="grid gap-6 sm:grid-cols-3">
      <FeatureCard v-for="d in content.demand" :key="d.id" :stat="d.stat" :title="d.title" :desc="d.desc" />
    </div>
  </SectionShell>
</template>
