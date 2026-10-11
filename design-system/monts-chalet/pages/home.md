# Home Page Overrides

> **PROJECT:** Monts-Chalet
> **Generated:** 2026-10-11 13:04:04
> **Page Type:** Landing / Marketing

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- No overrides — use Master colors

### Component Overrides

- No overrides — use Master component specs

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: @keyframes text animation, typing effect, background-clip: text, GSAP ScrollTrigger, split text

---

## Decisions for this build

- **Adopted:** full-width sections with centred 1200px content; hero at viewport height with one headline, the location line and two buttons.
- **Rejected:** typing effect, split text, `background-clip: text` and GSAP ScrollTrigger from the generated recommendations. They conflict with Motion 2/10 and with the brief ("avoid abrupt animation").
- **Hero text contrast:** white text sits on a neutral dark scrim (80% → 12%) plus a soft text shadow.
- **Mobile:** hero height leaves room for the fixed bottom CTA bar; facts grid is 2 columns.
- **Bento preview:** one 2×2 photo and four small ones from 1024px; 2 columns below.
