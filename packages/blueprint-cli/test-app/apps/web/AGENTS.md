# Web App - Agent Instructions

Next.js 15 app with App Router, shadcn/ui, and Tailwind CSS v4.

## Key Directories

- `src/app/` — Pages and layouts (App Router file-based routing)
- `src/components/ui/` — shadcn/ui primitives (managed by CLI, do not manually edit)
- `src/components/layout/` — Layout components (mobile-top-nav, mobile-footer, mobile-layout)
- `src/components/mobile/` — Mobile interaction components (bottom-sheet, slide-in-sheet)
- `src/components/` — Composed feature components
- `src/hooks/` — React Query hooks + utility hooks (e.g., `use-mobile.ts`)
- `src/lib/utils.ts` — `cn()` utility for Tailwind class merging
- `src/lib/mobile-animations.ts` — Shared animation presets for native-like mobile UX

## Rules

- Default to Server Components. Add `"use client"` only for interactivity.
- All API calls go through React Query hooks in `src/hooks/`.
- Add shadcn components via `npx shadcn@latest add <component>` from this directory.
- When adding a feature here, also implement it in `apps/react-native`.
- Uses `@repo/db` for database access.

## Commands

```bash
pnpm --filter web dev     # Dev server on port 3000
pnpm --filter web build   # Production build
```
