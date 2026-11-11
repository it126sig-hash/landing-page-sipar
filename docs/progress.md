# Progress — Landing Page Sanggar Indah Parahyangan

Acuan status pengerjaan. Detail task per fase ada di `docs/fase-N-*.md`. Update kolom Status saat mulai/selesai fase.

Status: `belum` · `jalan` · `selesai`

| # | Fase | Status | Dokumen |
|---|------|--------|---------|
| 1 | Setup Project (Nuxt 3, Tailwind, struktur folder) | selesai | [fase-1-setup.md](fase-1-setup.md) |
| 2 | Content & Data Layer (`content.js`, `useContent.js`) | selesai | [fase-2-konten.md](fase-2-konten.md) |
| 3 | Komponen UI (layout, primitive, section) | selesai | [fase-3-komponen.md](fase-3-komponen.md) |
| 4 | SEO, Performance & Analytics | belum | [fase-4-seo-analytics.md](fase-4-seo-analytics.md) |
| 5 | Deployment (GitHub Pages + Actions) | belum | [fase-5-deployment.md](fase-5-deployment.md) |
| 6 | QA & Acceptance | belum | [fase-6-qa.md](fase-6-qa.md) |

---

## Catatan Pembaruan Komponen (Fase 3)

| Tanggal | Komponen / Task | Status | Ringkasan Pembaruan |
| :--- | :--- | :---: | :--- |
| **2026-11-11** | `HouseTypeModal.vue` (Penyempurnaan & Bugfix Navigasi Modal Detail) | **selesai (QA PASS 100%)** | • **Visual Stage Diperbesar**: Lebar modal `max-w-[760px]`, tinggi stage desktop `340px` (`sm:h-[340px]`) & mobile `250px` (`h-[250px]`).<br>• **Alur Sekuensial Gambar Lengkap**: Navigasi panah stage dan keyboard melintasi seluruh sudut pandang secara mulus: Tampak Depan $\leftrightarrow$ Perspektif (1/2) $\leftrightarrow$ Perspektif (2/2) $\leftrightarrow$ Denah $\leftrightarrow$ Tampak Depan. Tab "Perspektif" tetap aktif selama berada di sub-gambar perspektif dan berlanjut ke tab Denah setelah gambar terakhir.<br>• **Padding Anti-Bocor Spesifikasi**: Padding horizontal `px-3 sm:px-4` dipindahkan ke masing-masing slide chunk di dalam kontainer `overflow-hidden`, mencegah icon paling tepi terpotong saat transisi slide.<br>• **Navigasi Panah Desktop Panel Spesifikasi**: Penambahan tombol panah Kiri (`<`) dan Kanan (`>`) 20px pada desktop (`hidden sm:flex`) mengapit pagination dots, dilengkapi timer auto-reset.<br>• **Zero Desktop Overflow Terverifikasi**: Akumulasi tinggi modal ~494px pada viewport 1280×720, jauh di bawah ambang batas container 94vh (676.8px) dengan `scrollHeight === clientHeight` (0px internal overflow). |

---

## Urutan kerja
Fase 1 → 2 → 3 wajib berurutan (komponen butuh data layer, data layer butuh project). Fase 4 & 5 bisa paralel setelah Fase 3 selesai. Fase 6 selalu terakhir.

## Referensi
- PRD: `docs/PRD_Landing_Sanggar_Indah_Parahyangan.md`
- Design system: `docs/design/DESIGN.md`
- Design Guide Modal Detail Unit: `docs/00-Design Guide Modal Detail Unit (Compact).md`
