# Design Guide: Modal Detail Unit (Compact Single-Stage)

Panduan tata letak, hierarki komponen, dan sistem desain untuk modal detail tipe rumah (contoh: Tipe 22/60, Tipe 30/60, dsb.) pada proyek perumahan **Sanggar Indah Parahyangan (SIP)**. 

Dokumen ini menjadi acuan tunggal implementasi komponen [`HouseTypeModal.vue`](file:///c:/Users/Salivs/Data/laragon/www/sipar/components/HouseTypeModal.vue) agar selaras 100% dengan token resmi di [`tailwind.config.js`](file:///c:/Users/Salivs/Data/laragon/www/sipar/tailwind.config.js) dan spesifikasi arsitektur [`2026-11-03-modal-detail-unit-compact-design.md`](file:///c:/Users/Salivs/Data/laragon/www/sipar/docs/superpowers/specs/2026-11-03-modal-detail-unit-compact-design.md).

---

## 1. Prinsip Desain

- **Padat, bukan sesak (*Enlarged & Breathable*).** Menghilangkan elemen mubazir (seperti kartu per item spesifikasi atau judul seksi berulang) tanpa mengecilkan teks di bawah ambang keterbacaan normal. Dimensi modal diperbesar ke lebar `max-w-[760px]` dan panggung visual ke tinggi **`340px` (desktop)** dan **`250px` (mobile)** agar foto fasad, visual 3D, dan denah tampil megah dan tajam.
- **Prinsip Zero Desktop Overflow.** Pada viewport laptop/desktop standar (1280×720 px), seluruh konten inti (identitas tipe, 4 chip ringkasan, stage visual 340px, panel spesifikasi dinamis 1 baris, tombol CTA WhatsApp, dan catatan legal) terbukti muat 100% dalam satu layar tanpa scrollbar vertikal internal (`scrollHeight === clientHeight`). Tinggi modal terukur hanya **~494px**, jauh di bawah ambang container `max-h-[94vh]` (676.8px).
- **Satu Panggung Visual Terpadu (*Single Visual Stage*).** Foto tampak depan, perspektif 3D, dan denah arsitektur berbagi satu wadah panggung (*stage*) bertab *segmented control*. Dilarang menumpuk gambar-gambar tersebut secara vertikal.
- **Navigasi Sekuensial Terpadu & Multi-Gambar.** Navigasi panggung visual mendukung alur sekuensial lengkap yang mulus dan intuitif:
  $$\text{Tampak Depan} \longleftrightarrow \text{Perspektif (1/2)} \longleftrightarrow \text{Perspektif (2/2)} \longleftrightarrow \text{Denah} \longleftrightarrow \text{Tampak Depan}$$
  Tab "Perspektif" tetap aktif dan menyala selama pengguna berada di dalam sub-gambar perspektif (`Perspektif 1/2` dan `Perspektif 2/2`). Setelah mencapai sub-gambar terakhir, navigasi panah kanan (`>`) atau swipe kiri secara otomatis melanjutkan ke tab berikutnya ("Denah"), dan sebaliknya navigasi panah kiri (`<`) pada gambar pertama akan mundur ke tab sebelumnya.
- **Panel Spesifikasi Efisien 1 Baris Carousel (*Single-Row Spec Carousel*):** Sembilan spesifikasi material disajikan dalam format 1 baris 3 kolom dinamis dengan auto-rotasi setiap **1.8 detik**, dilengkapi gesture touch swipe, fitur pause-on-hover / pause-on-touch, pagination dots mini interaktif, icon garis emas SIP `#c9a84c` (stroke 1.7), serta **tombol navigasi panah arah Kiri (`<`) dan Kanan (`>`) desktop** (`hidden sm:flex`) yang mengapit dots pagination.
- **Padding Anti-Bocor (*Zero-Leak Padding Architecture*):** Padding horizontal `px-3 sm:px-4` diletakkan langsung pada masing-masing slide chunk di dalam container ber-`overflow-hidden` (bukan pada container luar). Arsitektur ini menjamin icon spesifikasi paling tepi tidak terpotong atau bocor saat transisi slide berlangsung.
- **CTA Selalu Terlihat (*Pinned Action Footer*).** Tombol WhatsApp dan catatan serah terima terkunci di dasar modal (*sticky/fixed footer*), tidak ikut tergulung saat bodi modal di-scroll pada layar ponsel sempit.

---

## 2. Struktur Layout (3-Zona)

Komposisi modal terbagi ke dalam 3 zona vertikal yang kokoh:

| Zona | Isi & Komponen | Perilaku Layout | Token Visual |
| :--- | :--- | :--- | :--- |
| **1. Header** | Judul tipe, 4 chip ringkasan (LB, LT, KT, KM), tombol close bulat | Tetap di atas (*shrink-0*), satu baris horizontal tanpa wrap | `bg-white`, border `border-cream-light`, teks `forest-deep` |
| **2. Body** | Tab *segmented control*, stage visual terpadu (340px/250px), panel spesifikasi 1-baris carousel + nav desktop | Fleksibel (*flex-1*), scroll vertikal hanya jika viewport ponsel sempit | Latar luar `bg-off-white`, jarak blok `space-y-2.5`, padding `p-3 sm:p-4` |
| **3. Footer** | Tombol CTA WhatsApp, catatan serah terima unit | Tetap di bawah (*shrink-0*), menempel pada dasar modal | `bg-white`, border `border-cream-light`, gradien `grad-wa` |

```
+-------------------------------------------------------------------------+
| 1. HEADER (Pinned Top, Single-line, bg-white, border-cream-light)       |
| [Judul Tipe]   [LB 22m²] [LT 60m²] [1 LT] [1 KM] (Sage Chips)     [ (X) ]|
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

## 3. Design Tokens

### A. Pemetaan Token Warna Resmi (Tailwind & CSS)

Seluruh warna menggunakan token resmi proyek yang terdaftar di [`tailwind.config.js`](file:///c:/Users/Salivs/Data/laragon/www/sipar/tailwind.config.js):

| Token Tailwind | Utility Class | Nilai HEX / Karakteristik | Peruntukan pada Modal |
| :--- | :--- | :--- | :--- |
| `forest-deep` | `text-forest-deep`<br>`bg-forest-deep` | `#1C4A2A` | Judul modal tipe, nilai spesifikasi, background tab aktif, teks chip ringkasan, pill caption, badge counter sub-gambar, dot pagination aktif, tombol panah stage & panah panel spesifikasi, dan focus ring |
| `charcoal-gray` | `text-charcoal-gray` | `#6E7268` | Label kecil spesifikasi (uppercase), teks tab inaktif, teks catatan serah terima |
| `charcoal` | `bg-charcoal/60` | `#23271F` (60% + blur) | Backdrop overlay modal (`bg-charcoal/60 backdrop-blur-sm`) |
| `off-white` | `bg-off-white` | `#FBFAF6` | Latar belakang bodi modal dan tombol kontrol nav spesifikasi desktop |
| `white` | `bg-white`<br>`text-white` | `#FFFFFF` | Latar header, footer, stage gambar, dan panel spesifikasi; teks tab aktif & tombol WA |
| `cream-light` | `border-cream-light`<br>`bg-cream-light/60` | `#ECEAE1` | Semua garis pembatas (header, footer, stage, panel spesifikasi) & latar wadah tab segmented |
| `sage-pale` | `bg-sage-pale` | `#E4EFDD` | Latar belakang chip ringkasan spesifikasi di header (selaras dengan `Badge.vue`) |
| `sage-mist` | `border-sage-mist` | `#BFD8B6` | Border chip ringkasan spesifikasi di header |
| `accent-gold` | `text-[#c9a84c]` | `#c9a84c` | 9 Icon outline SVG spesifikasi teknis (stroke 1.7), focus ring aksen |
| `grad-wa` | `from-[#1cba5a] to-[#2eec72]` | Gradien Hijau WA | Tombol CTA WhatsApp dengan bayangan timbul `shadow-btn-wa` |
| `orange` | `text-orange`<br>`hover:border-orange/40` | `#EE8322` | State hover tombol tutup (`hover:border-orange/40 hover:bg-[#FFF4E6] hover:text-orange`) |

### B. Tipografi Dinamis

Tipografi mengikuti hierarki tipografi landing page SIP: font display serif untuk judul unit, dan font body sans-serif untuk seluruh teks fungsional.

| Peran Elemen | Font Family | Kelas Ukuran | Berat (Weight) | Tracking / Leading |
| :--- | :--- | :--- | :--- | :--- |
| **Judul Tipe** | `font-display` (`Cormorant Garamond`, serif) | 24px desktop (`sm:text-[24px]`), 22px mobile (`text-[22px]`) | Bold (700) | `leading-tight`, `lining-nums`, `whitespace-nowrap` |
| **Nilai Spesifikasi** | `font-body` (`Be Vietnam Pro`, sans) | 13px desktop (`sm:text-[13px]`), 12px mobile (`text-[12px]`) | Bold (700) | `leading-tight text-forest-deep truncate mt-0.5` |
| **Tombol WhatsApp** | `font-body` (`Be Vietnam Pro`, sans) | 13.5px (`text-[13.5px]`) | Semibold (600) | Kontras putih, tombol `shadow-btn-wa` |
| **Tab Segmented** | `font-body` (`Be Vietnam Pro`, sans) | 13px desktop (`sm:text-[13px]`), 12px mobile (`text-xs`) | Semibold (aktif: 600), Medium (inaktif: 500) | `transition-all` |
| **Chip Ringkasan** | `font-body` (`Be Vietnam Pro`, sans) | 12px (`text-xs`) | Semibold (600) | `whitespace-nowrap` |
| **Caption & Counter Stage** | `font-body` (`Be Vietnam Pro`, sans) | 12px (`text-xs`) | Semibold (600) | `tracking-wide text-white` |
| **Catatan Serah Terima** | `font-body` (`Be Vietnam Pro`, sans) | 12px (`text-xs`) | Normal (400) | `leading-tight text-charcoal-gray` |
| **Label Spesifikasi** | `font-body` (`Be Vietnam Pro`, sans) | 11px desktop (`sm:text-[11px]`), 10px mobile (`text-[10px]`) | Semibold (600) | `uppercase tracking-wider text-charcoal-gray` |

---

### C. Dimensi, Spacing, dan Radius

| Elemen | Nilai / Utility Tailwind | Keterangan & Perubahan |
| :--- | :--- | :--- |
| **Lebar Modal** | `max-w-[760px]` | Diperbesar dari `max-w-[700px]` untuk keluasan panggung visual & kenyamanan membaca 3 kolom |
| **Batas Maksimal Tinggi** | `max-h-[94vh]` | Pembatasan adaptif terhadap viewport dinamis |
| **Radius Sudut Modal** | `rounded-[20px]` | Elevasi bayangan: `shadow-[0_24px_60px_rgba(20,43,32,0.25)]` |
| **Padding Modal Luar** | `p-3 sm:p-4` | Jarak batas modal terhadap tepi viewport browser |
| **Padding Header** | `px-4 py-3 sm:px-5 sm:py-3.5` | Border bawah `border-b border-cream-light bg-white` |
| **Padding Body** | `p-3 sm:p-4` | Latar `bg-off-white` dengan jarak antar blok `space-y-2.5` (10px) |
| **Tinggi Visual Stage** | `sm:h-[340px]` (desktop)<br>`h-[250px]` (mobile) | Panggung visual dinaikkan (+60px desktop / +30px mobile) agar detail fasad & denah lebih jelas |
| **Padding Panel Spesifikasi** | Container: `py-2 sm:py-2.5`<br>Chunk Slide: `px-3 sm:px-4` | **Arsitektur anti-bocor**: padding horizontal berada di dalam slide chunk, bukan di container luar |
| **Tombol Nav Spesifikasi Desktop** | `h-5 w-5 rounded-full` (20px) | Panah kiri & kanan (`hidden sm:flex border border-cream-light bg-off-white`) |
| **Padding Footer** | `px-4 py-2.5 sm:px-5 sm:py-3` | Border atas `border-t border-cream-light bg-white` |
| **Radius Stage & Panel**| `rounded-xl` (12px) | Border `border border-cream-light bg-white` |
| **Radius Tombol WhatsApp**| `rounded-btn` (11px) | Sesuai konfigurasi tombol resmi `borderRadius.btn` di Tailwind |
| **Radius Chip & Badge** | `rounded-full` (pill 999px) | Chip spesifikasi header, caption pill stage, dan badge counter `1 / 2` |
| **Tombol Tutup** | `h-8 w-8 rounded-full` (32px) | Lingkaran dengan border tipis `border-cream-light` |

---

## 4. Komponen Terperinci

### A. Header (Single-line Header, Tetap di Atas)

Header dirancang dalam 1 baris datar horizontal (`flex items-center justify-between gap-3`):
1. **Sisi Kiri:** Judul tipe rumah (`font-display font-bold text-[22px] sm:text-[24px] text-forest-deep whitespace-nowrap`).
2. **Sisi Tengah:** Empat chip ringkasan bernuansa sage (`bg-sage-pale border border-sage-mist text-forest-deep`):
   - Luas Bangunan: `LB {type.lb} m²` (dengan icon rumah mini 12px `text-forest-deep/75`)
   - Luas Tanah: `LT {type.lt} m²` (dengan icon kavling mini 12px `text-forest-deep/75`)
   - Kamar Tidur: `{type.kt} KT` (dengan icon tempat tidur mini 12px `text-forest-deep/75`)
   - Kamar Mandi: `{type.km} KM` (dengan icon bathtub mini 12px `text-forest-deep/75`)
   - Wadah chip dilengkapi `overflow-x-auto no-scrollbar` agar tidak terjadi pembungkusan baris (*no line wrapping*) pada layar resolusi sempit.
3. **Sisi Kanan:** Tombol tutup lingkaran 32px (`h-8 w-8 rounded-full border border-cream-light bg-white`). Memiliki transisi hover interaktif khas landing page: `hover:border-orange/40 hover:bg-[#FFF4E6] hover:text-orange`.

---

### B. Tab Segmented Control & Alur Sekuensial Navigasi Gambar

Kontrol navigasi visual diletakkan tepat di atas stage visual dengan wadah `rounded-xl border border-cream-light bg-cream-light/60 p-1`:
- **Hierarki Kategori:** Tab mewakili kategori visual utama: **Tampak Depan**, **Perspektif**, dan **Denah**.
- **Alur Sekuensial Gambar Penuh (*Full Sequential Flow*):**
  - Pengguna dapat bernavigasi secara berkesinambungan menggunakan panah panggung (`<` / `>`), keyboard (`ArrowLeft` / `ArrowRight`), atau gesture sentuh (*touch swipe*):
    $$\text{Tampak Depan} \longleftrightarrow \text{Perspektif (1/2)} \longleftrightarrow \text{Perspektif (2/2)} \longleftrightarrow \text{Denah} \longleftrightarrow \text{Tampak Depan}$$
  - **Perilaku Kategori Aktif:**
    - Saat berada di `Perspektif (1/2)`, menekan panah kanan (`nextImage()`) memajukan gambar ke `Perspektif (2/2)`. Tab **Perspektif tetap aktif dan menyala**.
    - Saat berada di `Perspektif (2/2)` (gambar terakhir di kategori Perspektif), menekan panah kanan (`nextImage()`) secara otomatis memajukan tampilan ke tab **Denah** (gambar pertama Denah).
    - Begitu pula sebaliknya: saat berada di **Denah**, menekan panah kiri (`prevImage()`) mundur ke `Perspektif (2/2)` (gambar terakhir dari tab Perspektif) dan tab Perspektif langsung aktif.
    - Dari **Tampak Depan**, menekan panah kiri (`prevImage()`) mundur ke **Denah**, mewujudkan perputaran siklus (*infinite cyclic carousel*) yang utuh tanpa jalan buntu.
- **State Tab Aktif:** `bg-forest-deep font-semibold text-white shadow-sm rounded-lg px-2.5 py-1.5`.
- **State Tab Inaktif:** `font-medium text-charcoal-gray hover:text-forest-deep`.

---

### C. Stage Visual Terpadu (Enlarged Stage & Gesture Swipe)

Panggung visual tunggal untuk seluruh sudut pandang unit:
- **Dimensi Baru:** Tinggi desktop **`340px`** (`sm:h-[340px]`) dan mobile **`250px`** (`h-[250px]`), radius `rounded-xl`, border `border-cream-light`.
- **Mode Render Gambar:**
  - Tampak Depan & Perspektif 3D: `object-cover` untuk menghadirkan ketajaman visual fasad.
  - Denah Arsitektur: `object-contain p-2 bg-white` untuk menjamin seluruh skala ruang, arsiran dinding, dan dimensi ukuran denah tidak terpotong tepi stage.
- **Caption Pill (Kiri Atas):** Menampilkan label gambar aktif dengan latar semitransparan `bg-forest-deep/85 text-white backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-xs`.
- **Sub-Image Counter Badge (Kanan Atas):** Saat kategori memiliki $>1$ gambar, badge counter `1 / 2` tampil otomatis di sudut kanan atas (`bg-forest-deep/85 text-white backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-xs`).
- **Sub-Image Indicator Dots (Dasar Tengah Stage):** Indikator titik mini di bagian tengah bawah stage (`bg-forest-deep/60 backdrop-blur-sm rounded-full px-2 py-1`) yang memperlihatkan posisi slide gambar aktif dalam tab bersangkutan.
- **Navigasi Panah Stage (Kanan Bawah):** Dua tombol lingkaran (`h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-forest-deep/80 text-white backdrop-blur-sm hover:bg-forest-deep`) untuk navigasi sekuensial bolak-balik.
- **Gesture Touch Swipe:** Area stage mendukung sentuhan geser (*touch swipe*) di layar mobile dengan ambang batas delta horizontal minimal 30px (`deltaX > 30px`), memisahkan swipe horizontal dari klik pembuka lightbox via flag `stageIsSwiping`.
- **Integrasi Lightbox:** Klik langsung pada area panggung visual akan mengeksekusi `handleStageClick()`, meratakan seluruh koleksi gambar dari semua tab dan membuka `useLightbox().openGallery` pada gambar yang sedang aktif untuk pembesaran resolusi tinggi dengan zoom interaktif.

---

### D. Panel Spesifikasi 1 Baris 3 Kolom (Carousel Auto-Rotasi & Navigasi Panah Desktop)

Panel spesifikasi satu baris yang sangat efisien dan interaktif (`rounded-xl border border-cream-light bg-white py-2 sm:py-2.5 shadow-xs`):
- **Struktur Slide (Chunking):** Kesembilan spesifikasi dikelompokkan menjadi 3 slide (masing-masing 3 item):
  - **Slide 1:** Pondasi, Struktur, Dinding
  - **Slide 2:** Lantai, Atap, Kusen
  - **Slide 3:** Pintu, Listrik, Air
- **Arsitektur Padding Anti-Bocor (*Zero-Leak Padding*):**
  - Container pembungkus utama hanya diberi padding vertikal `py-2 sm:py-2.5` dengan utilitas `overflow-hidden`.
  - Padding horizontal `px-3 sm:px-4` dipindahkan langsung ke dalam masing-masing elemen grid slide (`grid w-full shrink-0 grid-cols-3 items-center gap-2 sm:gap-4 px-3 sm:px-4`).
  - **Tujuan Arsitektur:** Mencegah terjadinya kebocoran icon atau teks spesifikasi dari slide berikutnya pada sisi kanan saat animasi transformasi geser horizontal berlangsung.
- **Auto-Rotasi 1.8 Detik:** Transisi otomatis antar-slide setiap **1.8 detik** menggunakan `setInterval` Vue dengan animasi geser horizontal mulus (`transition-transform duration-500 ease-out`).
- **Pause on Interaction:**
  - Kursor diarahkan ke area panel (`mouseenter`): rotasi otomatis dijeda seketika agar calon pembeli dapat membaca detail.
  - Kursor keluar (`mouseleave`): rotasi otomatis berlanjut kembali.
  - Layar disentuh (`touchstart`): rotasi dijeda otomatis selama interaksi sentuhan berlangsung.
- **Tombol Navigasi Panah Desktop (`hidden sm:flex`):**
  - Dilengkapi sepasang tombol panah mini 20px (`h-5 w-5 rounded-full border border-cream-light bg-off-white text-forest-deep hover:bg-forest-deep hover:text-white transition-all`) di sebelah kiri (`<`) dan kanan (`>`) pagination dots.
  - Memudahkan pengguna desktop beralih antar-halaman spesifikasi dengan klik mouse tanpa harus menunggu timer 1.8 detik.
  - Setiap klik pada tombol panah (`prevSpecSlide` / `nextSpecSlide`) mengeksekusi `resetSpecTimer()` agar timer 1.8 detik direset dari awal dan tidak langsung berpindah seketika setelah interaksi pengguna.
- **Gesture Touch Swipe di Mobile:** Pengguna layar sentuh dapat menggeser spesifikasi ke kiri (*next*) atau ke kanan (*prev*) secara manual dengan deteksi swipe horizontal `deltaX > 30px`.
- **Pagination Dots Mini Interaktif:** Tiga titik indikator diapit tombol panah desktop yang dapat diklik langsung:
  - Dot Aktif: Berbentuk pil lonjong `w-4 bg-forest-deep h-1 rounded-full`.
  - Dot Inaktif: Berbentuk lingkaran mini `w-1.5 bg-cream-light h-1 rounded-full hover:bg-charcoal-gray/40`.
- **9 Icon Outline Emas SIP (`#c9a84c`):**
  - Menggunakan inline SVG murni berdimensi 18px (`h-[18px] w-[18px]`) dengan ketebalan garis konsisten `stroke-width="1.7"`.
  - Terdiri dari: **Pondasi**, **Struktur**, **Dinding**, **Lantai**, **Atap**, **Kusen**, **Pintu**, **Listrik**, dan **Air** (dilengkapi fallback default icon).
- **Hierarki Teks:**
  - Label spesifikasi: 11px desktop / 10px mobile uppercase `font-semibold text-charcoal-gray tracking-wider leading-tight`.
  - Nilai spesifikasi: 13px desktop / 12px mobile `font-bold text-forest-deep truncate leading-tight mt-0.5`, dilengkapi atribut HTML `title` sebagai tooltip bawaan saat teks terpotong.

---

### E. Fixed Action Footer & Catatan Serah Terima

Zona aksi konversi terkunci di bagian bawah modal:
- **Tombol WhatsApp CTA:**
  - Menggunakan gradien resmi landing page: `bg-gradient-to-r from-[#1cba5a] to-[#2eec72] text-white shadow-btn-wa rounded-btn (11px) px-4 py-2 text-[13.5px] font-semibold transition-all hover:brightness-105 active:scale-[0.99]`.
  - Dilengkapi ikon SVG WhatsApp 16px di kiri dan panah mini di kanan dengan teks lugas `"Tanya unit ini"`.
  - Tautan WhatsApp dinamis otomatis menyertakan nama tipe rumah via composable `useContent().wa('type', { type: type.name })`.
- **Catatan Perlindungan Konsumen:**
  - Teks resmi: `*Konsumen tidak dapat merubah/merenovasi bangunan sebelum proses serah terima unit.`
  - Warna `text-charcoal-gray text-xs font-normal leading-tight`.
- **Perilaku Responsif Footer:**
  - Desktop (`min-[520px]`): Bersebelahan dalam satu baris (WhatsApp di kiri, catatan di kanan rata kanan).
  - Mobile (`< 520px`): Bertumpuk vertikal dengan tombol WhatsApp membentang selebar 100% dan catatan rata tengah di bawah tombol.

---

## 5. Responsif & Prinsip Zero Desktop Overflow

### A. Evaluasi Zero Desktop Overflow pada Layar Desktop 720p (1280×720)

Layout dihitung secara matematis dan diverifikasi via DOM runtime Playwright agar total ketinggian modal berada di bawah ambang batas container `max-h-[94vh]` (676.8 px pada viewport 720px):

| Komponen Modal | Dimensi Ketinggian Terukur | Detail Utility CSS & Catatan |
| :--- | :--- | :--- |
| **Header (1 Baris)** | ~56 px | `px-4 py-3 sm:px-5 sm:py-3.5` + judul + border |
| **Segmented Tab Control** | ~36 px | `p-1 py-1.5 text-xs sm:text-[13px]` + border |
| **Visual Stage (Desktop)** | **340 px** | `sm:h-[340px]` + border (diperbesar dari 280px) |
| **Panel Spesifikasi (1 Baris Carousel + Nav)** | **~44 px** | `py-2 sm:py-2.5` + dots mini & nav buttons 20px (hemat ~54px dari grid 3x3) |
| **Body Padding & Gaps** | ~42 px | `p-3 sm:p-4` (32px) + `space-y-2.5` (10px) |
| **Footer CTA & Catatan** | ~54 px | `py-2.5 sm:py-3` + tombol WA `py-2` + border |
| **Total Akumulasi Tinggi Modal** | **~494 px** | **Jauh di bawah 676.8 px (Margin Aman Sangat Lega ~182.8 px)** |
| **Status DOM Scroll** | **`scrollHeight === clientHeight`** | **PASS: 100% Zero internal scrollbar (0px)** |

> [!TIP]
> Walaupun stage visual desktop diperbesar dari 280px ke 340px (+60px), total ketinggian modal justru turun dari ~576px menjadi **~494px** berkat efisiensi panel spesifikasi 1 baris carousel (menghemat ~54px ruang vertikal). Hal ini memberikan margin keamanan ekstra sebesar **182.8px** sebelum menyentuh batas viewport 720p.

### B. Breakpoint Responsif 520px

- **Desktop & Tablet (Lebar ≥ 520px):**
  - Panel spesifikasi tersusun 3 kolom presisi dalam 1 baris slide berotasi.
  - Tombol navigasi panah kiri & kanan desktop aktif (`hidden sm:flex`).
  - Footer tersusun horizontal dalam 1 baris.
  - Tinggi visual stage terkunci di **340px** (`sm:h-[340px]`).
  - Judul tipe berukuran 24px (`sm:text-[24px]`).
- **Mobile (Lebar < 520px):**
  - Panel spesifikasi tetap tersusun 3 kolom ringkas dengan gesture swipe sentuh horizontal yang responsif.
  - Tombol panah spesifikasi disembunyikan otomatis (`hidden sm:flex`) agar ruang fokus tetap bersih bagi dots dan gesture sentuh.
  - Footer beralih menjadi susunan bertumpuk vertikal (*full-width button*).
  - Tinggi visual stage menyesuaikan menjadi **250px** (`h-[250px]`).
  - Judul tipe berukuran 22px (`text-[22px]`).
  - Area Body adalah satu-satunya wadah yang dapat di-scroll vertikal bila tinggi layar ponsel terbatas.

---

## 6. Aksesibilitas (a11y) & Interaksi Keyboard

- **Semantic Role & Dialog:** Kontainer utama memiliki `role="dialog"`, `aria-modal="true"`, dan `:aria-label="type.name"` yang merefleksikan nama tipe unit secara dinamis.
- **Tab Navigation & ARIA:** Wadah segmented control memakai `role="tablist"` dan tombol tab memakai `role="tab"` dengan state dinamis `:aria-selected="activeTabId === tab.id"`.
- **Pagination Dot & Nav ARIA:** 
  - Tombol dot spesifikasi memiliki atribut `:aria-label="`Spesifikasi halaman ${dotIdx + 1}`"`.
  - Tombol panah navigasi spesifikasi memiliki atribut `aria-label="Spesifikasi sebelumnya"` dan `aria-label="Spesifikasi berikutnya"`.
- **Keyboard Shortcuts:**
  - Tombol keyboard `Escape`: Menutup modal seketika dan mengembalikan fokus.
  - Tombol keyboard `ArrowLeft` / `ArrowRight`: Bernavigasi sekuensial antar-gambar dan antar-kategori tab secara siklik (`Tampak Depan <-> Perspektif 1/2 <-> Perspektif 2/2 <-> Denah`).
- **Body Scroll Locking:** Saat modal terbuka, scrolling halaman latar belakang dimatikan otomatis via `document.body.style.overflow = 'hidden'`, dan dikembalikan normal saat modal tertutup.
- **Focus Rings Standar SIP:** Seluruh tombol interaktif (tab, panah stage, dot spesifikasi, tombol panah spesifikasi, tombol tutup, dan WhatsApp) dilengkapi indikator fokus yang tegas: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-deep focus-visible:ring-offset-2`.
- **Kontras Rasio WCAG AA:** Rasio kontras teks `forest-deep` (#1C4A2A) dan `charcoal-gray` (#6E7268) terhadap latar putih/off-white melebihi 4.5:1, menjamin kenyamanan baca bagi seluruh pengguna.

---

## 7. Do dan Don't

| Do (Wajib Diterapkan) | Don't (Dilarang) |
| :--- | :--- |
| Terapkan alur sekuensial: Tampak Depan $\leftrightarrow$ Perspektif 1/2 $\leftrightarrow$ Perspektif 2/2 $\leftrightarrow$ Denah | Memutuskan alur navigasi atau memaksa lompat tab saat pengguna masih di sub-gambar perspektif |
| Pertahankan tab "Perspektif" tetap aktif selama berada di dalam sub-gambar perspektif | Mengganti label atau highlight tab saat hanya menggeser antar-sudut perspektif 3D |
| Pindahkan padding horizontal `px-3 sm:px-4` ke dalam masing-masing slide chunk | Menaruh `px-3` di container luar ber-`overflow-hidden` yang menyebabkan icon tepi bocor |
| Pasang tombol panah desktop (`hidden sm:flex`) mengapit pagination dots | Mengharuskan pengguna desktop menunggu rotasi timer 1.8s tanpa kontrol manual cepat |
| Reset timer rotasi spesifikasi (`resetSpecTimer`) setiap kali ada interaksi manual | Membiarkan slide bergeser langsung sesaat setelah pengguna mengklik tombol panah manual |
| Jeda rotasi spesifikasi saat kursor mengarah (*hover*) atau layar disentuh (*touch*) | Membiarkan slide bergeser saat pengguna sedang fokus membaca teks spesifikasi |
| Gunakan outline inline SVG konsisten warna `#c9a84c` dengan garis 1.7 | Mencampur icon solid dengan outline atau memakai paket icon eksternal yang berat |
| Terapkan `object-contain p-2 bg-white` khusus untuk gambar denah arsitektur | Memotong denah dengan `object-cover` sehingga dimensi ruangan hilang |
| Potong nilai spesifikasi panjang dengan `truncate` dan sediakan atribut `title` | Membiarkan teks melipat ke baris baru dan merusak simetri baris grid |
| Kunci tombol WhatsApp dan catatan serah terima di dasar modal (*pinned footer*) | Menaruh tombol WhatsApp di dalam area scroll body yang bisa terkubur |
| Pertahankan prinsip Zero Desktop Overflow (~494px) pada viewport 1280×720 | Menambah padding atau margin liar yang memicu vertical scrollbar di desktop |

---

## 8. Catatan Implementasi & Pemeliharaan

1. **Sinkronisasi Token Tailwind:** Seluruh token warna dan radius terikat langsung ke `tailwind.config.js`. Dilarang mendeklarasikan CSS variable mandiri yang berdiri sendiri tanpa sinkronisasi tema.
2. **Kesesuaian Sumber Data Multi-Gambar:**
   - Kategori Tampak Depan membaca `type.facades` berkategori `'front'` / label depan, dengan fallback `facades[0]` atau `gallery[1]`.
   - Kategori Perspektif membaca array `type.perspectives` dan seluruh item `facades` berkategori `'perspective'` / label perspektif. Jika terdapat $\ge 2$ gambar, keduanya otomatis tertampung dalam tab "Perspektif".
   - Kategori Denah membaca array `type.plans` atau fallback `type.gallery[0]`.
3. **Pembersihan Timer Lifecycle:** Pastikan fungsi `stopSpecTimer()` selalu dipanggil pada lifecycle hook `onUnmounted()` dan ketika modal ditutup (`watch(props.type)`) untuk mencegah memory leak.
4. **Ukuran Layar Standar QA:** Setiap pembaruan komponen wajib diuji pada resolusi desktop acuan `1280×720 px` untuk memastikan `scrollHeight === clientHeight` tetap terpenuhi (~494px), serta diuji pada resolusi mobile `375×667 px` dan `390×844 px`.
5. **Konsistensi Tautan WhatsApp:** Parameter teks otomatis yang dibuat oleh fungsi `wa('type', { type: type.name })` tidak boleh diubah secara sepihak agar tim marketing tetap dapat mengidentifikasi unit yang ditanyakan oleh calon pembeli.
