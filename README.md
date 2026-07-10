# EcomExperts Test

Wyze bundle builder built with React, TypeScript, Vite, and Tailwind CSS.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (LTS recommended)
- npm (included with Node.js)

## Quick start

From a fresh clone:

```bash
git clone <repository-url>
cd ecomexperts-test
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> Use `npm install` instead of `npm ci` if `package-lock.json` is missing or you need to update dependencies.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server (alias: `npm start`) |
| `npm run build` | Type-check and build for production to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run tests with Vitest |
| `npm run typecheck` | Run TypeScript checks only |

## Production build

```bash
npm ci
npm run build
npm run preview
```

The preview server runs at [http://localhost:4173](http://localhost:4173) by default.

---

## Notes, Decisions & Tradeoffs

### Architecture & Technology

- **TypeScript** — The project is treated as an enterprise-grade codebase, so TypeScript is used throughout with a strict configuration. All state, catalog data, and component props are fully typed.
- **Custom hook for flash message** — The save-confirmation toast is extracted into a dedicated `useFlashMessage` hook, keeping side-effect logic out of components and making it reusable.

### UI & Design Decisions

- **Checkout button pinned on small viewports** — On mobile and tablet, the Checkout and "Save my system for later" buttons are fixed to the bottom of the screen so they remain accessible without scrolling to the bottom of the review panel.
- **Missing design system** — No design tokens, component library, or style guide was provided alongside the Figma. Some components (spacing, typography scale, color values) are approximated by inspecting the design. A full pixel-perfect pass would require the actual design system assets.
- **Plan card & sensor card treated as product card** — The Figma shows distinct card designs for plan selection and sensor products that differ from the camera card. Because no separate UI spec was provided for those variants, the same `ProductCard` component is reused across all categories. For the plans step, the card is rendered in `single`-selection mode (radio-style toggle, no quantity stepper) rather than the `multiple` mode used for cameras and accessories.
- **Pixel-perfect coordination needed** — To fully close the gap between the implementation and the Figma, designer collaboration is required to clarify the complete design system (exact tokens, icon assets, component states, and edge-case layouts).

### Unknowns & Gaps

- **Fast Shipping item** — It is unclear from the brief how the "Fast Shipping" line item is meant to work: whether it is conditionally included, tied to a specific plan tier, or always free. It is currently hardcoded as a static line inside the review panel's Plans group as a placeholder until the business logic is clarified.
- **Wyze Sense Hub pre-selection** — The design implies the Wyze Sense Hub should appear in the review panel as a required, always-included item (shown free of charge), but no rule defining that logic is documented in the brief. To avoid guessing, it is not added as part of the seeded initial state.
- **Price mismatches** — Some prices in the review panel design do not match the product prices in `catalog.json`. For example, the Wyze Cam Pan v3 shows **$47.98** in the Figma review snapshot but is listed as **$34.98** in the catalog. The implementation uses the catalog prices. The correct source of truth (and whether bundle discounts apply) would need to be confirmed before going to production.
