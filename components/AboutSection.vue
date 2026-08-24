<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { useContent } from '~/composables/useContent';

const { content } = useContent();

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
          <h2 class="font-display font-semibold text-2xl sm:text-3xl md:text-4xl leading-tight text-[#c9a84c] mb-2 sm:mb-3">
            {{ content.about.title }}
          </h2>
          <p class="font-body text-xs sm:text-sm md:text-base leading-relaxed text-gray-700">
            {{ content.about.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
