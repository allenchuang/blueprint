# Mastermind - Agent Instructions

## Repository Map

This is a Turborepo monorepo with the following structure:

```
mastermind/
├── apps/
│   ├── web/            → Main web app (Next.js 15 + shadcn/ui + Tailwind CSS v4, port 3000)
│   ├── admin/          → Admin panel (Next.js 15 + shadcn/ui + Tailwind CSS v4, port 3002)
│   ├── docs/           → Documentation (Mintlify, port 3003)
│   ├── react-native/   → Mobile app (Expo + Expo Router + NativeWind)
│   ├── remotion/       → Video generation (Remotion, port 3004)
│   └── server/         → API server (Fastify + Swagger, port 3001)
├── packages/
│   ├── db/             → Drizzle ORM + Neon PostgreSQL schema
│   ├── eslint-config/  → Shared ESLint configs
│   └── typescript-config/ → Shared TypeScript configs
```

## Build & Dev Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all apps
pnpm dev:web          # Start web only
pnpm dev:admin        # Start admin only
pnpm dev:server       # Start server only
pnpm build            # Build all apps
pnpm lint             # Lint all
pnpm check-types      # Type check all
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio
```

## Core Rules

### 1. Co-Development (Web + Mobile)
When implementing any new UI feature, always implement it in BOTH `apps/web` AND `apps/react-native` simultaneously. Web uses shadcn/ui components; React Native uses NativeWind equivalents. Use identical hook names in both apps.

### 2. API Changes → Swagger
Every new or modified API endpoint in `apps/server` MUST include a Fastify schema definition for automatic Swagger/OpenAPI generation. Verify the endpoint appears at `http://localhost:3001/docs`.

### 3. API Consumption → React Query Hooks
All API calls on the frontend MUST go through React Query hooks. One hook per file in `src/hooks/` (web/admin) or `hooks/` (react-native). Naming: `useGet[Resource]`, `useCreate[Resource]`, `useUpdate[Resource]`, `useDelete[Resource]`.

### 4. Database Changes → packages/db
All schema changes go through `packages/db/src/schema/`. Never write raw SQL for schema changes. Always run `pnpm db:generate` after schema modifications. Export types from `@repo/db`.

### 5. Documentation Updates
When adding user-facing features or API changes, update `apps/docs/`. Keep docs concise — no filler content. Update `mint.json` navigation when adding new pages.

### 6. shadcn/ui Components
Each Next.js app has independent shadcn installs. Add components with `npx shadcn@latest add <component>` from the app directory. Do NOT manually edit `components/ui/` files.

### 7. Code Style
- TypeScript strict mode everywhere, no `any` without justification
- File naming: kebab-case for files, PascalCase for components
- Path alias `@/` maps to `src/`
- Server Components by default in Next.js; `"use client"` only when needed
- Use `pnpm` exclusively (never npm/yarn)

### 8. Git Commits
Use conventional commits: `feat(web): add user profile`, `fix(server): handle null email`, `chore(db): add posts schema`.

## Environment Variables

Required: `DATABASE_URL` (Neon PostgreSQL connection string)

Copy `.env.example` to `.env` and fill in values. Never commit `.env` files.
