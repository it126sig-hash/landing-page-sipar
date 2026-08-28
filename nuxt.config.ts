// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  modules: ['@nuxtjs/tailwindcss'],
  experimental: {
    // Mematikan app manifest. Fiturnya menerbitkan `builds/meta/<buildId>.json`
    // yang dipakai Nuxt untuk route rules sisi klien + deteksi rute prerender
    // saat prefetch <NuxtLink> — dua-duanya tidak dipakai situs satu halaman ini.
    //
    // Sekaligus menghilangkan error yang muncul di awal `nuxt dev`:
    //   Pre-transform error: Failed to resolve import "#app-manifest"
    //     from "node_modules/nuxt/dist/app/composables/manifest.js"
    // Penyebabnya balapan waktu start: alias `#app-manifest` menunjuk ke
    // .nuxt/manifest/meta/dev.json yang baru ditulis NITRO, sedangkan Vite sudah
    // siap menerima request SSR lebih dulu. Request yang masuk di sela itu
    // gagal me-resolve alias-nya. Sifatnya sementara — begitu Nitro selesai,
    // error berhenti sendiri dan situs tidak pernah rusak karenanya — tapi
    // dengan appManifest mati, import-nya tidak pernah ada sejak awal.
    appManifest: false,
  },
  runtimeConfig: {
    public: {
      // Domain produksi. Ditulis TANPA trailing slash supaya penggabungan
      // `siteUrl + path` (og:image, twitter:image di pages/index.vue) tidak
      // menghasilkan '//' — path aset sendiri sudah selalu diawali '/'.
      // Tetap bisa dioverride lewat NUXT_PUBLIC_SITE_URL.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://sanggarindahparahyangan.com',
      // Google Sheets integration via Google Apps Script Web App.
      //
      // URL /exec ini TIDAK rahasia: dipanggil langsung dari browser lewat fetch(),
      // jadi selalu ikut ter-bundle ke JS yang bisa dibaca siapa pun yang membuka
      // DevTools di situs live. Pengaman sesungguhnya ada di sisi Apps Script, yang
      // memverifikasi token reCAPTCHA memakai SECRET KEY di Script Properties.
      //
      // Default ini wajib ada dengan alasan yang sama seperti captchaSiteKey di bawah:
      // .env tidak ikut ter-commit, dan kalau GitHub repo secret
      // NUXT_PUBLIC_SHEET_ENDPOINT belum di-set, build GitHub Actions menghasilkan
      // string kosong sehingga form live selalu berhenti di state notConfigured
      // ("Belum Bisa Kirim Online") walaupun captcha-nya sudah lolos.
      // Tetap bisa dioverride lewat NUXT_PUBLIC_SHEET_ENDPOINT.
      sheetEndpoint: process.env.NUXT_PUBLIC_SHEET_ENDPOINT
        || 'https://script.google.com/macros/s/AKfycbytID6Jm-dzZ78VUioDSMtuaE4dlD7J1eqGGIW7i_Bp88Sbf55cZzYFnOwt3Z25DpH7kw/exec',
      // Verifikator kode referral Member Get Member (milik SIG App).
      // Dipanggil langsung dari browser (POST, parameter `kode`), jadi URL-nya
      // memang publik — sama sekali bukan rahasia. Endpoint-nya sendiri hanya
      // membalas data pemilik kode, tidak menerima perubahan apa pun.
      //
      // Default ini wajib ada dengan alasan yang sama seperti sheetEndpoint di
      // atas: .env tidak ikut ter-commit, sehingga tanpa fallback ini build di
      // GitHub Actions menghasilkan string kosong dan tombol "Cek" selalu gagal.
      // Tetap bisa dioverride lewat NUXT_PUBLIC_REFERRAL_CHECK_ENDPOINT.
      referralCheckEndpoint: process.env.NUXT_PUBLIC_REFERRAL_CHECK_ENDPOINT
        || 'https://sigapp.site/api/public/check-referral',
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