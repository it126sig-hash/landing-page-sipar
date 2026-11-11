---
name: backend-agent
description: >
  Use this skill when acting as the Backend Agent for the Sanggar Indah Parahyangan (SIP) project.
  Covers Supabase integration (@supabase/supabase-js), PostgreSQL schema (JSONB & Relational),
  RLS policies, Supabase Storage (public-assets), Auth, and data layer composables (useContent, usePosts).
---

# BACKEND AGENT — Standar & Aturan Eksekusi

Stack: Supabase, PostgreSQL, `@supabase/supabase-js`, Nuxt 3 Composables/Server routes.

---

## 1. Arsitektur Database & Penyimpanan

Proyek ini menerapkan **Skema Hybrid**:
1. **Landing Page (`site_content`):**
   - Model Key-Value dengan kolom `key` (VARCHAR PK) dan `data` (JSONB).
   - Satu baris mewakili satu seksi konten (misal: `hero`, `houseTypes`, `faqs`, dll.).
   - Memastikan update konten tidak membutuhkan relasi tabel yang rumit.
2. **Blog SEO (`posts`):**
   - Tabel relasional penuh: `id`, `slug`, `title`, `excerpt`, `content`, `cover_image`, `seo_title`, `seo_description`, `status`, `published_at`, `created_at`, `updated_at`.
   - Dioptimalkan untuk indexing crawler Google, pagination, dan filter status `published`.
3. **Storage Bucket (`public-assets`):**
   - Digunakan untuk upload gambar dari Admin Dashboard (`/admin`).
   - Akses bucket bersifat `public` untuk pembacaan aset oleh pengunjung web.

---

## 2. Aturan SQL & Row Level Security (RLS)

- **Idempotensi:** Seluruh migrasi SQL wajib idempotent (`CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`).
- **Keamanan RLS (Mutlak):**
  - Aktifkan RLS di setiap tabel: `ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;`
  - Hak akses publik (anon key): **Hanya `SELECT`** pada data yang boleh dibaca publik (misal artikel `published` dan konten landing page).
  - Hak akses mutasi (`INSERT`, `UPDATE`, `DELETE`): **Wajib dibatasi ke pengguna terautentikasi** (`auth.role() = 'authenticated'`).
- **Contoh Kebijakan RLS:**
  ```sql
  -- Membaca konten publik
  CREATE POLICY "Public read site_content" ON site_content
      FOR SELECT USING (true);

  -- Mutasi oleh admin terautentikasi
  CREATE POLICY "Admin manage site_content" ON site_content
      FOR ALL USING (auth.role() = 'authenticated');
  ```

---

## 3. Data Layer & Resilience (Fallback Mutlak)

- **Composable `useContent.js`:**
  - Fungsi `useContent()` adalah antarmuka tunggal bagi komponen Vue.
  - **Graceful Fallback:** Jika koneksi Supabase gagal (misal kuota habis, koneksi putus, atau env belum disetel), fungsi wajib me-return data cadangan dari `data/content.js`. Landing page **TIDAK BOLEH** blank atau crash.
- **Dual-Path Asset Helper (`withBase()`):**
  - Path gambar lokal tetap didukung (`/assets/images/...`).
  - URL Supabase Storage (`https://<project-ref>.supabase.co/storage/v1/object/public/...`) dideteksi otomatis dan tidak dipotong base URL lokal.

---

## 4. Checklist Mandiri Sebelum Serahkan ke QA

- [ ] File SQL migrasi/seed tersimpan rapi dan dapat dijalankan ulang tanpa error.
- [ ] RLS policies diuji: request tanpa token admin tidak bisa melakukan write/update/delete.
- [ ] Fallback offline berfungsi ketika koneksi Supabase dimatikan/gagal.
- [ ] Data yang di-return oleh `useContent()` mempertahankan shape/struktur data yang diharapkan oleh komponen UI.
