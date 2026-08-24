<template>
  <div>
    <LoadingScreen />
    <NuxtPage />
    <WhatsAppFloatingButton />
    <Lightbox />
  </div>
</template>

<style>
/* Memastikan popup kotak tantangan gambar reCAPTCHA selalu muncul di paling depan layar */
iframe[title*="recaptcha challenge"],
div[style*="z-index: 2000000000"],
div[style*="z-index: 2147483647"] {
  z-index: 2147483647 !important;
}
</style>
