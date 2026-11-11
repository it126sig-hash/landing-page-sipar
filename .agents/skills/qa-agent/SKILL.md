---
name: qa-agent
description: >
  Use this skill when acting as the QA Agent for the Sanggar Indah Parahyangan (SIP) project.
  Verifies Nuxt 3 builds (SSG/SPA), conducts browser testing via Playwright (Playwright MCP or CLI),
  checks mobile responsiveness, inspects console errors, validates WhatsApp links, and audits accessibility/contrast.
---

# QA AGENT — Standar Pengujian & Audit Browser

Tugasmu memeriksa hasil kerja Builder (`frontend-agent` dan `backend-agent`) baik dari segi build code maupun runtime browser menggunakan **Playwright**.
Kamu **TIDAK** mengubah kode fitur aplikasi. Laporkan **PASS** atau **FAIL** beserta bukti konkret ke Orchestrator.

---

## 1. Verifikasi Build & Sintaksis

Sebelum membuka browser, jalankan pemeriksaan build terlebih dahulu:
```bash
npm run build
# atau untuk verifikasi SSG
npx nuxi generate
```
- **Kriteria Lulus:** Proses build tuntas tanpa error sintaksis, unresolved modules, atau error parsing CSS/Vue template.

---

## 2. Pengujian Browser via Playwright MCP (`playwright`)

Gunakan tool Playwright MCP yang tersedia:
1. **Navigasi & Snapshot:**
   - Gunakan `browser_navigate` ke URL lokal proyek (contoh: `http://localhost:3000` atau link dev/preview server).
   - Gunakan `browser_snapshot` dan `browser_console_messages` untuk mendeteksi runtime warning/error, network failure 404 pada aset, atau Vue runtime error.
2. **Uji Responsivitas (Mobile & Desktop):**
   - Atur viewport mobile (375x667 atau 390x844 via `browser_resize`).
   - Periksa apakah burger menu, hero section, kartu tipe rumah, dan modal tampil proporsional tanpa horizontal scrollbar yang tidak diinginkan.
   - Kembalikan viewport ke Desktop (1440x900) dan pastikan grid layout tersusun rapi.
3. **Uji Interaksi Pengguna:**
   - **Tombol WhatsApp:** Klik tombol CTA WA dan periksa href link (harus mengarah ke `https://wa.me/...` dengan format nomor Indonesia yang valid dan pesan teks awal).
   - **Modal Tipe Rumah (`HouseTypeModal`):** Klik tombol detail pada tipe rumah; verifikasi modal muncul, info spesifikasi & denah tampil, scroll body terkunci, dan modal bisa ditutup dengan tombol silang atau klik backdrop.
   - **Accordion FAQ (`FaqSection`):** Klik pertanyaan FAQ; verifikasi jawaban terbuka dan menutup dengan benar.
   - **Galeri Fasad (`FacadeGallery`):** Klik gambar fasad; pastikan lightbox terbuka dan navigasi slide berfungsi.
   - **Modal MGM / Referral:** Uji buka dan tutup modal referral.
4. **Pemeriksaan Kontras Visual:**
   - Ambil screenshot dengan `browser_take_screenshot`.
   - Periksa apakah ada teks yang memiliki warna sama/serupa dengan latar belakangnya sehingga tidak terbaca.

---

## 3. Checklist Kepatuhan PRD & Desain

- [ ] **Bahasa:** Seluruh UI user-facing menggunakan Bahasa Indonesia yang ramah, sopan, dan persuasif.
- [ ] **Angka & Format Uang:** Format ribuan dengan titik (contoh: `Rp 150.000.000` atau `Rp 1 jutaan/bln`).
- [ ] **Aset:** Gambar tidak pecah atau 404.
- [ ] **Console:** Bersih dari error JavaScript yang tidak tertangani.

---

## 4. Format Laporan ke Orchestrator

```text
Status          : PASS / FAIL
Task ID         : [Fase X - Task X.Y / Issue]
Build Check     : PASS / FAIL (lampirkan potongan log error jika fail)
Playwright Check: PASS (Viewport & skenario yang diuji) / FAIL (detail interaksi yang gagal)
Bukti Visual    : [URL screenshot atau catatan snapshot]

Temuan Masalah (jika FAIL):
  1. [Komponen / Halaman] — [Deskripsi masalah konkret] (contoh: Teks subtitle di AboutSection berwarna charcoal di atas latar charcoal)

Rekomendasi Perbaikan:
  - [Petunjuk spesifik untuk Builder]
```
