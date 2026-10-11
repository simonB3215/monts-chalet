# Contact Page Overrides

> **PROJECT:** Monts-Chalet
> **Generated:** 2026-10-11 13:04:06
> **Page Type:** General

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

- Avoid: No feedback after submit
- Avoid: Placeholder-only inputs

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Forms: Show loading then success/error state
- Accessibility: Use label with for attribute or wrap input

---

## Decisions for this build

- **Adopted:** "Avoid: no feedback after submit" and "placeholder-only inputs" → visible labels, loading state on the button, success / error message in a live region.
- **Validation:** on blur and on submit; error summary at the top receives focus and links to each field; inline errors use `aria-describedby` and `aria-invalid`.
- **Simple booking (Master anti-pattern "Complex booking"):** one screen, five required fields, no account.
- **Sending:** Formspree-compatible endpoint from `site.config.mjs`; without it the form opens a pre-filled email (mailto).
