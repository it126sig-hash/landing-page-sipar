# Fase 3 — Komponen UI

Ref PRD: §4 (arsitektur komponen), §5 (mapping section→data). Ref styling: `docs/design/DESIGN.md` §4 (button/card/input/nav), §6 (shadow), §7 (do's/don'ts), §8 (responsive).

## Layout
- [ ] `TheHeader` — nav `meta.nav`, `WhatsAppButton(konsultasi)`. Styling: DESIGN.md "Top Navigation Bar".
- [ ] `TheFooter` — dari `content.footer` + `content.meta`.
- [ ] `SectionShell` (props `id`, `bg`) — padding konsisten (DESIGN.md spacing scale, §5 PRD).
- [ ] `SectionHeading` (eyebrow + judul + subjudul).

## Primitive
- [ ] `BaseButton` — variant primary/secondary/ghost, styling persis DESIGN.md §4 "Buttons" (warna, padding, radius, hover/active/disabled state).
- [ ] `WhatsAppButton` (props `messageKey`, optional `vars`) → panggil `wa()`.
- [ ] `Chip`, `Badge` (status/warning variant per DESIGN.md "Badges & Labels").
- [ ] `FeatureCard` (props `num?`, `icon?`, `title`, `desc`, `stat?`) — dipakai reasons/oneGate/invest/demand.
- [ ] `SpecRow`.

## Section (per PRD §5, baca via `useContent()`)
- [ ] `HeroSection` — headline/sub, `heroChips`, specs primer tipe `hero.primaryTypeId`, CTA `survey`.
- [ ] `ReasonsSection` (`#alasan`) — `reasons` via `FeatureCard`.
- [ ] `InstallmentSection` (`#cicilan`) — CTA `simulasi`.
- [ ] `OneGateSection` — `oneGate[]` via `FeatureCard`.
- [ ] `HouseTypesSection` (`#tipe`) — `HouseTypeCard` (grid) + `HouseTypeModal` (state `selectedTypeId`, `modalOpen` lokal di section ini).
- [ ] `LocationSection` (`#lokasi`) — `locations` + `facilities[]`.
- [ ] `InvestSection` — `invest[]`.
- [ ] `DemandSection` — `demand[]` (varian `stat`).
- [ ] `FaqSection` (`#faq`) — `FaqItem` accordion, state `openFaqId` (single-open).
- [ ] `FinalCtaSection` — CTA `survey`.
- [ ] Rakit semua section di `pages/index.vue`.

## Definisi selesai (acceptance §11.1, §11.3)
- Nol hardcode teks/angka jualan di komponen — semua dari `useContent()`.
- Ubah satu spec/tipe → kartu & modal konsisten.
- Modal & accordion bisa dioperasikan via keyboard (DESIGN.md §9 poin 9 — focus state wajib).
