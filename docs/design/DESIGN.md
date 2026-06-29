# Design System Inspired by Sanggar Indah Pararyangan

## 1. Visual Theme & Atmosphere

Sanggar Indah Pararyangan embodies a warm, approachable aesthetic grounded in Indonesian heritage and modern sustainability. The design communicates trust and accessibility through a refined palette of deep forest greens, warm oranges, and soft naturals. The visual identity balances contemporary minimalism with organic warmth, creating an inviting space for residential subsidy information and community engagement. Generous whitespace, carefully considered typography, and deliberate color placement establish a professional yet human-centered experience that celebrates affordable housing as a pathway to modern living.

**Key Characteristics**
- Warm, organic color palette rooted in natural materials
- Clean, contemporary layout with generous breathing room
- Strong visual hierarchy using contrasting accent colors
- Accessible, approachable tone for government/social programs
- Typography-driven content with supporting illustration
- Emphasis on call-to-action prominence and clarity

## 2. Color Palette & Roles

### Primary
- **Forest Deep** (`#1C4A2A`): Primary brand color for headers, hero text, and key structural elements
- **Dark Charcoal** (`#23271F`): Dominant text and component background; highest contrast for readability

### Accent Colors
- **Warm Orange** (`#EE8322`): Primary call-to-action buttons, WhatsApp links, and engagement elements
- **Light Orange** (`#F6A24A`): Warning states and secondary emphasis

### Interactive
- **Forest Medium** (`#2E5A36`): Secondary buttons, active states, and interactive accents
- **Forest Light** (`#6FB544`): Tertiary interactive states and hover variations

### Neutral Scale
- **Pure White** (`#FFFFFF`): Card backgrounds, primary text containers, and high-contrast surfaces
- **Off-White** (`#FBFAF6`): Subtle background tint for content sections
- **Cream Light** (`#ECEAE1`): Border and divider lines
- **Stone Gray** (`#8A8F84`): Secondary text, captions, and metadata
- **Charcoal Gray** (`#6E7268`): Tertiary text and disabled states
- **Pure Black** (`#000000`): Emphasis text and highest contrast interactions

### Surface & Borders
- **Sage Pale** (`#E4EFDD`): Soft background tint for highlighted sections
- **Mint Pale** (`#EDF4E7`): Ultra-light background for callout containers
- **Sage Mist** (`#BFD8B6`): Soft borders and divider accents
- **Sage Medium** (`#CFE6C8`): Tertiary background tint for layered content
- **Sage Olive** (`#5C7A52`): Deep accent borders and outlines

## 3. Typography Rules

### Font Family
**Primary:** Sora (https://fonts.googleapis.com/)
Fallback: `Sora, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Secondary:** Plus Jakarta Sans (https://fonts.googleapis.com/)
Fallback: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display | Sora | 52.8px | 800 | 58.08px | 0px | Hero headings, primary page titles |
| Heading 2 | Sora | 43.2px | 700 | 49.248px | 0px | Section headers, major content breaks |
| Heading 3 | Sora | 17.28px | 700 | 22.464px | 0px | Subsection headers, card titles |
| Body | Plus Jakarta Sans | 16px | 400 | 27.2px | 0px | Primary content text, descriptions |
| Button | Plus Jakarta Sans | 15.2px | 700 | normal | 0px | Interactive button labels |
| Caption | Plus Jakarta Sans | 14.72px | 600 | 18px | 0px | Secondary labels, metadata links |
| Navigation | Plus Jakarta Sans | 16px | 400 | normal | 0px | Top navigation menu items |
| Small Text | Plus Jakarta Sans | 13.333px | 400 | normal | 0px | Tertiary labels and info text |

### Principles
- Sora is reserved for display and heading tiers to establish visual hierarchy and brand distinction
- Plus Jakarta Sans carries all body and interactive text for optimal readability and approachability
- Line height is generous (1.7x for body) to support scanning and reduce cognitive load
- Font weights are deliberate: 400 for body, 600–700 for emphasis, 800 for hero impact
- All interactive elements (buttons, links) use weight 600+ for visual distinction

## 4. Component Stylings

### Buttons

#### Primary Button (CTA)
- **Background:** `#EE8322`
- **Text Color:** `#FFFFFF`
- **Font:** Plus Jakarta Sans, 15.2px, weight 700
- **Padding:** `13px 13px`
- **Border Radius:** `11px`
- **Border:** None
- **Height:** `45px`
- **Width:** `336px` (default; can be fluid)
- **Box Shadow:** None
- **Hover State:** Darken background to `#D66F1A`; add subtle lift with `0 4px 12px rgba(238, 131, 34, 0.3)`
- **Active State:** Deepen to `#B8580E`
- **Disabled State:** Reduce opacity to 0.5, cursor not-allowed

#### Secondary Button
- **Background:** Transparent
- **Text Color:** `#2E5A36`
- **Font:** Plus Jakarta Sans, 15.2px, weight 700
- **Padding:** `12px 20px`
- **Border Radius:** `8px`
- **Border:** `2px solid #2E5A36`
- **Box Shadow:** None
- **Hover State:** Background `#E4EFDD`, border remains `#2E5A36`
- **Active State:** Background `#D0E5C2`

#### Ghost Button
- **Background:** Transparent
- **Text Color:** `#23271F`
- **Font:** Plus Jakarta Sans, 15.2px, weight 400
- **Padding:** `12px 20px`
- **Border Radius:** `0px`
- **Border:** `1px solid #6E7268`
- **Box Shadow:** None
- **Hover State:** Background `#FBFAF6`, text `#1C4A2A`
- **Active State:** Border `#1C4A2A`, text `#1C4A2A`

### Cards & Containers

#### Standard Card
- **Background:** `#FFFFFF`
- **Border Radius:** `12px`
- **Border:** `1px solid #ECEAE1`
- **Padding:** `20px 24px`
- **Box Shadow:** None (or minimal: `0 2px 8px rgba(35, 39, 31, 0.04)`)
- **Text Color:** `#23271F`

#### Highlight Card (CTA Block)
- **Background:** `#1C4A2A`
- **Border Radius:** `12px`
- **Padding:** `24px 28px`
- **Text Color (Primary):** `#FFFFFF`
- **Text Color (Secondary):** `#BFD8B6`
- **Border:** None
- **Box Shadow:** `0 4px 16px rgba(28, 74, 42, 0.15)`

#### Light Background Card
- **Background:** `#E4EFDD`
- **Border Radius:** `12px`
- **Padding:** `20px 24px`
- **Border:** `1px solid #BFD8B6`
- **Text Color:** `#23271F`

### Inputs & Forms

#### Text Input
- **Background:** `#FFFFFF`
- **Border:** `1px solid #ECEAE1`
- **Border Radius:** `8px`
- **Padding:** `12px 16px`
- **Font:** Plus Jakarta Sans, 16px, weight 400
- **Text Color:** `#23271F`
- **Placeholder Color:** `#8A8F84`
- **Focus State:** Border `#1C4A2A`, box-shadow `0 0 0 3px rgba(28, 74, 42, 0.1)`
- **Error State:** Border `#D64545`, background `#FDF5F5`

#### Form Label
- **Font:** Plus Jakarta Sans, 14.72px, weight 600
- **Color:** `#23271F`
- **Margin Bottom:** `8px`
- **Line Height:** 18px

#### Checkbox
- **Size:** `18px × 18px`
- **Border Radius:** `4px`
- **Border (unchecked):** `2px solid #8A8F84`
- **Background (checked):** `#1C4A2A`
- **Checkmark Color:** `#FFFFFF`

### Navigation

#### Top Navigation Bar
- **Background:** `#FFFFFF`
- **Height:** `64px`
- **Padding:** `0px 40px`
- **Border Bottom:** `1px solid #ECEAE1`
- **Display:** Flex, items center, justify-between

#### Navigation Link
- **Font:** Plus Jakarta Sans, 16px, weight 400
- **Color:** `#23271F`
- **Padding:** `8px 12px`
- **Hover State:** Color `#1C4A2A`, background `transparent`
- **Active State:** Color `#EE8322`, border-bottom `2px solid #EE8322`

#### Mobile Navigation (Hamburger)
- **Icon Color:** `#23271F`
- **Icon Size:** `24px`
- **Dropdown Background:** `#FBFAF6`

### Badges & Labels

#### Status Badge
- **Background:** `#E4EFDD`
- **Text Color:** `#2E5A36`
- **Font:** Plus Jakarta Sans, 12px, weight 600
- **Padding:** `4px 12px`
- **Border Radius:** `16px`
- **Border:** `1px solid #BFD8B6`

#### Warning Badge
- **Background:** `#FFF4E6`
- **Text Color:** `#F6A24A`
- **Border:** `1px solid #F6A24A`

### Tabs

#### Tab Container
- **Background:** `#FBFAF6`
- **Border Radius:** `8px`
- **Padding:** `4px`

#### Tab Button
- **Font:** Plus Jakarta Sans, 14px, weight 600
- **Color (inactive):** `#6E7268`
- **Background (inactive):** Transparent
- **Color (active):** `#FFFFFF`
- **Background (active):** `#1C4A2A`
- **Padding:** `10px 16px`
- **Border Radius:** `6px`
- **Cursor:** Pointer

## 5. Layout Principles

### Spacing System
**Base Unit:** `4px`

**Scale:**
- `4px`: Micro spacing within components, icon-to-text gaps
- `8px`: Tight padding, small gaps between inline elements
- `12px`: Button internal padding, form field padding
- `16px`: Medium gaps, section dividers, standard padding
- `20px`: Card padding, container padding
- `24px`: Section spacing, margin between blocks
- `28px`: Large section spacing, container margins
- `32px`: Major section gaps, hero section spacing
- `36px`: Extra-large gaps between content blocks
- `40px`: Page margin, container sides
- `44px`: Large container spacing
- `64px`: Hero-level spacing, page sections

**Usage Context:**
- Micro (`4–8px`): Icon alignment, tight lists
- Comfortable (`12–20px`): Cards, form fields, buttons
- Breathing (`24–32px`): Section breaks, feature blocks
- Open (`36–64px`): Hero spacing, major layout sections

### Grid & Container
- **Max Width:** `1200px` (centered container)
- **Side Padding:** `40px` on desktop, `20px` on tablet, `16px` on mobile
- **Column Strategy:** 12-column grid for desktop, 6-column for tablet, single-column for mobile
- **Section Pattern:** Full-width backgrounds with centered content containers
- **Content Width:** 70% max for body text (improves readability)

### Whitespace Philosophy
Whitespace is treated as a structural element—not negative space, but active breathing room. Margins and padding are generous to reduce cognitive load and guide user attention through intentional hierarchy. Sections are separated by `32–64px` vertical space to establish visual rhythm. Cards and components maintain `20–24px` internal padding to ensure content feels spacious rather than cramped.

### Border Radius Scale
- `0px`: Navigation borders, ghost button borders (intentional hard edges)
- `4px`: Checkbox, small form inputs
- `6px`: Tab buttons, small pills
- `8px`: Form inputs, small containers
- `11px`: Primary buttons, standard interactive elements
- `12px`: Cards, containers, image containers
- `16px`: Badges, rounded pills
- `20px`: Large rounded containers (if needed)
- `50%`: Fully circular elements (avatar placeholders, icon buttons)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Surface (0) | No shadow, `background: #FFFFFF` or `#FBFAF6` | Base content surfaces, cards |
| Raised (1) | `0 2px 8px rgba(35, 39, 31, 0.04)` | Subtle hover state for cards, form focus |
| Floating (2) | `0 4px 12px rgba(35, 39, 31, 0.08)` | Active card state, dropdown menus, tooltips |
| Modal (3) | `0 12px 32px rgba(35, 39, 31, 0.12)` | Modals, popovers, prominent floating panels |
| Overlay (4) | `0 20px 48px rgba(35, 39, 31, 0.16)` | Full-screen modals, critical alerts |

**Shadow Philosophy:**
Shadows are minimal and restrained, using soft black (`#23271F` at low opacity) to maintain the warm, approachable aesthetic. Elevation is reserved for interactive states and modals rather than static content. Shadows increase opacity with elevation level, creating a subtle depth hierarchy without harsh contrast. All shadows use a vertical offset (y > x) to suggest gentle lift rather than dramatic separation.

## 7. Do's and Don'ts

### Do
- Use `#1C4A2A` (Forest Deep) for primary headers and structural text—it anchors the design with authority
- Apply the warm orange (`#EE8322`) exclusively to call-to-action buttons and WhatsApp engagement elements for consistent conversion focus
- Maintain minimum `20px` padding inside cards and containers for comfortable content breathing
- Use Sora font exclusively for Display and Heading tiers to create visual distinction from body text
- Stack headings with generous line height (`1.1–1.2x`) to support scanning and hierarchy
- Keep form inputs at minimum `44px` height to meet touch target accessibility standards
- Use the sage palette (`#BFD8B6`, `#E4EFDD`, `#EDF4E7`) for layered backgrounds and soft callouts
- Apply hover states to all interactive elements; primary buttons should lift and darken
- Leverage vertical rhythm: maintain consistent `24–32px` spacing between major content blocks

### Don't
- Don't use orange (`#EE8322`) for non-interactive elements or decorative purposes—reserve it for CTAs
- Don't apply multiple shadows to a single element; keep elevation to one level only
- Don't reduce font sizes below `14px` for body text; use weight reduction instead
- Don't place text directly on images without a semi-transparent overlay (`rgba(0, 0, 0, 0.3)`)
- Don't mix Sora and Plus Jakarta Sans in the same text line; assign font by element tier
- Don't use the dark charcoal (`#23271F`) at full opacity for extended body reading; use `#6E7268` for reduced strain
- Don't create buttons wider than `500px` except for full-width mobile layouts; stay proportional
- Don't nest more than two levels of cards; layering reduces clarity
- Don't use color alone to indicate state; always combine with icon, text, or shape change
- Don't apply border radius to text inputs below `8px`; stay within the scale for consistency

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | `0–599px` | Single-column layout, `16px` side padding, full-width cards, vertical button stacking |
| Tablet | `600–999px` | 6-column grid, `20px` side padding, 2-column card layouts where applicable |
| Desktop | `1000px+` | 12-column grid, `40px` side padding, 3+ column layouts, max-width container `1200px` |
| Large Desktop | `1400px+` | Increased max-width to `1400px`, wider content breathing, enhanced spacing |

### Touch Targets
- **Minimum Interactive Size:** `44px × 44px` (buttons, links, form controls)
- **Recommended Size:** `48px × 48px` for primary actions
- **Spacing Between Targets:** Minimum `8px` to prevent accidental taps
- **Text Link Padding:** `8px` top/bottom, `4px` left/right minimum for clickable area
- **Icon Size:** 24px for navigation, 20px for inline text

### Collapsing Strategy
- **Hero Section:** Stack content vertically on mobile; reduce Display font to `36px` on tablet
- **Navigation:** Convert top nav to hamburger menu below `600px`; preserve logo at all sizes
- **Cards:** Single-column on mobile, 2-column on tablet, 3-column on desktop
- **Buttons:** Full-width (`100%`) on mobile with `16px` horizontal margin; inline (`auto` width) on desktop
- **Images:** Constrain to `100%` width with `max-width: 100%` for responsive scaling
- **Spacing:** Reduce gaps by 25–50% on mobile (e.g., `32px` desktop → `16px` mobile) for compact layouts
- **Typography:** Reduce Display font by 20–30% on mobile; maintain weight hierarchy

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Warm Orange (`#EE8322`) — use for all call-to-action buttons and WhatsApp links
- **Primary Brand:** Forest Deep (`#1C4A2A`) — headers, hero text, highlight containers
- **Background:** Pure White (`#FFFFFF`) — card and content surfaces; Off-White (`#FBFAF6`) for subtle tints
- **Heading Text:** Dark Charcoal (`#23271F`) — primary hierarchy and emphasis
- **Body Text:** Dark Charcoal (`#23271F`) for standard; Stone Gray (`#6E7268`) for secondary
- **Borders & Dividers:** Cream Light (`#ECEAE1`) — light lines; Sage Mist (`#BFD8B6`) — soft accents
- **Interactive States:** Forest Medium (`#2E5A36`) — secondary buttons; Light Orange (`#F6A24A`) — warnings
- **Disabled/Tertiary:** Charcoal Gray (`#6E7268`) — reduced emphasis states

### Iteration Guide
1. **Color Application:** All interactive CTAs use `#EE8322`; all text use `#23271F` or `#6E7268` only; backgrounds alternate between `#FFFFFF`, `#FBFAF6`, and sage accents
2. **Typography Tiers:** Use Sora for Display/H2/H3 only; Plus Jakarta Sans for everything else; maintain 1.7x line height for body text
3. **Spacing Consistency:** Apply spacing from the scale (`4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 64px`) only; never use arbitrary values
4. **Component Sizing:** Buttons minimum `44px` height; cards minimum `20px` padding; form inputs `12px` padding, `8px` border-radius
5. **Elevation Restraint:** Use shadows sparingly—maximum one shadow per element; reserve shadows for hover and modal states
6. **Responsive Scaling:** Mobile: `16px` padding, single-column, `36px` Display font; Tablet: `20px` padding, 6-column; Desktop: `40px` padding, 12-column
7. **Border Radius Consistency:** Buttons `11px`, cards `12px`, inputs `8px`, badges `16px`; never deviate from these values
8. **Contrast & Accessibility:** Maintain WCAG AA minimum contrast; use color + icon/text for state indication, never color alone
9. **Focus States:** All interactive elements require visible focus ring (`0 0 0 3px rgba(28, 74, 42, 0.1)`); test keyboard navigation