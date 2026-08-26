<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { useContent } from '~/composables/useContent';

const { content } = useContent();

/**
 * Gaya penekanan untuk potongan teks di content.about.description.
 *
 * Emasnya sengaja #8a6d1f, bukan #c9a84c seperti judul. #c9a84c memang warna
 * palet yang sama, tapi di atas latar putih kontrasnya hanya sekitar 2,3:1 —
 * cukup untuk judul berukuran besar, tidak cukup untuk teks paragraf. Nada
 * emas yang lebih tua ini menjaga identitas warnanya sekaligus tetap terbaca.
 */
const emphasis = {
  gold: 'font-semibold text-[#8a6d1f]',
  green: 'font-semibold text-forest-deep',
  undefined: '',
};

const carouselRef = ref(null);
let ctx;
let tween;

onMounted(() => {
  if (!carouselRef.value) return;

  ctx = gsap.context(() => {
    const carousel = carouselRef.value;
    const items = Array.from(carousel.children);
    // Ukur jarak antar-kartu dari DOM: lebar kartu + gap berbeda per breakpoint
    // (100px+16px di mobile, 110px+20px di sm+). Nilai hardcoded 130 membuat loop
    // meleset ~14px per putaran di mobile sehingga terlihat "melompat".
    const measurePitch = () => {
      if (items.length < 2) return 130;
      const a = items[0].getBoundingClientRect();
      const b = items[1].getBoundingClientRect();
      return Math.round(b.left - a.left) || 130;
    };
    const itemWidth = measurePitch();

    // Clone items for seamless loop
    items.forEach(item => {
      const clone = item.cloneNode(true);
      carousel.appendChild(clone);
    });

    // Infinite horizontal scroll
    tween = gsap.to(carousel, {
      x: -itemWidth * items.length,
      duration: 20,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % (itemWidth * items.length))
      }
    });
  });
});

const pauseScroll = () => tween?.pause();
const resumeScroll = () => tween?.play();

onUnmounted(() => ctx?.revert());
</script>

<template>
  <section id="tentang" class="scroll-mt-20 bg-white py-4 sm:py-6 lg:py-16 border-t border-gray-100 lg:border-t-0">
    <div class="container mx-auto px-4 md:px-20">
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 items-center">
        <!-- Left: Awards Carousel - Show max 4 visible -->
        <div class="overflow-hidden relative" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
          <div ref="carouselRef" class="flex gap-4 sm:gap-5 items-stretch py-1">
            <div v-for="award in content.about.awards" :key="award.id" class="flex-shrink-0 w-[100px] sm:w-[110px] flex">
              <!-- Award Card -->
              <div class="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-2.5 sm:p-3 text-center flex flex-col justify-between">
                <!-- Award Image -->
                <div class="w-full h-16 sm:h-20 mb-2 flex items-center justify-center bg-gray-50/80 rounded p-1.5 flex-shrink-0 overflow-hidden">
                  <img
                    v-if="award.image"
                    :src="award.image"
                    :alt="award.title"
                    class="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                  <span v-else class="text-2xl sm:text-3xl">🏆</span>
                </div>

                <!-- Award Details Container -->
                <div class="flex-1 flex flex-col justify-between">
                  <!-- Award Year -->
                  <p class="font-bold text-xs text-[#c9a84c] mb-0.5 sm:mb-1 flex-shrink-0">{{ award.year }}</p>

                  <!-- Award Title -->
                  <p class="font-medium text-[9px] leading-tight text-black flex-1 flex items-center justify-center">{{ award.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Text Content with Colored Typography -->
        <div class="text-left md:text-right">
          <!-- Metallic gold, sama seperti headline harga di ProductsSection.
               text-[#a8862f] adalah warna cadangan kalau background-clip:text
               tidak didukung — tanpa itu judulnya bisa hilang sama sekali. -->
          <!-- inline-block itu WAJIB, bukan hiasan: gradient dilukis pada kotak
               elemen, bukan pada hurufnya. Sebagai block selebar kolom, teks
               yang rata kanan hanya kebagian ujung gelap gradient dan kilaunya
               terbuang. Menyusut selebar teks membuat gradient terpetakan pas. -->
          <h2 class="inline-block font-display font-semibold text-2xl sm:text-3xl md:text-4xl leading-tight mb-2 sm:mb-3
                     text-[#a8862f]
                     bg-[linear-gradient(115deg,#836619_0%,#9c7c28_38%,#b8974a_55%,#8f7124_78%,#7d611a_100%)]
                     bg-clip-text supports-[background-clip:text]:text-transparent">
            {{ content.about.title }}
          </h2>
          <!-- text-justify merapikan tepi kiri-kanan supaya paragraf tidak lagi
               bergerigi. hyphens-auto dipasang berpasangan dengannya: teks rata
               kanan-kiri tanpa pemenggalan kata akan melebarkan spasi antarkata
               secara ekstrem pada kolom sempit. -->
          <p class="font-body text-xs sm:text-sm md:text-base leading-relaxed text-gray-700 text-justify hyphens-auto">
            <span v-for="(part, i) in content.about.description" :key="i" :class="emphasis[part.em]">{{ part.text }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
