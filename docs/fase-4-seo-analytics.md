# Fase 4 — SEO, Performance & Analytics

Ref PRD: §7 (analytics), §8 (NFR performance/SEO/a11y).

## SEO
- [ ] Title/description per halaman via `useSeoMeta`/`useHead`.
- [ ] OpenGraph tags (og-image dari `public/`).
- [ ] JSON-LD `RealEstateListing`/`Product` (data dari `houseTypes`).
- [ ] `sitemap.xml`, `robots.txt` di `public/`.
- [ ] Cek view-source build statis: konten ada tanpa JS (acceptance §11.6).

## Performance
- [ ] Hero image (`assets/images/hero.png`) → WebP/AVIF, `loading="eager"` (LCP element).
- [ ] Gambar lain → lazy-load + responsive `srcset` (`@nuxt/image` kalau dipasang, atau native `<img loading="lazy">` — cukupi dulu pakai native sebelum tambah dependency).
- [ ] Target Lighthouse Perf/SEO ≥ 90, LCP < 2.5s 4G (acceptance §11.7).

## Analytics & Lead Capture
- [ ] Pasang GTM/Meta Pixel/GA4 di `app.vue` head atau `nuxt.config` (modul resmi kalau tersedia).
- [ ] Event tracking 4 titik: `wa_click` (param `source`), `type_detail_open`, `faq_open`, `cta_final_click`.
- [ ] Lead form opsional (nama + no HP + tipe diminati) → submit ke Google Sheets/Formspree/email, tanpa DB.

## Definisi selesai (acceptance §11.8, §11.9)
Tiap CTA mengirim event analytics; tidak ada dependensi DB/jaringan untuk render konten (kecuali analytics & form opsional).
