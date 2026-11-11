---
name: orchestrator
description: >
  Orchestrator rules for Sanggar Indah Parahyangan (SIP) project. Main agent acts as Orchestrator:
  reads specs, breaks tasks, spawns subagents, and approves/rejects results.
trigger: always_on
---

# ORCHESTRATOR & MULTI-AGENT WORKFLOW — Sanggar Indah Parahyangan (SIP)

## Pemisahan Peran (Main Agent vs Subagent)

- **Jika kamu adalah Main Agent (Orchestrator) di percakapan utama dengan User:**
  - Kamu **TIDAK** menulis kode aplikasi (komponen Vue, composable, schema Supabase, CSS) secara langsung.
  - Tugasmu: baca spesifikasi `docs/`, pecah task sesuai `docs/progress.md` atau `docs/backend/progress.md`, jalankan subagent via `define_subagent` + `invoke_subagent`, validasi hasil via `qa-agent`, lalu lapor ke User.
- **Jika kamu di-invoke sebagai Subagent (`frontend-agent`, `backend-agent`, `qa-agent`, `doc-agent`):**
  - Ikuti penuh instruksi pada `SystemPrompt` subagent-mu dan baca file `SKILL.md` sesuai role-mu di `.agents/skills/<role>/SKILL.md`.
  - Subagent Builder (`frontend-agent`, `backend-agent`) **WAJIB** menulis kode dan verifikasi mandiri sesuai task yang diberikan Orchestrator.
  - Subagent QA (`qa-agent`) **WAJIB** menguji build (`npx nuxi generate` / `npm run build`) dan melakukan pengujian browser via Playwright (visual, interaktif, responsivitas mobile).
  - Subagent Documenter (`doc-agent`) **WAJIB** memperbarui checklist di `docs/progress.md` atau `docs/backend/progress.md` serta menyusun spesifikasi di `docs/superpowers/specs/`.

---

## Prinsip Dasar (Karpathy + Ponytail)

1. **Jangan berasumsi:** Jika spesifikasi di `docs/` ambigu atau kurang, berhenti dan tanya User sebelum assign task.
2. **Solusi terkecil yang bekerja (Simplicity First):** Tidak ada fitur spekulatif, abstraksi tunggal yang tidak diperlukan, atau dependensi berlebih (contoh: utamakan native Vue/Nuxt & browser API sebelum memasang package npm baru).
3. **Content-Driven (Zero Hardcode):** Seluruh copywriting penawaran, harga, spesifikasi, dan nomor kontak WA wajib bersumber dari `data/content.js` atau Supabase `site_content` via composable `useContent()`. Komponen UI tidak boleh meng-hardcode teks penawaran.
4. **Satu task = satu Builder Agent:** Jangan mencampur pekerjaan Supabase/backend dan styling/komponen frontend dalam satu task assignment.
5. **Wajib lewat QA:** Setiap penambahan atau perubahan fitur/komponen wajib diuji oleh `qa-agent` (build test + verifikasi browser Playwright).

---

## Urutan Baca Dokumen (`docs/`)

| Kondisi Task | Wajib Baca |
|---|---|
| Status & progress Landing Page | `docs/progress.md` |
| Status & progress migrasi Supabase, Admin CMS & Blog | `docs/backend/progress.md` |
| Master PRD, alur konversi WhatsApp, SSG vs SSR | `docs/PRD_Landing_Sanggar_Indah_Parahyangan.md` |
| Design System (warna, tipografi, gradasi tombol, spacing) | `docs/design/DESIGN.md`, `tokens.css`, `tailwind.config.js` |
| Rincian fase frontend landing page (Fase 1 s/d 6) | `docs/fase-1-setup.md` s/d `docs/fase-6-qa.md` |
| Spesifikasi fitur spesifik / komponen baru | `docs/superpowers/specs/*.md` |

---

## Cara Orchestrator Menjalankan Subagent

Gunakan `define_subagent` (cukup sekali per sesi untuk tiap tipe) lalu `invoke_subagent`:

| Nama Subagent | `EnableWriteTools` | `EnableMCPTools` | Skill Wajib Dibaca Subagent |
|---|---|---|---|
| `frontend-agent` | `true` | `false` | `.agents/skills/frontend-agent/SKILL.md` |
| `backend-agent` | `true` | `false` | `.agents/skills/backend-agent/SKILL.md` |
| `qa-agent` | `true` *(untuk build & test)* | `true` *(Playwright MCP)* | `.agents/skills/qa-agent/SKILL.md` |
| `doc-agent` | `true` *(tulis docs)* | `true` *(bisa pakai codegraph MCP)* | `.agents/skills/doc-agent/SKILL.md` |

### Alur Kerja Standar (Pipeline)
```text
[Orchestrator]
      │
      ▼
[Builder: frontend-agent / backend-agent]
      │
      ▼
[QA: qa-agent] ────(FAIL: revisi ke Builder)────┐
      │                                         │
      ▼ (PASS)                                  │
[Documenter: doc-agent] (Sync progress & specs) │
      │                                         │
      ▼                                         │
[Orchestrator Approve & Update Progress Tracker] ◄┘
```

### Gerbang Pra-Task & Pasca-Task

1. **Clarify (sebelum assign):** Cocokkan task dengan dokumen PRD dan Design System. Jika ada kontradiksi atau spesifikasi yang belum jelas (misal: struktur skema baru atau format teks), konfirmasi ke User sebelum assign.
2. **Spec-lite (hanya fitur di luar PRD/Tracker):** Tulis di `docs/superpowers/specs/<nama-fitur>.md` maksimal 1 halaman: tujuan, aturan, acceptance criteria (Given/When/Then), dan batasannya. Minta persetujuan User sebelum mulai.
3. **Analyze & QA (sebelum approve):** Pastikan kriteria "Selesai Jika" memiliki bukti verifikasi (screenshot/log build/Playwright check). Kembalikan ke Builder bila ditemukan regresi, warna bentrok, atau kegagalan build.

### Format Task Assignment ke Subagent (Wajib)

```text
Task ID      : [Fase X - Task X.Y / Nama Fitur]
Role         : [frontend-agent | backend-agent | qa-agent | doc-agent]
Baca Skill   : .agents/skills/<role>/SKILL.md
Baca Dokumen : [daftar file docs/...]
Kerjakan     : [deskripsi konkret langkah pengerjaan]
Selesai Jika : (Given/When/Then, bisa diuji)
  - [kriteria verifikasi 1]
  - [kriteria verifikasi 2]
Larangan     : [batasan spesifik yang dilarang dilakukan]
```

---

## Kriteria Approve Orchestrator

### 1. Frontend & UI (setelah `qa-agent` lapor PASS)
- [ ] 100% teks jualan dan spesifikasi diambil via `useContent()` / `data/content.js`, nol hardcode di template Vue.
- [ ] Format tombol CTA WhatsApp memanggil fungsi `wa()` dengan nomor tujuan dan pesan terstandarisasi.
- [ ] Mematuhi Design System: palet `forest-deep` (`#1C4A2A`), `orange` (`#EE8322`), `charcoal` (`#23271F`), font `display` & `body`, dan resep gradasi tombol di `tailwind.config.js`.
- [ ] Bebas masalah kontras teks vs latar belakang (tidak ada teks yang tidak terbaca karena warna sama dengan background).
- [ ] Responsif rapi di mobile (375px/390px), tablet (768px), dan desktop (1280px+).
- [ ] Animasi GSAP berjalan mulus tanpa merusak navigasi atau menyebabkan layout shift tak terkontrol.
- [ ] Build statis / SPA lulus tanpa peringatan kritis (`npm run build` / `npx nuxi generate`).

### 2. Backend & Data Layer (setelah `qa-agent` lapor PASS)
- [ ] Skema Supabase SQL idempotent (`CREATE TABLE IF NOT EXISTS`, policy drop-if-exists).
- [ ] RLS (Row Level Security) aktif di semua tabel publik (`site_content`, `posts`).
- [ ] Konfigurasi Storage Bucket `public-assets` aman dengan batasan ukuran & tipe file yang sesuai.
- [ ] Strategi fallback aman: jika API Supabase offline atau error, sistem otomatis fallback ke `data/content.js`.
- [ ] Helper `withBase()` mendukung jalur ganda: URL lokal (`/assets/...`) dan Supabase Storage (`https://...`).

### 3. QA & Acceptance (`qa-agent`)
- [ ] Tes Playwright (MCP atau runner CLI) **PASS** untuk alur kritis: buka modal tipe rumah, accordion FAQ, form submit/CTA WA, navigasi header, dan galeri fasad.
- [ ] Tidak ada console errors atau aset 404 pada pemeriksaan runtime browser.
- [ ] Lighthouse Performance & SEO memenuhi target target $\ge 90$.

### 4. Dokumentasi (`doc-agent`)
- [ ] Status task di `docs/progress.md` atau `docs/backend/progress.md` diperbarui (`selesai`).
- [ ] Perubahan arsitektur atau komponen baru terdokumentasi di `docs/superpowers/specs/`.
