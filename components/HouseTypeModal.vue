<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useLightbox } from '~/composables/useLightbox';
import { useContent } from '~/composables/useContent';

const props = defineProps({
  type: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const dialogRef = ref(null);
const { openGallery } = useLightbox();
const { wa } = useContent();

/**
 * Tab visual terpadu & multi-gambar:
 * 1. Tampak Depan (id: 'front')
 * 2. Perspektif (id: 'perspective', mendukung >1 gambar)
 * 3. Denah (id: 'plan')
 */
const visualTabs = computed(() => {
  if (!props.type) return [];
  const list = [];

  // 1. Tampak Depan
  const frontImages = [];
  const frontFacades = (props.type.facades || []).filter(
    f => f.category === 'front' || f.type === 'front' || (f.label && f.label.toLowerCase().includes('depan'))
  );
  if (frontFacades.length > 0) {
    frontFacades.forEach((f, idx) => {
      frontImages.push({
        src: f.src,
        fit: 'cover',
        label: f.label || (frontFacades.length > 1 ? `Tampak Depan ${idx + 1}` : 'Tampak Depan'),
      });
    });
  } else {
    const fallbackFront = props.type.facades?.[0]?.src || props.type.gallery?.[1];
    if (fallbackFront) {
      frontImages.push({
        src: fallbackFront,
        fit: 'cover',
        label: props.type.facades?.[0]?.label || 'Tampak Depan',
      });
    }
  }
  if (frontImages.length > 0) {
    list.push({
      id: 'front',
      label: 'Tampak Depan',
      images: frontImages,
    });
  }

  // 2. Perspektif (Dukung multiple gambar)
  const perspectiveImages = [];
  if (Array.isArray(props.type.perspectives) && props.type.perspectives.length > 0) {
    props.type.perspectives.forEach((p, idx) => {
      const src = typeof p === 'string' ? p : p.src;
      const label = (typeof p === 'object' && p.label) ? p.label : `Perspektif ${idx + 1}`;
      perspectiveImages.push({ src, fit: 'cover', label });
    });
  }
  const perspectiveFacades = (props.type.facades || []).filter(
    f => f.category === 'perspective' || f.type === 'perspective' || (f.label && f.label.toLowerCase().includes('perspektif'))
  );
  if (perspectiveFacades.length > 0) {
    perspectiveFacades.forEach((f, idx) => {
      if (!perspectiveImages.some(p => p.src === f.src)) {
        perspectiveImages.push({
          src: f.src,
          fit: 'cover',
          label: f.label || (perspectiveFacades.length > 1 ? `Perspektif ${idx + 1}` : 'Perspektif'),
        });
      }
    });
  } else if (perspectiveImages.length === 0) {
    const fallbackP = props.type.facades?.[1]?.src;
    if (fallbackP) {
      perspectiveImages.push({
        src: fallbackP,
        fit: 'cover',
        label: props.type.facades?.[1]?.label || 'Perspektif',
      });
    }
  }
  if (perspectiveImages.length > 0) {
    list.push({
      id: 'perspective',
      label: 'Perspektif',
      images: perspectiveImages,
    });
  }

  // 3. Denah
  const planImages = [];
  if (Array.isArray(props.type.plans) && props.type.plans.length > 0) {
    props.type.plans.forEach((pl, idx) => {
      const src = typeof pl === 'string' ? pl : pl.src;
      const label = (typeof pl === 'object' && pl.label) ? pl.label : `Denah ${idx + 1}`;
      planImages.push({ src, fit: 'contain', label });
    });
  } else if (props.type.gallery?.[0]) {
    planImages.push({
      src: props.type.gallery[0],
      fit: 'contain',
      label: 'Denah',
    });
  }
  if (planImages.length > 0) {
    list.push({
      id: 'plan',
      label: 'Denah',
      images: planImages,
    });
  }

  return list;
});

const activeTabId = ref('front');
const activeImageIndex = ref(0);

const currentTab = computed(() => {
  return visualTabs.value.find(t => t.id === activeTabId.value) || visualTabs.value[0] || null;
});

const currentImage = computed(() => {
  if (!currentTab.value || !currentTab.value.images?.length) return null;
  const idx = Math.min(activeImageIndex.value, currentTab.value.images.length - 1);
  return currentTab.value.images[idx];
});

function selectTab(id) {
  activeTabId.value = id;
  activeImageIndex.value = 0;
}

function prevImage() {
  if (!currentTab.value?.images?.length || !visualTabs.value.length) return;

  if (activeImageIndex.value > 0) {
    // Masih ada sub-gambar sebelumnya di tab ini -> mundurkan sub-gambar (tab tetap aktif)
    activeImageIndex.value--;
  } else {
    // Sudah di gambar pertama di tab ini -> mundurkan ke tab sebelumnya
    const tabIdx = visualTabs.value.findIndex(t => t.id === activeTabId.value);
    const prevTabIdx = (tabIdx - 1 + visualTabs.value.length) % visualTabs.value.length;
    const prevTab = visualTabs.value[prevTabIdx];
    activeTabId.value = prevTab.id;
    activeImageIndex.value = Math.max(0, (prevTab.images?.length || 1) - 1);
  }
}

function nextImage() {
  if (!currentTab.value?.images?.length || !visualTabs.value.length) return;
  const len = currentTab.value.images.length;

  if (activeImageIndex.value < len - 1) {
    // Masih ada sub-gambar di tab ini -> majukan sub-gambar (tab tetap aktif)
    activeImageIndex.value++;
  } else {
    // Sudah di gambar terakhir di tab ini -> majukan ke tab berikutnya
    const tabIdx = visualTabs.value.findIndex(t => t.id === activeTabId.value);
    const nextTabIdx = (tabIdx + 1) % visualTabs.value.length;
    activeTabId.value = visualTabs.value[nextTabIdx].id;
    activeImageIndex.value = 0;
  }
}

/**
 * Stage Gesture Swipe
 */
let stageTouchStartX = 0;
let stageTouchStartY = 0;
let stageIsSwiping = false;

function onStageTouchStart(e) {
  if (!e.touches?.[0]) return;
  stageTouchStartX = e.touches[0].clientX;
  stageTouchStartY = e.touches[0].clientY;
  stageIsSwiping = false;
}

function onStageTouchMove(e) {
  if (!e.touches?.[0]) return;
  const deltaX = e.touches[0].clientX - stageTouchStartX;
  const deltaY = e.touches[0].clientY - stageTouchStartY;
  if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
    stageIsSwiping = true;
  }
}

function onStageTouchEnd(e) {
  if (!e.changedTouches?.[0]) return;
  const deltaX = e.changedTouches[0].clientX - stageTouchStartX;
  const deltaY = e.changedTouches[0].clientY - stageTouchStartY;
  if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
    stageIsSwiping = true;
    if (deltaX < 0) {
      nextImage();
    } else {
      prevImage();
    }
    setTimeout(() => {
      stageIsSwiping = false;
    }, 120);
  } else {
    stageIsSwiping = false;
  }
}

function handleStageClick() {
  if (stageIsSwiping) return;
  openLightboxFromStage();
}

function openLightboxFromStage() {
  if (!visualTabs.value.length) return;
  const allImages = [];
  let currentIndexInFlat = 0;
  visualTabs.value.forEach((tab) => {
    tab.images.forEach((img, idx) => {
      if (tab.id === activeTabId.value && idx === activeImageIndex.value) {
        currentIndexInFlat = allImages.length;
      }
      allImages.push({
        src: img.src,
        alt: `${img.label || tab.label} ${props.type?.name || ''}`,
      });
    });
  });
  openGallery(allImages, currentIndexInFlat);
}

/**
 * Panel Spesifikasi Auto-Slide (1 Baris 3 Kolom)
 */
const specChunks = computed(() => {
  if (!props.type?.specs) return [];
  const chunks = [];
  for (let i = 0; i < props.type.specs.length; i += 3) {
    chunks.push(props.type.specs.slice(i, i + 3));
  }
  return chunks;
});

const currentSpecSlide = ref(0);
let specTimer = null;
const isInteractingWithSpecs = ref(false);

function startSpecTimer() {
  stopSpecTimer();
  if (specChunks.value.length <= 1) return;
  specTimer = setInterval(() => {
    if (!isInteractingWithSpecs.value && specChunks.value.length > 1) {
      currentSpecSlide.value = (currentSpecSlide.value + 1) % specChunks.value.length;
    }
  }, 1800);
}

function stopSpecTimer() {
  if (specTimer) {
    clearInterval(specTimer);
    specTimer = null;
  }
}

function resetSpecTimer() {
  stopSpecTimer();
  startSpecTimer();
}

function prevSpecSlide() {
  if (specChunks.value.length <= 1) return;
  currentSpecSlide.value = (currentSpecSlide.value - 1 + specChunks.value.length) % specChunks.value.length;
  resetSpecTimer();
}

function nextSpecSlide() {
  if (specChunks.value.length <= 1) return;
  currentSpecSlide.value = (currentSpecSlide.value + 1) % specChunks.value.length;
  resetSpecTimer();
}

function goToSpecSlide(idx) {
  currentSpecSlide.value = idx;
  resetSpecTimer();
}

let specTouchStartX = 0;
let specTouchStartY = 0;

function onSpecTouchStart(e) {
  if (!e.touches?.[0]) return;
  specTouchStartX = e.touches[0].clientX;
  specTouchStartY = e.touches[0].clientY;
  isInteractingWithSpecs.value = true;
}

function onSpecTouchEnd(e) {
  isInteractingWithSpecs.value = false;
  if (!e.changedTouches?.[0]) return;
  const deltaX = e.changedTouches[0].clientX - specTouchStartX;
  const deltaY = e.changedTouches[0].clientY - specTouchStartY;
  if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) && specChunks.value.length > 1) {
    if (deltaX < 0) {
      nextSpecSlide();
    } else {
      prevSpecSlide();
    }
  }
}

const waHref = computed(() => {
  if (!props.type) return '#';
  return props.type.waLink || wa('type', { type: props.type.name });
});

function getSpecType(label = '') {
  const l = label.toLowerCase();
  if (l.includes('pondasi')) return 'pondasi';
  if (l.includes('struktur')) return 'struktur';
  if (l.includes('dinding')) return 'dinding';
  if (l.includes('lantai')) return 'lantai';
  if (l.includes('atap')) return 'atap';
  if (l.includes('kusen')) return 'kusen';
  if (l.includes('pintu')) return 'pintu';
  if (l.includes('listrik')) return 'listrik';
  if (l.includes('air')) return 'air';
  return 'default';
}

function onKeydown(e) {
  if (!props.type) return;
  if (e.key === 'Escape') {
    emit('close');
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  } else if (e.key === 'ArrowRight') {
    nextImage();
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  stopSpecTimer();
  document.removeEventListener('keydown', onKeydown);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});

watch(() => props.type, (newType) => {
  if (newType) {
    activeTabId.value = visualTabs.value[0]?.id || 'front';
    activeImageIndex.value = 0;
    currentSpecSlide.value = 0;
    startSpecTimer();
    nextTick(() => {
      dialogRef.value?.focus();
    });
  } else {
    stopSpecTimer();
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = newType ? 'hidden' : '';
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="type"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/60 p-3 sm:p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-label="type.name"
          tabindex="-1"
          class="relative flex max-h-[94vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[20px] border border-cream-light bg-off-white shadow-[0_24px_60px_rgba(20,43,32,0.25)] focus:outline-none"
        >
          <!-- 1. HEADER (Satu Baris, Tetap di Atas) -->
          <div class="flex shrink-0 items-center justify-between gap-3 border-b border-cream-light bg-white px-4 py-3 sm:px-5 sm:py-3.5">
            <!-- Kiri: Judul Tipe -->
            <h3 class="font-display text-[22px] sm:text-[24px] font-bold leading-tight text-forest-deep whitespace-nowrap">
              {{ type.name }}
            </h3>

            <!-- Tengah: 4 Chip Ringkasan (LB, LT, KT, KM) -->
            <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-pale text-forest-deep border border-sage-mist font-body text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap">
                <svg class="h-3 w-3 shrink-0 text-forest-deep/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <span>LB {{ type.lb }} m²</span>
              </span>

              <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-pale text-forest-deep border border-sage-mist font-body text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap">
                <svg class="h-3 w-3 shrink-0 text-forest-deep/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 12h18M12 3v18" />
                </svg>
                <span>LT {{ type.lt }} m²</span>
              </span>

              <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-pale text-forest-deep border border-sage-mist font-body text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap">
                <svg class="h-3 w-3 shrink-0 text-forest-deep/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
                </svg>
                <span>{{ type.kt }} KT</span>
              </span>

              <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-pale text-forest-deep border border-sage-mist font-body text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap">
                <svg class="h-3 w-3 shrink-0 text-forest-deep/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1zm2-6h2a2 2 0 0 1 2 2v4M6 6a2 2 0 0 0-2 2v4" />
                </svg>
                <span>{{ type.km }} KM</span>
              </span>
            </div>

            <!-- Kanan: Tombol Close Bulat -->
            <button
              type="button"
              aria-label="Tutup"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream-light bg-white text-forest-deep transition-colors hover:border-orange/40 hover:bg-[#FFF4E6] hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep focus-visible:ring-offset-2"
              @click="emit('close')"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 2. BODY (Scroll Vertikal bila perlu pada layar kecil) -->
          <div class="flex-1 space-y-2.5 overflow-y-auto overscroll-contain bg-off-white p-3 sm:p-4">
            <!-- Segmented Control Tab -->
            <div class="flex gap-1 rounded-xl border border-cream-light bg-cream-light/60 p-1" role="tablist" aria-label="Pilihan tampilan visual unit">
              <button
                v-for="tab in visualTabs"
                :key="tab.id"
                type="button"
                role="tab"
                :aria-selected="activeTabId === tab.id"
                class="flex-1 rounded-lg px-2.5 py-1.5 text-center font-body text-xs sm:text-[13px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep"
                :class="activeTabId === tab.id ? 'bg-forest-deep font-semibold text-white shadow-sm' : 'font-medium text-charcoal-gray hover:text-forest-deep'"
                @click="selectTab(tab.id)"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Visual Stage (250px Mobile / 340px Desktop) -->
            <div
              class="group relative h-[250px] w-full cursor-pointer select-none overflow-hidden rounded-xl border border-cream-light bg-white sm:h-[340px]"
              @touchstart.passive="onStageTouchStart"
              @touchmove.passive="onStageTouchMove"
              @touchend="onStageTouchEnd"
              @click="handleStageClick"
            >
              <img
                v-if="currentImage"
                :key="currentImage.src"
                :src="currentImage.src"
                :alt="`${currentImage.label || currentTab?.label} ${type.name}`"
                loading="lazy"
                class="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]"
                :class="currentImage.fit === 'contain' ? 'object-contain p-2 bg-white' : 'object-cover'"
              />

              <!-- Caption Pill Kiri Atas -->
              <span class="pointer-events-none absolute left-3 top-3 rounded-full bg-forest-deep/85 px-2.5 py-0.5 font-body text-xs font-semibold tracking-wide text-white backdrop-blur-sm shadow-xs">
                {{ currentImage?.label || currentTab?.label }}
              </span>

              <!-- Sub-image Counter Badge Kanan Atas saat gambar > 1 -->
              <span
                v-if="currentTab && currentTab.images.length > 1"
                class="pointer-events-none absolute right-3 top-3 rounded-full bg-forest-deep/85 px-2.5 py-0.5 font-body text-xs font-semibold tracking-wide text-white backdrop-blur-sm shadow-xs"
              >
                {{ activeImageIndex + 1 }} / {{ currentTab.images.length }}
              </span>

              <!-- Sub-image Dots di dasar stage jika > 1 gambar -->
              <div
                v-if="currentTab && currentTab.images.length > 1"
                class="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-forest-deep/60 px-2 py-1 backdrop-blur-sm"
              >
                <span
                  v-for="(_, dotI) in currentTab.images"
                  :key="dotI"
                  class="h-1.5 rounded-full transition-all"
                  :class="activeImageIndex === dotI ? 'w-3.5 bg-white' : 'w-1.5 bg-white/50'"
                />
              </div>

              <!-- Tombol Panah Navigasi Kanan Bawah -->
              <div
                v-if="visualTabs.length > 1 || (currentTab && currentTab.images.length > 1)"
                class="absolute bottom-3 right-3 z-10 flex items-center gap-1.5"
              >
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-forest-deep/80 text-white backdrop-blur-sm transition-all hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep sm:h-8 sm:w-8"
                  @click.stop="prevImage"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Berikutnya"
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-forest-deep/80 text-white backdrop-blur-sm transition-all hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep sm:h-8 sm:w-8"
                  @click.stop="nextImage"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Panel Spesifikasi (1 Baris 3 Kolom + Auto-Slide 1.8s + Swipe Touch + Desktop Nav) -->
            <div
              class="relative overflow-hidden rounded-xl border border-cream-light bg-white py-2 sm:py-2.5 shadow-xs"
              @mouseenter="isInteractingWithSpecs = true"
              @mouseleave="isInteractingWithSpecs = false"
              @touchstart.passive="onSpecTouchStart"
              @touchend="onSpecTouchEnd"
            >
              <!-- Carousel Track -->
              <div
                class="flex transition-transform duration-500 ease-out"
                :style="{ transform: `translateX(-${currentSpecSlide * 100}%)` }"
              >
                <div
                  v-for="(chunk, cIdx) in specChunks"
                  :key="cIdx"
                  class="grid w-full shrink-0 grid-cols-3 items-center gap-2 sm:gap-4 px-3 sm:px-4"
                >
                  <div
                    v-for="spec in chunk"
                    :key="spec.label"
                    class="flex min-w-0 items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <!-- Icon 18px Outline dengan warna emas SIP #c9a84c -->
                    <div class="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[#c9a84c]">
                      <!-- Pondasi -->
                      <svg v-if="getSpecType(spec.label) === 'pondasi'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M4 20h16M3 20v-4h18v4M6 16v-5h12v5M8 11V7h8v4" />
                      </svg>
                      <!-- Struktur -->
                      <svg v-else-if="getSpecType(spec.label) === 'struktur'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="5" y="3" width="14" height="18" rx="1" />
                        <path d="M5 9h14M5 15h14M9 3v18M15 3v18" />
                      </svg>
                      <!-- Dinding -->
                      <svg v-else-if="getSpecType(spec.label) === 'dinding'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="16" rx="1" />
                        <path d="M3 9.5h18M3 14.5h18M9 4v5.5M15 4v5.5M6 9.5v5M18 9.5v5M10 14.5V20M16 14.5V20" />
                      </svg>
                      <!-- Lantai -->
                      <svg v-else-if="getSpecType(spec.label) === 'lantai'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="1.5" />
                        <path d="M3 12h18M12 3v18M3 7.5h18M3 16.5h18M7.5 3v18M16.5 3v18" />
                      </svg>
                      <!-- Atap -->
                      <svg v-else-if="getSpecType(spec.label) === 'atap'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M2 13 12 4l10 9M4 11.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7.5" />
                        <path d="M8 15h8M7 18h10" />
                      </svg>
                      <!-- Kusen -->
                      <svg v-else-if="getSpecType(spec.label) === 'kusen'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="1.5" />
                        <path d="M12 3v18M3 12h18" />
                        <rect x="5.5" y="5.5" width="4" height="4" rx="0.5" />
                        <rect x="14.5" y="5.5" width="4" height="4" rx="0.5" />
                        <rect x="5.5" y="14.5" width="4" height="4" rx="0.5" />
                        <rect x="14.5" y="14.5" width="4" height="4" rx="0.5" />
                      </svg>
                      <!-- Pintu -->
                      <svg v-else-if="getSpecType(spec.label) === 'pintu'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M4 21h16M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
                        <circle cx="15" cy="12" r="1" fill="currentColor" />
                      </svg>
                      <!-- Listrik -->
                      <svg v-else-if="getSpecType(spec.label) === 'listrik'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M13 2 3 14h8l-2 8 10-12h-8l2-8z" />
                      </svg>
                      <!-- Air -->
                      <svg v-else-if="getSpecType(spec.label) === 'air'" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <!-- Fallback -->
                      <svg v-else class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                    </div>

                    <!-- Teks Spesifikasi -->
                    <div class="min-w-0">
                      <span class="block font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-charcoal-gray leading-tight">
                        {{ spec.label }}
                      </span>
                      <span
                        class="block font-body text-[12px] sm:text-[13px] font-bold text-forest-deep truncate leading-tight mt-0.5"
                        :title="spec.value"
                      >
                        {{ spec.value }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination Controls: Desktop Nav Arrows (< & >) + Dots -->
              <div v-if="specChunks.length > 1" class="mt-2 flex justify-center items-center gap-2">
                <!-- Desktop Prev Button -->
                <button
                  type="button"
                  aria-label="Spesifikasi sebelumnya"
                  class="hidden sm:flex h-5 w-5 items-center justify-center rounded-full border border-cream-light bg-off-white text-forest-deep transition-all hover:bg-forest-deep hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forest-deep"
                  @click.stop="prevSpecSlide"
                >
                  <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <!-- Dots -->
                <div class="flex items-center gap-1.5">
                  <button
                    v-for="(_, dotIdx) in specChunks"
                    :key="dotIdx"
                    type="button"
                    :aria-label="`Spesifikasi halaman ${dotIdx + 1}`"
                    class="h-1 rounded-full transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forest-deep"
                    :class="currentSpecSlide === dotIdx ? 'w-4 bg-forest-deep' : 'w-1.5 bg-cream-light hover:bg-charcoal-gray/40'"
                    @click.stop="goToSpecSlide(dotIdx)"
                  />
                </div>

                <!-- Desktop Next Button -->
                <button
                  type="button"
                  aria-label="Spesifikasi berikutnya"
                  class="hidden sm:flex h-5 w-5 items-center justify-center rounded-full border border-cream-light bg-off-white text-forest-deep transition-all hover:bg-forest-deep hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-forest-deep"
                  @click.stop="nextSpecSlide"
                >
                  <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 3. FOOTER (Tetap di Bawah) -->
          <div class="flex shrink-0 flex-col gap-2.5 border-t border-cream-light bg-white px-4 py-2.5 sm:px-5 sm:py-3 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
            <!-- Kiri: Tombol WhatsApp -->
            <a
              :href="waHref"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-btn bg-gradient-to-r from-[#1cba5a] to-[#2eec72] px-4 py-2 text-[13.5px] font-semibold text-white shadow-btn-wa transition-all hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep focus-visible:ring-offset-2 min-[520px]:w-auto"
            >
              <svg class="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Tanya unit ini</span>
              <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <!-- Kanan: Catatan Serah Terima -->
            <p class="font-body text-xs font-normal leading-tight text-charcoal-gray text-center min-[520px]:text-right">
              *Konsumen tidak dapat merubah/merenovasi bangunan sebelum proses serah terima unit.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
