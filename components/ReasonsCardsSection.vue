<template>
  <section id="lokasi" class="relative bg-gradient-to-b from-white via-[#fffef5] to-white py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Part 1: Kenapa Harus -->
      <h2 class="font-display font-semibold text-3xl md:text-4xl text-center text-[#142b20] mb-10">
        Kenapa Harus Sanggar Indah Parahyangan?
      </h2>

      <!-- Cards Grid with overlay text -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
        <div v-for="(advantage, index) in content.advantages" :key="advantage.id" class="flex flex-col">
          <!-- Image with overlay text -->
          <div class="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">
            <!-- Background Image -->
            <img v-if="advantage.image" :src="advantage.image" :alt="advantage.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

            <!-- Gradient overlay for better text contrast -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#c9a84c] via-[#c9a84c]/10 to-transparent"></div>

            <!-- Text overlay at bottom -->
            <div class="absolute inset-0 flex items-end justify-center p-3 pb-3">
              <h3 class="font-bold text-xs md:text-sm text-center text-[#142b20] leading-tight">
                {{ advantage.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Part 2: Lokasi di Pusat Pertumbuhan -->
      <div class="relative mb-12">
        <!-- Hero Image with Maps -->
        <div class="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-lg overflow-hidden relative group">
          <!-- Peta Image -->
          <img :src="content.locationSection?.mapImage" alt="Peta Lokasi Sanggar Indah Parahyangan"
            class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            @click="isLightboxOpen = true" />

          <!-- Hover Overlay Hint -->
          <div
            class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span
              class="bg-black/70 text-white text-xs md:text-sm px-4 py-2 rounded-full font-medium flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              Klik untuk memperbesar
            </span>
          </div>

          <!-- Button overlay bottom right -->
          <div class="absolute bottom-6 right-6 z-10">
            <a :href="content.locationSection?.mapUrl" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center px-5 py-2.5 bg-[#c9a84c] text-black font-medium text-sm rounded-lg hover:bg-[#b8974a] transition-colors shadow-lg">
              Lihat Google Maps
            </a>
          </div>
        </div>

        <!-- Title below image -->
        <h2 class="font-display font-semibold text-3xl md:text-4xl text-center text-[#142b20] mt-8 mb-10">
          {{ content.locationSection?.title || 'Lokasi di Pusat Pertumbuhan' }}
        </h2>

        <!-- Facilities List with borders -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 max-w-4xl mx-auto">
          <div v-for="(facility, idx) in content.locationSection?.facilities || []" :key="idx"
            class="pb-4 border-b border-gray-200">
            <p class="font-body text-sm uppercase tracking-wide text-gray-600">{{ facility }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isLightboxOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-sm"
          @click="isLightboxOpen = false">
          <div class="relative max-w-5xl max-h-[90vh] flex flex-col items-center" @click.stop>
            <!-- Close Button -->
            <button type="button"
              class="absolute -top-10 right-0 md:-right-10 text-white hover:text-gray-300 p-2 text-2xl font-bold focus:outline-none"
              @click="isLightboxOpen = false" aria-label="Tutup">
              ✕
            </button>
            <!-- Image -->
            <img :src="content.locationSection?.mapImage" alt="Peta Lokasi Sanggar Indah Parahyangan"
              class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const { content } = useContent();
const isLightboxOpen = ref(false);
</script>
