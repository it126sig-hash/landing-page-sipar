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
      <div class="h-[calc(100vh-64px)] min-h-[580px] flex flex-col justify-between overflow-hidden lg:h-auto lg:min-h-0 lg:block lg:overflow-visible">
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