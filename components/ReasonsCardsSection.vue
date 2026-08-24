<template>
  <section id="lokasi" class="scroll-mt-20 relative bg-gradient-to-b from-white via-[#fffef5] to-white py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Part 1: Kenapa Harus — image header tetap dipertahankan -->
      <div class="flex justify-center mb-4">
        <img :src="withBase(content.reasons.headingImage)" :alt="content.reasons.headingAlt"
          class="h-auto w-[80%] sm:w-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl object-contain" />
      </div>

      <!-- Subheading humanis — copy baru, tidak mengubah visual card -->
      <div class="text-center mb-10 max-w-xl mx-auto">
        <p class="font-body text-sm text-gray-500 leading-relaxed">
          {{ content.reasons.subheading }}
        </p>
      </div>

      <!-- Cards & Mascot Section -->
      <div class="mb-16">
        <!-- 4 Advantage Cards + Desktop Mascot Card (5-col on desktop, 2x2 on mobile) -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <div v-for="(advantage) in content.advantages" :key="advantage.id"
            class="group cursor-pointer bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out p-4 md:p-6 flex flex-col items-center justify-between h-full border border-gray-50 overflow-hidden relative">

            <template v-if="advantage.title">
              <!-- Image / Icon -->
              <!-- imageFit dari content.js: 'contain' untuk logo/ikon, 'cover' untuk foto suasana -->
              <div class="w-20 h-20 md:w-28 md:h-28 mb-3 flex items-center justify-center overflow-hidden rounded-xl">
                <img v-if="advantage.image" :src="advantage.image" :alt="advantage.title"
                  class="w-full h-full transition-transform duration-300 group-hover:scale-110"
                  :class="advantage.imageFit === 'cover' ? 'object-cover' : 'object-contain'" />
              </div>

              <!-- Title -->
              <div class="flex-grow flex flex-col items-center justify-center mb-2 text-center">
                <h3 class="font-bold text-sm md:text-base text-center text-[#2A6D3A] leading-snug group-hover:text-[#1d4d29] transition-colors">
                  {{ advantage.title }}
                </h3>
                <!-- Microcopy — baru, dari content.advantages.microcopy -->
                <p v-if="advantage.microcopy" class="mt-1 text-xs text-gray-500 leading-snug text-center">
                  {{ advantage.microcopy }}
                </p>
              </div>

              <!-- Bottom Dash -->
              <div class="w-6 h-1 bg-[#F59E0B] rounded-full mt-auto transition-all duration-300 group-hover:w-10"></div>
            </template>

            <template v-else>
              <!-- Full image (loc4: logo fasilitas) -->
              <div class="w-full h-full flex items-center justify-center my-auto p-2">
                <img v-if="advantage.image" :src="advantage.image" alt="Fasilitas sekitar"
                  class="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105" />
              </div>
            </template>
          </div>

          <!-- DESKTOP ONLY: Mascot card inside white card block -->
          <div class="hidden lg:flex bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out p-4 md:p-6 flex-col items-center justify-between h-full border border-gray-50 overflow-hidden relative">
            <div class="w-20 h-20 md:w-28 md:h-28 mb-3 flex items-center justify-center">
              <img :src="withBase(content.mascot.image)" :alt="content.mascot.alt"
                class="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <div class="flex-grow flex flex-col items-center justify-center mb-2 text-center">
              <h3 class="font-bold text-sm md:text-base text-center text-[#2A6D3A] leading-snug">
                {{ content.mascot.title }}
              </h3>
              <p class="mt-1 text-xs text-gray-500 leading-snug text-center">
                {{ content.mascot.text }}
              </p>
            </div>
            <div class="w-6 h-1 bg-[#F59E0B] rounded-full mt-auto"></div>
          </div>
        </div>

        <!-- MOBILE ONLY: Mascot on the left, wording on the right (NO white card block) -->
        <div class="flex lg:hidden items-center justify-center gap-4 sm:gap-6 mt-8 px-2">
          <img :src="withBase(content.mascot.image)" :alt="content.mascot.alt"
            class="w-28 min-[375px]:w-32 sm:w-36 h-auto flex-shrink-0 drop-shadow-xl" />
          <div class="max-w-[15rem] text-left">
            <h3 class="font-bold text-base sm:text-lg text-[#2A6D3A] leading-snug">
              {{ content.mascot.title }}
            </h3>
            <p class="mt-1.5 font-body text-xs sm:text-sm text-gray-600 leading-relaxed">
              {{ content.mascot.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Part 2: Peta Lokasi -->
      <div class="relative mb-12">
        <div class="w-full bg-gray-100 rounded-lg overflow-hidden relative group">
          <!-- Peta Image -->
          <img :src="content.locationSection?.mapImage" :alt="content.reasons.mapAlt"
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
              {{ content.reasons.mapZoomHint }}
            </span>
          </div>

          <!-- CTA: tepat di atas panel QR peta, rata kanan dengannya.
               Posisi pakai persen supaya ikut menyesuaikan di semua lebar layar.
               Panel QR pada gambar ada di x 72,1%-95,1% dan y 85%-96,2%. -->
          <div class="absolute bottom-[17%] right-[4.95%] z-10">
            <a :href="content.locationSection?.mapUrl" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 md:px-5 md:py-2.5 bg-[#c9a84c] text-black font-medium text-[9px] sm:text-xs md:text-sm whitespace-nowrap rounded md:rounded-lg hover:bg-[#b8974a] transition-colors shadow-lg">
              {{ content.reasons.mapCtaLabel }}
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
          class="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-sm"
          @click="isLightboxOpen = false">
          <div class="relative max-w-5xl max-h-[90vh] flex flex-col items-center" @click.stop>
            <button type="button"
              class="absolute -top-10 right-0 md:-right-10 text-white hover:text-gray-300 p-2 text-2xl font-bold focus:outline-none"
              @click="isLightboxOpen = false" :aria-label="content.reasons.mapCloseLabel">
              ✕
            </button>
            <img :src="content.locationSection?.mapImage" :alt="content.reasons.mapAlt"
              class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const { content, withBase } = useContent();
const isLightboxOpen = ref(false);
</script>
