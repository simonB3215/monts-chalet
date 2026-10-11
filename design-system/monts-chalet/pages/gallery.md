# Gallery Page Overrides

> **PROJECT:** Monts-Chalet
> **Generated:** 2026-10-11 13:04:05
> **Page Type:** Landing / Marketing

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content
- **Sections:** Hero (Name/Role) > Project Grid (Masonry) > About/Philosophy > Contact

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Neutral background (let work shine). Text: Black/White. Accent: Minimal.

### Component Overrides

- No overrides — use Master component specs

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Film grain overlay, VHS tracking effect, polaroid shake, fade-in transitions, light leak animations
- CTA Placement: Project Card Hover + Footer Contact

---

## Decisions for this build

- **Adopted:** neutral background so the photos lead; masonry grid (1 / 2 / 3 columns) that keeps portrait photos uncropped.
- **Rejected:** film grain, VHS tracking, polaroid shake and light-leak effects from the generated recommendations.
- **Filters:** All / Chalet / Interior / Views / Winter / Summer as toggle buttons (`aria-pressed`), result count announced.
- **Lightbox:** native `<dialog>`; arrow keys, Escape, visible previous / next / close buttons, swipe on touch, focus returns to the thumbnail. Without JavaScript each thumbnail links to the large photo.
