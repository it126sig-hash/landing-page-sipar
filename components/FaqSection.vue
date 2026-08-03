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
  <section id="faq" class="relative bg-off-white py-5 md:py-5">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Title -->
      <div class="text-center mb-12">
        <h2 class="font-display text-4xl md:text-5xl font-medium text-[#142b20] mb-2">
          FAQ
        </h2>
        <p class="font-body text-base text-gray-600">
          Pertanyaan yang Sering Ditanyakan
        </p>
      </div>

      <div class="max-h-[calc(100vh-220px)] overflow-y-auto pr-2 scroll-smooth">
        <div class="grid lg:grid-cols-2 gap-4 max-w-6xl mx-auto items-start">
          <!-- FAQ Items -->
          <div v-for="faq in content.faqs" :key="faq.id"
            class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <button @click="toggle(faq.id)" class="w-full text-left">
              <div class="flex justify-between items-start gap-3">
                <h3 class="font-body text-base font-medium text-[#142b20]">
                  {{ faq.question }}
                </h3>
                <span class="text-[#c9a84c] text-lg flex-shrink-0">
                  {{ openFaqId === faq.id ? '−' : '+' }}
                </span>
              </div>
              <div v-if="openFaqId === faq.id" class="mt-3 font-body text-sm text-gray-600 leading-relaxed">
                {{ faq.answer }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
