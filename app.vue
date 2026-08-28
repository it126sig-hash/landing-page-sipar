<template>
  <div>
    <LoadingScreen />
    <NuxtPage />
    <WhatsAppFloatingButton />
    <Lightbox />
  </div>
</template>

<style>
/*
  Font dasar brand.

  Tailwind sudah mendefinisikan fontFamily.body, tapi tidak ada satu pun aturan
  yang menerapkannya ke <body>. Akibatnya elemen tanpa kelas font-body eksplisit
  (judul kartu di "Kenapa SIPAR", sebagian microcopy) jatuh ke ui-sans-serif
  bawaan Tailwind — bukan Be Vietnam Pro.

  Diset sekali di sini supaya font brand jadi bawaan, bukan sesuatu yang harus
  diulang di setiap elemen. Kelas font-display/font-body yang sudah ada tetap
  menang karena selektor kelas lebih spesifik daripada selektor elemen.
*/
body {
  font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Memastikan popup kotak tantangan gambar reCAPTCHA selalu muncul di paling depan layar */
iframe[title*="recaptcha challenge"],
div[style*="z-index: 2000000000"],
div[style*="z-index: 2147483647"] {
  z-index: 2147483647 !important;
}
</style>
