---
name: frontend-agent
description: >
  Use this skill when acting as the Frontend Agent for the Sanggar Indah Parahyangan (SIP) project.
  Covers Nuxt 3, Vue 3 (<script setup>), Tailwind CSS, GSAP animations, Design System tokens,
  and Content-Driven UI architecture via useContent().
---

# FRONTEND AGENT — Standar & Aturan Eksekusi

Stack: Nuxt 3, Vue 3 (`<script setup>`), Tailwind CSS v3, GSAP.

---

## 1. Sebelum Menulis Kode

1. Wajib membaca:
   - **`docs/design/DESIGN.md`** (Design System acuan).
   - **`tailwind.config.js`** & **`tokens.css`** (Daftar token warna, font, gradasi tombol).
   - **`docs/PRD_Landing_Sanggar_Indah_Parahyangan.md`** (Prinsip arsitektur & konversi).
2. **DILARANG hardcode teks jualan:** Semua teks penawaran, harga, spesifikasi rumah, poin keunggulan, FAQ, dan link WA wajib diakses via composable `useContent()`. Komponen UI bertindak murni sebagai lapisan presentasi.
3. **Single Source of Truth:** Jangan menduplikasi array data akses atau spesifikasi tipe rumah di dalam komponen. Ambil dari objek kanonik di `content.js` / Supabase `site_content`.

---

## 2. Standar Desain & Token Warna (`docs/design/DESIGN.md`)

- **Palette Utama:**
  - `forest-deep` (`#1C4A2A`): Header, hero text, aksen struktural.
  - `forest-medium` (`#2E5A36`): Tombol sekunder, status aktif.
  - `forest-light` (`#6FB544`): Hover & aksen hijau muda.
  - `charcoal` (`#23271F`): Teks utama gelap & latar belakang kontras tinggi.
  - `orange` (`#EE8322`): Aksen tombol Call-To-Action (CTA) utama & tombol WhatsApp.
  - `orange-light` (`#F6A24A`): State peringatan / penekanan sekunder.
  - `off-white` (`#FBFAF6`): Latar belakang seksi terang.
  - `cream-light` (`#ECEAE1`): Border & garis pemisah.
  - `sage-pale` (`#E4EFDD`) & `mint-pale` (`#EDF4E7`): Latar belakang callout container.
- **Tipografi:**
  - Font Display: `font-display` (`Cormorant Garamond` / `Sora`).
  - Font Body: `font-body` (`Be Vietnam Pro` / `Plus Jakarta Sans`).
- **Resep Gradasi Tombol (di `tailwind.config.js`):**
  - Tombol Emas: `bg-grad-gold` (hover: `bg-grad-gold-hover`)
  - Tombol Hijau: `bg-grad-forest` (hover: `bg-grad-forest-hover`)
  - Tombol Oranye: `bg-grad-orange` (hover: `bg-grad-orange-hover`)
  - Tombol WA: `bg-grad-wa` (hover: `bg-grad-wa-hover`)
- **Peringatan Kontras Warna:**
  - Pastikan warna teks SELALU kontras dengan latar belakangnya.
  - Jangan gunakan teks gelap pada latar belakang gelap (`charcoal` di atas `charcoal` atau `forest-deep`), atau teks putih pada latar belakang terang (`off-white`).

---

## 3. Komponen, Interaksi & Aksesibilitas

- **Format Angka & Uang:**
  - Pemisah ribuan titik (`.`), pemisah desimal koma (`,`).
  - Prefix mata uang: `Rp ` (misal: `Rp 150.000.000` atau cicilan `Rp 1 jutaan/bln`).
- **Modal & Drawer:**
  - Wajib mengunci scroll body (`overflow: hidden` pada `document.body`) saat modal dibuka (`HouseTypeModal`, `KprTermsModal`, `MemberGetMemberModal`).
  - Sediakan tombol tutup yang jelas (Escape key listener + tombol close klik).
- **Animasi GSAP:**
  - Animasi harus halus, tidak menimbulkan layout shift atau menghambat keterbacaan teks saat scroll.
  - Bungkus pemanggilan DOM dalam `onMounted()` dan pastikan cleanup di `onUnmounted()` jika memakai event listener kustom.
- **Gambar & Aset:**
  - Gambar LCP (Hero) wajib memakai `loading="eager"`.
  - Gambar lainnya wajib memakai native `loading="lazy"`.
  - Gunakan helper `withBase()` untuk semua path aset gambar agar kompatibel dengan subpath build maupun storage eksternal.

---

## 4. Checklist Mandiri Sebelum Serahkan ke QA

- [ ] Tidak ada warning linting atau missing import di Vue components.
- [ ] Semua teks jualan diambil dari `useContent()`.
- [ ] Tombol WA memanggil `wa(source)` dengan parameter yang benar.
- [ ] Tampilan rapi dan responsif di ukuran 375px (mobile) dan 1440px (desktop).
- [ ] Cek warna teks vs latar belakang: terbaca jelas dan memenuhi standar kontras AA.
