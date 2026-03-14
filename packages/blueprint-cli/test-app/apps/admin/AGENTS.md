# Admin Panel - Agent Instructions

Next.js 15 admin dashboard with shadcn/ui (slate theme) and Tailwind CSS v4.

## Key Directories

Same structure as `apps/web`. Independent shadcn/ui install with slate base color.

- `src/app/` — Pages and layouts
- `src/components/ui/` — shadcn/ui primitives
- `src/hooks/` — React Query hooks

## Rules

- Same patterns as `apps/web` (Server Components default, React Query hooks, etc.)
- Has its own shadcn theme — do not share components with web app
- Uses `@repo/db` for database access

## Commands

```bash
pnpm --filter admin dev     # Dev server on port 3002
pnpm --filter admin build   # Production build
```
