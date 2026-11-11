# Redesign Modal Detail Unit — Compact Single-Stage & Spesifikasi Berbingkai (Enlarged Stage & Single-Row Spec Carousel)

- **Tanggal Dokumen Awal:** 2026-11-03
- **Tanggal Pembaruan Terkini:** 2026-11-11
- **Status:** Selesai / Terverifikasi QA (PASS 100%)
- **Komponen Utama:** [`HouseTypeModal.vue`](file:///c:/Users/Salivs/Data/laragon/www/sipar/components/HouseTypeModal.vue)
- **Dokumen Panduan:** [`docs/00-Design Guide Modal Detail Unit (Compact).md`](file:///c:/Users/Salivs/Data/laragon/www/sipar/docs/00-Design%20Guide%20Modal%20Detail%20Unit%20%28Compact%29.md)
- **Bukti Visual & Tangkapan Layar QA:** [`docs/qa/screenshots/`](file:///c:/Users/Salivs/Data/laragon/www/sipar/docs/qa/screenshots/)

---

## 1. Latar Belakang & Tujuan

### Masalah
Implementasi modal tipe unit sebelumnya mengadopsi susunan vertikal bertingkat yang memisahkan elemen visual fasad, perspektif 3D, denah lantai, dan kartu-kartu spesifikasi teknis ke dalam kontainer tersendiri yang panjang. Hal ini menimbulkan sejumlah kendala pengalaman pengguna:
1. **Vertical Overflow Ekstrem:** Pengguna harus banyak menggulir (*scrolling*) ke bawah untuk membaca seluruh informasi teknis unit, menyebabkan hilangnya konteks visual unit saat membaca spesifikasi.
2. **CTA WhatsApp Terkubur:** Tombol konversi WhatsApp berada di ujung terbawah konten yang sering kali tidak terlihat (*below the fold*) sebelum pengguna menggulir hingga dasar modal.
3. **Penyajian Visual Terfragmentasi & Tab Jumping:** Ketika menavigasi multi-sudut gambar (misal 2 sudut perspektif), perpindahan tab sebelumnya sering merusak status kategori aktif tab.
4. **Card Bloat:** Membungkus setiap item spesifikasi ke dalam kartu terpisah (*individual card*) menambah ketebalan visual dan jarak margin/padding yang tidak perlu.

### Tujuan & Nilai Tambah (Revisi & Penyempurnaan 2026-11-11)
Menyempurnakan arsitektur modal **Compact Single-Stage** yang memegang teguh prinsip **"Padat, bukan sesak"** dengan peningkatan kapasitas visual dan efisiensi ruang:
- **Zero Desktop Overflow pada Viewport Standar 720px:** Seluruh konten inti (identitas tipe, visual stage 340px, segmented tabs, panel spesifikasi dinamis 1 baris, dan CTA) muat presisi dalam 1 layar penuh pada viewport desktop standar 1280×720 (`max-h-[94vh]`, `max-w-[760px]`), dengan verifikasi DOM mutlak: `scrollHeight === clientHeight` (0px internal vertical overflow, total tinggi terukur ~494px vs ambang container 676.8px).
- **Dimensi Diperbesar (Enlarged Stage & Container):**
  - Lebar modal ditingkatkan dari `max-w-[700px]` ke **`max-w-[760px]`**, memberikan kelegaan panggung visual dan kenyamanan membaca 3 kolom.
  - Tinggi visual stage ditingkatkan menjadi **`340px` (desktop)** dan **`250px` (mobile)** (`sm:h-[340px] h-[250px]`), menghadirkan kejelasan detail gambar fasad, denah, dan perspektif yang superior.
  - Radius sudut modal diselaraskan menjadi `rounded-[20px]`.
- **Navigasi Sekuensial Terpadu & Multi-Gambar:**
  - Alur navigasi sekuensial lengkap: $\text{Tampak Depan} \longleftrightarrow \text{Perspektif (1/2)} \longleftrightarrow \text{Perspektif (2/2)} \longleftrightarrow \text{Denah} \longleftrightarrow \text{Tampak Depan}$.
  - Tab kategori "Perspektif" tetap aktif dan menyala selama berada di sub-gambar perspektif (`Perspektif 1/2` & `Perspektif 2/2`). Setelah gambar terakhir perspektif, navigasi panah kanan (`>`) berlanjut mulus ke tab Denah.
- **Panel Spesifikasi Dinamis 1 Baris Carousel + Navigasi Desktop:**
  - 9 item spesifikasi dikelompokkan ke dalam 3 slide (3 item per slide).
  - Auto-rotasi setiap **1.8 detik** dengan animasi geser halus (`duration-500 ease-out`).
  - Arsitektur padding anti-bocor: padding horizontal `px-3 sm:px-4` dipindahkan ke masing-masing slide chunk di dalam kontainer `overflow-hidden`.
  - Dilengkapi sepasang tombol panah desktop (`hidden sm:flex`) 20px di kiri (`<`) dan kanan (`>`) pagination dots mini dengan auto-reset timer.
  - Dilengkapi fitur pause-on-hover / pause-on-touch dan gesture touch swipe horizontal di mobile (>30px deltaX).
- **Keselarasan 100% Token Landing Page:** Seluruh palet warna, border, dan chip menggunakan token resmi Tailwind SIP (`bg-off-white`, `border-cream-light`, `text-forest-deep`, `bg-sage-pale`, `border-sage-mist`, `text-charcoal-gray`, `hover:border-orange/40`).
- **Fixed Action Footer:** Tombol aksi WhatsApp gradien hijau resmi dan catatan serah terima menempel (*pinned*) di dasar modal, menjamin jalur konversi selalu tampak dalam jangkauan pandang pengguna.

---

## 2. Arsitektur & Komponen

### Struktur Layout 3-Zona
Struktur layout modal dibangun secara vertikal dengan 3 zona berorientasi flexbox dengan lebar `max-w-[760px]`:

```
+-------------------------------------------------------------------------+
| 1. HEADER (Pinned Top, Single-line, bg-white, border-cream-light)       |
| [Judul Tipe]   [LB 22m²] [LT 60m²] [1 KT] [1 KM] (Sage Chips)     [ (X) ]|
+-------------------------------------------------------------------------+
| 2. BODY (bg-off-white, Zero Scrollbar di Desktop 1280x720, Total ~494px) |
|  [ Tampak Depan | Perspektif | Denah ]  <-- Segmented Tab (bg-cream/60)|
|  +-------------------------------------------------------------------+  |
|  | Visual Stage (sm:h-[340px] Desktop / h-[250px] Mobile)            |  |
|  | [Caption: Forest Deep]                [Counter: 1 / 2]           |  |
|  |                  ( . o ) Sub-image Dots                           |  |
|  |                                                [ < ] [ > ] Nav    |  |
|  +-------------------------------------------------------------------+  |
|  +-------------------------------------------------------------------+  |
|  | Panel Spesifikasi 1 Baris 3 Kolom (Carousel 1.8s / Touch Swipe)   |  |
|  | [Pondasi Batu Kali] | [Struktur Beton Bertulang] | [Dinding ...]  |  |
|  |                [ < ]   ( --- . . ) Dots   [ > ]  (Desktop Nav)    |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
| 3. FOOTER (Pinned Bottom, bg-white, border-cream-light)                 |
| [ WhatsApp: Tanya unit ini -> ]               [*Catatan serah terima]   |
+-------------------------------------------------------------------------+
```

---

## 3. Acceptance Criteria

Kriteria penerimaan berikut telah diverifikasi secara objektif oleh tim QA:

### AC-01: Viewport Fit Desktop 720px & Zero Internal Overflow (scrollHeight == clientHeight)
- **Given:** Pengguna membuka modal detail unit pada layar desktop dengan tinggi viewport 720px (1280×720).
- **When:** Modal dirender penuh di layar pada lebar `max-w-[760px]`.
- **Then:**
  1. Seluruh zona (Header 1 baris, Stage gambar 340px, Segmented tabs, Panel spesifikasi 1 baris, dan Footer CTA) muat presisi dalam 1 layar.
  2. Total akumulasi tinggi komponen modal (~494px) berada jauh di bawah ambang batas container `max-h-[94vh]` (676.8px), menyisakan margin aman ~182.8px.
  3. Pada elemen kontainer scroll body modal terverifikasi: `scrollHeight === clientHeight` (nilai selisih overflow = 0px).
  4. Tidak ada internal scrollbar vertikal yang muncul pada desktop viewport 720px.

### AC-02: Header 1 Baris & 4 Pill Chips Sage Pale
- **Given:** Data tipe rumah memiliki properti `name`, `lb`, `lt`, `kt`, dan `km`.
- **When:** Modal dibuka pada resolusi desktop maupun mobile.
- **Then:**
  1. Judul tipe (`text-forest-deep`), keempat chip (`bg-sage-pale border-sage-mist text-forest-deep`), dan tombol tutup 32px tersusun horizontal dalam satu baris tanpa wrapping.
  2. Micro-icon SVG berdimensi 12px tampil serasi dengan warna `text-forest-deep/75`.
  3. Chip dapat digeser horizontal secara halus (*overflow-x no-scrollbar*) jika layar perangkat sangat sempit.

### AC-03: Navigasi Sekuensial, Multi-Gambar & Visual Stage Diperbesar (340px / 250px)
- **Given:** Visual stage menampilkan tab awal "Tampak Depan".
- **When:** Pengguna mengklik tombol panah navigasi stage, atau menekan tombol keyboard panah, atau melakukan touch swipe pada stage.
- **Then:**
  1. Alur berpindah sekuensial: Tampak Depan $\leftrightarrow$ Perspektif (1/2) $\leftrightarrow$ Perspektif (2/2) $\leftrightarrow$ Denah $\leftrightarrow$ Tampak Depan.
  2. Saat berada di sub-gambar perspektif, tab "Perspektif" tetap aktif dan menyala (`bg-forest-deep text-white`).
  3. Tampil badge counter `1 / 2` di kanan atas stage dan indikator dots sub-gambar di dasar tengah stage.
  4. Tinggi stage konsisten pada `340px` (desktop) dan `250px` (mobile).
  5. Stage menampilkan gambar aset yang bersesuaian dengan rasio tepat (`object-cover` untuk fasad/perspektif dan `object-contain` dengan latar putih untuk denah).

### AC-04: Lightbox Terintegrasi
- **Given:** Gambar unit sedang tampil di visual stage.
- **When:** Pengguna mengklik area visual stage gambar tanpa melakukan gestur swipe.
- **Then:** Composable `useLightbox().openGallery` dipanggil dan modal lightbox terbuka penuh, menampilkan gambar resolusi tinggi dengan kemampuan zoom in/out dan navigasi galeri.

### AC-05: Panel Spesifikasi 1 Baris 3 Kolom, Padding Anti-Bocor & Desktop Nav
- **Given:** Array `type.specs` berisi 9 spesifikasi teknis unit.
- **When:** Panel spesifikasi dirender.
- **Then:**
  1. Kesembilan spesifikasi terbagi dalam 3 slide (3 item per tampilan) dalam 1 baris rapi.
  2. Slide berotasi otomatis setiap 1.8 detik dan otomatis berhenti saat kursor berada di atas panel atau saat disentuh.
  3. Padding horizontal `px-3 sm:px-4` berada di dalam masing-masing slide chunk; tidak ada icon atau teks yang bocor di sisi tepi saat transformasi slide.
  4. Pada desktop, sepasang tombol panah 20px (`hidden sm:flex`) mengapit dots pagination untuk navigasi manual cepat dengan timer auto-reset.
  5. Pengguna mobile dapat menggeser slide secara horizontal melalui gesture touch swipe.
  6. Masing-masing item menampilkan outline icon inline SVG berspesifikasi stroke 1.7 warna emas SIP (`#c9a84c`).

### AC-06: CTA WhatsApp & Catatan Serah Terima
- **Given:** Modal terbuka pada tipe rumah tertentu (misal: "Tipe 22/60").
- **When:** Pengguna mengklik tombol "Tanya unit ini".
- **Then:**
  1. Tautan WhatsApp terbuka ke nomor resmi SIP dengan parameter query teks otomatis yang memuat nama tipe rumah terkait.
  2. Tombol mengadopsi gradien resmi `from-[#1cba5a] to-[#2eec72]` dengan elevasi `shadow-btn-wa` dan radius `rounded-btn` (11px).
  3. Catatan serah terima tampil jelas berdampingan dengan tombol CTA (`text-charcoal-gray text-xs`).

### AC-07: Responsivitas Mobile (< 520px Breakpoint)
- **Given:** Pengguna mengakses website menggunakan perangkat mobile (viewport 375×667 atau 390×844).
- **When:** Modal dibuka.
- **Then:**
  1. Tinggi visual stage menyesuaikan otomatis menjadi 250px (`h-[250px]`).
  2. Panel spesifikasi 3 kolom tetap ringkas dengan gesture touch swipe yang responsif.
  3. Tombol panah spesifikasi disembunyikan otomatis pada mobile (`hidden sm:flex`).
  4. Footer beralih ke tata letak bertumpuk (*stacked layout*) dengan tombol WhatsApp membentang selebar 100%.
  5. Header dan Footer tetap menempel (*pinned*), dan hanya area Body yang dapat digulir jika ruang layar vertikal terbatas.

---

## 4. Evaluasi Zero Desktop Overflow (1280×720)

| Komponen & Parameter | Nilai Terukur | Analisis Ketinggian |
| :--- | :--- | :--- |
| **Viewport Desktop** | 1280 × 720 px | Standar acuan desktop laptop 720p |
| **Max Modal Height (`max-h-[94vh]`)** | 676.8 px | Batas toleransi maksimum modal |
| **Header (1 Baris)** | ~56 px | `px-4 py-3 sm:px-5 sm:py-3.5` + border |
| **Segmented Tab Control** | ~36 px | `p-1 py-1.5 text-xs sm:text-[13px]` + border |
| **Visual Stage (Desktop)** | **340 px** | `sm:h-[340px]` + border-cream-light |
| **Panel Spesifikasi (1 Baris Carousel + Nav)** | **~44 px** | `py-2 sm:py-2.5` + dots mini & nav buttons 20px |
| **Body Padding & Gap (`space-y-2.5`)** | ~42 px | `p-3 sm:p-4` (32px) + `space-y-2.5` (10px) |
| **Footer (WhatsApp + Note)** | ~54 px | `py-2.5 sm:py-3` + button py-2 + border |
| **Total Akumulasi Tinggi Modal** | **~494 px** | **Jauh di bawah 676.8 px (Margin Aman Sangat Lega ~182.8 px)** |
| **Evaluasi DOM Scroll** | **`scrollHeight === clientHeight`** | **PASS: Zero internal scrollbar (0px)** |
