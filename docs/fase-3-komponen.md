# Fase 3 — Komponen UI

Ref PRD: §4 (arsitektur komponen), §5 (mapping section→data). Ref styling: `docs/design/DESIGN.md` §4 (button/card/input/nav), §6 (shadow), §7 (do's/don'ts), §8 (responsive).

## Layout
- [x] `TheHeader` — nav `meta.nav`, `WhatsAppButton(konsultasi)`. Styling: DESIGN.md "Top Navigation Bar".
- [x] `TheFooter` — dari `content.footer` + `content.meta`.
- [x] `SectionShell` (props `id`, `bg`) — padding konsisten (DESIGN.md spacing scale, §5 PRD).
- [x] `SectionHeading` (eyebrow + judul + subjudul).

## Primitive
- [x] `BaseButton` — variant primary/secondary/ghost, styling persis DESIGN.md §4 "Buttons" (warna, padding, radius, hover/active/disabled state).
- [x] `WhatsAppButton` (props `messageKey`, optional `vars`) → panggil `wa()`.
- [x] `Chip`, `Badge` (status/warning variant per DESIGN.md "Badges & Labels").
- [x] `FeatureCard` (props `num?`, `icon?`, `title`, `desc`, `stat?`) — dipakai reasons/oneGate/invest/demand.
- [x] `SpecRow`.

## Section (per PRD §5, baca via `useContent()`)
- [x] `HeroSection` — headline/sub, `heroChips`, specs primer tipe `hero.primaryTypeId`, CTA `survey`.
- [x] `ReasonsSection` (`#alasan`) — `reasons` via `FeatureCard`.
- [x] `InstallmentSection` (`#cicilan`) — CTA `simulasi`.
- [x] `OneGateSection` — `oneGate[]` via `FeatureCard`.
- [x] `HouseTypesSection` (`#tipe`) — `HouseTypeCard` (grid) + `HouseTypeModal` (state `selectedTypeId`, `modalOpen` lokal di section ini; panggung visual diperbesar 340px desktop/250px mobile, navigasi sekuensial gambar Tampak Depan $\leftrightarrow$ Perspektif (1/2 & 2/2) $\leftrightarrow$ Denah, panel spesifikasi carousel 1.8s dengan arsitektur padding anti-bocor & nav panah desktop, lolos QA Playwright 100%).
- [x] `MortgageCalculatorSection` (`#kalkulator`) — Section Kalkulator Cicilan KPR (arsitektur 1 card landscape 2 kolom, latar belakang hunian 3D subtle dengan vertical fade, formula anuitas 5%, two-way sync DP nominal/persen/slider 5-90%, dropdown tenor, collapsible accordion biaya akad awal, pill Bank BCA di luar card, CTA WhatsApp dinamis, zero hardcode via `content.calculator`).
- [x] `LocationSection` (`#lokasi`) — `locations` + `facilities[]`.
- [x] `InvestSection` — `invest[]`.
- [x] `DemandSection` — `demand[]` (varian `stat`).
- [x] `FaqSection` (`#faq`) — `FaqItem` accordion, state `openFaqId` (single-open).
- [x] `FinalCtaSection` — CTA `survey`.
- [x] Rakit semua section di `pages/index.vue`.

## Definisi selesai (acceptance §11.1, §11.3)
- [x] Nol hardcode teks/angka jualan di komponen — semua dari `useContent()`.
- [x] Ubah satu spec/tipe → kartu & modal konsisten.
- [x] Modal & accordion bisa dioperasikan via keyboard (DESIGN.md §9 poin 9 — focus state wajib).
