# Web App

Main web application for Blueprint. Built with Next.js 15, shadcn/ui, and Tailwind CSS v4.

## Tech Stack

- **Next.js 15** with App Router and React Server Components
- **shadcn/ui** for UI primitives (independently installed)
- **Tailwind CSS v4** for styling
- **React Query** (`@tanstack/react-query`) for server state management
- **`@repo/db`** for database access

## Development

```bash
# From monorepo root
pnpm dev:web

# Or directly
pnpm --filter web dev
```

Runs on **http://localhost:3000**.

## Directory Structure

```
src/
├── app/            → Next.js App Router pages and layouts
│   ├── globals.css → Tailwind CSS entry point
│   ├── layout.tsx  → Root layout
│   └── page.tsx    → Home page
├── components/
│   └── ui/         → shadcn/ui components (auto-generated)
├── hooks/          → React Query hooks for API calls
└── lib/
    └── utils.ts    → Utility functions (cn helper)
```

## Patterns

- **Server Components by default** — only add `"use client"` when you need interactivity
- **React Query hooks** in `src/hooks/` for all API calls (e.g., `useGetUsers.ts`)
- **shadcn components** added via `npx shadcn@latest add <component>` from this directory
- **Path alias** `@/` maps to `src/`

## Adding shadcn Components

```bash
cd apps/web
npx shadcn@latest add button
npx shadcn@latest add card
```

## Environment Variables

Uses root `.env` for `DATABASE_URL`. Add app-specific variables in `apps/web/.env.local`.

## Build

```bash
pnpm --filter web build
```
