# Fase 6 — QA & Acceptance

Checklist final sebelum launch — semua 9 poin PRD §11 harus tercentang.

- [ ] 1. Semua teks/angka jualan dari `data/content.js`, nol hardcode di komponen.
- [ ] 2. Ubah satu `accessPoint` → hero chip, reason, location card berubah otomatis.
- [ ] 3. Ubah satu spec/tipe → kartu & modal tipe konsisten.
- [ ] 4. `useContent()` satu-satunya jalur komponen mengakses konten.
- [ ] 5. Semua CTA WA memakai `wa()` (nomor & template tunggal).
- [ ] 6. Build `--preset github_pages` → HTML ter-render (cek view-source, konten ada tanpa JS).
- [ ] 7. Lighthouse Perf/SEO ≥ 90; render mobile rapi (cek breakpoint DESIGN.md §8: mobile/tablet/desktop).
- [ ] 8. Tiap CTA mengirim event analytics.
- [ ] 9. Tidak ada dependensi DB/jaringan untuk render konten (kecuali analytics & form opsional).

## Tambahan
- [ ] Cross-browser: evergreen + Safari iOS.
- [ ] Aksesibilitas: kontras AA, alt text, focus state, nav keyboard modal & accordion (DESIGN.md §9 poin 8–9).
