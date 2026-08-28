<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useLightbox } from '~/composables/useLightbox';

/**
 * Image viewer: ZOOM + PAN + SWIPE, tanpa library tambahan.
 * - Zoom hanya pada GAMBAR (CSS transform), BUKAN pada halaman.
 *   Tidak menyentuh browser zoom / page scale sama sekali.
 * - Mobile: pinch (2 jari) untuk zoom, drag untuk geser saat zoom,
 *   swipe kiri/kanan untuk ganti gambar saat belum di-zoom.
 * - Desktop: tombol +/-, double click, drag untuk pan, panah kiri/kanan, ESC.
 */
const { gallery, closeLightbox, next, prev } = useLightbox();

const MIN = 1;
const MAX = 4;
const scale = ref(1);
const tx = ref(0);
const ty = ref(0);
const dragging = ref(false);

const items = computed(() => gallery.value?.items || []);
const index = computed(() => gallery.value?.index ?? 0);
const current = computed(() => items.value[index.value] || null);
const many = computed(() => items.value.length > 1);
const zoomed = computed(() => scale.value > 1.01);

function resetView() {
  scale.value = 1; tx.value = 0; ty.value = 0;
}
function zoomBy(d) {
  const s = Math.min(MAX, Math.max(MIN, +(scale.value + d).toFixed(2)));
  scale.value = s;
  if (s <= 1.01) { tx.value = 0; ty.value = 0; }
}
function toggleZoom() {
  if (zoomed.value) resetView(); else scale.value = 2;
}
function goNext() { resetView(); next(); }
function goPrev() { resetView(); prev(); }

// reset zoom tiap ganti gambar / buka galeri
watch(() => [gallery.value?.index, items.value.length], () => resetView());

// ── Pointer: drag untuk pan (saat zoom) / swipe (saat belum zoom) ──
let startX = 0, startY = 0, baseX = 0, baseY = 0, moved = false;
function onPointerDown(e) {
  if (e.pointerType === 'touch' && e.isPrimary === false) return;
  // JANGAN capture pointer kalau tekanan dimulai di atas tombol (prev/next).
  // setPointerCapture me-retarget pointerup ke stage sehingga event `click`
  // pada tombol tidak pernah terjadi → tombol jadi mati.
  if (e.target.closest && e.target.closest('button')) return;
  dragging.value = true; moved = false;
  startX = e.clientX; startY = e.clientY;
  baseX = tx.value; baseY = ty.value;
  e.currentTarget.setPointerCapture?.(e.pointerId);
}
function onPointerMove(e) {
  if (!dragging.value || pinching) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
  if (zoomed.value) { tx.value = baseX + dx; ty.value = baseY + dy; }
}
function onPointerUp(e) {
  if (!dragging.value) return;
  dragging.value = false;
  if (pinching) return;
  const dx = e.clientX - startX;
  // swipe hanya saat tidak zoom, supaya pan tidak bentrok
  if (!zoomed.value && many.value && Math.abs(dx) > 45) {
    dx < 0 ? goNext() : goPrev();
  }
}

// ── Pinch zoom (2 jari) ──
let pinching = false, startDist = 0, startScale = 1;
function dist(t) {
  const [a, b] = [t[0], t[1]];
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
function onTouchStart(e) {
  if (e.touches.length === 2) {
    pinching = true; dragging.value = false;
    startDist = dist(e.touches); startScale = scale.value;
  }
}
function onTouchMove(e) {
  if (pinching && e.touches.length === 2) {
    e.preventDefault();                                  // cegah page ikut zoom/scroll
    const r = dist(e.touches) / (startDist || 1);
    scale.value = Math.min(MAX, Math.max(MIN, +(startScale * r).toFixed(2)));
    if (scale.value <= 1.01) { tx.value = 0; ty.value = 0; }
  }
}
function onTouchEnd(e) {
  if (e.touches.length < 2) pinching = false;
}

// ── Keyboard ──
function onKeydown(e) {
  if (!gallery.value) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') goNext();
  else if (e.key === 'ArrowLeft') goPrev();
  else if (e.key === '+' || e.key === '=') zoomBy(0.5);
  else if (e.key === '-') zoomBy(-0.5);
  else if (e.key === '0') resetView();
}

const dialogRef = ref(null);
onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  if (typeof document !== 'undefined') document.body.style.overflow = '';
});

// kunci scroll body selama viewer terbuka
watch(gallery, async (g) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = g ? 'hidden' : '';
  if (g) { await nextTick(); dialogRef.value?.focus(); }
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100" leave-to-class="opacity-0"
  >
    <div
      v-if="current"
      ref="dialogRef"
      tabindex="-1"
      class="fixed inset-0 z-[100] flex flex-col bg-charcoal/95 backdrop-blur-sm focus:outline-none"
      role="dialog"
      aria-modal="true"
      :aria-label="current.alt"
      @click.self="closeLightbox"
    >
      <!-- Toolbar -->
      <div class="flex shrink-0 items-center justify-between gap-2 p-3 sm:p-4">
        <p class="min-w-0 flex-1 truncate font-body text-xs sm:text-sm text-white/90">
          {{ current.alt }}
          <span v-if="many" class="text-white/50"> · {{ index + 1 }}/{{ items.length }}</span>
        </p>
        <div class="flex shrink-0 items-center gap-2">
          <button type="button" aria-label="Perkecil"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:opacity-40"
            :disabled="scale <= 1" @click="zoomBy(-0.5)">
            <svg class="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" d="M5 12h14"/></svg>
          </button>
          <button type="button" aria-label="Perbesar"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:opacity-40"
            :disabled="scale >= 4" @click="zoomBy(0.5)">
            <svg class="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
          </button>
          <button type="button" aria-label="Tutup"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            @click="closeLightbox">
            <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Stage -->
      <div
        class="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 pb-3 sm:px-4"
        style="touch-action: none"
        @pointerdown="onPointerDown" @pointermove="onPointerMove"
        @pointerup="onPointerUp" @pointercancel="onPointerUp"
        @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
        @dblclick="toggleZoom"
      >
        <img
          :src="current.src" :alt="current.alt" draggable="false"
          class="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl"
          :class="[zoomed ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in',
                   dragging ? '' : 'transition-transform duration-150']"
          :style="{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }"
        />

        <!-- Prev / Next -->
        <button v-if="many" type="button" aria-label="Gambar sebelumnya"
          class="absolute left-2 sm:left-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
          @click.stop="goPrev">
          <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button v-if="many" type="button" aria-label="Gambar berikutnya"
          class="absolute right-2 sm:right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
          @click.stop="goNext">
          <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <p class="shrink-0 pb-3 text-center font-body text-[11px] text-white/45">
        Cubit atau tombol +/- untuk memperbesar<span v-if="many"> · geser untuk ganti gambar</span>
      </p>
    </div>
  </Transition>
</template>
