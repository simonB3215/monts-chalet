# Apartment Page Overrides

> **PROJECT:** Monts-Chalet
> **Generated:** 2026-10-11 13:04:04
> **Page Type:** Pricing / Plans

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px
- **Layout:** Responsive grid

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- No overrides — use Master colors

### Component Overrides

- Avoid: Wide tables breaking layout

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Responsive: Use horizontal scroll or card layout

---

## Decisions for this build

- **Adopted:** "Avoid wide tables breaking layout" → the rates table becomes stacked cards below 640px.
- **Anchors:** `#rates` and `#availability`; `scroll-padding-top` keeps them clear of the fixed header.
- **Calendar:** Google Calendar iframe, full width, 460px high on mobile and 600px from 768px, lazy-loaded, with a titled fallback link.
- **Season dates:** shown from `site.config.mjs`; while empty the cell shows `[DATES DE SAISON À DÉFINIR] / [SEASON DATES TO BE DEFINED]`.
