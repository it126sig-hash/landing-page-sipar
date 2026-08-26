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
                 Alasnya putih agar tetap terbaca di atas foto apa pun; yang dibuat
                 emas adalah TULISANNYA, sesuai permintaan. Sengaja tidak memakai
                 alas emas pekat supaya tidak bersaing dengan tombol CTA di bawah. -->
            <span
              class="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1
                     text-xs font-bold tracking-wide text-[#8a6d1f] shadow-sm ring-1 ring-[#e0d3ae] backdrop-blur-sm">
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
      <div class="text-center">
        <h2 class="font-display font-semibold text-3xl md:text-4xl text-center text-[#142b20] mb-10">
          {{ content.products.priceHeadline }}
        </h2>
      </div>

    </div>

    <HouseTypeModal :type="modalOpen ? selectedType : null" @close="closeModal" />
  </section>
</template>