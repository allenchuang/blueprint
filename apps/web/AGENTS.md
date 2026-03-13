# Web App - Agent Instructions

Next.js 15 app with App Router, shadcn/ui, and Tailwind CSS v4.

## Key Directories

- `src/app/` — Pages and layouts (App Router file-based routing)
- `src/components/ui/` — shadcn/ui primitives (managed by CLI, do not manually edit)
- `src/components/` — Composed feature components
- `src/hooks/` — React Query hooks (one per file, e.g., `use-get-users.ts`)
- `src/lib/utils.ts` — `cn()` utility for Tailwind class merging

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
