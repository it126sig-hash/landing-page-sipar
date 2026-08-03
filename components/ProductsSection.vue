<script setup>
import { computed, ref } from 'vue';
import { useContent } from '~/composables/useContent';

const { content, houseTypes } = useContent();

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
  <section id="tipe" class="bg-off-white py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Heading - Hijau -->
      <h2 class="font-display font-semibold text-3xl md:text-4xl text-center text-[#142b20] mb-10">
        Pilih Rumah Impianmu
      </h2>

      <!-- House Types Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div v-for="(t, index) in houseTypes" :key="t.id" class="flex flex-col h-full">
          <!-- Image - Rectangle aspect ratio, use 3D render -->
          <div class="w-full aspect-[4/3] bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <img v-if="t.thumbnail || (t.gallery && t.gallery.length)" :src="t.thumbnail || t.gallery[1] || t.gallery[0]" :alt="t.name"
              class="w-full h-full object-cover" />
          </div>

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
            Lihat Detail
          </a>
        </div>
      </div>

      <!-- Spesifikasi Bangunan Section -->
      <div class="mt-20">
        <div class="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
          <div class="md:w-1/2">
            <p class="font-body text-[#c9a84c] text-xs font-bold tracking-widest uppercase mb-3">Quality Assurance</p>
            <h2 class="font-display font-semibold text-3xl md:text-4xl lg:text-5xl text-[#142b20]">
              Spesifikasi Bangunan
            </h2>
          </div>
          <div class="md:w-1/2 md:max-w-md pt-2">
            <p class="font-body text-gray-600 text-sm md:text-base leading-relaxed">
              Kami menggunakan material pilihan yang telah teruji untuk menjamin kekuatan dan durabilitas rumah Anda.
            </p>
          </div>
        </div>

        <!-- Specs Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 border-t border-l border-gray-200/60 bg-white">
          <div v-for="(spec, index) in content.defaultSpecs" :key="spec.label"
            class="p-4 md:p-8 border-r border-b border-gray-200/60 flex flex-col justify-center"
            :class="index === content.defaultSpecs.length - 1 ? 'col-span-2 md:col-span-1' : ''">
            <p class="font-body text-[10px] md:text-xs font-bold text-[#c9a84c] uppercase tracking-widest mb-1 md:mb-2">
              {{ spec.label }}</p>
            <p class="font-display text-sm sm:text-base md:text-xl text-[#142b20]">{{ spec.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <HouseTypeModal :type="modalOpen ? selectedType : null" @close="closeModal" />
  </section>
</template>