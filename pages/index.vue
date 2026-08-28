<script setup>
const { content, withBase } = useContent();

// Origin dinormalkan tanpa trailing slash, lalu URL absolut dirakit dari path
// yang selalu diawali '/'. Sebelumnya `siteUrl + content.meta.logo` menempelkan
// dua string yang sama-sama membawa slash, jadi og:image/twitter:image keluar
// dengan '//' di tengah — dan waktu masih di sub-folder github.io base path-nya
// bahkan ikut dobel. Dinormalkan di sini supaya benar di root maupun sub-folder.
const origin = useRuntimeConfig().public.siteUrl.replace(/\/+$/, '');
const absoluteUrl = (path) => origin + path;
const pageUrl = absoluteUrl(withBase('/'));
const ogImage = absoluteUrl(content.meta.logo);

const title = `${content.meta.projectName} — ${content.meta.tagline}`;
const description = `${content.meta.tagline}. ${content.meta.priceFrom}.`;

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: pageUrl,
  ogImage,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage,
});
useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
});
</script>

<template>
  <div>
    <TheHeader />
    <main>
      <!-- Hero + About Section Container: 1 screen on mobile/tablet (< lg), standard full hero on desktop (lg:) -->
      <!-- min-h (bukan h) + tanpa overflow-hidden: layar pendek (mis. 320x568) tetap bisa menampilkan
           seluruh konten hero/about alih-alih memotongnya. Layar tinggi tetap pas 1 layar. -->
      <div class="min-h-[calc(100vh-64px)] flex flex-col justify-between lg:min-h-0 lg:block">
        <HeroSection class="flex-1 lg:flex-none" />
        <!-- Keterangan penyedia KPR. Ditempatkan di luar hero supaya logo bank
             terbaca sebagai keterangan pembiayaan, bukan pemilik proyek. -->
        <KprPartnerStrip class="flex-shrink-0" />
        <AboutSection class="flex-shrink-0 lg:flex-none" />
      </div>
      <ProductsSection />
      <ReasonsCardsSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
    <TheFooter />
  </div>
</template>