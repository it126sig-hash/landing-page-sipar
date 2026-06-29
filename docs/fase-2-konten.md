# Fase 2 — Content & Data Layer

Ref PRD: §3 (seluruh bagian). Sumber skema: §3.2, sumber composable: §3.3.

## Task
- [ ] `data/content.js` — copy skema PRD §3.2 persis: `meta`, `accessPoints`, `hero`, `defaultSpecs`, `houseTypes`, `oneGate`, `installment`, `facilities`, `invest`, `demand`, `faqs`, `finalCta`, `footer`.
- [ ] Isi nilai asli kalau sudah ada (logo path, nomor WA, harga tipe lain) — kalau belum, pakai placeholder PRD apa adanya, jangan menebak.
- [ ] `composables/useContent.js` — implementasi `wa()`, `heroChips`, `reasons`, `locations`, `houseTypes` (merged specs) sesuai §3.3.
- [ ] Helper `mergeSpecs(defaultSpecs, specsOverride, type)` — override by `label`, fallback ke default.
- [ ] Tidak ada nilai jual/teks di luar `content.js` — aturan PRD §3.1 poin 2.

## Definisi selesai (acceptance §11.1, §11.2, §11.4, §11.5)
- Ubah satu `accessPoints[i].minutes` → hero chip, reason, location card ikut berubah (test manual via console/dev page).
- `useContent()` adalah satu-satunya jalur akses konten (no direct `import content` di komponen).
- `wa()` menghasilkan link `wa.me` valid dengan template terisi.
