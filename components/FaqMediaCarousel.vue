<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useContent } from '~/composables/useContent';
import { useLightbox } from '~/composables/useLightbox';

/**
 * Carousel horizontal untuk media di dalam FAQ (penghargaan / proyek).
 * - Swipe di mobile: pakai native scroll-snap, jadi tidak butuh library apa pun.
 * - Scroll HANYA di dalam track ini (overflow-x-auto + overscroll-x-contain),
 *   sehingga body halaman tidak ikut melebar / horizontal scroll.
 * - Tombol prev/next untuk desktop.
 */
const props = defineProps({
  items: { type: Array, required: true },   // { key, image?, title, meta?, sub? }
  label: { type: String, default: '' },
  variant: { type: String, default: 'award' }, // 'award' | 'project'
});

const { content } = useContent();
const { openGallery } = useLightbox();
const track = ref(null);
const atStart = ref(true);
const atEnd = ref(false);

function updateEdges() {
  const el = track.value;
  if (!el) return;
  atStart.value = el.scrollLeft <= 2;
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
}

function scrollByCard(dir) {
  const el = track.value;
  if (!el) return;
  const card = el.firstElementChild;
  const step = card ? card.getBoundingClientRect().width + 12 : el.clientWidth * 0.8;
  el.scrollBy({ left: dir * step, behavior: 'smooth' });
}

// Buka lightbox galeri (zoom + swipe) untuk item yang punya gambar
const images = computed(() =>
  props.items.filter(i => i.image).map(i => ({ src: i.image, alt: i.title }))
);
function openAt(item) {
  if (!item.image) return;
  const idx = images.value.findIndex(i => i.src === item.image);
  openGallery(images.value, idx < 0 ? 0 : idx);
}

onMounted(() => {
  updateEdges();
  track.value?.addEventListener('scroll', updateEdges, { passive: true });
  window.addEventListener('resize', updateEdges, { passive: true });
});
onUnmounted(() => {
  track.value?.removeEventListener('scroll', updateEdges);
  window.removeEventListener('resize', updateEdges);
});
</script>

<template>
  <div class="relative mt-3" role="group" :aria-label="label">
    <!-- Track: satu-satunya area yang boleh scroll horizontal -->
    <div
      ref="track"
      class="flex gap-3 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <!-- ── Kartu PENGHARGAAN ── -->
      <template v-if="variant === 'award'">
        <button
          v-for="item in items"
          :key="item.key"
          type="button"
          class="snap-start shrink-0 w-[132px] sm:w-[150px] rounded-[14px] border border-cream-light bg-white p-3 text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep/30"
          :aria-label="`Perbesar penghargaan ${item.title}`"
          @click="openAt(item)"
        >
          <span class="block h-[92px] w-full overflow-hidden rounded-lg bg-gray-50">
            <img :src="item.image" :alt="item.title" loading="lazy"
              class="h-full w-full object-contain p-1" />
          </span>
          <span class="mt-2 block font-body text-xs font-bold text-[#c9a84c]">{{ item.meta }}</span>
          <span class="mt-0.5 block font-body text-[11px] leading-snug text-charcoal-gray">{{ item.title }}</span>
        </button>
      </template>

      <!-- ── Kartu PROYEK ── -->
      <template v-else>
        <div
          v-for="item in items"
          :key="item.key"
          class="snap-start shrink-0 w-[210px] sm:w-[240px] rounded-[14px] border bg-white p-4"
          :class="item.current ? 'border-[#c9a84c] ring-1 ring-[#c9a84c]/40' : 'border-cream-light'"
        >
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center rounded-md bg-mint-pale px-2 py-0.5 font-body text-xs font-bold text-forest-deep">
              {{ item.meta }}
            </span>
            <span v-if="item.current"
              class="inline-flex items-center rounded-md bg-[#c9a84c]/15 px-2 py-0.5 font-body text-[10px] font-bold text-[#8a6f21]">
              Proyek ini
            </span>
          </div>
          <p class="mt-2 font-body text-sm font-bold leading-snug text-forest-deep">{{ item.title }}</p>
          <p v-if="item.sub" class="mt-1 font-body text-[11px] leading-snug text-charcoal-gray">{{ item.sub }}</p>
          <p v-if="item.types" class="mt-1 font-body text-[11px] leading-snug text-stone-gray">{{ item.types }}</p>
        </div>
      </template>
    </div>

    <!-- Prev / Next (desktop; disembunyikan saat tidak relevan) -->
    <button
      type="button"
      class="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-cream-light bg-white shadow-md transition disabled:opacity-0"
      :disabled="atStart"
      :aria-label="content.carousel.prev"
      @click="scrollByCard(-1)"
    >
      <svg class="h-4 w-4 stroke-forest-deep" fill="none" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      type="button"
      class="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-cream-light bg-white shadow-md transition disabled:opacity-0"
      :disabled="atEnd"
      :aria-label="content.carousel.next"
      @click="scrollByCard(1)"
    >
      <svg class="h-4 w-4 stroke-forest-deep" fill="none" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>
