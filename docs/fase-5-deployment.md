# Fase 5 — Deployment (GitHub Pages + SSG)

Ref PRD: §X (lengkap).

## Task
- [ ] Putuskan: repo `username.github.io` (root, tanpa subpath) atau repo biasa (perlu `baseURL`). Default PRD §12.5: subpath `/<repo>/` kecuali user pilih lain.
- [ ] `.github/workflows/deploy.yml` — copy persis dari PRD §X.2, isi `NUXT_APP_BASE_URL` sesuai keputusan di atas (hapus env itu kalau pakai custom domain / repo root).
- [ ] Settings GitHub repo → Pages → Source: **GitHub Actions**.
- [ ] Test build lokal: `npx nuxt build --preset github_pages` (cek `.output/public` dan `.nojekyll` ada).
- [ ] Push ke `main` → cek Action jalan dan situs live.

## Definisi selesai (acceptance §11.6)
Build `--preset github_pages` menghasilkan HTML ter-render penuh; aset tidak 404 (cek baseURL benar kalau pakai subpath).
