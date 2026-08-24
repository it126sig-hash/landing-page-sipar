<script setup>
const { content } = useContent();
const siteUrl = useRuntimeConfig().public.siteUrl;
const title = `${content.meta.projectName} — ${content.meta.tagline}`;
const description = `${content.meta.tagline}. ${content.meta.priceFrom}.`;

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: siteUrl,
  ogImage: siteUrl + content.meta.logo,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: siteUrl + content.meta.logo,
});
useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
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