<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useLightbox } from '~/composables/useLightbox';

const props = defineProps({
  type: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const dialogRef = ref(null);
const { openGallery } = useLightbox();

/** Galeri tipe ini: ilustrasi/fasad lalu denah — dipakai untuk zoom + swipe. */
function typeGallery() {
  return [
    { src: props.type.gallery[1], alt: `Ilustrasi ${props.type.name}` },
    { src: props.type.gallery[0], alt: `Denah ${props.type.name}` },
  ];
}

/**
 * Dua kartu gambar di dalam modal. `index` harus cocok dengan urutan
 * typeGallery() di atas supaya lightbox terbuka pada gambar yang diklik.
 */
const imageCards = computed(() => props.type ? [
  // Fasad boleh dipangkas (object-cover) karena yang dijual kesan visualnya.
  // Denah TIDAK boleh: memangkasnya menghilangkan sebagian ruang dan ukuran,
  // yang justru jadi alasan utama orang membuka denah. Karena itu object-contain.
  { label: 'Fasad', src: props.type.gallery[1], index: 0, fit: 'object-cover' },
  { label: 'Denah', src: props.type.gallery[0], index: 1, fit: 'object-contain p-2' },
] : []);

function onKeydown(e) {
  if (e.key === 'Escape' && props.type) emit('close');
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  if (typeof document !== 'undefined') document.body.style.overflow = '';
});

watch(() => props.type, (t) => {
  if (t) dialogRef.value?.focus();
  // Kunci scroll body selama modal terbuka, konsisten dengan modal lain.
  if (typeof document !== 'undefined') document.body.style.overflow = t ? 'hidden' : '';
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
      class="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm"
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
          class="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-off-white shadow-[0_24px_60px_rgba(28,74,42,0.3)] focus:outline-none"
        >
          <!-- HEADER — menetap.
               Sebelumnya seluruh modal ikut bergulir di dalam overlay, sehingga
               tombol tutup hilang dari layar begitu user menggulir ke spesifikasi.
               Di HP itu menjebak: tidak ada jalan keluar yang terlihat. Sekarang
               modal jadi kolom flex bertinggi maksimum, hanya isinya yang bergulir. -->
          <div class="shrink-0 border-b border-cream-light bg-white px-6 py-5 sm:px-9">
            <button
              type="button"
              aria-label="Tutup"
              class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream-light bg-white text-forest-deep transition-colors hover:border-orange/40 hover:bg-[#FFF4E6] hover:text-orange focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-forest-deep/10"
              @click="emit('close')"
            >
              <!-- SVG, bukan karakter "✕": karakter teks tebalnya ikut font dan
                   ukurannya tidak konsisten antar sistem. -->
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="pr-12">
              <p class="font-body text-xs font-bold uppercase tracking-[0.14em] text-orange">Detail Unit</p>
              <h3 class="mt-1 font-display text-size-3 text-forest-deep sm:text-size-2">{{ type.name }}</h3>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <Badge :label="`LB ${type.lb} m²`" />
              <Badge :label="`LT ${type.lt} m²`" />
              <Badge :label="`${type.kt} KT`" />
              <Badge :label="`${type.km} KM`" />
            </div>
          </div>

          <!-- ISI — satu-satunya bagian yang bergulir -->
          <div class="flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-9">
            <div class="grid gap-4 sm:grid-cols-2">
              <!-- Gambar diberi keterangan. Sebelumnya keduanya tampil polos
                   berdampingan sehingga user harus menebak mana fasad mana denah.
                   Ikon kaca pembesar memberi tahu bahwa gambar bisa diperbesar —
                   sebelumnya satu-satunya petunjuk hanya kursor, yang tidak ada
                   sama sekali di layar sentuh. -->
              <button v-for="img in imageCards" :key="img.label" type="button"
                class="group relative block w-full overflow-hidden rounded-xl border border-cream-light bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep/30"
                :aria-label="`Perbesar ${img.label.toLowerCase()} ${type.name}`"
                @click="openGallery(typeGallery(), img.index)">
                <img :src="img.src" :alt="`${img.label} ${type.name}`" loading="lazy"
                  :class="img.fit"
                  class="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                <span class="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wide text-forest-deep shadow-sm ring-1 ring-cream-light">
                  {{ img.label }}
                </span>
                <span class="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-forest-deep opacity-0 shadow-sm ring-1 ring-cream-light transition-opacity duration-200 group-hover:opacity-100">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
                  </svg>
                </span>
              </button>
            </div>

            <div class="mt-7">
              <!-- Judul diberi garis emas tipis di sampingnya sebagai pemisah
                   halus, supaya blok spesifikasi terbaca sebagai bagian tersendiri. -->
              <h4 class="flex items-center gap-3 font-display text-size-4 text-forest-deep">
                <span class="whitespace-nowrap">Spesifikasi Teknis</span>
                <span class="h-px flex-1 bg-[linear-gradient(90deg,#e0d3ae,transparent)]"></span>
              </h4>
              <div class="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div v-for="spec in type.specs" :key="spec.label"
                  class="rounded-[10px] border border-cream-light bg-white px-3 py-[9px] transition-colors hover:border-sage-mist">
                  <p class="font-body text-[11px] uppercase tracking-wide text-charcoal-gray">{{ spec.label }}</p>
                  <p class="mt-0.5 font-body text-sm font-bold text-forest-deep">{{ spec.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER — menetap, supaya ajakan bertindak selalu terlihat tanpa
               perlu menggulir kembali ke bawah. -->
          <div class="shrink-0 border-t border-cream-light bg-white px-6 py-4 sm:px-9">
            <WhatsAppButton message-key="type" :vars="{ type: type.name }" variant="primaryGradient" class="w-full sm:w-auto">
              <!-- Ikon WhatsApp memberi tahu tombol ini membuka WhatsApp, bukan
                   halaman lain di situs. -->
              <svg class="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Tanya Unit {{ type.name }}</span>
              <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </WhatsAppButton>
            <p class="mt-3 font-body text-xs leading-relaxed text-charcoal-gray">
              *Konsumen tidak dapat merubah/merenovasi bangunan sebelum proses serah terima unit.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
