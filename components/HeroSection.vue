<script setup>
import { ref } from 'vue';
import { useContent } from '~/composables/useContent';

const { content } = useContent();
</script>

<template>
  <section class="relative h-full min-h-[300px] lg:h-[calc(100vh-64px)] lg:min-h-[600px] overflow-hidden">
    <!-- Background Image Desktop -->
    <div class="hidden md:block absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${content.hero.image || '/assets/images/hero.webp'})` }"></div>

    <!-- Background Image Mobile -->
    <div class="block md:hidden absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${content.hero.imageMobile || content.hero.heroMobile || '/assets/images/hero-mobile.webp'})` }">
    </div>

    <!-- Dimmer overlay - hijau gelap base -->
    <div class="absolute inset-0 bg-[#142b20]/60"></div>

    <!-- Gradient overlay - hijau lebih gelap di kiri, fade ke kanan -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#142b20]/90 via-[#142b20]/40 to-transparent"></div>

    <!-- Content Container -->
    <div class="relative h-full flex flex-col justify-between px-4 md:px-20 py-6 sm:py-10 lg:py-20">
      <!-- Bank Logos -->
      <div
        class="absolute top-6 right-4 sm:top-10 sm:right-20 lg:top-20 flex items-center gap-3 sm:gap-5 z-10 bg-white/40 px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-xl sm:rounded-2xl border-2 border-[#c9a84c]/50 shadow-xl">
        <img v-for="bank in content.banks" :key="bank.name" :src="bank.image" :alt="bank.name"
          class="h-5 sm:h-5 md:h-6 lg:h-12 object-contain" />
      </div>

      <!-- Top Content: Title & Tagline -->
      <div class="sm:max-w-[600px] lg:max-w-[80%]">
        <!-- Headline - Kuning -->
        <h1 class="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-8xl leading-tight text-[#c9a84c]">
          {{ content.hero.headlineLines[0] }}
        </h1>

        <!-- Tagline - Putih, ALL CAPS -->
        <p class="mt-1.5 sm:mt-3 font-body text-xs sm:text-sm md:text-base tracking-wider uppercase text-white">
          {{ content.hero.tagline }}
        </p>
      </div>

      <!-- Bottom Content: Button & Description -->
      <div class="max-w-[600px]">
        <!-- CTA Button - Kuning -->
        <div class="mb-3 sm:mb-6">
          <a href="#tipe"
            class="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-[#c9a84c] text-black font-medium text-sm sm:text-base rounded-lg hover:bg-[#b8974a] transition-colors">
            {{ content.hero.primaryCta || 'Lihat Tipe Rumah' }}
          </a>
        </div>

        <!-- Description - Putih -->
        <p class="max-w-[500px] font-body text-xs sm:text-sm md:text-base leading-relaxed text-white">
          {{ content.hero.sub }}
        </p>
      </div>
    </div>
  </section>
</template>
