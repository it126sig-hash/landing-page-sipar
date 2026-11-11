# Panduan Portabilitas & Implementasi Reusable: Kalkulator Cicilan KPR

Dokumen ini adalah panduan teknis lengkap (*complete integration guide*) untuk mereplikasi dan mengimplementasikan **Section Kalkulator Cicilan KPR (Simulasi Bunga Anuitas)** ke proyek web lain berbasis **Vue 3**, **Nuxt 3**, dan **Tailwind CSS**.

---

## 1. Overview & Fitur Utama

Kalkulator ini dirancang dengan pendekatan *high-conversion, mobile-responsive, content-driven*, dan akurasi finansial sesuai standar perbankan nasional.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Background: Gambar Hunian 3D Opacity 10-15% + Fade Gradient Atas & Bawah]             │
│                                                                                        │
│                               [Eyebrow: SIMULASI ANGSURAN]                             │
│                           Hitung Simulasi Cicilan Rumah Anda                           │
│              Rencanakan pembelian rumah impian Anda dengan mudah...                    │
│                                                                                        │
│  ┌─ SATU CARD LANDSCAPE 2 KOLOM (Rounded 26px, Shadow, Border Line) ────────────────┐  │
│  │                                                   │                              │  │
│  │  KOLOM 1 (KIRI, 6 Col): INPUT DATA                │  KOLOM 2 (KANAN, 6 Col):     │  │
│  │                                                   │  HASIL ESTIMASI & CTA        │  │
│  │  🏠 Harga Rumah                                   │  Plafon KPR:                 │  │
│  │  ┌──────────────────────────────────────────┬───┐ │    Rp 157.700.000            │  │
│  │  │ Rp 166.000.000                           │ ✕ │ │  ──────────────────────────  │  │
│  │  └──────────────────────────────────────────┴───┘ │  ┌─ BOX ESTIMASI CICILAN ──┐ │  │
│  │                                                   │  │ Estimasi Cicilan/Bulan  │ │  │
│  │  👛 Uang Muka (DP) - 5% (Rp 8.300.000)            │  │ Rp 1.040.750 /bulan     │ │  │
│  │  ┌────────────────────────┬─────────────────────┐ │  │ [ Bunga 5% Anuitas BCA ] │ │  │
│  │  │ Rp 8.300.000           │  5 %                │ │  └─────────────────────────┘ │  │
│  │  └────────────────────────┴─────────────────────┘ │  ┌─ 3 METRICS GRID ────────┐ │  │
│  │  [==●===========================================] │  │ Bunga     DP       Tenor │ │  │
│  │  5% Min DP                 50%       90% Max DP   │  │ 5.0% p.a. Mulai 5% 20 Th │ │  │
│  │                                                   │  └─────────────────────────┘ │  │
│  │  📅 Jangka Waktu Pinjaman                         │  ▾ Rincian Biaya Akad Awal   │  │
│  │  ┌──────────────────────────────────────────────┐ │    • Provisi (0.5%): Rp 788k │  │
│  │  │ 20 Tahun (240 Bulan)                       ▼ │ │    • Admin Bank: Rp 500k     │  │
│  │  └──────────────────────────────────────────────┘ │    • Total Biaya: Rp 2.329k  │  │
│  │                                                   │                              │  │
│  │                                                   │  [ 📲 Konsultasi WhatsApp ↗ ]│  │
│  └───────────────────────────────────────────────────┴──────────────────────────────┘  │
│                                                                                        │
│       ┌─ PILL CONTAINER DI LUAR CARD (White/80 Backdrop-blur, Border Line) ───┐        │
│       │ [ Logo BCA ] | *Simulasi cicilan bunga anuitas 5% ini khusus berlaku  │        │
│       │                untuk KPR Bank BCA. Persetujuan kredit dan biaya riil   │        │
│       │                mengikuti ketentuan bank.                              │        │
│       └───────────────────────────────────────────────────────────────────────┘        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Rangkuman Fitur:
1. **Layout 1 Card Landscape 2 Kolom:** Terpadu dalam satu wadah (*container* kartu besar) dengan border halus dan bayangan elegan.
   - **Kolom Kiri:** Input harga rumah manual, input nominal DP, input persentase DP, slider DP interaktif, dan dropdown tenor.
   - **Kolom Kanan:** Plafon pembiayaan, box highlight estimasi angsuran bulanan dengan badge bunga, grid 3 metrik ringkasan, collapsible accordion rincian biaya awal akad, dan tombol WhatsApp CTA *full-width*.
2. **Sinkronisasi Dua Arah Uang Muka (DP):**
   - Mengetik nominal DP $\rightarrow$ persentase DP & slider otomatis sinkron.
   - Mengubah persentase DP $\rightarrow$ nominal DP & slider otomatis sinkron.
   - Menggeser slider $\rightarrow$ nominal DP & persentase DP otomatis sinkron.
   - Mengubah harga rumah $\rightarrow$ nominal DP terhitung ulang mengikuti persentase aktif.
3. **Input Harga Fleksibel & Tombol Clear:** Format otomatis pemisah ribuan titik (`id-ID`) dan tombol `✕` untuk mereset harga menjadi 0 tanpa error `NaN`.
4. **Formula Anuitas Standar Perbankan:** Menghitung angsuran bulanan tetap dengan suku bunga efektif/anuitas tahunan yang 100% presisi sesuai formula Excel bank.
5. **Estimasi Biaya Akad Awal:**
   - Biaya Provisi: $0.5\% \times \text{Plafon Kredit}$.
   - Biaya Administrasi Bank: $\text{Rp } 500.000$ (biaya tetap).
   - Total Biaya Pertama: $\text{Angsuran Pertama} + \text{Provisi} + \text{Administrasi}$.
6. **Latar Belakang Hunian Subtle:** Background image 3D tipis (*opacity 10–15%*) dengan efek gradasi vertikal *fade* atas dan bawah agar konten kartu tetap memiliki kontras tinggi.
7. **Pill Bank Partner & Disclaimer di Luar Card:** Logo bank resmi (misal: Bank BCA) dan kalimat disclaimer ringkas diletakkan di luar card utama dalam pill container berlatar *backdrop-blur*.
8. **WhatsApp CTA Dinamis:** Menghasilkan pesan konsultasi WhatsApp otomatis yang langsung memuat rincian simulasi pengguna.

---

## 2. Kebutuhan Stack & Dependensi

Komponen ini bersifat *framework-agnostic* di ekosistem Vue:
- **Core:** Vue 3 (Composition API `<script setup>`) atau Nuxt 3.
- **CSS Utility:** Tailwind CSS v3.x atau v4.x.
- **Icons / Fonts (Opsional):**
  - Font Judul: Serif display (`Fraunces`, `Dream Orphans`, atau `Playfair Display`).
  - Font Konten: Sans-serif (`Poppins`, `DM Sans`, atau `Inter`).
  - Simbol: Karakter UTF-8 bawaan (`Rp`, `▼`, `✕`, `↗`, `▾`, `▴`).

### Variabel Warna CSS (Design Tokens)
Jika proyek Anda menggunakan sistem CSS variables, daftarkan variabel berikut di CSS global (atau ganti langsung dengan class Tailwind seperti `emerald-700`, `stone-100`, dll.):

```css
:root {
  --paper: #f6f5f1;          /* Latar belakang section */
  --paper-deep: #e8e6df;     /* Track slider & border sekunder */
  --white: #ffffff;          /* Latar card utama */
  --ink: #1e2420;            /* Teks judul & nominal utama */
  --muted: #6b726d;          /* Teks deskripsi & label */
  --line: #e3e1da;           /* Border garis halus */
  --green: #2d5a3f;          /* Warna primer (tombol, accent slider) */
  --green-deep: #1e3f2c;     /* Warna hijau gelap (teks nominal cicilan) */
  --green-soft: #c8d8cd;     /* Border box highlight cicilan */
  --sage-pale: #eaf1ec;      /* Latar box highlight cicilan */
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
```

---

## 3. Struktur Data Konfigurasi (Config Object)

Definisikan data kalkulator di file terpisah (misal `content.js` atau JSON):

```javascript
export const mortgageCalculatorConfig = {
  eyebrow: 'Simulasi Angsuran',
  titleLines: ['Hitung Simulasi', 'Cicilan Rumah Anda'],
  subtitle: 'Rencanakan pembelian rumah impian Anda dengan mudah menggunakan kalkulator cicilan berikut.',
  
  // Parameter Finansial Default
  defaultPrice: 166000000,       // Patokan harga awal (Rp 166 Jt)
  defaultDpPercent: 5,           // Minimal DP awal 5%
  defaultTenor: 20,              // Default tenor 20 tahun
  annualInterestRate: 0.05,      // Suku bunga anuitas 5.0% per tahun (0.05)
  provisionRate: 0.005,          // Biaya provisi 0.5% (0.005)
  adminFee: 500000,              // Biaya administrasi flat Rp 500.000
  
  // Pilihan Tenor
  tenors: [
    { value: 5, label: '5 Tahun (60 Bulan)' },
    { value: 10, label: '10 Tahun (120 Bulan)' },
    { value: 15, label: '15 Tahun (180 Bulan)' },
    { value: 20, label: '20 Tahun (240 Bulan)' },
  ],
  
  // Visual & Media
  image: '/assets/images/rumah-3d.webp', // Foto latar belakang hunian
  
  // Bank Partner
  bankPartner: {
    name: 'Bank BCA',
    logo: '/assets/images/bank/bca.webp',
  },
  
  // Metrik Ringkasan
  metrics: [
    { label: 'Bunga KPR', value: '5.0% p.a.' },
    { label: 'Uang Muka', value: 'Mulai 5%' },
    { label: 'Tenor KPR', value: 's/d 20 Thn' },
  ],
  
  // WhatsApp Configuration
  whatsappNumber: '6281234567890', // Nomor WhatsApp Marketing (tanpa tanda +)
  whatsappTemplate: 'Halo tim marketing, saya melakukan simulasi cicilan di website dengan rincian:\n- Harga Rumah: {harga}\n- Uang Muka: {dp} ({dpPercent}%)\n- Plafon KPR: {plafon}\n- Tenor: {tenor} Tahun\n- Estimasi Cicilan: {cicilan}/bulan\n\nBoleh bantu info ketersediaan unit dan persyaratannya?',
  
  footnote: '*Simulasi cicilan bunga anuitas 5% ini khusus berlaku untuk KPR Bank BCA. Persetujuan kredit dan biaya riil mengikuti ketentuan bank.',
  ctaLabel: 'Konsultasi Simulasi via WhatsApp',
};
```

---

## 4. Formula Matematika & Logika Inti (The Math & Core Logic)

### 4.1 Rumus Bunga Anuitas Bulanan (EMI)

$$A = P \times \frac{r(1 + r)^n}{(1 + r)^n - 1}$$

- $P$ = Plafon Kredit = $\text{Harga Jual} - \text{Nominal Uang Muka}$
- $i$ = Suku Bunga Tahunan (desimal, cth: $5\% = 0.05$)
- $r$ = Suku Bunga Bulanan = $\frac{i}{12} = \frac{0.05}{12} \approx 0.0041666667$
- $n$ = Jumlah Bulan = $\text{Tenor (Tahun)} \times 12$

#### Fungsi JavaScript Murni:
```javascript
function calculateMonthlyInstallment(plafon, annualInterestRate, tenorYears) {
  if (plafon <= 0) return 0;
  const n = tenorYears * 12;
  if (annualInterestRate <= 0) return Math.round(plafon / n);
  
  const r = annualInterestRate / 12;
  const factor = Math.pow(1 + r, n);
  const emi = plafon * (r * factor) / (factor - 1);
  return Math.round(emi);
}
```

### 4.2 Helper Format Rupiah
```javascript
function formatCurrency(val) {
  if (val === null || val === undefined || isNaN(val)) return 'Rp 0';
  return 'Rp ' + Math.round(val).toLocaleString('id-ID');
}
```

### 4.3 Logika Sinkronisasi Dua Arah Uang Muka (DP)
```javascript
// 1. Saat pengguna mengetik harga rumah manual
function onPriceInput(digitsOnlyString, currentDpPercent) {
  const price = parseInt(digitsOnlyString, 10) || 0;
  const dpNominal = Math.round(price * (currentDpPercent / 100));
  return { price, dpNominal };
}

// 2. Saat pengguna mengetik nominal DP dalam Rupiah
function onDpNominalInput(digitsOnlyString, currentPrice) {
  const dpNominal = parseInt(digitsOnlyString, 10) || 0;
  let dpPercent = 0;
  if (currentPrice > 0) {
    const pct = (dpNominal / currentPrice) * 100;
    dpPercent = Math.min(100, Math.max(0, Number(pct.toFixed(1))));
  }
  return { dpNominal, dpPercent };
}

// 3. Saat pengguna mengetik persentase DP atau menggeser slider
function onDpPercentChange(newPercent, currentPrice) {
  let pct = parseFloat(newPercent);
  if (isNaN(pct)) pct = 0;
  if (pct > 95) pct = 95;
  if (pct < 0) pct = 0;
  const dpNominal = Math.round(currentPrice * (pct / 100));
  return { dpPercent: pct, dpNominal };
}
```

### 4.4 Generator URL WhatsApp Dinamis
```javascript
function generateWhatsAppUrl(phone, template, data) {
  let message = template;
  for (const [key, val] of Object.entries(data)) {
    message = message.replaceAll(`{${key}}`, val);
  }
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
```

---

## 5. Kode Komponen Lengkap Siap Pakai (`MortgageCalculator.vue`)

Komponen Single-File Component (SFC) berikut sudah **self-contained**. Anda dapat langsung menyalin file ini ke proyek Anda di `components/MortgageCalculator.vue`:

```vue
<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

// Default Configuration Fallback
const defaultConfig = {
  eyebrow: 'Simulasi Angsuran',
  titleLines: ['Hitung Simulasi', 'Cicilan Rumah Anda'],
  subtitle: 'Rencanakan pembelian rumah impian Anda dengan mudah menggunakan kalkulator cicilan berikut.',
  defaultPrice: 166000000,
  defaultDpPercent: 5,
  defaultTenor: 20,
  annualInterestRate: 0.05,
  provisionRate: 0.005,
  adminFee: 500000,
  tenors: [
    { value: 5, label: '5 Tahun (60 Bulan)' },
    { value: 10, label: '10 Tahun (120 Bulan)' },
    { value: 15, label: '15 Tahun (180 Bulan)' },
    { value: 20, label: '20 Tahun (240 Bulan)' },
  ],
  image: '',
  bankPartner: {
    name: 'Bank BCA',
    logo: '',
  },
  metrics: [
    { label: 'Bunga KPR', value: '5.0% p.a.' },
    { label: 'Uang Muka', value: 'Mulai 5%' },
    { label: 'Tenor KPR', value: 's/d 20 Thn' },
  ],
  whatsappNumber: '6281234567890',
  whatsappTemplate: 'Halo tim marketing, saya melakukan simulasi cicilan di website dengan rincian:\n- Harga Rumah: {harga}\n- Uang Muka: {dp} ({dpPercent}%)\n- Plafon KPR: {plafon}\n- Tenor: {tenor} Tahun\n- Estimasi Cicilan: {cicilan}/bulan\n\nBoleh bantu info ketersediaan unit dan persyaratan pengajuan KPR-nya?',
  footnote: '*Simulasi cicilan bunga anuitas 5% ini khusus berlaku untuk KPR Bank BCA. Persetujuan kredit dan biaya riil mengikuti ketentuan bank.',
  ctaLabel: 'Konsultasi Simulasi via WhatsApp',
};

const c = computed(() => ({ ...defaultConfig, ...props.config }));

// Reactive State
const price = ref(c.value.defaultPrice);
const dpPercent = ref(c.value.defaultDpPercent);
const dpNominal = ref(Math.round(price.value * (dpPercent.value / 100)));
const tenorYears = ref(c.value.defaultTenor);
const showBreakdown = ref(false);

// Format Rupiah
function formatCurrency(val) {
  if (val === null || val === undefined || isNaN(val)) return 'Rp 0';
  return 'Rp ' + Math.round(val).toLocaleString('id-ID');
}

const formattedPrice = computed(() => {
  return price.value > 0 ? price.value.toLocaleString('id-ID') : '';
});

const formattedDpNominal = computed(() => {
  return dpNominal.value > 0 ? dpNominal.value.toLocaleString('id-ID') : '';
});

// Event Handlers
function onPriceInput(e) {
  const digits = e.target.value.replace(/\D/g, '');
  const num = digits ? parseInt(digits, 10) : 0;
  price.value = num;
  dpNominal.value = Math.round(num * (dpPercent.value / 100));
}

function clearPrice() {
  price.value = 0;
  dpNominal.value = 0;
  dpPercent.value = 0;
}

function onDpNominalInput(e) {
  const digits = e.target.value.replace(/\D/g, '');
  const num = digits ? parseInt(digits, 10) : 0;
  dpNominal.value = num;
  if (price.value > 0) {
    const pct = (num / price.value) * 100;
    dpPercent.value = Math.min(100, Math.max(0, Number(pct.toFixed(1))));
  } else {
    dpPercent.value = 0;
  }
}

function onDpPercentInput(e) {
  let pct = parseFloat(e.target.value);
  if (isNaN(pct)) pct = 0;
  if (pct > 95) pct = 95;
  if (pct < 0) pct = 0;
  dpPercent.value = pct;
  dpNominal.value = Math.round(price.value * (pct / 100));
}

function onSliderInput(e) {
  const pct = Number(e.target.value);
  dpPercent.value = pct;
  dpNominal.value = Math.round(price.value * (pct / 100));
}

// Computations
const plafon = computed(() => Math.max(0, price.value - dpNominal.value));

const monthlyInstallment = computed(() => {
  const P = plafon.value;
  if (P <= 0) return 0;
  const annualRate = c.value.annualInterestRate ?? 0.05;
  const years = tenorYears.value || 20;
  const n = years * 12;
  if (annualRate <= 0) return Math.round(P / n);
  
  const r = annualRate / 12;
  const factor = Math.pow(1 + r, n);
  const emi = P * (r * factor) / (factor - 1);
  return Math.round(emi);
});

const provisionFee = computed(() => {
  const rate = c.value.provisionRate ?? 0.005;
  return Math.round(plafon.value * rate);
});

const adminFee = computed(() => {
  return plafon.value > 0 ? (c.value.adminFee ?? 500000) : 0;
});

const totalInitialFee = computed(() => {
  if (plafon.value <= 0) return 0;
  return monthlyInstallment.value + provisionFee.value + adminFee.value;
});

// Dynamic WhatsApp link
const waConsultLink = computed(() => {
  const template = c.value.whatsappTemplate;
  const map = {
    harga: formatCurrency(price.value),
    dp: formatCurrency(dpNominal.value),
    dpPercent: dpPercent.value,
    plafon: formatCurrency(plafon.value),
    tenor: tenorYears.value,
    cicilan: formatCurrency(monthlyInstallment.value),
  };
  let message = template;
  for (const [key, val] of Object.entries(map)) {
    message = message.replaceAll(`{${key}}`, val);
  }
  const phone = (c.value.whatsappNumber || '').replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
});
</script>

<template>
  <section class="calc-section relative py-20 lg:py-24 scroll-mt-20 overflow-hidden bg-[var(--paper,#f6f5f1)]" id="kalkulator">
    <!-- Background Image with Fade Effect -->
    <div v-if="c.image" class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <img
        :src="c.image"
        alt=""
        aria-hidden="true"
        class="h-full w-full object-cover object-center opacity-10 lg:opacity-15"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[var(--paper,#f6f5f1)] via-transparent to-[var(--paper,#f6f5f1)]"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
      <!-- Section Heading -->
      <div class="mb-10 lg:mb-12">
        <div class="max-w-2xl">
          <span v-if="c.eyebrow" class="inline-block text-xs font-bold tracking-widest uppercase text-[var(--green,#2d5a3f)] mb-3">
            {{ c.eyebrow }}
          </span>
          <h2 class="text-3xl sm:text-4xl lg:text-[42px] font-serif leading-tight text-[var(--ink,#1e2420)] mb-3">
            {{ c.titleLines?.[0] || 'Hitung Simulasi' }}<br>
            <em class="italic">{{ c.titleLines?.[1] || 'Cicilan Rumah Anda' }}</em>
          </h2>
          <p class="text-xs sm:text-sm text-[var(--muted,#6b726d)] leading-relaxed">
            {{ c.subtitle }}
          </p>
        </div>
      </div>

      <!-- SATU Card Landscape 2 Kolom -->
      <div class="bg-[var(--white,#ffffff)] border border-[var(--line,#e3e1da)] rounded-[26px] p-6 sm:p-8 lg:p-10 shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <!-- Kolom 1 (Kiri): Input Data (6 Col) -->
          <div class="lg:col-span-6 space-y-6">
            <!-- 1. Input Harga Rumah -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="calc-price-input" class="text-xs sm:text-[13px] font-bold text-[var(--ink,#1e2420)] tracking-tight">
                  Harga Rumah
                </label>
                <span v-if="price > 0" class="text-[11px] font-semibold text-[var(--green,#2d5a3f)]">
                  {{ formatCurrency(price) }}
                </span>
              </div>

              <div class="relative flex items-center">
                <div class="absolute left-4 pointer-events-none text-xs sm:text-sm font-bold text-[var(--muted,#6b726d)] select-none">
                  Rp
                </div>
                <input
                  id="calc-price-input"
                  type="text"
                  inputmode="numeric"
                  :value="formattedPrice"
                  @input="onPriceInput"
                  placeholder="0"
                  class="w-full pl-11 pr-10 py-3.5 bg-[var(--paper,#f6f5f1)]/50 border border-[var(--line,#e3e1da)] rounded-xl text-sm sm:text-base font-bold text-[var(--ink,#1e2420)] placeholder-[var(--muted,#6b726d)]/50 focus:bg-white focus:border-[var(--green,#2d5a3f)] focus:ring-2 focus:ring-[var(--green,#2d5a3f)]/20 outline-none transition-all"
                  aria-label="Harga Rumah"
                />
                <button
                  v-if="price > 0"
                  type="button"
                  @click="clearPrice"
                  class="absolute right-3.5 w-6 h-6 flex items-center justify-center rounded-full bg-[var(--line,#e3e1da)] hover:bg-[var(--muted,#6b726d)] hover:text-white text-[var(--ink,#1e2420)] text-xs transition-colors cursor-pointer"
                  aria-label="Hapus input harga"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- 2. Uang Muka (DP) Sinkronisasi Dua Arah -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="calc-dp-nominal" class="text-xs sm:text-[13px] font-bold text-[var(--ink,#1e2420)] tracking-tight">
                  Uang Muka (DP)
                </label>
                <span class="text-[11px] font-semibold text-[var(--green,#2d5a3f)]">
                  {{ dpPercent }}% ({{ formatCurrency(dpNominal) }})
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <!-- Input Nominal DP -->
                <div class="sm:col-span-8 relative flex items-center">
                  <div class="absolute left-4 pointer-events-none text-xs sm:text-sm font-bold text-[var(--muted,#6b726d)] select-none">
                    Rp
                  </div>
                  <input
                    id="calc-dp-nominal"
                    type="text"
                    inputmode="numeric"
                    :value="formattedDpNominal"
                    @input="onDpNominalInput"
                    placeholder="0"
                    class="w-full pl-11 pr-4 py-3.5 bg-[var(--paper,#f6f5f1)]/50 border border-[var(--line,#e3e1da)] rounded-xl text-sm sm:text-base font-bold text-[var(--ink,#1e2420)] placeholder-[var(--muted,#6b726d)]/50 focus:bg-white focus:border-[var(--green,#2d5a3f)] focus:ring-2 focus:ring-[var(--green,#2d5a3f)]/20 outline-none transition-all"
                    aria-label="Uang Muka Nominal"
                  />
                </div>

                <!-- Input Persentase DP -->
                <div class="sm:col-span-4 relative flex items-center">
                  <input
                    id="calc-dp-percent"
                    type="number"
                    min="0"
                    max="95"
                    step="0.5"
                    :value="dpPercent"
                    @input="onDpPercentInput"
                    placeholder="0"
                    class="w-full pl-4 pr-8 py-3.5 bg-[var(--paper,#f6f5f1)]/50 border border-[var(--line,#e3e1da)] rounded-xl text-sm sm:text-base font-bold text-[var(--ink,#1e2420)] placeholder-[var(--muted,#6b726d)]/50 focus:bg-white focus:border-[var(--green,#2d5a3f)] focus:ring-2 focus:ring-[var(--green,#2d5a3f)]/20 outline-none transition-all text-right sm:text-center"
                    aria-label="Persentase DP"
                  />
                  <div class="absolute right-4 pointer-events-none text-xs sm:text-sm font-bold text-[var(--muted,#6b726d)] select-none">
                    %
                  </div>
                </div>
              </div>

              <!-- Slider Range (5% - 90%) -->
              <div class="mt-3.5 px-1">
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="1"
                  :value="dpPercent"
                  @input="onSliderInput"
                  class="w-full h-2 bg-[var(--paper-deep,#e8e6df)] rounded-lg appearance-none cursor-pointer accent-[var(--green,#2d5a3f)]"
                  aria-label="Slider Persentase Uang Muka"
                />
                <div class="flex justify-between text-[10px] sm:text-[11px] font-semibold text-[var(--muted,#6b726d)] mt-1.5">
                  <span>5% Min DP</span>
                  <span>50%</span>
                  <span>90% Max DP</span>
                </div>
              </div>
            </div>

            <!-- 3. Tenor Pinjaman -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="calc-tenor-select" class="text-xs sm:text-[13px] font-bold text-[var(--ink,#1e2420)] tracking-tight">
                  Jangka Waktu Pinjaman
                </label>
                <span class="text-[11px] font-semibold text-[var(--green,#2d5a3f)]">
                  {{ tenorYears }} Tahun ({{ tenorYears * 12 }} Bulan)
                </span>
              </div>

              <div class="relative">
                <select
                  id="calc-tenor-select"
                  v-model.number="tenorYears"
                  class="w-full appearance-none px-4 py-3.5 bg-[var(--paper,#f6f5f1)]/50 border border-[var(--line,#e3e1da)] rounded-xl text-sm sm:text-base font-bold text-[var(--ink,#1e2420)] focus:bg-white focus:border-[var(--green,#2d5a3f)] focus:ring-2 focus:ring-[var(--green,#2d5a3f)]/20 outline-none cursor-pointer transition-all pr-10"
                  aria-label="Jangka Waktu Pinjaman"
                >
                  <option
                    v-for="t in c.tenors"
                    :key="t.value"
                    :value="t.value"
                  >
                    {{ t.label }}
                  </option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--green,#2d5a3f)] text-xs font-bold">
                  ▼
                </div>
              </div>
            </div>
          </div>

          <!-- Kolom 2 (Kanan): Plafon, Box Cicilan, Metrics, Biaya Akad, WhatsApp CTA (6 Col) -->
          <div class="lg:col-span-6 space-y-5 lg:border-l lg:border-[var(--line,#e3e1da)] lg:pl-10">
            <!-- Plafon Pinjaman -->
            <div class="flex items-center justify-between pb-3 border-b border-[var(--line,#e3e1da)] text-xs sm:text-sm">
              <span class="text-[var(--muted,#6b726d)] font-medium">Plafon Pembiayaan KPR</span>
              <span class="text-[var(--ink,#1e2420)] font-bold text-sm sm:text-base">{{ formatCurrency(plafon) }}</span>
            </div>

            <!-- Box Estimasi Cicilan -->
            <div class="p-5 sm:p-6 rounded-2xl bg-[var(--sage-pale,#eaf1ec)] border border-[var(--green-soft,#c8d8cd)] text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
              <div>
                <span class="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[var(--green-deep,#1e3f2c)]">
                  Estimasi Cicilan per Bulan
                </span>
                <div class="flex items-baseline justify-center sm:justify-start gap-1.5 mt-1">
                  <span class="font-serif text-3xl sm:text-4xl text-[var(--green-deep,#1e3f2c)] font-bold tracking-tight">
                    {{ formatCurrency(monthlyInstallment) }}
                  </span>
                  <span class="text-xs sm:text-sm font-semibold text-[var(--muted,#6b726d)]">
                    /bulan
                  </span>
                </div>
              </div>
              <div class="mt-3 sm:mt-0 flex justify-center">
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-white text-[var(--green-deep,#1e3f2c)] shadow-sm">
                  <span>Bunga 5% Anuitas</span>
                </span>
              </div>
            </div>

            <!-- 3 Metrics Grid -->
            <div
              v-if="c.metrics && c.metrics.length"
              class="p-4 rounded-xl bg-[var(--paper,#f6f5f1)] border border-[var(--line,#e3e1da)] grid grid-cols-3 gap-2 text-center divide-x divide-[var(--line,#e3e1da)]"
            >
              <div v-for="metric in c.metrics" :key="metric.label" class="first:pl-0 px-2 last:pr-0">
                <span class="block text-[10px] uppercase font-bold tracking-wider text-[var(--muted,#6b726d)]">{{ metric.label }}</span>
                <strong class="block text-xs sm:text-sm font-bold text-[var(--green-deep,#1e3f2c)] mt-0.5">{{ metric.value }}</strong>
              </div>
            </div>

            <!-- Collapsible Biaya Akad Awal -->
            <div>
              <button
                type="button"
                @click="showBreakdown = !showBreakdown"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--green,#2d5a3f)] hover:text-[var(--green-deep,#1e3f2c)] transition-colors py-1 cursor-pointer"
                :aria-expanded="showBreakdown"
              >
                <span>{{ showBreakdown ? 'Tutup Rincian Biaya Akad Awal ▴' : 'Lihat Rincian Biaya Akad Awal ▾' }}</span>
              </button>

              <div
                v-show="showBreakdown"
                class="mt-3 p-4 rounded-xl bg-[var(--paper,#f6f5f1)]/70 border border-[var(--line,#e3e1da)] space-y-2.5 text-xs transition-all"
              >
                <div class="flex justify-between items-center text-[var(--muted,#6b726d)]">
                  <span>Provisi Bank (0.5%)</span>
                  <span class="font-semibold text-[var(--ink,#1e2420)]">{{ formatCurrency(provisionFee) }}</span>
                </div>
                <div class="flex justify-between items-center text-[var(--muted,#6b726d)]">
                  <span>Administrasi Bank</span>
                  <span class="font-semibold text-[var(--ink,#1e2420)]">{{ formatCurrency(adminFee) }}</span>
                </div>
                <div class="flex justify-between items-center pt-2.5 border-t border-[var(--line,#e3e1da)] font-bold text-[var(--ink,#1e2420)] text-xs sm:text-sm">
                  <span>Total Estimasi Biaya Pertama</span>
                  <span class="text-[var(--green-deep,#1e3f2c)] text-sm sm:text-base">{{ formatCurrency(totalInitialFee) }}</span>
                </div>
                <p class="text-[10.5px] text-[var(--muted,#6b726d)] leading-relaxed pt-1">
                  *Estimasi biaya awal mencakup angsuran pertama, provisi bank, dan biaya administrasi.
                </p>
              </div>
            </div>

            <!-- WhatsApp CTA Button -->
            <div class="pt-2">
              <a
                :href="waConsultLink"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-4 px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-full bg-[var(--green,#2d5a3f)] hover:bg-[var(--green-deep,#1e3f2c)] text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>{{ c.ctaLabel }}</span>
                <span class="text-base leading-none">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Pill Logo Bank & Disclaimer di Luar Card -->
      <div v-if="c.footnote" class="mt-8 flex justify-center">
        <div class="inline-flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 px-5 py-2.5 sm:py-2 rounded-2xl sm:rounded-full bg-[var(--white,#ffffff)]/80 backdrop-blur-sm border border-[var(--line,#e3e1da)] shadow-sm max-w-[820px] text-center sm:text-left">
          <div v-if="c.bankPartner?.logo" class="shrink-0 flex items-center justify-center">
            <img
              :src="c.bankPartner.logo"
              :alt="c.bankPartner.name || 'Bank Partner'"
              class="h-5 sm:h-6 w-auto object-contain"
              loading="lazy"
            />
          </div>
          <span v-if="c.bankPartner?.logo" class="hidden sm:block h-3.5 w-px bg-[var(--line,#e3e1da)] shrink-0" aria-hidden="true"></span>
          <p class="text-[11px] sm:text-xs leading-relaxed text-[var(--muted,#6b726d)]">
            {{ c.footnote }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--green, #2d5a3f);
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--green, #2d5a3f);
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.15);
}
</style>
```

---

## 6. Panduan Kustomisasi di Proyek Baru

### 6.1 Mengubah Suku Bunga Pinjaman (Subsidi vs Komersial)
Di konfigurasi props atau data:
- **KPR Subsidi FLPP (Flat):** `annualInterestRate: 0.05` ($5\%$).
- **KPR Komersial Promo (Fixed awal):** `annualInterestRate: 0.0375` ($3.75\%$) atau `annualInterestRate: 0.075` ($7.5\%$).
- Jangan lupa perbarui teks badge dan metrik:
  ```javascript
  {
    annualInterestRate: 0.075,
    metrics: [
      { label: 'Bunga KPR', value: '7.5% p.a.' },
      // ...
    ]
  }
  ```

### 6.2 Mengganti Mitra Bank & Logo
Ganti logo dan nama bank pada objek `bankPartner`:
```javascript
bankPartner: {
  name: 'Bank Mandiri',
  logo: '/assets/images/bank/mandiri.webp',
}
```
Dan sesuaikan teks disclaimer:
```javascript
footnote: '*Simulasi cicilan bunga anuitas 5% ini khusus berlaku untuk program KPR Bank Mandiri. Persetujuan kredit dan suku bunga riil mengikuti ketentuan bank.'
```

### 6.3 Menyesuaikan Nomor WhatsApp & Template Pesan
Ubah `whatsappNumber` dengan format nomor internasional tanpa `+`:
```javascript
whatsappNumber: '6285721112233',
whatsappTemplate: 'Halo tim marketing {namaProyek}, saya tertarik simulasi KPR:\n- Harga: {harga}\n- DP: {dp} ({dpPercent}%)\n- Plafon: {plafon}\n- Tenor: {tenor} Thn\n- Angsuran: {cicilan}/bln\nMohon informasi ketersediaan unit.'
```

### 6.4 Menyesuaikan Batas Slider Uang Muka
Jika program perumahan Anda mewajibkan minimal DP 10% atau 20%:
Ubah atribut `min` dan `max` pada `<input type="range">`:
```html
<input
  type="range"
  min="10"
  max="80"
  step="1"
  :value="dpPercent"
  @input="onSliderInput"
/>
```
Serta perbarui label rentang di bawah slider:
```html
<div class="flex justify-between text-[11px] font-semibold text-[var(--muted)] mt-1.5">
  <span>10% Min DP</span>
  <span>50%</span>
  <span>80% Max DP</span>
</div>
```

### 6.5 Integrasi di Nuxt 3 atau Vue 3 App
Cukup panggil komponen di halaman yang diinginkan:

```vue
<template>
  <main>
    <!-- Section lain -->
    <MortgageCalculator :config="myCustomCalcConfig" />
    <!-- Section lain -->
  </main>
</template>

<script setup>
import MortgageCalculator from '~/components/MortgageCalculator.vue';

const myCustomCalcConfig = {
  defaultPrice: 250000000,
  defaultDpPercent: 10,
  defaultTenor: 15,
  annualInterestRate: 0.05,
  bankPartner: {
    name: 'Bank BTN',
    logo: '/images/btn.png',
  },
};
</script>
```

---

## 7. Rangkuman & Checklist Implementasi

| Langkah | Deskripsi | Status |
|---|---|:---:|
| 1. Salin Komponen | Salin `MortgageCalculator.vue` ke folder `components/` proyek baru | Siap Pakai |
| 2. Daftarkan Data | Siapkan objek konfigurasi harga, DP default, dan suku bunga | Opsional |
| 3. Aset Logo & Gambar | Letakkan logo bank di `public/assets/images/bank/` | Siap Pakai |
| 4. Nomor WhatsApp | Ganti `whatsappNumber` dengan nomor tim marketing aktif | Siap Pakai |
| 5. Pasang di Halaman | Import dan render komponen di template halaman utama | Siap Pakai |
