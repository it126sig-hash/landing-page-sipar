// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      // ponytail: placeholder sampai domain produksi fix, override via NUXT_PUBLIC_SITE_URL
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://it126sig-hash.github.io/landing-page-sipar/',
      // Google Sheets integration via Google Apps Script Web App.
      // Set NUXT_PUBLIC_SHEET_ENDPOINT to the Apps Script deployment URL.
      // Jika kosong, ConsultationModal akan menampilkan state INTEGRATION_NOT_CONFIGURED.
      sheetEndpoint: process.env.NUXT_PUBLIC_SHEET_ENDPOINT || '',
      // CAPTCHA provider (reCAPTCHA v2 checkbox).
      // Site key reCAPTCHA memang bersifat PUBLIK (selalu ikut terkirim ke browser),
      // jadi aman dipakai sebagai default di sini. Yang WAJIB tetap rahasia adalah
      // SECRET KEY, dan itu hanya disimpan di Script Properties milik Google Apps Script.
      //
      // Default ini penting: .env tidak ikut ter-commit (lihat .gitignore), sehingga
      // tanpa fallback ini build di GitHub Actions menghasilkan site key kosong →
      // widget reCAPTCHA tidak pernah muncul di website yang sudah live.
      // Tetap bisa dioverride lewat NUXT_PUBLIC_CAPTCHA_SITE_KEY.
      captchaSiteKey: process.env.NUXT_PUBLIC_CAPTCHA_SITE_KEY || '6LcwbI8tAAAAABDNuRczH1JoiDZddEY8CJ3ELRnO',
    },
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'id', class: 'scroll-smooth' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://www.google.com' },
        { rel: 'preconnect', href: 'https://www.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap' }
      ],
      script: [
        // reCAPTCHA v2 — loaded async, render=explicit agar widget dirender manual
        { src: 'https://www.google.com/recaptcha/api.js?render=explicit', async: true, defer: true },
      ]
    }
  }
})