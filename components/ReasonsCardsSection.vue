<template>
  <section id="lokasi" class="relative bg-gradient-to-b from-white via-[#fffef5] to-white py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Part 1: Kenapa Harus -->
      <div class="flex justify-center mb-10">
        <img src="/assets/images/kenapa.webp" alt="Kenapa Sanggar Indah Parahyangan?"
          class="h-auto w-[80%] sm:w-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl object-contain" />
      </div>

      <!-- Cards & Mascot Section -->
      <div class="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mb-16">
        
        <!-- Cards Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full flex-grow">
          <div v-for="(advantage, index) in content.advantages" :key="advantage.id" 
            class="group cursor-pointer bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out p-4 md:p-6 flex flex-col items-center justify-between h-full border border-gray-50 overflow-hidden relative">
            
            <template v-if="advantage.title">
              <!-- Image / Icon -->
              <div class="w-20 h-20 md:w-28 md:h-28 mb-4 flex items-center justify-center">
                <img v-if="advantage.image" :src="advantage.image" :alt="advantage.title"
                  class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>

              <!-- Title -->
              <div class="flex-grow flex items-center justify-center mb-4">
                <h3 class="font-bold text-sm md:text-base text-center text-[#2A6D3A] leading-snug group-hover:text-[#1d4d29] transition-colors">
                  {{ advantage.title }}
                </h3>
              </div>

              <!-- Bottom Dash -->
              <div class="w-6 h-1 bg-[#F59E0B] rounded-full mt-auto transition-all duration-300 group-hover:w-10"></div>
            </template>
            
            <template v-else>
              <!-- Fit Image -->
              <div class="w-full h-full flex items-center justify-center my-auto p-2">
                <img v-if="advantage.image" :src="advantage.image" alt="Fasilitas"
                  class="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105" />
              </div>
            </template>
          </div>
        </div>

        <!-- Mascot -->
        <div class="w-32 sm:w-40 md:w-48 lg:w-56 flex-shrink-0 mt-6 lg:mt-0 flex justify-center">
          <img src="/assets/images/mascot.webp" alt="Maskot SIPAR" class="w-full h-auto drop-shadow-2xl" />
        </div>
      </div>

      <!-- Part 2: Lokasi di Pusat Pertumbuhan -->
      <div class="relative mb-12">
        <!-- Hero Image with Maps -->
        <div class="w-full bg-gray-100 rounded-lg overflow-hidden relative group">
          <!-- Peta Image -->
          <img :src="content.locationSection?.mapImage" alt="Peta Lokasi Sanggar Indah Parahyangan"
            class="w-full h-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
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
