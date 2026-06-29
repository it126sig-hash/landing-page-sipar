# PRD — Landing Page Sanggar Indah Parahyangan

**Versi:** 1.1 (Fase 1)
**Pemilik:** Wen — Sanggar Indah Group
**Stack (final):** Nuxt 3 · SSG · deploy ke GitHub Pages · content-driven static-first
**Status:** Draft untuk implementasi

> **Perubahan v1.1:** Keputusan framework difinalkan → **Nuxt 3**. Mode render ditetapkan **SSG** untuk Fase 1 (deploy GitHub Pages), dan dijelaskan sebagai keputusan *deploy-time* yang tidak mengunci kode. Ditambah §X (Deployment) dan revisi §9 (Fase 2) untuk backend yang belum ditentukan (Laravel/Supabase/Firebase) serta pohon keputusan kapan SSR benar-benar dibutuhkan.

---

## 0. Keputusan arsitektur (sudah final)

### 0.1 Framework & mode render — **DIPUTUSKAN**

- **Framework: Nuxt 3** (tetap Vue 3 — komponen & composable sama persis seperti Vue biasa).
- **Fase 1: SSG** (`nuxt generate` / preset `github_pages`) → deploy ke **GitHub Pages** (gratis, tanpa server).
- **Mode render bukan keputusan yang mengunci kode.** Di Nuxt, beralih SSG ↔ SSR hanya mengubah preset/config saat deploy; komponen & data nol perubahan. Maka keputusan SSR ditunda sampai ada kebutuhan nyata (lihat §9).

**Kenapa SSG, bukan SSR, untuk SEO:** yang menentukan SEO adalah *apakah HTML sudah ter-render saat crawler datang*, bukan *apakah ada server*.

| Mode | Yang diterima crawler | SEO | Kebutuhan server |
|---|---|---|---|
| CSR (Vue SPA murni) | HTML kosong, konten muncul setelah JS | **Buruk** — dihindari | Tidak |
| **SSG (Nuxt → GitHub Pages)** | HTML lengkap, dirender saat build | **Bagus** | **Tidak** |
| SSR | HTML lengkap, dirender per-request | Bagus | Ya (Node hidup) |

SSG dan SSR **sama baiknya untuk SEO**; bedanya hanya *kapan* HTML dibuat. Yang memberi penalti SEO adalah CSR/SPA — itu satu-satunya yang dihindari. Jadi GitHub Pages + SSG = manfaat SEO penuh, jalur termurah, tanpa server.

### 0.2 "Satu variable" → "satu modul konten + satu composable akses"

Objek global mentah tidak otomatis "siap dinamis". Yang membuatnya siap DB adalah *lapisan akses*:

```
data/content.js   ← SATU sumber kebenaran (Fase 1: statis; mudah diedit non-dev)
      ▼
composables/useContent.js   ← SEAM. Komponen hanya tahu composable ini.
      ▼
komponen (Hero, Reasons, HouseTypes, ...)
```

Fase 2: isi `useContent()` cukup diubah dari `import` statis → `await $fetch('/api/content')` (atau query Supabase/Firebase). **Komponen tidak berubah.** Inilah arti "siap dinamis" yang sebenarnya.

### 0.3 Hilangkan duplikasi nilai akses

Satu array kanonik `accessPoints`; hero chips, reasons, dan location cards **diturunkan** darinya, tidak diketik ulang. Edit "15 menit ke KBP" sekali → konsisten di semua tempat.

### 0.4 Spesifikasi per-tipe, bukan global

`defaultSpecs` + override per tipe. Memperbaiki bug sample (specs global padahal `kt`/`km` berbeda per tipe).

### 0.5 Gap konversi (requirement, bukan opsional)

Landing page beriklan tanpa tracking = ROI tak terukur, tanpa audiens retargeting. Lihat §7. Tetap kompatibel "static" Fase 1 (tracking tidak butuh DB).

---

## 1. Tujuan & ruang lingkup

### 1.1 Tujuan produk
Landing page pemasaran perumahan Sanggar Indah Parahyangan: menampilkan nilai jual & tipe rumah, mengarahkan calon pembeli ke WhatsApp / lead form, dan terukur konversinya.

### 1.2 Tujuan teknis
- Static-first (Fase 1, tanpa DB) tapi **content-driven** → setiap nilai siap dinamis tanpa refactor komponen.
- Konten terpusat di **satu sumber** berskema jelas, mudah diisi tanpa coding.
- Komponen reusable di level yang tepat (hindari over-engineering).
- Ter-render penuh untuk SEO (SSG).

### 1.3 Di luar lingkup Fase 1
Koneksi DB/BaaS, CMS, modul artikel/blog, multi-halaman, multi-bahasa, autentikasi admin → **Fase 2** (§9).

### 1.4 Non-goals
Bukan aplikasi (no login user, no dashboard). Tidak ada pembayaran online.

---

## 2. Pengguna & success metrics

**Pengguna:** calon pembeli rumah (mayoritas mobile; dari Meta/Google Ads & share WhatsApp).

**Metrik sukses (Fase 1):**
- CTR ke WhatsApp / submit lead form (event ter-track).
- LCP < 2.5s (4G mobile), Lighthouse Performance ≥ 90, SEO ≥ 95.
- Bounce & scroll depth per section.

---

## 3. Arsitektur konten (inti)

### 3.1 Prinsip
1. **Satu file** `data/content.js` = satu-satunya tempat edit konten.
2. Komponen **tidak pernah** hardcode teks/angka jualan; selalu via `useContent()`.
3. Nilai yang dipakai >1 tempat **diturunkan**, tidak diduplikasi.
4. Setiap entitas punya `id` stabil → kandidat primary key saat masuk DB.

### 3.2 Skema konten (Fase 1)

> Struktur ini sengaja 1:1 dengan tabel DB Fase 2. `id` = kandidat PK. Array = kandidat tabel relasional.

```js
// data/content.js
export default {
  meta: {
    projectName: 'Sanggar Indah Parahyangan',
    developer: 'Sanggar Indah Group',
    logo: '/assets/logo.png',
    tagline: 'Hunian nyaman dekat Kota Baru Parahyangan',
    priceFrom: 'Mulai 160 Juta-an',
    whatsapp: {
      number: '6285795903747',
      templates: {
        konsultasi: 'Halo, saya ingin konsultasi & survey lokasi {project}.',
        simulasi:   'Halo, saya mau tanya simulasi cicilan flat {project}.',
        survey:     'Halo, saya ingin booking survey lokasi {project}.',
        type:       'Halo, saya tertarik dengan {type} di {project}. Boleh info lengkap & harga?',
      },
    },
    nav: [
      { id: 'alasan', label: 'Alasan' },
      { id: 'cicilan', label: 'Cicilan' },
      { id: 'tipe', label: 'Tipe Rumah' },
      { id: 'lokasi', label: 'Lokasi' },
      { id: 'faq', label: 'FAQ' },
    ],
  },

  // ── SUMBER KANONIK untuk semua klaim "X menit ke Y" ──────────────
  // hero chips, reasons, dan location cards DITURUNKAN dari sini.
  accessPoints: [
    { id: 'kbp',    minutes: 15,   place: 'Kota Baru Parahyangan', sub: 'Pusat kawasan & bisnis Bandung Barat.', inHero: true,  inReasons: true,  inLocation: true },
    { id: 'tol',    minutes: 20,   place: 'Tol Padalarang',        sub: 'Akses cepat ke seluruh Bandung Raya.',    inHero: true,  inReasons: true,  inLocation: true },
    { id: 'kcic',   minutes: 30,   place: 'Stasiun KCIC Whoosh',   sub: 'Kereta cepat ke Jakarta.',                inHero: true,  inReasons: true,  inLocation: true },
    { id: 'publik', minutes: null, place: 'Fasilitas Publik',      sub: 'Sekolah, RS, pasar, minimarket.',         inHero: false, inReasons: true,  inLocation: false },
  ],

  hero: {
    headline: 'Rumah Impian di Kawasan yang Terus Bertumbuh',
    sub: 'One Gate System · Cicilan Flat · Dekat KBP & KCIC',
    primaryTypeId: '22-60',           // tipe untuk hero specs
    extraChips: [{ id: 'gate', label: 'One Gate System' }],
  },

  // ── TIPE RUMAH ───────────────────────────────────────────────────
  defaultSpecs: [
    { label: 'Pondasi',  value: 'Batu Kali' },
    { label: 'Struktur', value: 'Beton Bertulang' },
    { label: 'Dinding',  value: 'Bata Interlock' },
    { label: 'Lantai',   value: 'Keramik' },
    { label: 'Atap',     value: 'Genteng Beton' },
    { label: 'Kusen',    value: 'Aluminium' },
    { label: 'Pintu',    value: 'Kayu Panel' },
    { label: 'Listrik',  value: '900 VA' },
    { label: 'Air',      value: 'PAM Desa / Sumur' },
  ],
  houseTypes: [
    { id: '22-60', name: 'Tipe 22/60', lb: '22', lt: '60', kt: '1', km: '1',
      tag: 'Paling Terjangkau', priceFrom: '160 Jt-an',
      gallery: ['/assets/types/22-60-1.webp'], specsOverride: [] },
    { id: '26-72', name: 'Tipe 26/72', lb: '26', lt: '72', kt: '2', km: '1',
      tag: 'Favorit Keluarga', priceFrom: '—',
      gallery: ['/assets/types/26-72-1.webp'],
      specsOverride: [{ label: 'Listrik', value: '1300 VA' }] },   // contoh override
    { id: '31-72', name: 'Tipe 31/72', lb: '31', lt: '72', kt: '2', km: '1',
      tag: 'Paling Lega', priceFrom: '—',
      gallery: ['/assets/types/31-72-1.webp'], specsOverride: [] },
  ],

  // ── SECTION KONTEN (array = mudah diisi, mudah jadi tabel) ────────
  oneGate: [
    { id: 'akses',    title: 'Akses Masuk Terkontrol',   desc: 'Satu pintu gerbang dengan pengawasan terpusat.' },
    { id: 'aman',     title: 'Keamanan Lebih Baik',      desc: 'Lingkungan terjaga 24 jam, lebih tenang.' },
    { id: 'privasi',  title: 'Privasi Penghuni Terjaga', desc: 'Hanya warga & tamu terdaftar yang masuk.' },
    { id: 'keluarga', title: 'Nyaman untuk Keluarga',    desc: 'Lingkungan eksklusif, aman untuk anak.' },
  ],

  installment: {
    headline: 'Rumah Impian Tidak Harus Menunggu',
    points: ['Proses mudah', 'DP ringan', 'Cicilan flat sepanjang tenor', 'Cocok keluarga muda'],
  },

  facilities: ['IKEA', 'XXI Cinema', 'Rumah Sakit', 'Parahyangan Golf', 'Destinasi Wisata'],

  invest: [
    { id: 'i1', title: 'Kawasan yang terus berkembang',     desc: 'Dekat pusat pertumbuhan ekonomi baru.' },
    { id: 'i2', title: 'Didukung infrastruktur berkembang', desc: 'Meningkatkan kenyamanan & nilai investasi.' },
    { id: 'i3', title: 'Terhubung akses utama',             desc: 'Mobilitas mudah ke berbagai pusat aktivitas.' },
    { id: 'i4', title: 'Potensi nilai properti meningkat',  desc: 'Nilai aset berpotensi terus naik.' },
  ],

  demand: [
    { id: 'd1', stat: '15 mnt', title: 'Magnet Kota Baru Parahyangan', desc: 'Pertumbuhan hunian & bisnis di KBP menaikkan minat kawasan.' },
    { id: 'd2', stat: 'Whoosh', title: 'Efek Kereta Cepat',            desc: 'Kehadiran KCIC mempercepat pertumbuhan nilai properti.' },
    { id: 'd3', stat: '1 Jt-an',title: 'Subsidi Rasa Komersil',        desc: 'Harga subsidi dengan kualitas komersil, incaran keluarga muda.' },
  ],

  faqs: [
    { id: 'f1', question: 'Siapa pengembangnya?',         answer: 'Sanggar Indah Group.' },
    { id: 'f2', question: 'Berapa harganya?',             answer: 'Mulai 160 Juta-an. Hubungi sales untuk jadwal survey & show unit.' },
    { id: 'f3', question: 'Bagaimana cara pembeliannya?', answer: 'Bisa KPR maupun cash keras.' },
    { id: 'f4', question: 'Jenis sertifikatnya apa?',     answer: 'SHGB, bisa ditingkatkan ke SHM.' },
    { id: 'f5', question: 'Bank apa yang bekerja sama?',  answer: 'BTN dan BCA.' },
    { id: 'f6', question: 'Kapan serah terima unit?',     answer: 'Setelah pembangunan selesai dan akad kredit.' },
  ],

  finalCta: {
    headline: 'Wujudkan Rumah Impian Anda Sekarang',
    chips: ['Cicilan Flat', 'One Gate System', 'Dekat KBP', 'Dekat KCIC'],
  },

  footer: { /* alamat, kontak, sosial — diisi nanti */ },
};
```

### 3.3 Data turunan (derived) — di composable, bukan di data file

```js
// composables/useContent.js (inti seam)
import content from '~/data/content';

export function useContent() {
  const project = content.meta.projectName;

  const wa = (key, vars = {}) => {
    const tpl = content.meta.whatsapp.templates[key];
    const msg = tpl.replace('{project}', project).replace('{type}', vars.type || '');
    return `https://wa.me/${content.meta.whatsapp.number}?text=${encodeURIComponent(msg)}`;
  };

  const heroChips = [
    ...content.hero.extraChips,
    ...content.accessPoints.filter(a => a.inHero)
      .map(a => ({ id: a.id, label: `${a.minutes} mnt ke ${a.place}` })),
  ];

  const reasons = content.accessPoints.filter(a => a.inReasons).map((a, i) => ({
    id: a.id, num: String(i + 1),
    title: `Dekat ${a.place}`,
    desc: a.minutes ? `Hanya ${a.minutes} menit. ${a.sub}` : a.sub,
  }));

  const locations = content.accessPoints.filter(a => a.inLocation)
    .map(a => ({ id: a.id, time: a.minutes, place: a.place, sub: a.sub }));

  const houseTypes = content.houseTypes.map(t => ({
    ...t,
    specs: mergeSpecs(content.defaultSpecs, t.specsOverride, t),
    waLink: wa('type', { type: t.name }),
  }));

  return { content, wa, heroChips, reasons, locations, houseTypes };
}
```

> Edit angka akses **satu kali** di `accessPoints` → otomatis benar di hero, reasons, dan location. Konsistensi dijamin struktur, bukan kedisiplinan saat mengisi.

---

## 4. Arsitektur komponen

### 4.1 Prinsip reusability
Reusable di level **primitive** & **wrapper**, bukan memaksa tiap section jadi generic. Section punya komponen sendiri (layout beda); yang dibagi adalah building block-nya.

### 4.2 Daftar komponen

**Layout:** `TheHeader` · `TheFooter` · `SectionShell` (props `id`, `bg`, padding konsisten) · `SectionHeading` (eyebrow + judul + subjudul).

**Primitive (reusable):** `BaseButton` · `WhatsAppButton` (terima `messageKey` → panggil `wa()`) · `Chip` · `Badge` · `FeatureCard` (props `num`/`icon`, `title`, `desc`, `stat?` — dipakai reasons/oneGate/invest/demand) · `SpecRow`.

**Section (content-driven, baca via `useContent()`):** `HeroSection` · `ReasonsSection` · `InstallmentSection` · `OneGateSection` · `HouseTypesSection` (berisi `HouseTypeCard` + `HouseTypeModal`) · `LocationSection` · `InvestSection` · `DemandSection` · `FaqSection` (berisi `FaqItem`) · `FinalCtaSection`.

> Section mengambil *slice* datanya dari `useContent()`. Sub-card menerima data via **props** → presentational murni, gampang dites & dipakai ulang.

### 4.3 State interaktif (Fase 1, lokal)
| State | Lokasi | Fungsi |
|---|---|---|
| `selectedTypeId` | `HouseTypesSection` | tipe aktif di modal |
| `modalOpen` | `HouseTypesSection` | buka/tutup modal detail |
| `openFaqId` | `FaqSection` | accordion FAQ (single-open) |

Tidak perlu Pinia di Fase 1 (konten read-only). Pinia masuk Fase 2 jika ada CMS/cache.

---

## 5. Spesifikasi per section (mapping ke data)

1. **Header** — `meta.logo`, `meta.nav`, `WhatsAppButton(konsultasi)`.
2. **Hero** — `hero.headline/sub`, `heroChips` (derived), hero specs dari `houseTypes` by `hero.primaryTypeId`, CTA `survey`.
3. **5 Alasan** (`#alasan`) — `reasons` (derived) via `FeatureCard`.
4. **Cicilan** (`#cicilan`) — `installment.headline/points`, CTA `simulasi`.
5. **One Gate / Cluster** — `oneGate[]` via `FeatureCard`.
6. **Tipe Rumah** (`#tipe`) — `houseTypes[]` → `HouseTypeCard` (grid) + `HouseTypeModal` (specs gabungan + `waLink` per tipe).
7. **Lokasi** (`#lokasi`) — `locations` (derived) + `facilities[]`.
8. **Investasi** — `invest[]` via `FeatureCard`.
9. **Demand** — `demand[]` via `FeatureCard` (varian `stat`).
10. **FAQ** (`#faq`) — `faqs[]` → `FaqItem` accordion.
11. **Final CTA** — `finalCta.headline/chips`, CTA `survey`.
12. **Footer** — `meta` + `footer`.

---

## 6. Desain visual & responsif
- **Mobile-first.** Palet: hijau `#1C4A2A` / krem `#FBFAF6` / aksen oranye `#EE8322`. Font: `Sora` (heading), sans-serif sistem (body).
- Token warna & spacing diangkat ke CSS variables / Tailwind config (via `@nuxtjs/tailwindcss`).
- Hero = elemen LCP → wajib teroptimasi (§8).

---

## 7. Analytics & lead capture (requirement)
Tetap kompatibel "static" Fase 1.

- **GTM / Meta Pixel / GA4** di layout root (`app.vue` / `nuxt.config` head, atau modul resmi).
- **Event tracking** tiap CTA: `wa_click` (param `source` section), `type_detail_open`, `faq_open`, `cta_final_click`.
- **Lead form (opsional Fase 1, disarankan):** nama + no HP + tipe diminati. Fase 1 kirim ke Google Sheets/email/Formspree (tanpa DB). Memberi lead first-party + audiens retargeting yang WA-only tidak bisa.

---

## 8. Non-functional requirements
- **Performance:** Lighthouse ≥ 90; LCP < 2.5s (4G); gambar **WebP/AVIF + responsive `srcset` + lazy-load** (hero eager). Pertimbangkan `@nuxt/image`.
- **SEO:** title/description, OpenGraph, JSON-LD (`RealEstateListing`/`Product`), sitemap, robots. SSG memastikan semua ter-render di HTML.
- **Aksesibilitas:** kontras AA, alt text, focus state, nav keyboard untuk modal & accordion.
- **Browser:** evergreen + Safari iOS.

---

## X. Deployment (Fase 1: GitHub Pages + SSG)

### X.1 Konfigurasi Nuxt
- `nuxi generate` default-nya sudah output statis penuh. Untuk GitHub Pages, build dengan preset khusus:
  ```bash
  NUXT_APP_BASE_URL=/<nama-repo>/ npx nuxt build --preset github_pages
  ```
- **Subpath (satu-satunya bagian fiddly):** jika repo bukan `username.github.io`, URL jadi `username.github.io/<repo>/`, sehingga `baseURL` harus `/<repo>/`. Lupa = aset 404.
  - **Cara menghindari subpath:** namai repo `username.github.io` (jadi root), atau pakai **custom domain** → `baseURL` bisa diabaikan.
- Preset `github_pages` otomatis menambahkan `.nojekyll` (mencegah Jekyll menghapus folder aset Nuxt).

### X.2 GitHub Actions (deploy otomatis tiap push)
```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm install
      - run: npx nuxt build --preset github_pages
        env:
          NUXT_APP_BASE_URL: /<nama-repo>/   # hapus jika custom domain / repo username.github.io
      - uses: actions/upload-pages-artifact@v3
        with: { path: .output/public }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
Lalu Settings → Pages → Source: **GitHub Actions**.

### X.3 Mode render = keputusan deploy-time (tidak mengunci kode)
Codebase yang sama melayani semua mode:
- **Fase 1 (sekarang):** `--preset github_pages` → statis.
- **Fase 2, jika pindah ke host Node:** `nuxt build` default → SSR.
- **Hybrid (paling fleksibel):** `routeRules` per-rute di `nuxt.config` — mis. landing & blog di-`prerender`, hanya rute tertentu yang SSR/ISR.

```js
// nuxt.config — contoh hybrid (baru relevan Fase 2)
routeRules: {
  '/':        { prerender: true },
  '/blog/**': { prerender: true },
  // '/harga':  { swr: 3600 },   // contoh: revalidate tiap jam (butuh host Node)
}
```

---

## 9. Fase 2 (forward-compatibility)

Backend & waktu pengerjaan **belum ditentukan** — dan desain Fase 1 sengaja membuat keputusan-keputusan ini bisa ditunda tanpa biaya.

### 9.1 Pemetaan teknis
| Fase 2 | Cara, berkat desain Fase 1 |
|---|---|
| Sumber konten dinamis | Ganti isi `useContent()`: `import` statis → `$fetch`/query BaaS. Komponen nol perubahan. |
| Loading state | `useContent()` async → tambah skeleton di section. |
| Post artikel / blog | Nuxt `pages/blog/[slug].vue` + `@nuxt/content` (Markdown) atau API. |
| Tambah halaman | Routing Nuxt by-folder; komponen reusable dipakai ulang. |
| Admin CMS | CRUD backend untuk entitas §3.2; non-dev tak lagi edit `content.js`. |
| Multi-bahasa | `@nuxtjs/i18n`. |

### 9.2 Backend belum ditentukan — ketiganya ortogonal terhadap mode render
Laravel, Supabase, dan Firebase **semua hanya API**. Bisa dipanggil saat build (SSG), saat render server (SSR), atau dari client. Jadi ketidakpastian backend **tidak** menuntut keputusan render apa pun.
- **Laravel:** cocok jika butuh admin UI custom & logika bisnis; kamu sudah menguasainya. Butuh host yang menjalankannya.
- **Supabase / Firebase (BaaS):** Postgres/Realtime + Auth + Storage tanpa kelola server; lazim dipakai client-side/edge. Cocok jika ingin minim ops.

### 9.3 Mode render & target hosting — pohon keputusan (ditunda)
Putuskan saat Fase 2 mulai, berdasar **kebutuhan konten**, bukan kapabilitas host:

```
Apakah ADA halaman yang HARUS ter-index Google
DAN berubah lebih cepat dari yang bisa kamu rebuild?
        │
        ├─ TIDAK  → tetap SSG. Konten berubah = rebuild (push → Action ~90 dtk).
        │           Host: GitHub Pages / static host. Tanpa server. (paling murah)
        │
        └─ YA     → butuh SSR/ISR pada rute itu.
                    Host: VPS / host Node. (hindari shared cPanel Node:
                    proses hidup, RAM dibatasi, sering di-kill — sama
                    alasannya dgn memilih dompdf ketimbang Puppeteer dulu.)
```

> Untuk landing page + blog properti, cabang jawabannya hampir pasti **TIDAK** → SSG + rebuild-on-publish sudah cukup, dan kemungkinan besar **tidak butuh DB/backend sama sekali** (cukup `@nuxt/content`). Backend baru wajib jika ada non-developer yang harus mengisi konten lewat UI admin, bukan Git/Markdown.

### 9.4 Migrasi data
`data/content.js` Fase 1 = seed Fase 2 (sekali jalan ke DB/BaaS).

---

## 10. Struktur folder (Nuxt 3)

```
/
├─ data/content.js              # SATU sumber konten (Fase 1)
├─ composables/useContent.js    # seam statis↔API
├─ components/
│  ├─ layout/   (TheHeader, TheFooter, SectionShell, SectionHeading)
│  ├─ ui/       (BaseButton, WhatsAppButton, Chip, Badge, FeatureCard, SpecRow)
│  └─ sections/ (HeroSection, ReasonsSection, ... , HouseTypeCard, HouseTypeModal, FaqItem)
├─ pages/index.vue              # rakit semua section
├─ assets/                      # logo, types/*.webp
├─ public/                      # favicon, robots.txt, og-image
├─ nuxt.config.ts               # SEO, baseURL, routeRules, modul (tailwind, image, content)
└─ .github/workflows/deploy.yml # GitHub Actions (§X.2)
```

---

## 11. Acceptance criteria Fase 1
1. Semua teks/angka jualan berasal dari `data/content.js` — **nol hardcode** di komponen.
2. Ubah satu `accessPoint` → hero chip, reason, dan location card berubah otomatis.
3. Ubah satu spec/tipe → kartu & modal tipe konsisten.
4. `useContent()` satu-satunya jalur komponen mengakses konten.
5. Semua CTA WA memakai `wa()` (nomor & template tunggal).
6. Build `--preset github_pages` menghasilkan HTML ter-render (cek view-source: konten ada tanpa JS).
7. Lighthouse Perf/SEO ≥ 90; render mobile rapi.
8. Tiap CTA mengirim event analytics.
9. Tidak ada dependensi DB/jaringan untuk render konten (kecuali analytics & form opsional).

---

## 12. Keputusan terbuka
| # | Isu | Default PRD | Perlu konfirmasi |
|---|---|---|---|
| 1 | Lead form Fase 1 | Disarankan ada (Sheets/email) | Ikutkan sekarang? |
| 2 | Harga per tipe | Hanya 22/60 yang ada angka | Lengkapi harga tipe lain? |
| 3 | Spec per tipe | `defaultSpecs` + override | Konfirmasi spec asli tiap tipe (listrik 900/1300 VA, dll). |
| 4 | TypeScript | Default JS (sesuai kebiasaan) | Pakai TS untuk skema konten (lebih aman dari typo)? |
| 5 | Repo & domain | Pakai subpath `/<repo>/` | Mau repo `username.github.io` / custom domain agar tanpa subpath? |
| 6 | Backend & mode render Fase 2 | **Ditunda** (lihat §9.3) | Tidak perlu diputuskan sekarang. |
