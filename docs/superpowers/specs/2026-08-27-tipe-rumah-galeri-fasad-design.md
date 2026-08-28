# Redesign Section Tipe Rumah — Galeri Fasad & Thumbnail Persona

Tanggal: 2026-08-27
Status: menunggu persetujuan
Figma: https://www.figma.com/design/jt65sgpmBs8bnth3m84kyE (artboard A–D)

## Masalah

Empat hal ditemukan saat membaca kode dan aset yang ada:

1. **Komposisi persona pada thumbnail tidak cocok dengan copy-nya.** Ketiga render isometrik di `public/assets/images/rumah/` sudah berisi orang, tetapi keluarganya salah: `22 DAN 60.webp` menampilkan anak usia sekolah padahal subtitle-nya "memulai cerita baru bersama pasangan"; `26 DAN 72.webp` menampilkan empat orang dewasa tanpa anak padahal subtitle-nya "keluarga kecil".

2. **Satu kartu punya dua tujuan yang berbeda.** Menekan gambar membuka lightbox (`openTypeGallery`), menekan tombol membuka modal (`openType`). Dua jalan dari satu kartu tanpa penanda apa pun.

3. **Aset fasad 16:9 dipaksa masuk kotak 4:3.** Di `HouseTypeModal.vue`, kartu fasad memakai `aspect-[4/3]` + `object-cover`, sehingga sebagian streetscape terpotong.

4. **Aset 3D perspektif tidak pernah tampil.** `2260-3d-ilustrasi.webp`, `2672-3d-ilustrasi.webp`, dan `3672-3d-ilustrasi.webp` ada di repo tetapi tidak dirujuk kode mana pun.

## Keputusan

- Ilustrasi persona dipesan ke **vendor render isometrik yang sama**, bukan foto stok / AI / vektor. Alasannya konsistensi bahasa visual.
- Galeri fasad di modal berisi **tampilan luar saja** (fasad + 3D perspektif). Denah tetap kartu tersendiri.
- Aset persona diperlakukan sebagai **dependensi eksternal**: kode harus rilis dan benar sebelum aset datang.

## Rancangan

### 1. Skema data (`data/content.js`)

Tambah dua field opsional per tipe rumah. Tidak ada field lama yang dihapus atau diubah artinya.

```js
{
  id: '26-72',
  // ...field lama tidak berubah...
  thumbnail: '/assets/images/rumah/26 DAN 72.webp',  // tetap — jadi fallback
  persona: '/assets/images/rumah/persona-2672.webp', // BARU, opsional
  facades: [                                          // BARU, opsional
    { src: '/assets/images/rumah/galeri/2672-fasad.webp',        label: 'Tampak Depan' },
    { src: '/assets/images/rumah/galeri/2672-3d-ilustrasi.webp', label: 'Perspektif' },
  ],
}
```

`gallery` lama tetap dipertahankan supaya denah dan lightbox tidak berubah kontraknya.

### 2. Kartu (`ProductsSection.vue`)

- Sumber gambar thumbnail: `t.persona || t.thumbnail || t.gallery[1]`. Selama `persona` belum ada, tampilan kartu **persis seperti sekarang** — tidak ada kotak kosong di halaman publik.
- Seluruh kartu jadi satu target menuju modal. Gambar tidak lagi membuka lightbox langsung; `openTypeGallery` dihapus dari kartu.
- Rasio slot tetap `aspect-[4/3]` + `object-cover`, sama seperti sekarang.

### 3. Galeri fasad (`HouseTypeModal.vue`)

Komponen baru `FacadeGallery.vue` — satu tanggung jawab: menampilkan deret gambar 16:9 yang bisa digeser.

- Wadah `overflow-x-auto` + `snap-x snap-mandatory`, tiap kartu `snap-center`.
- Kartu memakai `aspect-video` (16:9) sesuai rasio asli aset, bukan 4:3 — ini yang memperbaiki masalah #3. Sudah diverifikasi: keenam aset fasad & 3D berukuran tepat 1920×1080.
- Lebar kartu `basis-[88%]` di HP supaya kartu berikutnya terpotong di tepi sebagai petunjuk bisa digeser. Di `sm:` ke atas `basis-[62%]`.
- Menekan kartu membuka lightbox lewat `openGallery(facades, index)` — API `useLightbox` yang sudah ada, tidak berubah.
- Indikator titik di bawah, mengikuti kartu yang sedang di tengah lewat `IntersectionObserver`.
- Denah tetap kartu terpisah `object-contain`, alasannya sudah tertulis di komentar kode yang ada: denah dibaca, bukan dinikmati. Rasio kotaknya diubah dari `aspect-[4/3]` (lanskap) ke `aspect-[3/4]` (potret) karena denah aslinya 810×1080 — potret. Dengan kotak lanskap, denah menyusut ke tengah dan sebagian besar kartu jadi ruang kosong.

Bila `facades` tidak ada, komponen jatuh ke `[gallery[1]]` — satu gambar, tanpa indikator, tanpa scroll.

### 4. Aset yang dipesan ke vendor

| Tipe | Komposisi yang benar | Suasana |
|---|---|---|
| 22/60 | 2 dewasa, pasangan muda, TANPA anak | Sore, motor / 1 mobil kecil, teras rapi |
| 26/72 | 2 dewasa + 1 balita | Ibu menata tanaman, ayah menggendong balita |
| 36/72 | 2 dewasa + 2 anak | Anak main di halaman, mobil keluarga |

Spesifikasi: **rasio 4:3**, gaya miniatur isometrik dengan latar putih polos, sudut kamera dan tinggi horizon konsisten antar tipe, webp, sisi terpanjang ±1400px, target <150KB. Nama file `persona-2260.webp`, `persona-2672.webp`, `persona-3672.webp`.

Catatan: render lama berukuran 1400×834 (≈1.68), sedangkan slot kartu 4:3 (1.33). Selama ini selisih itu ditutup `object-cover`, jadi sisi kiri-kanan render terpangkas. Meminta 4:3 langsung ke vendor membuat komposisi yang mereka rancang tidak ada yang terbuang. Kalau vendor hanya bisa mengirim 16:9, slot kartu diubah ke `aspect-video` dan tinggi kartu ikut menyesuaikan — putuskan saat aset datang.

## Aksesibilitas & kualitas

- Galeri bisa digulir dengan keyboard (wadah `tabindex="0"`, panah kiri/kanan).
- `prefers-reduced-motion`: `scroll-behavior: auto`, transisi hover dimatikan.
- Tiap kartu fasad punya `aria-label` yang menyebut label dan nama tipe.
- Indikator titik `aria-hidden` — informasinya sudah ada di label kartu.
- Target sentuh kartu ≥44px (terpenuhi sendiri oleh tinggi kartu 16:9).

## Batasan

- Tidak menyentuh `useLightbox.js` — API-nya sudah mendukung galeri N gambar.
- Tidak mengubah denah, spesifikasi teknis, header, atau footer modal.
- Tidak mengubah bagian lain halaman.

## Verifikasi

- Galeri bisa digeser dan snap di 390px, 768px, 1440px.
- Fasad tampil utuh 16:9, tidak terpotong.
- Lightbox terbuka pada gambar yang benar saat kartu ditekan.
- Dengan `persona`/`facades` dihapus dari data, tampilan kembali seperti sekarang tanpa error.
- Modal tetap bisa ditutup dengan Escape dan klik luar.
