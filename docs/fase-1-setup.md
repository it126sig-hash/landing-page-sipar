# Fase 1 — Setup Project

Ref PRD: §0.1, §6, §10. Ref design: `docs/design/DESIGN.md` §2–§3 (token warna/font).

## Task
- [x] `npx nuxi@latest init .` (Nuxt 3)
- [x] `npx nuxi module add tailwindcss` (`@nuxtjs/tailwindcss`)
- [x] Tailwind config: tambah token dari DESIGN.md §2 (warna) & §3 (font Sora + Plus Jakarta Sans, via `@nuxt/fonts` atau Google Fonts link) sebagai `theme.extend` — bukan hardcode hex di komponen.
- [x] Spacing/border-radius scale dari DESIGN.md §5 (kalau Tailwind default sudah cukup dekat, pakai default; tambah hanya yang beda, mis. radius `11px` untuk tombol primer).
- [x] Buat struktur folder sesuai PRD §10:
  ```
  data/content.js
  composables/useContent.js
  components/layout/  components/ui/  components/sections/
  pages/index.vue
  assets/  public/
  ```
- [x] Pindahkan `assets/images/hero.png` & `signgate.png` ke lokasi final (`assets/` sudah sesuai struktur, cek penamaan dipakai di `houseTypes`/`hero`).
- [x] `nuxt.config.ts` dasar: modules (`@nuxtjs/tailwindcss`), `app.head` kosong dulu (diisi Fase 4).

## Definisi selesai
`npx nuxi generate` jalan tanpa error, halaman kosong tampil dengan font & warna brand ter-load.
