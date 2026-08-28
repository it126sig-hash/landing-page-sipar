<template>
  <section id="lokasi" class="scroll-mt-20 relative bg-gradient-to-b from-white via-[#fffef5] to-white py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-20">
      <!-- Part 1: Kenapa Harus — image header tetap dipertahankan -->
      <div class="flex justify-center mb-4">
        <img :src="withBase(content.reasons.headingImage)" :alt="content.reasons.headingAlt"
          class="h-auto w-[80%] sm:w-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl object-contain" />
      </div>

      <!-- Subheading humanis — copy baru, tidak mengubah visual card -->
      <div class="text-center mb-10 max-w-xl mx-auto">
        <p class="font-body text-sm text-gray-500 leading-relaxed">
          {{ content.reasons.subheading }}
        </p>
      </div>

      <!-- Cards & Mascot Section -->
      <div class="mb-16">
        <!-- 4 Advantage Cards + Desktop Mascot Card (5-col on desktop, 2x2 on mobile) -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <div v-for="(advantage) in content.advantages" :key="advantage.id"
            class="group cursor-pointer bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out p-4 md:p-6 flex flex-col items-center justify-between h-full border border-gray-50 overflow-hidden relative">

            <!-- imageFit dari content.js: 'contain' untuk logo/ikon, 'cover' untuk foto suasana.
                 imageWide melebarkan slot untuk kartu Fasilitas yang gambarnya kolase
                 banyak logo — pada slot ikon biasa logo-logonya jadi tidak terbaca. -->
            <div class="mb-3 flex items-center justify-center overflow-hidden rounded-xl"
              :class="advantage.imageWide ? 'w-full h-24 md:h-28 px-1' : 'w-20 h-20 md:w-28 md:h-28'">
              <img v-if="advantage.image" :src="advantage.image" :alt="advantage.title"
                class="w-full h-full transition-transform duration-300 group-hover:scale-110"
                :class="advantage.imageFit === 'cover' ? 'object-cover' : 'object-contain'" />
            </div>

            <div class="flex-grow flex flex-col items-center justify-center mb-2 text-center">
              <!-- Headline: Be Vietnam Pro (font-body) dengan gradasi hijau.
                   text-[#2A6D3A] ditulis DULUAN sebagai warna cadangan — kalau
                   background-clip:text tidak didukung, judulnya jatuh ke hijau
                   biasa; tanpa itu text-transparent membuat judul HILANG.
                   inline-block wajib: gradient dilukis pada kotak elemen, bukan
                   pada hurufnya, jadi kotaknya harus menyusut selebar teks.
                   Kedua ujung gradasi berjarak sama dari #2A6D3A sehingga
                   rata-rata warnanya kembali ke hijau semula — identitasnya
                   tidak bergeser, yang bertambah hanya dimensinya. -->
              <h3 class="headline-grad font-body font-bold text-sm md:text-base text-center leading-snug">
                {{ advantage.title }}
              </h3>
              <!-- Deskripsi memakai font bawaan (Be Vietnam Pro) seperti semula.
                   Hanya headline yang diberi gradasi & Be Vietnam Pro eksplisit. -->
              <p v-if="advantage.microcopy" class="mt-1 text-xs text-gray-500 leading-snug text-center">
                {{ advantage.microcopy }}
              </p>
            </div>

            <!-- Bottom Dash -->
            <div class="w-6 h-1 bg-[#F59E0B] rounded-full mt-auto transition-all duration-300 group-hover:w-10"></div>
          </div>

          <!-- DESKTOP ONLY: Mascot card inside white card block -->
          <div class="hidden lg:flex bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out p-4 md:p-6 flex-col items-center justify-between h-full border border-gray-50 overflow-hidden relative">
            <div class="w-20 h-20 md:w-28 md:h-28 mb-3 flex items-center justify-center">
              <img :src="withBase(content.mascot.image)" :alt="content.mascot.alt"
                class="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <div class="flex-grow flex flex-col items-center justify-center mb-2 text-center">
              <h3 class="headline-grad font-body font-bold text-sm md:text-base text-center leading-snug">
                {{ content.mascot.title }}
              </h3>
              <p class="mt-1 text-xs text-gray-500 leading-snug text-center">
                {{ content.mascot.text }}
              </p>
            </div>
            <div class="w-6 h-1 bg-[#F59E0B] rounded-full mt-auto"></div>
          </div>
        </div>

        <!-- MOBILE ONLY: Mascot on the left, wording on the right (NO white card block) -->
        <div class="flex lg:hidden items-center justify-center gap-4 sm:gap-6 mt-8 px-2">
          <img :src="withBase(content.mascot.image)" :alt="content.mascot.alt"
            class="w-28 min-[375px]:w-32 sm:w-36 h-auto flex-shrink-0 drop-shadow-xl" />
          <div class="max-w-[15rem] text-left">
            <h3 class="headline-grad font-body font-bold text-base sm:text-lg leading-snug">
              {{ content.mascot.title }}
            </h3>
            <p class="mt-1.5 font-body text-xs sm:text-sm text-gray-600 leading-relaxed">
              {{ content.mascot.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Part 2: Peta Lokasi -->
      <div class="relative mb-12">
        <div class="w-full bg-gray-100 rounded-lg overflow-hidden relative group">
          <!-- Peta Image -->
          <img :src="content.locationSection?.mapImage" :alt="content.reasons.mapAlt"
            class="w-full h-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            @click="isLightboxOpen = true" />

          <!-- Hover Overlay Hint -->
          <div
            class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span
              class="bg-black/70 text-white text-xs md:text-sm px-4 py-2 rounded-full font-medium flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              {{ content.reasons.mapZoomHint }}
            </span>
          </div>

          <!-- CTA: tepat di atas panel QR peta, rata kanan dengannya.
               Posisi pakai persen supaya ikut menyesuaikan di semua lebar layar.
               Panel QR pada gambar ada di x 72,1%-95,1% dan y 85%-96,2%. -->
          <div class="absolute bottom-[17%] right-[4.95%] z-10">
            <!-- Di mobile tombolnya sengaja dibuat ramping supaya tidak menenggelamkan
                 panel QR di sebelahnya (panel itu hanya ±79x26px pada layar 390px;
                 tombol setinggi 44px membuatnya tampak jauh lebih besar dari peta).
                 Ambang sentuh 44px TIDAK dikorbankan: ia dipindahkan ke ::after —
                 area tak terlihat yang melebarkan bidang sentuh ke luar kotak tombol.
                 Jadi yang mengecil hanya tampilannya, bukan sasaran jarinya. -->
            <a :href="content.locationSection?.mapUrl" target="_blank" rel="noopener noreferrer"
              class="map-cta relative inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-5 md:py-2.5 bg-[#c9a84c] bg-grad-gold text-black font-semibold text-[9px] sm:text-xs md:text-sm whitespace-nowrap rounded md:rounded-lg hover:-translate-y-0.5 hover:bg-grad-gold-hover hover:shadow-btn-gold-lg active:translate-y-0 transition-all duration-200 shadow-btn-gold">
              {{ content.reasons.mapCtaLabel }}
            </a>
          </div>

        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isLightboxOpen"
          class="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-sm"
          @click="isLightboxOpen = false">
          <div class="relative max-w-5xl max-h-[90vh] flex flex-col items-center" @click.stop>
            <button type="button"
              class="absolute -top-10 right-0 md:-right-10 text-white hover:text-gray-300 p-2 text-2xl font-bold focus:outline-none"
              @click="isLightboxOpen = false" :aria-label="content.reasons.mapCloseLabel">
              ✕
            </button>
            <img :src="content.locationSection?.mapImage" :alt="content.reasons.mapAlt"
              class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const { content, withBase } = useContent();
const isLightboxOpen = ref(false);
</script>

<style scoped>
/* Gradasi headline kartu — dipakai 4 kartu keunggulan + kartu maskot
   (desktop & mobile). Ditaruh di satu tempat, bukan diulang sebagai string
   utility panjang di tiap h3, supaya sekali ubah berlaku untuk semuanya.

   color: dipasang DULUAN sebagai warna cadangan. Kalau background-clip:text
   tidak didukung, judulnya jatuh ke hijau biasa; tanpa itu teksnya HILANG.
   Karena itu -webkit-text-fill-color: transparent hanya dinyalakan di dalam
   @supports.

   inline-block wajib: gradient dilukis pada kotak elemen, bukan pada hurufnya.
   Sebagai block selebar kartu, judul pendek cuma kebagian ujung gelap gradient
   dan kilaunya terbuang; menyusut selebar teks membuatnya terpetakan pas.

   Kedua ujung gradasi berjarak sama dari #2A6D3A sehingga rata-rata warnanya
   kembali ke hijau semula — identitas warnanya tidak bergeser, yang bertambah
   hanya dimensinya. Aturan yang sama dipakai resep tombol di tailwind.config.js. */
.headline-grad {
  display: inline-block;
  color: #2A6D3A;
  background-image: linear-gradient(115deg, #1d4d29 0%, #2A6D3A 45%, #3d8b4d 70%, #245a31 100%);
}

/* Bidang sentuh tombol peta.
   Tombolnya sendiri dibiarkan kecil agar proporsional dengan panel QR pada
   gambar peta, tapi jari butuh sasaran ±44px. ::after memberi area sentuh
   tak terlihat yang meluber ke luar kotak tombol tanpa mengubah ukuran
   visual maupun posisinya. Hanya perlu di layar kecil; mulai sm: tombolnya
   sudah cukup besar dengan sendirinya. */
.map-cta::after {
  content: '';
  position: absolute;
  inset: 50% 0 0 50%;
  width: 100%;
  min-width: 44px;
  height: 44px;
  transform: translate(-50%, -50%);
}

@media (min-width: 640px) {
  .map-cta::after {
    display: none;
  }
}

@supports (background-clip: text) or (-webkit-background-clip: text) {
  .headline-grad {
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
