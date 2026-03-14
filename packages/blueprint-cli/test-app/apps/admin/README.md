# Admin Panel

Admin dashboard for Mastermind. Same stack as the web app but with an independent shadcn/ui theme (slate base color).

## Tech Stack

- **Next.js 15** with App Router and React Server Components
- **shadcn/ui** (independently installed, slate theme)
- **Tailwind CSS v4**
- **React Query** for server state management
- **`@repo/db`** for database access

## Development

```bash
# From monorepo root
pnpm dev:admin

# Or directly
pnpm --filter admin dev
```

Runs on **http://localhost:3002**.

## Directory Structure

```
src/
├── app/            → Next.js App Router pages and layouts
├── components/
│   └── ui/         → shadcn/ui components (own theme)
├── hooks/          → React Query hooks for API calls
└── lib/
    └── utils.ts    → Utility functions
```

## Patterns

Same patterns as the web app. See [`apps/web/README.md`](../web/README.md) for details.

The admin panel has its own shadcn/ui theme with a **slate** base color, distinct from the web app's **neutral** base.

## Adding shadcn Components

```bash
cd apps/admin
npx shadcn@latest add button
npx shadcn@latest add data-table
```

## Build

```bash
pnpm --filter admin build
```
