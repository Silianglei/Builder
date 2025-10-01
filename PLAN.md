### Design Improvement Plan

This plan outlines a pragmatic, phased approach to elevate the product’s design quality, consistency, and accessibility while preserving velocity. It is tailored to the current Next.js 15 + Tailwind setup with CSS variables, Radix UI primitives, and custom UI components under `frontend/src/components/ui`.

---

### 1) Current State Summary
- Tech: Next.js 15 App Router, TailwindCSS, Radix UI (`@radix-ui/react-dialog`), `class-variance-authority`, `tailwind-merge`.
- Tokens: Central color tokens in `frontend/src/styles/globals.css` mapped into Tailwind in `tailwind.config.ts`.
- Components: Custom primitives (`button.tsx`, `input.tsx`, `card.tsx`, `modal.tsx`), plus ad‑hoc styles (e.g., glassmorphism, gradient text) spread across pages.
- Theming: Single dark theme via CSS variables; no runtime theme switching yet.
- Motion: Custom keyframes defined both in Tailwind config and raw CSS, plus inline `<style jsx global>` in pages.
- Docs: `docs/styles.md` contains a large set of patterns not fully centralized in code.

Key issues observed:
- Design tokens exist but are not fully enforced; pages override tokens with hex literals (e.g., `bg-[#0a0a0a]`).
- Motion and effects duplicated (globals.css + inline `style jsx global` blocks).
- Component styles partially centralized but some patterns live directly in pages (e.g., landing, dashboard).
- No light mode; no tokenized spacing/typography scale beyond Tailwind defaults.
- Accessibility and consistency of focus states depend on individual components.

---

### 2) Design Principles
- Consistency first: all colors, spacing, radii, shadows, and motion come from a single source of truth.
- Token-driven: consume CSS variables through Tailwind theme and avoid raw hex values in components/pages.
- Progressive enhancement: tasteful motion; prefer low-cost, GPU-friendly transforms.
- Accessible by default: keyboard, focus, and contrast meet WCAG AA.
- Composable primitives: small, reusable UI primitives compose more complex views.

---

### 3) Token System and Theming
Deliverables:
- Consolidate tokens in `globals.css` and expose them via `tailwind.config.ts` only. Remove raw hex in pages.
- Extend tokens beyond color: spacing, radii, shadows, z-indices, container widths, motion durations/easings.
- Add light theme via `next-themes` and `data-theme` attributes.

Actions:
- Add `:root[data-theme="dark"]` and `:root[data-theme="light"]` blocks in `globals.css`. Mirror keys.
- Map all tokens to Tailwind `theme.extend.{colors,spacing,borderRadius,boxShadow}`.
- Create a `styles/tokens.md` that mirrors `docs/styles.md` summaries with the authoritative token table.

Success criteria:
- 0 hard-coded hex colors in `src/app` and `src/components` except in token definitions.
- Toggle between dark/light without component edits.

---

### 4) Component Library Consolidation
Deliverables:
- Elevate `frontend/src/components/ui` into a cohesive set: `Button`, `Input`, `Card`, `Modal`, `Badge`, `Tabs`, `Toast`, `Sheet`, `Dropdown`, `Skeleton`.
- Ensure each component supports variants via `cva` and consumes tokens.

Actions:
- Audit usages of ad‑hoc elements in `page.tsx` and `dashboard/page.tsx` and migrate to primitives (e.g., replace custom nav pills/tabs, badges, skeletons).
- Add `variants` to `Button` for `primary|secondary|ghost|link|destructive` and sizes; align colors with tokens.
- Extract common “glass card” as `Card` variant or a utility `glass-card` class backed by tokens.

Success criteria:
- No repeated class soup for the same pattern across pages; usage funnels through `ui` primitives.

---

### 5) Layout System
Deliverables:
- Create standard layouts: `MarketingLayout` (landing), `AppLayout` (auth + navbar), `DashboardLayout` (with optional sidebar), and `CenteredLayout` (auth/empty states).

Actions:
- Move nav and background effects from pages to layouts with optional props.
- Create `components/layout/navbar.tsx` enhancements to accept title/slots and consistent spacing.
- Add responsive container utility via Tailwind plugin or `max-w` tokens.

Success criteria:
- No inline layout duplication; pages import one of the 3-4 layouts.

---

### 6) Motion & Visual Effects
Deliverables:
- Centralize keyframes and animation classes in `globals.css` and Tailwind config; remove inline `<style jsx global>`.
- Introduce an ergonomic `motion.ts` helper mapping tokenized durations/easings.

Actions:
- Add tokens: `--easing-standard`, `--duration-sm|md|lg` and map to Tailwind `transitionTimingFunction` and `transitionDuration`.
- Refactor landing and dashboard to use standardized `animate-fade-in`, `animate-float`, `animate-shimmer` classes only.

Success criteria:
- 0 custom `<style jsx global>` animation blocks in pages.

---

### 7) Accessibility & States
Deliverables:
- Standard focus rings, disabled, error, and loading states across components.
- Color contrast validated for both themes.

Actions:
- Ensure all interactive components implement `:focus-visible` with tokenized ring.
- Add `aria-*` and `role` attributes in `Modal`, `Dropdown`, and `Tabs` based on Radix patterns.
- Provide `Skeleton` and `EmptyState` primitives; enforce their use.

Success criteria:
- Keyboard-only navigation passes through all critical flows. Axe core scan yields no critical issues.

---

### 8) Content & Iconography
Deliverables:
- Consolidate icons: keep `lucide-react` for UI icons; move custom SVG logos to a shared `icons` folder.

Actions:
- Create `components/icons` with named exports. Replace inline SVGs in landing/dashboard with imports.
- Provide `IconBadge` pattern for text-with-icon rows.

Success criteria:
- No inline SVG repetition; all references import from the same place.

---

### 9) Documentation
Deliverables:
- `docs/styles.md` remains the narrative guide; add `docs/design/usage.md` and `docs/design/components.md` with live code examples.

Actions:
- Co-locate Story-like usage snippets inside `components/ui/__examples__` for quick preview in docs.
- Add a short “How to add a new component” checklist.

Success criteria:
- New contributors can style features without asking for guidance.

---

### 10) Roadmap (Phased)

Phase 0 — Foundation (0.5 day)
- Add light theme tokens and map to Tailwind.
- Centralize animations in `globals.css`; delete inline `<style jsx global>` blocks.

Phase 1 — Primitives (1–2 days)
- Expand `ui` with `Badge`, `Tabs`, `Dropdown`, `Skeleton`, `Toast`.
- Refactor `Button` variants and `Card` glass variant.

Phase 2 — Layouts (1 day)
- Introduce standardized layouts and migrate landing + dashboard.
- Extract navbar into configurable component.

Phase 3 — Migrations (1–2 days)
- Replace ad‑hoc classes in `page.tsx` and `dashboard/page.tsx` with primitives/tokens.
- Move SVGs to `components/icons`.

Phase 4 — Accessibility & QA (0.5–1 day)
- Axe and keyboard audit; fix focus/contrast; add tests for critical flows.

Phase 5 — Documentation (0.5 day)
- Update `docs/design/*` and `styles.md` cross‑references. Add usage snippets.

---

### 11) Success Metrics
- Visual consistency: <5% variance in spacing/colors across analogous components.
- Theming: Dark/light parity with no ad‑hoc overrides.
- Reuse: ≥80% of new UI uses primitives or documented utilities.
- Accessibility: 0 critical Axe issues; key flows fully keyboard-navigable.
- Code hygiene: 0 inline global style blocks for animations; 0 raw hexes in components/pages.

---

### 12) Implementation Notes (Repo-Specific)
- Use `next-themes` already in deps to enable theme toggle in `RootProvider` or `layout.tsx`.
- Keep `docs/styles.md` as the canonical pattern catalog; mirror token names exactly to avoid drift.
- Prefer CSS variables for any new surface (e.g., radii: `--radius-md`, shadows: `--shadow-card`).
- When in doubt, add a variant to a primitive, not a bespoke page-level class list.

---

### 13) Immediate Next Steps Checklist
- Add light tokens and theme switcher in layout.
- Create `components/icons` and migrate landing/dashboard SVGs.
- Replace inline animation `<style jsx global>` with standardized classes.
- Introduce `Badge`, `Tabs`, `Dropdown`, `Skeleton` primitives.
- Migrate landing CTA and integration cards to `Button`, `Card`, and `IconBadge` patterns.

