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
    },
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'id', class: 'scroll-smooth' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap' }
      ]
    }
  }
})