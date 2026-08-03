# Graph Report - .  (2026-08-03)

## Corpus Check
- 69 files · ~190,151 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 181 nodes · 172 edges · 58 communities (45 shown, 13 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Content & Section Data Layer|Content & Section Data Layer]]
- [[_COMMUNITY_UI Design System & Brand Tokens|UI Design System & Brand Tokens]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Deployment & Documentation Pipeline|Deployment & Documentation Pipeline]]
- [[_COMMUNITY_GSAP Animation System|GSAP Animation System]]
- [[_COMMUNITY_House Type Catalog & Modal|House Type Catalog & Modal]]
- [[_COMMUNITY_House Type Images & Floor Plans|House Type Images & Floor Plans]]
- [[_COMMUNITY_App Shell & SEO Config|App Shell & SEO Config]]
- [[_COMMUNITY_Content.js Internal Structure|Content.js Internal Structure]]
- [[_COMMUNITY_Award Carousel DOM|Award Carousel DOM]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_MCP Server Config|MCP Server Config]]
- [[_COMMUNITY_Component File 49|Component File 49]]
- [[_COMMUNITY_Component File 50|Component File 50]]
- [[_COMMUNITY_Component File 51|Component File 51]]
- [[_COMMUNITY_Component File 52|Component File 52]]
- [[_COMMUNITY_Component File 53|Component File 53]]
- [[_COMMUNITY_Component File 54|Component File 54]]
- [[_COMMUNITY_Component File 55|Component File 55]]
- [[_COMMUNITY_Component File 56|Component File 56]]
- [[_COMMUNITY_Component File 57|Component File 57]]

## God Nodes (most connected - your core abstractions)
1. `useContent Composable` - 22 edges
2. `Content Data Module` - 15 edges
3. `Index Page` - 10 edges
4. `House Types Data` - 9 edges
5. `scripts` - 6 edges
6. `ProductsSection Component` - 6 edges
7. `HouseTypeModal Component` - 6 edges
8. `Project Progress Tracker` - 6 edges
9. `useLightbox Composable` - 5 edges
10. `HeroSection Component` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Full Page Design Mockup (complete landing page wireframe)` --semantically_similar_to--> `PRD — Landing Page SIPAR`  [INFERRED] [semantically similar]
  docs/design/DESIGN.png → docs/PRD_Landing_Sanggar_Indah_Parahyangan.md
- `Phase 2 DB/API Readiness Strategy` --rationale_for--> `useContent Composable`  [EXTRACTED]
  docs/PRD_Landing_Sanggar_Indah_Parahyangan.md → composables/useContent.js
- `Content Schema (§3.2)` --rationale_for--> `Content Data Module`  [EXTRACTED]
  docs/PRD_Landing_Sanggar_Indah_Parahyangan.md → data/content.js
- `Hero Image Mobile (SIPAR signage, vertical crop)` --references--> `HeroSection Component`  [INFERRED]
  public/assets/images/hero-mobile.webp → components/HeroSection.vue
- `Content-Driven Architecture (seam pattern)` --rationale_for--> `useContent Composable`  [EXTRACTED]
  docs/PRD_Landing_Sanggar_Indah_Parahyangan.md → composables/useContent.js

## Hyperedges (group relationships)
- **Content Seam: data → composable → components** — content_data, usecontent_composable, rationale_content_seam [EXTRACTED 0.95]
- **Global Layout Shell (LoadingScreen + Page + WhatsApp Float + Lightbox)** — appvue_root, loadingscreen_component, lightbox_component, whatsappfloatingbutton_component [EXTRACTED 0.95]
- **House Type Display Flow (data → card → modal → lightbox)** — content_housetypes, housetypecard_component, housetypemodal_component, uselightbox_composable [EXTRACTED 0.95]
- **GSAP Animation System (plugin + scroll reveals)** — gsap_plugin, gsap_scrolltrigger, sectionshell_scrollreveal, aboutsection_carousel [EXTRACTED 0.90]
- **Deployment Pipeline (config + workflow + base URL)** — deploy_workflow, nuxtconfig_baseurl, prd_ssg_decision [EXTRACTED 0.95]
- **Tipe 22/60 (data + 3D render + floor plan)** — img_2260_3d, img_2260_denah, content_housetypes [EXTRACTED 0.95]

## Communities (58 total, 13 thin omitted)

### Community 0 - "Content & Section Data Layer"
Cohesion: 0.10
Nodes (28): AdvantagesSection Component, Advantages / Keunggulan Data, Content Data Module, FAQ Data, Final CTA Data, Footer Data, Hero Section Data, Installment / Cicilan Data (+20 more)

### Community 1 - "UI Design System & Brand Tokens"
Cohesion: 0.14
Nodes (17): BaseButton Component, BaseButton Variants (primary/secondary/ghost), Project Meta (name, WA, nav), Design System Button Specs, Design System Color Palette, Design System Doc, Design System Typography (Sora + Plus Jakarta Sans), Full Page Design Mockup (complete landing page wireframe) (+9 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.12
Nodes (15): dependencies, gsap, nuxt, @nuxtjs/tailwindcss, vue, vue-router, name, private (+7 more)

### Community 3 - "Deployment & Documentation Pipeline"
Cohesion: 0.13
Nodes (15): GitHub Actions Deploy Workflow, Fase 1: Project Setup Doc, Fase 2: Content Layer Doc, Fase 3: Components Doc, Fase 4: SEO & Analytics Doc (pending), Fase 5: Deployment Doc (pending), Fase 6: QA & Acceptance Doc (pending), App Base URL Config (+7 more)

### Community 4 - "GSAP Animation System"
Cohesion: 0.15
Nodes (13): Awards Carousel (GSAP Infinite Scroll), AboutSection Component, AdvantagesSection GSAP Stagger Animation, About / Awards Data, GSAP Client Plugin, ScrollTrigger Registration, LoadingScreen Component, Loading Screen GSAP FadeOut (+5 more)

### Community 5 - "House Type Catalog & Modal"
Cohesion: 0.21
Nodes (12): Badge Component, Default Build Specifications, HouseTypeCard Component, HouseTypeModal Component, HouseTypeModal Keyboard Navigation, HouseTypesSection Component, HouseTypesSection Modal State, ProductsSection Component (+4 more)

### Community 6 - "House Type Images & Floor Plans"
Cohesion: 0.36
Nodes (8): House Types Data, Tipe 22/60 3D Render (subsidi row houses), Tipe 22/60 Floor Plan (5x12m, 1BR expandable), Tipe 26/72 3D Render (2BR row houses, wood doors), Tipe 26/72 Floor Plan (6x12m, 2BR), Tipe 36/72 3D Render (larger row houses, evening lighting), Tipe 36/72 Floor Plan (6x12m, 2BR dining room), Derived House Types

### Community 7 - "App Shell & SEO Config"
Cohesion: 0.33
Nodes (6): App Root, SEO Meta Setup, Lightbox Component, Nuxt Config, Site URL Config, TailwindCSS Module

## Knowledge Gaps
- **49 isolated node(s):** `name`, `type`, `private`, `build`, `dev` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useContent Composable` connect `Content & Section Data Layer` to `UI Design System & Brand Tokens`, `Deployment & Documentation Pipeline`, `GSAP Animation System`, `House Type Catalog & Modal`, `House Type Images & Floor Plans`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Why does `Content Data Module` connect `Content & Section Data Layer` to `UI Design System & Brand Tokens`, `Deployment & Documentation Pipeline`, `GSAP Animation System`, `House Type Catalog & Modal`, `House Type Images & Floor Plans`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `PRD — Landing Page SIPAR` connect `Deployment & Documentation Pipeline` to `UI Design System & Brand Tokens`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `name`, `type`, `private` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Content & Section Data Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
- **Should `UI Design System & Brand Tokens` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._