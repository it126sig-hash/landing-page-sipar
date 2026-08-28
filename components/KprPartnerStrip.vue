<script setup>
import { useContent } from '~/composables/useContent';

const { content } = useContent();

/**
 * Tinggi optis logo bank tidak sama dengan tinggi kotaknya.
 *
 * Wordmark BCA punya huruf kapital semua dengan tinggi penuh, sedangkan "btn"
 * huruf kecil dengan aksen yang menjulur ke atas. Diberi tinggi CSS yang sama,
 * BCA terlihat lebih besar. Selisih ~3px ini membuat keduanya terbaca setara —
 * disetel dengan mata, bukan dengan angka yang rapi.
 */
const bankHeight = {
  BCA: 'h-[14px] sm:h-[16px] lg:h-[21px]',
  BTN: 'h-[16px] sm:h-[19px] lg:h-[25px]',
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

      <span class="flex items-center gap-4 sm:gap-6 lg:gap-8">
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
