<script setup>
import { computed, ref } from 'vue';
import { useContent } from '~/composables/useContent';
import { useLightbox } from '~/composables/useLightbox';

const { content, houseTypes } = useContent();
const { openGallery } = useLightbox();

/** Galeri satu tipe: ilustrasi/fasad dulu, lalu denah. */
function galleryOf(t) {
  return [
    { src: t.gallery[1], alt: `Ilustrasi ${t.name}` },
    { src: t.gallery[0], alt: `Denah ${t.name}` },
  ];
}
function openTypeGallery(t, start = 0) {
  openGallery(galleryOf(t), start);
}

const selectedTypeId = ref(null);
const modalOpen = ref(false);
const selectedType = computed(() => houseTypes.find(t => t.id === selectedTypeId.value) || null);

function openType(id) {
  selectedTypeId.value = id;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}
</script>

<template>
  <section id="tipe" class="scroll-mt-20 bg-off-white py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Heading - Hijau -->
      <h2 class="font-display font-semibold text-3xl md:text-4xl text-center text-[#142b20] mb-10">
        {{ content.products.title }}
      </h2>

      <!-- House Types Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Kartu blok: tiap tipe dibungkus wadah putih dengan batas jelas supaya
             terbaca sebagai tiga produk terpisah, bukan sederet gambar mengambang.
             `group` dipakai agar gambar ikut bereaksi saat kartu di-hover. -->
        <article v-for="(t, index) in houseTypes" :key="t.id"
          class="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#ECEAE1] bg-white
                 shadow-[0_1px_2px_rgba(20,43,32,0.04),0_8px_24px_-16px_rgba(20,43,32,0.25)]
                 transition-all duration-300
                 hover:-translate-y-1 hover:border-[#e0d3ae]
                 hover:shadow-[0_2px_4px_rgba(20,43,32,0.05),0_18px_40px_-20px_rgba(20,43,32,0.35)]">

          <!-- Image - Rectangle aspect ratio, use 3D render -->
          <button v-if="t.thumbnail || (t.gallery && t.gallery.length)"
            type="button"
            class="relative block w-full aspect-[4/3] overflow-hidden border-b border-[#ECEAE1] bg-[#F5F3EE] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c9a84c]"
            :aria-label="`Perbesar foto ${t.name}`"
            @click="openTypeGallery(t, 0)">
            <img :src="t.thumbnail || t.gallery[1] || t.gallery[0]" :alt="t.name" loading="lazy"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />

            <!-- Label tipe, ditempel di atas gambar seperti pola kartu properti.
                 Alasnya krem terang, bukan emas pekat, supaya tidak bersaing
                 dengan tombol CTA emas di bawah — label ini informasi, bukan
                 ajakan menekan. Huruf kapital berjarak membuatnya terbaca
                 sebagai label, bukan potongan kalimat. -->
            <span
              class="absolute left-3 top-3 inline-flex items-center rounded-full px-3 py-1.5
                     bg-[linear-gradient(135deg,#fffdf6_0%,#f7edd6_100%)]
                     text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a6d1f]
                     ring-1 ring-[#e2d2a6]
                     shadow-[0_1px_2px_rgba(90,70,20,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]
                     backdrop-blur-sm">
              {{ t.tag }}
            </span>
          </button>

          <!-- Copy -->
          <div class="flex flex-1 flex-col p-5">
            <!-- Font judul & deskripsi sengaja ditukar: judul memakai sans (font-body)
                 karena huruf kapital butuh bentuk yang tegas dan rapat, sedangkan
                 deskripsi memakai serif (font-display) yang lebih nyaman dibaca
                 mengalir. Serif Cormorant bertubuh tipis, jadi ukurannya dinaikkan
                 ke 15px + leading longgar + abu-abu lebih gelap supaya tetap jelas
                 dibaca — kalau dibiarkan 14px seperti sebelumnya, teksnya samar. -->
            <h3 class="font-body text-base font-bold uppercase tracking-[0.08em] text-[#142b20]">{{ t.name }}</h3>
            <p class="mt-2 mb-5 font-display text-[15px] leading-relaxed text-[#5a5f55]">{{ t.subtitle }}</p>

          <!-- Button - Kuning
               Warna dasarnya tetap #c9a84c, hanya dibuat bergradasi. Dua warnanya
               sengaja diambil dari hue yang sama dengan beda lightness tipis
               (#b8974a -> #d9bc63) supaya terbaca "mewah", bukan norak.
               Kesan timbulnya datang dari inset highlight 1px di sisi atas, dan
               shadow-nya memakai warna emas yang digelapkan — bukan hitam, karena
               shadow hitam membuat warna emas terlihat kotor. -->
          <a @click.prevent="openType(t.id)" href="#"
            class="group/cta mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-black
                   bg-[linear-gradient(135deg,#b8974a_0%,#d9bc63_100%)]
                   shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_12px_-4px_rgba(150,120,40,0.55)]
                   transition-all duration-200
                   hover:-translate-y-0.5
                   hover:bg-[linear-gradient(135deg,#c9a84c_0%,#e6cd7a_100%)]
                   hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_20px_-8px_rgba(150,120,40,0.65)]
                   active:translate-y-0
                   active:shadow-[inset_0_2px_4px_rgba(120,95,30,0.35)]
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#142b20]/40 focus-visible:ring-offset-2">
            <span>{{ content.products.detailCtaLabel }}</span>
            <svg class="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/cta:translate-x-1"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
          </div>
        </article>
      </div>
      <!-- Angkanya dijatuhkan ke baris sendiri di bawah kalimat pengantar.
           Pengantarnya sengaja dikecilkan dan dibuat kapital berjarak supaya
           berperan sebagai label, sehingga angka harganyalah yang dibaca lebih
           dulu. Tetap satu <h2> agar struktur judul halaman tidak berubah. -->
      <h2 class="mb-10 text-center">
        <span class="block font-body text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-charcoal-gray">
          {{ content.products.priceHeadline }}
        </span>
        <!-- Efek metallic gold: gradient dengan pita terang di tengah meniru
             pantulan cahaya pada logam.

             text-[#8a6d1f] DITULIS DULUAN dengan sengaja sebagai warna cadangan.
             Kalau background-clip:text tidak didukung, teks jatuh ke emas pekat
             biasa; tanpa itu, text-transparent akan membuat harganya HILANG
             sama sekali. Itulah gunanya varian supports-[].

             lining-nums: Cormorant bawaannya memakai angka old-style yang tinggi
             digitnya naik-turun — cantik untuk teks mengalir, tapi angka harga
             harus terbaca sekilas. -->
        <span class="mt-2 inline-block font-display text-3xl sm:text-4xl md:text-5xl font-bold lining-nums
                     text-[#8a6d1f]
                     bg-[linear-gradient(115deg,#836619_0%,#9c7c28_38%,#b8974a_55%,#8f7124_78%,#7d611a_100%)]
                     bg-clip-text supports-[background-clip:text]:text-transparent">
          {{ content.products.priceRange }}
        </span>
        <!-- Garis emas tipis yang memudar di kedua ujung, sebagai penutup visual. -->
        <span class="mx-auto mt-4 block h-px w-24 bg-[linear-gradient(90deg,transparent,#c9a84c,transparent)]"></span>
      </h2>

    </div>

    <HouseTypeModal :type="modalOpen ? selectedType : null" @close="closeModal" />
  </section>
</template>