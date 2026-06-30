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
  // ponytail: pakai logo sebagai og:image sementara, ganti gambar 1200x630 khusus kalau preview WA/Facebook kurang bagus
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
      <HeroSection />
      <ReasonsSection />
      <InstallmentSection />
      <OneGateSection />
      <HouseTypesSection />
      <LocationSection />
      <InvestSection />
      <DemandSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
    <TheFooter />
  </div>
</template>
