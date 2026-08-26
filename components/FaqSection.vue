<script setup>
import { ref } from 'vue';
import { useContent } from '~/composables/useContent';

const { content, wa } = useContent();

const openFaqId = ref(null);

function toggle(id) {
  openFaqId.value = openFaqId.value === id ? null : id;
}

const consultasiLink = wa('konsultasi');
</script>

<template>
  <section id="faq" class="scroll-mt-20 relative bg-off-white py-5 md:py-5">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Title -->
      <div class="text-center mb-12">
        <h2 class="font-display text-4xl md:text-5xl font-medium text-[#142b20] mb-2">
          {{ content.faqSection.title }}
        </h2>
        <p class="font-body text-base text-gray-600">
          {{ content.faqSection.subtitle }}
        </p>
      </div>

      <!-- FAQ Items Grid -->
      <div class="grid lg:grid-cols-2 gap-4 max-w-6xl mx-auto items-start">
        <FaqItem
          v-for="faq in content.faqs"
          :key="faq.id"
          :faq="faq"
          :open="openFaqId === faq.id"
          @toggle="toggle"
        />
      </div>

      <!-- CTA Konsultasi di bawah FAQ -->
      <div class="mt-10 flex flex-col items-center gap-3 text-center">
        <p class="font-body text-sm text-gray-500 max-w-sm">
          {{ content.faqSection.ctaIntro }}
        </p>
        <a
          :href="consultasiLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-full bg-[#142b20] bg-grad-forest px-6 py-3 font-body text-sm font-semibold text-white hover:bg-grad-forest-hover hover:-translate-y-0.5 hover:shadow-btn-forest-lg active:translate-y-0 shadow-btn-forest transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#142b20]"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          {{ content.faqSection.ctaLabel }}
        </a>
      </div>
    </div>

  </section>
</template>
