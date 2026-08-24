<script setup>
import { computed, ref } from 'vue';
import { useContent } from '~/composables/useContent';
import { useLightbox } from '~/composables/useLightbox';

const { content, houseTypes } = useContent();
const { openGallery } = useLightbox();

/** Galeri satu tipe: ilustrasi/fasad dulu, lalu denah. */
function galleryOf(t) {
  return [
    { src: t.gallery[1], alt: `Ilustrasi ${t.name}` },
    { src: t.gallery[0], alt: `Denah ${t.name}` },
  ];
}
function openTypeGallery(t, start = 0) {
  openGallery(galleryOf(t), start);
}

const selectedTypeId = ref(null);
const modalOpen = ref(false);
const selectedType = computed(() => houseTypes.find(t => t.id === selectedTypeId.value) || null);

function openType(id) {
  selectedTypeId.value = id;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}
</script>

<template>
  <section id="tipe" class="scroll-mt-20 bg-off-white py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Heading - Hijau -->
      <h2 class="font-display font-semibold text-3xl md:text-4xl text-center text-[#142b20] mb-10">
        {{ content.products.title }}
      </h2>

      <!-- House Types Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div v-for="(t, index) in houseTypes" :key="t.id" class="flex flex-col h-full">
          <!-- Image - Rectangle aspect ratio, use 3D render -->
          <button v-if="t.thumbnail || (t.gallery && t.gallery.length)"
            type="button"
            class="w-full aspect-[4/3] bg-gray-100 rounded-lg mb-4 overflow-hidden block cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
            :aria-label="`Perbesar foto ${t.name}`"
            @click="openTypeGallery(t, 0)">
            <img :src="t.thumbnail || t.gallery[1] || t.gallery[0]" :alt="t.name" loading="lazy"
              class="w-full h-full object-cover" />
          </button>

          <!-- Copy -->
          <div class="mb-4 flex-1">
            <h3 class="font-bold text-lg text-black mb-1 flex items-center gap-2">
              {{ t.name }}
              <span
                class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-[#142b20]/10 text-[#142b20]">
                {{ t.tag }}
              </span>
            </h3>
            <p class="font-normal text-sm text-gray-500">{{ t.subtitle }}</p>
          </div>

          <!-- Button - Kuning -->
          <a @click.prevent="openType(t.id)" href="#"
            class="inline-flex items-center justify-center px-5 py-2.5 bg-[#c9a84c] text-black font-medium text-sm rounded-lg hover:bg-[#b8974a] transition-colors mt-auto">
            {{ content.products.detailCtaLabel }}
          </a>
        </div>
      </div>
      <div class="text-center">
        <h2 class="font-display font-semibold text-3xl md:text-4xl text-center text-[#142b20] mb-10">
          {{ content.products.priceHeadline }}
        </h2>
      </div>

    </div>

    <HouseTypeModal :type="modalOpen ? selectedType : null" @close="closeModal" />
  </section>
</template>