<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();

/**
 * Tinggi logo bank disetel per merek, bukan disamakan begitu saja.
 *
 * Tinggi file PNG-nya tidak sebanding dengan tinggi hurufnya. Diukur dari
 * kotak piksel non-transparan tiap file:
 *   bca-white.png — puncak huruf kapital di 17,9% tinggi file, baseline 84,9%
 *                   (tinggi kapital = 67,0% tinggi file)
 *   btn-white.png — puncak huruf b/t di 13,8%, baseline 91,0%
 *                   (tinggi ascender = 77,1% tinggi file; sisanya ruang kosong
 *                   di bawah dan coretan aksen di atas huruf n)
 *
 * Dua akibatnya kalau tingginya dikira-kira: huruf "btn" jadi lebih besar
 * daripada "BCA", dan baseline-nya turun beberapa piksel sehingga terlihat
 * melorot. Rasio 18 : 21 (0,857) menyamakan tinggi kapital BCA dengan tinggi
 * ascender btn, dan pada rasio itu baseline keduanya jatuh di garis yang sama
 * (selisih < 0,2px) tanpa perlu digeser manual — jadi `items-center` di
 * pembungkusnya sudah cukup.
 *
 * Kalau salah satu file logo diganti, ukur ulang persentase di atas dulu:
 * angka di sini ikut berubah karena mengikuti isi file, bukan seleranya.
 */
const bankHeight = {
  BCA: 'h-[14px] sm:h-[16px] lg:h-[21px]',
  BTN: 'h-[12px] sm:h-[14px] lg:h-[18px]',
};
</script>

<template>
  <!--
    Pita mitra KPR — di LUAR hero, bukan di dalamnya.

    Bank di sini berperan sebagai keterangan pembiayaan, bukan bagian dari
    identitas proyek. Menaruhnya di dalam hero (dulu badge emas di kanan-atas)
    membuat logo bank bersaing dengan headline dan terbaca seperti sponsor
    utama.

    Latarnya hijau forest #142b20 — warna brand yang sama dengan tombol
    WhatsApp dan footer, bukan abu netral. Pita gelap tipis di bawah foto
    terbaca seperti keterangan pada kaki cetakan: sudah selesai, bukan bidang
    kosong yang belum diisi. Ini juga yang menjaga logo bank tetap tenang —
    di atas hijau gelap logo tampil putih satu warna, sehingga birunya tidak
    lagi menjadi warna paling kuat di layar dan tidak menyaingi logo SIG di
    header.

    Batas atasnya sengaja tidak diberi garis: hero sudah ditutup garis emas
    tipis di sisi bawahnya, dan menambah garis kedua di sini hanya
    menggandakannya jadi dua rambut sejajar.

    Tinggi desktop dikunci 56px karena HeroSection menghitung tingginya sebagai
    calc(100vh-120px) — 64px header + 56px pita — supaya hero dan pita muat pas
    satu layar. Kalau tinggi di sini diubah, angka di HeroSection harus ikut
    diperbarui.

    Proporsinya sengaja hanya membesar di lg ke atas. Di desktop pita terbentang
    selebar layar sehingga isinya jadi terlihat kecil dan hilang; di mobile
    lebarnya sudah sempit, jadi ukuran yang sama justru membuatnya penuh sesak
    dan memakan ruang layar pertama yang terbatas.
  -->
  <aside class="relative bg-[#142b20] lg:h-[56px]">
    <div
      class="mx-auto flex h-full flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2.5 sm:gap-x-5 sm:py-3 md:px-20 lg:gap-x-7 lg:py-0"
    >
      <span
        class="font-body text-[9px] font-medium uppercase tracking-[0.16em] text-white/55 sm:text-[10px] lg:text-[12px] lg:tracking-[0.18em] lg:text-white/65"
      >
        Bekerja sama dengan
      </span>

      <!-- Pemisah menandai batas antara keterangan dan logo. Disembunyikan saat
           pita membungkus ke dua baris, karena di sana ia justru mengambang. -->
      <span class="hidden h-3 w-px bg-white/20 sm:block lg:h-4" aria-hidden="true"></span>

      <!-- Jarak antar-logo sengaja lebih rapat daripada jarak pemisah→logo di
           induknya (10 vs 12, 14 vs 20, 20 vs 28). Kalau sama atau lebih lebar,
           BCA dan btn terbaca sebagai dua keterangan terpisah, bukan satu
           pasangan bank yang berdiri di belakang proyek yang sama. -->
      <span class="flex items-center gap-2.5 sm:gap-3.5 lg:gap-5">
        <!--
          Versi putih satu warna, bukan logo berwarna yang di-filter. Bank
          umumnya mengizinkan penggunaan monokrom di atas latar gelap, dan
          hasilnya lebih bersih daripada grayscale yang menyisakan abu kotor.
        -->
        <img
          v-for="bank in content.banks"
          :key="bank.name"
          :src="bank.imageWhite"
          :alt="`Bank ${bank.name}`"
          loading="lazy"
          decoding="async"
          class="w-auto object-contain opacity-85"
          :class="bankHeight[bank.name]"
        />
      </span>
    </div>
  </aside>
</template>
