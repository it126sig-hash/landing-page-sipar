# Spesifikasi Fitur: Kalkulator Cicilan KPR (Simulasi Bunga Anuitas 5%)

- **Dokumen ID**: `SPEC-FEAT-MORTGAGE-CALC-002`
- **Tanggal Dokumen**: 2026-11-11
- **Status Fitur**: Selesai (`QA PASS 100%`)
- **Komponen Utama**: [`components/MortgageCalculatorSection.vue`](file:///c:/Users/Salivs/Data/laragon/www/sipar/components/MortgageCalculatorSection.vue)
- **Data Layer**: [`data/content.js`](file:///c:/Users/Salivs/Data/laragon/www/sipar/data/content.js) (`content.calculator`), [`composables/useContent.js`](file:///c:/Users/Salivs/Data/laragon/www/sipar/composables/useContent.js)
- **Halaman Integrasi**: [`pages/index.vue`](file:///c:/Users/Salivs/Data/laragon/www/sipar/pages/index.vue) (Anchor `#kalkulator`)
- **Bank Partner**: Bank BCA (Suku Bunga KPR Anuitas 5.0% p.a.)
- **Viewport Terverifikasi**: Desktop 1440×900, Desktop 1280×720, Mobile 375×667, Mobile 390×844

---

## 1. Latar Belakang & Tujuan Fitur

### 1.1 Permasalahan Bisnis & Pengguna
1. **Ketidakpastian Skema Finansial**: Calon pembeli rumah (terutama pembeli rumah pertama / keluarga muda) sering kali kesulitan memperkirakan berapa dana riil yang harus disiapkan untuk uang muka (DP) dan berapa beban cicilan bulanan yang realistis sesuai anggaran keluarga mereka.
2. **Biaya Akad Awal yang Tersembunyi (*Hidden Costs*)**: Banyak konsumen hanya menyiapkan uang muka, lalu terkejut ketika harus membayar biaya provisi bank dan administrasi saat akad kredit KPR. Ketidaktahuan ini kerap menunda proses transaksi.
3. **Friksi Kontak Manual**: Pengguna enggan langsung menghubungi tim sales bila belum memiliki estimasi angka yang jelas, atau sebaliknya, tim sales menghabiskan banyak waktu mengulang perhitungan simulasi dasar secara manual melalui chat WhatsApp.

### 1.2 Tujuan & Nilai Tambah Fitur
1. **Transparansi Finansial Instan**: Pengunjung dapat mensimulasikan cicilan KPR secara mandiri, interaktif, dan akurat langsung di landing page tanpa reload halaman.
2. **Kesesuaian Standar Perbankan Nasional**: Menggunakan formula aktuaria bunga anuitas bulanan standar perbankan nasional (program KPR Bank BCA suku bunga 5.0% p.a.) sehingga hasil perhitungan identik dengan kalkulator perbankan resmi.
3. **Edukasi Biaya Akad Awal yang Transparan**: Fitur *collapsible accordion* rincian biaya akad awal menyajikan estimasi provisi bank (0.5%), administrasi bank (flat Rp 500.000), dan total biaya pertama (angsuran pertama + provisi + admin).
4. **Zero-Friction User Experience**: Disediakan tombol chip preset cepat untuk 3 unit resmi SIPAR (Tipe 22/60 Subsidi Rp 166 Jt, Tipe 26/72 Komersil Rp 240 Jt, dan Tipe 36/72 Komersil Rp 320 Jt), serta sinkronisasi dua arah interaktif antara input Rupiah, persentase (%), dan range slider (5% s/d 90%).
5. **High-Conversion WhatsApp Marketing Lead**: Mengonversi hasil simulasi pengguna langsung ke obrolan WhatsApp marketing resmi SIPAR dengan parameter simulasi yang terisi secara otomatis (*pre-filled message*).

---

## 2. Arsitektur Komponen & Data Layer (Zero Hardcode)

Komponen dirancang dengan prinsip **Zero Hardcode**. Seluruh teks, label antarmuka, parameter finansial, daftar tenor, preset unit, aset gambar, logo bank partner, hingga template pesan WhatsApp didefinisikan secara terpusat di `data/content.js` dan diakses melalui composable `useContent()`.

### 2.1 Diagram Alur Data & Komponen

```mermaid
flowchart TD
    subgraph ContentLayer["Data Layer (Zero Hardcode)"]
        A["data/content.js\n(content.calculator & meta.whatsapp)"]
    end

    subgraph ComposableLayer["Composable Layer"]
        A --> B["composables/useContent.js\n- useContent()\n- withBase()\n- wa(key, vars)"]
    end

    subgraph ComponentLayer["UI Presentation Layer"]
        B --> C["components/MortgageCalculatorSection.vue\n(Reactive Form, Slider, Anuity Math, Accordion)"]
        C --> D["pages/index.vue\n(Landing Page Section #kalkulator)"]
    end

    subgraph ExternalOutput["Konversi & Lead Generation"]
        C --> E["WhatsApp API Gateway\n(https://wa.me/6282118992299?text=...)"]
    end
```

### 2.2 Struktur Konfigurasi Data (`content.calculator`)

Konfigurasi pada [`data/content.js`](file:///c:/Users/Salivs/Data/laragon/www/sipar/data/content.js#L580-L640):

```javascript
calculator: {
  id: 'kalkulator',
  eyebrow: 'Simulasi Angsuran',
  titleLines: ['Hitung Simulasi', 'Cicilan Rumah Anda'],
  subtitle: 'Rencanakan pembelian rumah impian Anda dengan mudah menggunakan kalkulator cicilan berikut.',
  defaultPrice: 166000000,       // Patokan harga awal unit Tipe 22/60 Subsidi
  defaultDpPercent: 5,           // Minimal Uang Muka awal 5%
  defaultTenor: 20,              // Default tenor 20 tahun (240 bulan)
  annualInterestRate: 0.05,      // Suku bunga anuitas 5.0% p.a.
  provisionRate: 0.005,          // Biaya provisi bank 0.5% dari plafon
  adminFee: 500000,              // Biaya administrasi bank flat Rp 500.000
  minDpPercent: 5,               // Batas bawah slider 5%
  maxDpPercent: 90,              // Batas atas slider 90%
  tenors: [
    { value: 5, label: '5 Tahun (60 Bulan)' },
    { value: 10, label: '10 Tahun (120 Bulan)' },
    { value: 15, label: '15 Tahun (180 Bulan)' },
    { value: 20, label: '20 Tahun (240 Bulan)' },
  ],
  metrics: [
    { label: 'Bunga KPR', value: '5.0% p.a.' },
    { label: 'Uang Muka', value: 'Mulai 5%' },
    { label: 'Tenor KPR', value: 's/d 20 Thn' },
  ],
  bankPartner: {
    name: 'Bank BCA',
    logo: '/assets/images/bank/bca.webp',
  },
  footnote: '*Simulasi cicilan bunga anuitas 5% ini khusus berlaku untuk KPR Bank BCA. Persetujuan kredit dan biaya riil mengikuti ketentuan bank.',
  ctaLabel: 'Konsultasi Simulasi via WhatsApp',
  badge: 'Bunga 5% Anuitas',
  presets: [
    { id: '22-60', name: 'Tipe 22/60', price: 166000000, tag: 'Subsidi' },
    { id: '26-72', name: 'Tipe 26/72', price: 240000000, tag: 'Komersil' },
    { id: '36-72', name: 'Tipe 36/72', price: 320000000, tag: 'Komersil' },
  ],
  image: '/assets/images/rumah/galeri/3672-3d-ilustrasi.webp',
  imageAlt: 'Ilustrasi Hunian Modern Sanggar Indah Parahyangan',
  labels: {
    housePrice: 'Harga Rumah',
    downPayment: 'Uang Muka (DP)',
    downPaymentNominal: 'Uang Muka Nominal',
    downPaymentPercent: 'Persentase DP',
    tenor: 'Jangka Waktu Pinjaman',
    years: 'Tahun',
    months: 'Bulan',
    clearLabel: 'Hapus input harga',
    minDp: '5% Min DP',
    midDp: '50%',
    maxDp: '90% Max DP',
    plafonTitle: 'Plafon Pembiayaan KPR',
    installmentTitle: 'Estimasi Cicilan per Bulan',
    perMonth: '/bulan',
    breakdownOpen: 'Lihat Rincian Biaya Akad Awal ▾',
    breakdownClose: 'Tutup Rincian Biaya Akad Awal ▴',
    provisionFee: 'Provisi Bank (0.5%)',
    adminFee: 'Administrasi Bank',
    totalInitialFee: 'Total Estimasi Biaya Pertama',
    initialFeeNote: '*Estimasi biaya awal mencakup angsuran pertama, provisi bank, dan biaya administrasi.',
  },
}
```

### 2.3 Desain Layout UI (1 Card Landscape 2 Kolom)

Layout mengusung arsitektur visual satu wadah kartu besar (`rounded-[26px]`) dengan split 2 kolom seimbang pada layar desktop (`lg:grid-cols-12` dengan pembagian `lg:col-span-6` & `lg:col-span-6`), dilengkapi latar belakang gambar hunian 3D subtle dengan gradasi vertikal (*vertical fade*):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Latar Belakang: Gambar Hunian 3D Modern - Opacity 10-15% + Vertical Fade Gradient]   │
│                                                                                        │
│                               [Eyebrow: SIMULASI ANGSURAN]                             │
│                           Hitung Simulasi Cicilan Rumah Anda                           │
│              Rencanakan pembelian rumah impian Anda dengan mudah...                    │
│                                                                                        │
│  ┌─ SATU CARD LANDSCAPE 2 KOLOM (bg-white, rounded-[26px], border-cream-light, shadow)─┐  │
│  │                                                   │                              │  │
│  │  KOLOM 1 (KIRI, 6 Col): FORM INPUT FINANSIAL      │  KOLOM 2 (KANAN, 6 Col):     │  │
│  │                                                   │  RINGKASAN ESTIMASI & CTA    │  │
│  │  🏠 Harga Rumah             [Rp 166.000.000]      │  Plafon Pembiayaan KPR       │  │
│  │  ┌──────────────────────────────────────────┬───┐ │    Rp 157.700.000            │  │
│  │  │ Rp 166.000.000                           │ ✕ │ │  ──────────────────────────  │  │
│  │  └──────────────────────────────────────────┴───┘ │  ┌─ BOX ESTIMASI CICILAN ──┐ │  │
│  │  Presets: [Tipe 22/60] [Tipe 26/72] [Tipe 36/72]  │  │ Estimasi Cicilan/Bulan  │ │  │
│  │                                                   │  │ Rp 1.040.750 /bulan     │ │  │
│  │  👛 Uang Muka (DP) - 5% (Rp 8.300.000)            │  │ [ Bunga 5% Anuitas ]    │ │  │
│  │  ┌────────────────────────┬─────────────────────┐ │  └─────────────────────────┘ │  │
│  │  │ Rp 8.300.000           │  5 %                │ │  ┌─ 3 METRICS GRID ────────┐ │  │
│  │  └────────────────────────┴─────────────────────┘ │  │ Bunga     DP       Tenor │ │  │
│  │  [==●===========================================] │  │ 5.0% p.a. Mulai 5% 20 Th │ │  │
│  │  5% Min DP                 50%       90% Max DP   │  └─────────────────────────┘ │  │
│  │                                                   │  ▾ Rincian Biaya Akad Awal   │  │
│  │  📅 Jangka Waktu Pinjaman                         │    • Provisi (0.5%): Rp 788k │  │
│  │  ┌──────────────────────────────────────────────┐ │    • Admin Bank: Rp 500k     │  │
│  │  │ 20 Tahun (240 Bulan)                       ▼ │ │    • Total Biaya: Rp 2.329k  │  │
│  │  └──────────────────────────────────────────────┘ │                              │  │
│  │                                                   │  [ 📲 Konsultasi WhatsApp ↗ ]│  │
│  └───────────────────────────────────────────────────┴──────────────────────────────┘  │
│                                                                                        │
│       ┌─ WADAH PILL BANK PARTNER DI LUAR CARD (White/80 Backdrop-blur, Border) ───────┐ │
│       │ [ Logo BCA ] | *Simulasi cicilan bunga anuitas 5% ini khusus berlaku untuk    │ │
│       │                KPR Bank BCA. Persetujuan kredit dan biaya riil mengikuti      │ │
│       │                ketentuan bank.                                                │ │
│       └───────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Formula Matematika Perbankan & Logika Inti

### 3.1 Rumus Bunga Anuitas Bulanan (Equated Monthly Installment / EMI)

Perhitungan angsuran bulanan menggunakan rumus standar anuitas perbankan:

$$A = P \times \frac{r \times (1 + r)^n}{(1 + r)^n - 1}$$

Di mana:
- $P$ (**Plafon Kredit**): $\max(0, \text{Harga Rumah} - \text{Nominal Uang Muka})$
- $i$ (**Suku Bunga Tahunan**): $0.05$ ($5.0\%$ per tahun)
- $r$ (**Suku Bunga Bulanan**): $\frac{i}{12} = \frac{0.05}{12} \approx 0.0041666666666667$
- $n$ (**Jumlah Periode Bulan**): $\text{Tenor (Tahun)} \times 12$
- $A$ (**Angsuran per Bulan**): Angsuran tetap bulanan pokok + bunga

#### Implementasi JavaScript Murni:
```javascript
const monthlyInstallment = computed(() => {
  const P = plafon.value;
  if (P <= 0) return 0;
  const annualRate = calcData.value.annualInterestRate ?? 0.05;
  const years = tenorYears.value || 20;
  const n = years * 12;
  if (annualRate <= 0) return Math.round(P / n);

  const r = annualRate / 12;
  const factor = Math.pow(1 + r, n);
  const emi = P * (r * factor) / (factor - 1);
  return Math.round(emi);
});
```

### 3.2 Rumus Estimasi Biaya Akad Awal
Perbankan penyalur KPR umumnya membebankan biaya awal saat penandatanganan akad kredit:
1. **Biaya Provisi Bank ($0.5\%$)**:
   $$\text{Provisi} = \text{round}(P \times 0.005)$$
2. **Biaya Administrasi Bank**:
   $$\text{Administrasi} = \begin{cases} \text{Rp } 500.000, & \text{jika } P > 0 \\ 0, & \text{jika } P = 0 \end{cases}$$
3. **Total Estimasi Biaya Pertama**:
   $$\text{Total Biaya Pertama} = A + \text{Provisi} + \text{Administrasi}$$

### 3.3 Logika Sinkronisasi Dua Arah Uang Muka (DP)
Tiga elemen kendali DP (Input Rupiah, Input Persen, Slider Range 5–90%) saling terikat reaktif:
- **Pengguna mengetik nominal DP**:
  $$\text{Persentase} = \min\left(100, \max\left(0, \frac{\text{Nominal}}{\text{Harga}} \times 100\right)\right)$$
- **Pengguna mengetik persentase atau menggeser slider**:
  $$\text{Nominal} = \text{round}\left(\text{Harga} \times \frac{\text{Persen}}{100}\right)$$
- **Pengguna memilih preset unit / mengubah harga rumah**:
  Nominal DP otomatis dihitung ulang mengikuti persentase aktif saat itu tanpa merusak proporsi.

### 3.4 Matriks Simulasi Finansial Unit SIPAR (Suku Bunga 5.0% p.a.)

Berdasarkan harga resmi unit SIPAR pada DP standar 5%:

| Unit SIPAR | Harga Rumah ($P_0$) | DP (5%) | Plafon KPR ($P$) | Tenor 5 Thn ($n=60$) | Tenor 10 Thn ($n=120$) | Tenor 15 Thn ($n=180$) | Tenor 20 Thn ($n=240$) | Provisi (0.5%) | Admin Bank | Total Biaya Pertama (Tenor 20 Thn) |
|---|---|---|---|---|---|---|---|---|---|---|
| **Tipe 22/60 (Subsidi)** | Rp 166.000.000 | Rp 8.300.000 | Rp 157.700.000 | Rp 2.976.013/bln | Rp 1.672.846/bln | Rp 1.247.165/bln | **Rp 1.040.750/bln** | Rp 788.500 | Rp 500.000 | **Rp 2.329.250** |
| **Tipe 26/72 (Komersil)** | Rp 240.000.000 | Rp 12.000.000 | Rp 228.000.000 | Rp 4.300.971/bln | Rp 2.418.529/bln | Rp 1.803.119/bln | **Rp 1.504.664/bln** | Rp 1.140.000 | Rp 500.000 | **Rp 3.144.664** |
| **Tipe 36/72 (Komersil)** | Rp 320.000.000 | Rp 16.000.000 | Rp 304.000.000 | Rp 5.734.629/bln | Rp 3.224.705/bln | Rp 2.404.159/bln | **Rp 2.006.219/bln** | Rp 1.520.000 | Rp 500.000 | **Rp 4.026.219** |

---

## 4. Acceptance Criteria (Given / When / Then)

### AC 1: Preset Cepat Unit SIPAR & Kalkulasi Otomatis
- **Given**: Pengguna berada di section `#kalkulator`.
- **When**: Pengguna mengklik tombol preset `Tipe 22/60 (Subsidi)`.
- **Then**:
  - Input harga terisi `166.000.000` dengan format ribuan `Rp 166.000.000`.
  - Nominal DP terisi `Rp 8.300.000` (5% dari Rp 166 Jt).
  - Plafon terisi `Rp 157.700.000`.
  - Box estimasi cicilan menampilkan `Rp 1.040.750 /bulan` pada tenor default 20 tahun.
  - Tombol preset `Tipe 22/60` mendapat highlight status aktif (`bg-forest-deep text-white`).

### AC 2: Sinkronisasi Tiga Elemen DP (Nominal, Persen, Range Slider)
- **Given**: Harga rumah terpilih `Rp 166.000.000` dengan DP default 5% (`Rp 8.300.000`).
- **When**: Pengguna menggeser slider DP dari 5% ke `20%`.
- **Then**:
  - Input persen DP berubah menjadi `20`.
  - Input nominal DP berubah menjadi `Rp 33.200.000`.
  - Plafon KPR terhitung ulang menjadi `Rp 132.800.000`.
  - Angsuran bulanan tenor 20 tahun terhitung ulang menjadi `Rp 876.421 /bulan`.
- **When**: Pengguna mengetik nominal DP manual menjadi `Rp 16.600.000`.
- **Then**:
  - Persentase DP otomatis menjadi `10%`.
  - Slider range otomatis berpindah ke angka `10%`.
  - Track slider terisi gradient hijau aktif proporsional.

### AC 3: Keberadaan & Fungsi Tombol Clear Harga (`✕`)
- **Given**: Input harga bernilai `Rp 166.000.000`.
- **When**: Pengguna mengklik tombol `✕` di sisi kanan input harga.
- **Then**:
  - Nilai harga menjadi `0` dan input placeholder menampilkan `0`.
  - Nilai DP nominal, persen, dan plafon kembali ke `0`.
  - Box cicilan dan total biaya awal menampilkan `Rp 0` tanpa terjadi error kalkulasi `NaN`.

### AC 4: Dropdown Jangka Waktu Pinjaman (Tenor)
- **Given**: Plafon KPR bernilai `Rp 157.700.000`.
- **When**: Pengguna mengubah pilihan tenor pada dropdown:
  - Memilih `5 Tahun (60 Bulan)` $\rightarrow$ Angsuran menjadi `Rp 2.976.013 /bulan`.
  - Memilih `10 Tahun (120 Bulan)` $\rightarrow$ Angsuran menjadi `Rp 1.672.846 /bulan`.
  - Memilih `15 Tahun (180 Bulan)` $\rightarrow$ Angsuran menjadi `Rp 1.247.165 /bulan`.
  - Memilih `20 Tahun (240 Bulan)` $\rightarrow$ Angsuran menjadi `Rp 1.040.750 /bulan`.
- **Then**: Hasil simulasi langsung terupdate secara reaktif tanpa jeda atau visual flicker.

### AC 5: Collapsible Accordion Rincian Biaya Akad Awal
- **Given**: Plafon KPR `Rp 157.700.000` dan cicilan bulanan tenor 20 tahun `Rp 1.040.750`.
- **When**: Pengguna mengklik `Lihat Rincian Biaya Akad Awal ▾`.
- **Then**:
  - Container akordeon terbuka secara transisi halus.
  - Teks tombol berganti menjadi `Tutup Rincian Biaya Akad Awal ▴`.
  - Tertera baris Provisi Bank (0.5%): `Rp 788.500`.
  - Tertera baris Administrasi Bank: `Rp 500.000`.
  - Tertera Total Estimasi Biaya Pertama: `Rp 2.329.250` ($1.040.750 + 788.500 + 500.000$).
  - Tertera catatan kaki biaya awal akad.
- **When**: Pengguna mengklik kembali tombol tersebut.
- **Then**: Container akordeon tertutup rapat dan teks kembali ke semula.

### AC 6: Integrasi Pesan Dinamis CTA WhatsApp
- **Given**: Pengguna mensimulasikan Tipe 22/60 (Harga Rp 166.000.000, DP 5% Rp 8.300.000, Plafon Rp 157.700.000, Tenor 20 Tahun, Cicilan Rp 1.040.750/bulan).
- **When**: Pengguna mengklik tombol `Konsultasi Simulasi via WhatsApp ↗`.
- **Then**:
  - Browser membuka tautan `https://wa.me/6282118992299?text=...` di tab baru (`target="_blank"` dengan `rel="noopener noreferrer"`).
  - Teks parameter yang terkirim:
    ```text
    Halo tim marketing Sanggar Indah Parahyangan, saya sudah hitung simulasi cicilan di website:
    • Harga Rumah: Rp 166.000.000
    • Uang Muka (DP): Rp 8.300.000 (5%)
    • Plafon KPR: Rp 157.700.000
    • Tenor: 20 Tahun
    • Estimasi Cicilan: Rp 1.040.750/bulan
    Boleh bantu konsultasi ketersediaan unit dan persyaratannya?
    ```

### AC 7: Wadah Pill Bank Partner (Bank BCA) di Luar Card Utama
- **Given**: Halaman me-render `#kalkulator`.
- **When**: Pengguna melihat area di bawah kartu utama landscape.
- **Then**:
  - Tampil komponen pill mandiri berlatar `bg-white/80 backdrop-blur-sm` dengan border halus `border-cream-light`.
  - Tampil logo resmi Bank BCA (`/assets/images/bank/bca.webp`) dengan `loading="lazy"` dan tinggi proporsional (`h-5 sm:h-6`).
  - Tampil teks footnote disclaimer KPR bunga anuitas 5% Bank BCA.

### AC 8: Aksesibilitas & Zero Overflow
- **Given**: Halaman diuji pada viewport desktop (1440×900, 1280×720) dan mobile (375×667, 390×844).
- **When**: Seluruh field input, slider, select, dan button diinspeksi.
- **Then**:
  - Seluruh elemen form memiliki atribut `id`, `aria-label`, dan label yang terhubung.
  - Slider track memiliki visual pseudo-element thumb yang mudah disentuh (`width: 18px; height: 18px`).
  - Nilai `document.documentElement.scrollWidth <= window.innerWidth` (0px kebocoran overflow horizontal).

---

## 5. Status Verifikasi QA (Playwright Tests)

Pengujian otomatisasi fungsional dan tata letak responsif telah dieksekusi dengan hasil **PASS 100%**:

| Kategori Uji | Skenario Pengujian | Target Viewport | Hasil | Detail / Log Verifikasi |
|---|---|:---:|:---:|---|
| **SSR / Build** | Kompilasi Nitro & Nuxt SSR | Engine Build | **PASS** | `npm run build` sukses memproduksi server bundle tanpa warning sintaks Vue 3. |
| **Data Layer** | Zero Hardcode Audit | All Viewports | **PASS** | Semua teks judul, label, parameter keuangan, dan preset dikonsumsi dari `useContent().content.calculator`. |
| **Desktop Layout** | 1 Card Landscape 2 Kolom | **1440 × 900** | **PASS** | Kolom input (kiri 6 col) dan kolom hasil (kanan 6 col) sejajar proporsional, border divider vertikal tampil rapi, gambar hunian 3D subtle vertical fade tidak mengganggu kontras. |
| **Desktop Layout** | Resolusi Standar Desktop | **1280 × 720** | **PASS** | Elemen grid tidak bertumpuk, tombol preset tersusun 1 baris fleksibel, font scale terbaca jelas. |
| **Mobile Layout** | Viewport Mobile Compact | **375 × 667** (iPhone SE) | **PASS** | Form menyusun vertikal 1 kolom, thumb slider mudah digeser, tombol WhatsApp full-width, `scrollWidth === clientWidth` (0px overflow). |
| **Mobile Layout** | Viewport Mobile Standar | **390 × 844** (iPhone 12/13/14) | **PASS** | Margin dan padding konsisten, pill bank partner di luar card terpusat rapi dengan logo BCA. |
| **Fungsionalitas** | Presets SIPAR (22/60, 26/72, 36/72) | All Viewports | **PASS** | Mengklik tiap chip mengisi nominal harga secara instan dan memicu rekalkulasi DP, plafon, cicilan, dan biaya awal. |
| **Fungsionalitas** | Two-Way DP Synchronization | All Viewports | **PASS** | Input Rp 8.300.000 $\leftrightarrow$ Persen 5% $\leftrightarrow$ Slider 5% sinkron secara real-time. |
| **Fungsionalitas** | Reset Tombol Clear (`✕`) | All Viewports | **PASS** | Reset harga menjadi 0, nominal DP 0, cicilan Rp 0, bebas dari error `NaN`. |
| **Fungsionalitas** | Accordion Biaya Akad Awal | All Viewports | **PASS** | Toggle buka/tutup berfungsi mulus, provisi 0.5% (Rp 788.500) dan total biaya awal (Rp 2.329.250) terhitung akurat. |
| **Integrasi Eksternal** | WhatsApp Link Generator | All Viewports | **PASS** | URL encode valid, memuat seluruh data kalkulasi aktif menuju nomor marketing resmi `0821-1899-2299`. |

---

## 6. Out of Scope (Batasan Eksplisit)

Untuk mencegah pengerjaan *over-engineering* dan menjaga kesederhanaan bagi calon konsumen, batasan teknis berikut ditetapkan secara eksplisit:

1. **Pengajuan Pinjaman Online Formal (*Online Mortgage Approval*)**: Fitur ini adalah simulator edukatif dan sarana penangkapan prospek (*lead generator*), bukan modul pengajuan kredit resmi yang terhubung ke sistem BI Checking / SLIK OJK perbankan.
2. **Skema Suku Bunga Mengambang Bertingkat (*Multi-Tier Floating Rates*)**: Kalkulator menggunakan suku bunga tetap anuitas 5.0% p.a. (program KPR Bank BCA) dan tidak menampilkan proyeksi suku bunga mengambang tahun ke-6 ke atas untuk menjaga kesederhanaan pemahaman konsumen awal.
3. **Penyimpanan Riwayat Simulasi di Database (*No Server State*)**: Seluruh pemrosesan berjalan reaktif di sisi klien (*client-side reactive state*). Tidak ada data finansial calon pembeli yang dikirim atau disimpan ke database sebelum mereka menekan tombol konsultasi WhatsApp secara sadar.
