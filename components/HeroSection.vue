<script setup>
import { useContent } from '~/composables/useContent';

const { content, withBase } = useContent();

const heroDesktop = content.hero.image || withBase('/assets/images/hero.webp');
const heroMobile = content.hero.imageMobile || content.hero.heroMobile || withBase('/assets/images/hero-mobile.webp');
</script>

<template>
  <!--
    Tinggi desktop dikurangi tinggi header (64px) DAN tinggi pita KPR (47px),
    supaya hero beserta pita mitranya muat pas dalam satu layar. Tanpa itu pita
    jatuh persis di bawah lipatan dan tidak pernah terlihat tanpa men-scroll —
    padahal justru itu tujuannya dipindah keluar dari hero.
  -->
  <section class="relative isolate flex flex-col h-full min-h-[300px] lg:h-[calc(100vh-111px)] lg:min-h-[553px] overflow-hidden bg-[#12271b]">
    <!--
      ============================================================
      BACKGROUND HERO — "SUNLIT GARDEN"
      ============================================================
      Fotonya render siang cerah: tanaman tropis hijau, signage tosca,
      langit biru. Yang dulu membuatnya terasa terpisah dari website
      adalah grade sepia + tumpukan overlay gelap — hasilnya coklat
      keruh, padahal sisa halaman ini putih bersih + emas #c9a84c +
      hijau forest #142B20.

      Sekarang fotonya dibiarkan tetap segar (tanpa sepia), lalu diikat
      ke palet brand lewat: cahaya hangat dari kanan-atas dan bayangan
      yang jatuh ke hijau forest (bukan hitam). Hero ditutup garis emas
      lurus — sengaja TIDAK menyambung/melengkung ke section berikutnya.

      Urutan layer dari bawah ke atas:
      1. Foto (grade segar + pan lambat)
      2. Sunlight — pendar hangat dari kanan atas
      3. Brand tint — mengikat foto ke emas & hijau forest
      4. Dasar hijau forest (scrim CTA & deskripsi)
      5. Scrim arah teks (kiri di desktop, atas di mobile)
      6. Signage: halo cahaya + huruf ber-sheen emas
      7. Bokeh emas — aksen playful, mengambang pelan
      8. Vignette & grain halus
      9. Garis emas lurus sebagai penutup
    -->

    <!--
      1. Foto. Pan lambat dipasang di wrapper (bukan di tiap layer) supaya foto,
      halo lampu, dan mask huruf tidak pernah bisa saling meleset.
    -->
    <div class="absolute inset-0 hero-pan" aria-hidden="true">
      <!-- Desktop — digeser sedikit ke kiri supaya signage menjauh dari headline -->
      <div class="hidden md:block absolute inset-0 bg-cover hero-photo hero-pos-desktop"
        :style="{ backgroundImage: `url(${heroDesktop})` }"></div>

      <!-- Mobile (fokus dikunci ke pita signage, bukan ke hamparan paving) -->
      <div class="block md:hidden absolute inset-0 bg-cover hero-photo hero-pos-mobile"
        :style="{ backgroundImage: `url(${heroMobile})` }"></div>
    </div>

    <!-- 2. Sunlight: matahari sore dari kanan atas, bukan filter sepia -->
    <div class="absolute inset-0 hero-sun" aria-hidden="true"></div>

    <!-- 3. Brand tint — emas di kiri atas, hijau forest di kanan bawah -->
    <div class="absolute inset-0 hero-tint" aria-hidden="true"></div>

    <!-- 4. Dasar hijau forest (keterbacaan CTA & deskripsi) -->
    <div class="absolute inset-0 hero-ground" aria-hidden="true"></div>

    <!-- 5. Scrim teks: dari kiri (desktop) / dari atas (mobile) -->
    <div class="hidden md:block absolute inset-0 hero-scrim-left" aria-hidden="true"></div>
    <div class="block md:hidden absolute inset-0 hero-scrim-top" aria-hidden="true"></div>

    <!--
      6. SIGNAGE
      Mask huruf (signage-letters*.webp) diekstrak dari foto aslinya, jadi hanya
      pixel huruf "SANGGAR INDAH PARAHYANGAN" yang tersorot. Ukuran & posisi mask
      disamakan dengan fotonya (cover + posisi sama) supaya presisi di semua layar.
    -->
    <div class="absolute inset-0 hero-pan hero-signage" aria-hidden="true">
      <!-- Halo cahaya — Desktop -->
      <div class="hidden md:block absolute inset-0 bg-cover hero-lamp-glow hero-pos-desktop"
        :style="{ backgroundImage: `url(${withBase('/assets/images/signage-glow.webp')})` }"></div>

      <!-- Halo cahaya — Mobile -->
      <div class="block md:hidden absolute inset-0 bg-cover hero-lamp-glow hero-pos-mobile"
        :style="{ backgroundImage: `url(${withBase('/assets/images/signage-glow-mobile.webp')})` }"></div>

      <!-- Sheen emas pada huruf — Desktop -->
      <div class="hidden md:block absolute inset-0 bg-cover hero-letters-lit hero-pos-desktop"
        :style="{
          backgroundImage: `url(${heroDesktop})`,
          '--letters-mask': `url(${withBase('/assets/images/signage-letters.webp')})`,
        }"></div>

      <!-- Sheen emas pada huruf — Mobile -->
      <div class="block md:hidden absolute inset-0 bg-cover hero-letters-lit hero-pos-mobile"
        :style="{
          backgroundImage: `url(${heroMobile})`,
          '--letters-mask': `url(${withBase('/assets/images/signage-letters-mobile.webp')})`,
        }"></div>
    </div>

    <!--
      7. Bokeh emas — cahaya matahari yang menembus dedaunan.
      Sengaja hanya di sisi kanan/atas supaya tidak pernah menabrak
      headline (kiri di desktop, kiri-atas di mobile).
    -->
    <div class="absolute inset-0 hero-bokeh" aria-hidden="true">
      <span class="hero-orb hero-orb-1"></span>
      <span class="hero-orb hero-orb-2"></span>
      <span class="hero-orb hero-orb-3"></span>
      <span class="hidden md:block hero-orb hero-orb-4"></span>
    </div>

    <!-- 8. Vignette + grain -->
    <div class="absolute inset-0 hero-vignette" aria-hidden="true"></div>
    <div class="absolute inset-0 hero-grain" aria-hidden="true"></div>

    <!-- Garis emas tipis: penutup lurus hero, sama di mobile & desktop -->
    <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/70 to-transparent"
      aria-hidden="true"></div>

    <!-- Content Container -->
    <div class="relative flex-1 flex flex-col justify-between px-4 md:px-20 py-6 sm:py-10 lg:py-20">
      <!-- Top Content: Title & Tagline -->
      <div class="sm:max-w-[600px] lg:max-w-[80%]">
        <!--
          Logo bank sudah tidak di sini. Dulu ia berbagi baris dengan headline
          di mobile (memotong headline jadi dua baris) dan melayang di kanan-atas
          di desktop dengan latar emas yang sama dengan headline — dua blok emas
          bersaing. Sekarang bank turun ke KprPartnerStrip, pita tipis tepat di
          bawah hero, sebagai keterangan penyedia KPR.
        -->
        <!-- Headline - Kuning — focal point utama -->
        <h1 class="font-display font-bold text-2xl min-[360px]:text-[1.7rem] min-[390px]:text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-[1.15] text-[#c9a84c] hero-headline-shadow">
          {{ content.hero.headlineLines[0] }}
        </h1>

        <!-- Tagline - Putih, ALL CAPS -->
        <p class="mt-1.5 sm:mt-3 font-body text-[11px] min-[360px]:text-xs sm:text-sm md:text-base tracking-wider uppercase text-white/95 font-medium hero-text-shadow">
          {{ content.hero.tagline }}
        </p>
      </div>

      <!-- Bottom Content: Button & Description -->
      <div class="max-w-[600px]">
        <!-- CTA Button - Kuning -->
        <div class="mb-4 sm:mb-6">
          <a href="#tipe"
            class="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-[#c9a84c] bg-grad-gold text-black font-semibold text-sm sm:text-base rounded-lg shadow-btn-gold hover:-translate-y-0.5 hover:bg-grad-gold-hover hover:shadow-btn-gold-lg active:translate-y-0 transition-all duration-200">
            {{ content.hero.primaryCta || 'Lihat Tipe Rumah' }}
          </a>
        </div>

        <!-- Description - Putih -->
        <p class="max-w-[500px] font-body text-xs sm:text-sm md:text-base leading-relaxed text-white hero-text-shadow">
          {{ content.hero.sub }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
  Titik fokus foto. Dipakai bersama oleh foto, halo lampu, dan mask huruf
  supaya ketiganya selalu presisi menumpuk di posisi yang sama.

  Desktop pakai X 42% (bukan center): kalau viewport lebih "tinggi" dari
  rasio fotonya, cover memotong sisi kiri-kanan. Menggeser ke 42% berarti
  yang ditampilkan lebih banyak rimbun pohon di kiri, sehingga signage
  bergeser ke kanan — menjauh dari headline.
*/
.hero-pos-desktop {
  background-position: 42% 48%;
  --letters-pos: 42% 48%;
}

/* Di mobile hero-nya pendek: fokus dikunci ke pita signage, bukan paving kosong. */
.hero-pos-mobile {
  background-position: center 44%;
  --letters-pos: center 44%;
}

/*
  Pan lambat. scale 1.06 jadi baseline agar pergerakannya tidak pernah
  menyingkap tepi. Dipakai dua kali (grup foto & grup signage) dengan
  keyframes yang sama, jadi keduanya selalu bergerak seirama.
*/
.hero-pan {
  transform: scale(1.06);
  animation: heroPan 30s ease-in-out infinite alternate;
  will-change: transform;
}

/*
  Grup signage di-screen sebagai satu kesatuan (bukan per layer), supaya
  area gelap di sekitar halo hilang dan hanya cahayanya yang memancar.
*/
.hero-signage {
  mix-blend-mode: screen;
  pointer-events: none;
}

/*
  Foto: TANPA sepia. Sepia-lah yang dulu membuat tanaman jadi coklat dan
  hero terasa lepas dari sisa website. Sekarang hijaunya justru dinaikkan
  sedikit; terang diturunkan seperlunya agar teks putih & emas tetap terbaca.
*/
.hero-photo {
  filter: brightness(0.82) contrast(1.06) saturate(1.14);
}

@keyframes heroPan {
  from {
    transform: scale(1.06) translate3d(0, 0, 0);
  }

  to {
    transform: scale(1.11) translate3d(-1.2%, -1%, 0);
  }
}

/*
  Sunlight: satu sumber cahaya hangat dari kanan atas + sapuan tipis di
  langit. Screen blend, jadi ia hanya menambah cahaya — tidak mengaburkan
  warna aslinya seperti sepia.
*/
.hero-sun {
  background:
    radial-gradient(58% 52% at 82% 6%,
      rgba(255, 214, 148, 0.42) 0%,
      rgba(255, 196, 118, 0.16) 45%,
      rgba(255, 196, 118, 0) 72%),
    linear-gradient(to bottom,
      rgba(255, 226, 176, 0.20) 0%,
      rgba(255, 210, 150, 0.06) 26%,
      rgba(255, 210, 150, 0) 50%);
  mix-blend-mode: screen;
  pointer-events: none;
}

/*
  Brand tint — pengikat warna. Emas #c9a84c di kiri-atas, hijau forest
  #142B20 di kanan-bawah. Soft-light, jadi ia menggeser hue tanpa
  menutup detail foto.
*/
.hero-tint {
  background: linear-gradient(122deg,
      rgba(201, 168, 76, 0.42) 0%,
      rgba(201, 168, 76, 0.10) 38%,
      rgba(20, 43, 32, 0.52) 100%);
  mix-blend-mode: soft-light;
  pointer-events: none;
}

/*
  Paving & tanaman bawah ditarik ke hijau forest (bukan hitam), sekaligus
  scrim untuk CTA.
*/
.hero-ground {
  background: linear-gradient(to top,
      rgba(18, 39, 27, 0.86) 0%,
      rgba(20, 43, 32, 0.44) 24%,
      rgba(20, 43, 32, 0) 54%);
  pointer-events: none;
}

/* Desktop: teks di kiri, jadi scrim datang dari kiri dan foto sisi kanan tetap hidup */
.hero-scrim-left {
  background: linear-gradient(to right,
      rgba(15, 33, 23, 0.78) 0%,
      rgba(15, 33, 23, 0.30) 42%,
      rgba(15, 33, 23, 0) 68%);
  pointer-events: none;
}

/*
  Mobile: hero pendek, teks menumpuk atas-bawah. Scrim atas dibuat lebih
  ringan dan cepat memudar (habis di 52%), jadi pita tengah — signage &
  tanaman — tetap cerah alih-alih ikut kelabu.
*/
.hero-scrim-top {
  background: linear-gradient(to bottom,
      rgba(15, 33, 23, 0.72) 0%,
      rgba(15, 33, 23, 0.24) 30%,
      rgba(15, 33, 23, 0) 52%);
  pointer-events: none;
}

/* Pendaran lampu di sekitar huruf — diturunkan karena fotonya kini lebih cerah */
.hero-lamp-glow {
  opacity: 0.4;
}

/*
  Huruf signage diberi sheen emas lembut (bukan "dinyalakan" penuh seperti
  suasana malam) — cukup untuk membuatnya lepas dari latar dan senada
  dengan headline emas.
*/
.hero-letters-lit {
  filter: brightness(1.35) contrast(1.02) sepia(0.42) saturate(1.5);
  opacity: 0.52;

  -webkit-mask-image: var(--letters-mask);
  mask-image: var(--letters-mask);
  -webkit-mask-size: cover;
  mask-size: cover;
  -webkit-mask-position: var(--letters-pos);
  mask-position: var(--letters-pos);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

/*
  Bokeh: cahaya matahari yang lolos di sela dedaunan. Screen blend + blur,
  jadi terbaca sebagai cahaya, bukan lingkaran tempelan.
*/
.hero-bokeh {
  mix-blend-mode: screen;
  pointer-events: none;
  overflow: hidden;
}

.hero-orb {
  position: absolute;
  border-radius: 9999px;
  background: radial-gradient(circle,
      rgba(255, 226, 160, 0.85) 0%,
      rgba(201, 168, 76, 0.45) 45%,
      rgba(201, 168, 76, 0) 70%);
  filter: blur(1px);
  will-change: transform;
  animation: heroFloat 11s ease-in-out infinite alternate;
}

.hero-orb-1 {
  width: 90px;
  height: 90px;
  top: 12%;
  right: 8%;
  opacity: 0.5;
  animation-duration: 13s;
}

.hero-orb-2 {
  width: 46px;
  height: 46px;
  top: 34%;
  right: 24%;
  opacity: 0.4;
  animation-duration: 9s;
  animation-delay: -3s;
}

.hero-orb-3 {
  width: 22px;
  height: 22px;
  top: 22%;
  right: 38%;
  opacity: 0.55;
  animation-duration: 7s;
  animation-delay: -5s;
}

.hero-orb-4 {
  width: 130px;
  height: 130px;
  top: 48%;
  right: 3%;
  opacity: 0.26;
  animation-duration: 16s;
  animation-delay: -8s;
}

@keyframes heroFloat {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(-14px, -22px, 0) scale(1.12);
  }
}

/* Vignette: menggelapkan tepi saja, tengah foto tetap hidup */
.hero-vignette {
  background: radial-gradient(120% 90% at 58% 44%,
      rgba(10, 26, 18, 0) 36%,
      rgba(10, 26, 18, 0.24) 74%,
      rgba(10, 26, 18, 0.54) 100%);
  pointer-events: none;
}

/* Grain halus — menghilangkan banding pada gradien & memberi kesan filmis */
.hero-grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.045;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* Teks tetap kontras di atas foto yang kini lebih terang */
.hero-headline-shadow {
  text-shadow: 0 2px 20px rgba(6, 18, 13, 0.75), 0 1px 3px rgba(6, 18, 13, 0.65);
}

.hero-text-shadow {
  text-shadow: 0 1px 12px rgba(6, 18, 13, 0.7), 0 1px 2px rgba(6, 18, 13, 0.55);
}

@media (prefers-reduced-motion: reduce) {

  .hero-pan,
  .hero-orb {
    animation: none;
  }
}
</style>
