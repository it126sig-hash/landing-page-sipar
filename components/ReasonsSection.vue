<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <SectionShell id="alasan">
    <SectionHeading class="mx-auto text-center" eyebrow="Kenapa SIPAR"
      title="5 Alasan Memilih <br /> Sanggar Indah Parahyangan"
      subtitle="Lokasi strategis, lingkungan aman, dan nilai investasi yang terus bertumbuh." />
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      <FeatureCard v-for="r in content.reasons" :key="r.id" :num="r.num" :title="r.title" :desc="r.desc" />
    </div>
  </SectionShell>
</template>
