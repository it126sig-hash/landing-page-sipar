<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLightbox } from '~/composables/useLightbox';

const props = defineProps({
  /** [{ src, label }] — tampilan luar saja (fasad, perspektif 3D). Denah TIDAK di sini. */
  items: { type: Array, default: () => [] },
  /** Nama tipe, dipakai untuk alt & aria-label. */
  typeName: { type: String, default: '' },
});

const { openGallery } = useLightbox();

const scroller = ref(null);
const activeIndex = ref(0);

/**
 * Kartu dibaca langsung dari DOM anak scroller, bukan dikumpulkan lewat
 * callback `:ref`. Array `:ref` tidak pernah dibersihkan saat daftar berubah,
 * sehingga indeksnya bisa meleset dari urutan kartu yang sebenarnya —
 * tombol panah lalu menggeser ke elemen yang salah, atau tidak bergerak.
 */
function cards() {
  return scroller.value ? Array.from(scroller.value.children) : [];
}

/** Galeri untuk lightbox — urutannya harus sama dengan urutan kartu. */
const lightboxItems = computed(() =>
  props.items.map(it => ({ src: it.src, alt: `${it.label} ${props.typeName}` }))
);

function openAt(index) {
  openGallery(lightboxItems.value, index);
}

/**
 * Kartu mana yang sedang di tengah viewport — dipakai untuk indikator titik.
 * IntersectionObserver dipilih daripada mendengarkan event scroll karena tidak
 * ikut berjalan di setiap frame saat digeser.
 */
let observer = null;
function observeCards() {
  if (typeof IntersectionObserver === 'undefined' || !scroller.value) return;
  observer?.disconnect();
  const list = cards();
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const i = cards().indexOf(e.target);
          if (i !== -1) activeIndex.value = i;
        }
      }
    },
    { root: scroller.value, threshold: 0.6 }
  );
  for (const el of list) observer.observe(el);
}

/**
 * Geser ke kartu tertentu.
 *
 * Memakai scrollLeft pada wadahnya sendiri, BUKAN el.scrollIntoView().
 * scrollIntoView menggulirkan semua leluhur yang bisa digulir agar elemennya
 * terlihat — dan isi modal ini sendiri sebuah wadah bergulir vertikal, jadi
 * yang ikut bergeser justru modalnya, bukan galerinya.
 * offsetLeft dihitung relatif terhadap wadah agar tidak terpengaruh padding.
 */
function scrollTo(index) {
  const el = cards()[index];
  const box = scroller.value;
  if (!el || !box) return;
  const reduce = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  box.scrollTo({ left: offsetOf(el, box), behavior: reduce ? 'auto' : 'smooth' });
}

/**
 * Jarak kartu dari awal isi wadah.
 *
 * TIDAK boleh `el.offsetLeft - box.offsetLeft`: kartu dan wadahnya ternyata
 * ber-offsetParent SAMA, jadi selisih itu diukur dalam koordinat leluhur dan
 * angkanya jauh melebihi jarak gulir yang sebenarnya (mis. 434 padahal
 * maksimum gulirnya cuma 175). Akibatnya panah "berikutnya" mentok di ujung
 * lalu posisi terbaca balik ke kartu pertama, dan "sebelumnya" jadi mati.
 * Selisih getBoundingClientRect + scrollLeft selalu relatif terhadap isi wadah.
 */
function offsetOf(el, box) {
  return el.getBoundingClientRect().left - box.getBoundingClientRect().left + box.scrollLeft;
}

/**
 * Posisi sekarang dibaca dari scrollLeft, bukan dari activeIndex.
 * activeIndex hanya diperbarui IntersectionObserver; kalau observer belum
 * sempat menyala, tombol panah jadi tidak bergerak sama sekali.
 */
function currentIndex() {
  const box = scroller.value;
  if (!box) return 0;
  // Kartu terakhir tidak pernah bisa menempel ke kiri kalau sisa ruang gulirnya
  // kurang dari lebar kartu — di layar lebar, target kartu ke-2 bisa 434 padahal
  // gulir maksimumnya cuma 175. Karena itu posisi dinilai dari SEBERAPA BANYAK
  // kartu yang terlihat, bukan dari jaraknya ke tepi kiri.
  const list = cards();
  const view = { left: box.scrollLeft, right: box.scrollLeft + box.clientWidth };
  let best = 0;
  let bestVisible = -1;
  list.forEach((el, i) => {
    const left = offsetOf(el, box);
    const right = left + el.offsetWidth;
    const visible = Math.min(right, view.right) - Math.max(left, view.left);
    if (visible > bestVisible) { bestVisible = visible; best = i; }
  });
  return best;
}

function step(delta) {
  const next = Math.min(Math.max(currentIndex() + delta, 0), props.items.length - 1);
  scrollTo(next);
}

onMounted(observeCards);
watch(() => props.items, () => {
  activeIndex.value = 0;
  scroller.value?.scrollTo({ left: 0 });
  // tunggu DOM menggambar ulang kartu-kartunya sebelum diamati lagi
  requestAnimationFrame(observeCards);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div v-if="items.length">
    <div class="mb-3 flex items-center gap-3">
      <h4 class="font-display text-size-4 text-forest-deep">Fasad</h4>
      <!-- Petunjuk hanya ditampilkan kalau memang ada yang bisa digeser. -->
      <p v-if="items.length > 1" class="font-body text-xs text-charcoal-gray">
        Geser untuk melihat sudut lain
      </p>
      <span class="h-px flex-1 bg-[linear-gradient(90deg,#e0d3ae,transparent)]"></span>

      <!-- Panah hanya di layar besar: di HP orang menggeser langsung dengan jari,
           dan dua tombol kecil di sana justru memakan ruang gambar. -->
      <div v-if="items.length > 1" class="hidden shrink-0 gap-1.5 sm:flex">
        <button
          v-for="nav in [{ d: -1, label: 'Fasad sebelumnya', disabled: activeIndex === 0 },
                         { d: 1, label: 'Fasad berikutnya', disabled: activeIndex === items.length - 1 }]"
          :key="nav.d"
          type="button"
          :aria-label="nav.label"
          :disabled="nav.disabled"
          class="flex h-8 w-8 items-center justify-center rounded-full border border-cream-light bg-white text-forest-deep transition-colors hover:border-orange/40 hover:text-orange disabled:opacity-35 disabled:hover:border-cream-light disabled:hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep/30"
          @click="step(nav.d)"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path :d="nav.d === -1 ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Baris yang bisa digeser.
         snap-mandatory membuat kartu berhenti rapi di tengah, bukan mengambang
         setengah. Lebar kartu sengaja < 100% supaya kartu berikutnya terlihat
         terpotong di tepi — itu petunjuk paling jujur bahwa masih ada lagi,
         dan tetap terbaca di layar sentuh yang tidak punya kursor.
         Kelas .no-scrollbar hanya menyembunyikan batang gulir; isinya tetap
         bisa digeser dengan jari, roda, maupun keyboard. -->
    <div
      ref="scroller"
      class="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep/30"
      :tabindex="items.length > 1 ? 0 : -1"
      role="group"
      :aria-label="`Galeri fasad ${typeName}`"
      @keydown.left.prevent="step(-1)"
      @keydown.right.prevent="step(1)"
      @scroll.passive="activeIndex = currentIndex()"
    >
      <button
        v-for="(img, i) in items"
        :key="img.src"
        type="button"
        class="group relative block shrink-0 basis-[88%] snap-start overflow-hidden rounded-xl border border-cream-light bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep/30 sm:basis-[62%]"
        :aria-label="`Perbesar ${img.label.toLowerCase()} ${typeName}`"
        @click="openAt(i)"
      >
        <!-- aspect-video, BUKAN 4:3: aset fasad & 3D aslinya 1920x1080.
             Memaksanya ke 4:3 memangkas sisi kiri-kanan streetscape. -->
        <img
          :src="img.src"
          :alt="`${img.label} ${typeName}`"
          loading="lazy"
          class="aspect-video w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
        <span class="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wide text-forest-deep shadow-sm ring-1 ring-cream-light">
          {{ img.label }}
        </span>
        <span class="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-forest-deep opacity-0 shadow-sm ring-1 ring-cream-light transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Indikator posisi. aria-hidden: informasinya sudah disampaikan label tiap
         kartu, jadi buat pembaca layar ini hanya pengulangan. -->
    <div v-if="items.length > 1" class="mt-3 flex justify-center gap-1.5" aria-hidden="true">
      <button
        v-for="(img, i) in items"
        :key="`dot-${img.src}`"
        type="button"
        tabindex="-1"
        class="h-[7px] rounded-full transition-all duration-300 motion-reduce:transition-none"
        :class="i === activeIndex ? 'w-5 bg-[#c9a84c]' : 'w-[7px] bg-cream-light hover:bg-sage-mist'"
        @click="scrollTo(i)"
      />
    </div>
  </div>
</template>

<style scoped>
/* Batang gulir disembunyikan supaya galeri terbaca sebagai deretan gambar,
   bukan panel bergulir. Kemampuan menggesernya sendiri tidak dihilangkan. */
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
