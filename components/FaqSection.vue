<script setup>
import { ref } from 'vue';
import { useContent } from '~/composables/useContent';

const { content } = useContent();

const openFaqId = ref(null);

function toggle(id) {
  openFaqId.value = openFaqId.value === id ? null : id;
}
</script>

<template>
  <SectionShell id="faq" bg="bg-off-white">
    <SectionHeading class="mx-auto text-center" eyebrow="FAQ" title="Pertanyaan yang Sering Ditanyakan" />
    <div class="mx-auto flex max-w-2xl flex-col gap-3">
      <FaqItem v-for="faq in content.faqs" :key="faq.id" :faq="faq" :open="openFaqId === faq.id" @toggle="toggle" />
    </div>
  </SectionShell>
</template>
