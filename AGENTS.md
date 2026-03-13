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
│   ├── app-config/     → Centralized app metadata, branding, and assets
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
pnpm sync-config      # Sync app-config assets/theme to all apps
```

## Package Manager

This project uses **pnpm 10** with workspaces. Always use `pnpm` (never npm or yarn).

---

## Core Rules

### 1. App Config — Single Source of Truth

All app metadata lives in `packages/app-config/src/config.ts`. **Never hardcode** app names, descriptions, colors, URLs, or branding in individual apps.

Import directly in TypeScript apps:

```typescript
import { appConfig } from "@repo/app-config";
```

Brand assets (logos, favicons, icons) live in `packages/app-config/assets/`:
- `logo-light.svg` / `logo-dark.svg` — brand logos
- `favicon.svg` — favicon
- `icon-512.png` / `icon-192.png` — app icons (mobile + PWA)
- `splash.png` — mobile splash screen

Run `pnpm sync-config` after editing the config or assets. This generates theme CSS and copies assets to all apps.

**DO NOT** manually edit generated theme files (`apps/web/src/app/theme.css`, `apps/admin/src/app/theme.css`) or brand assets in `apps/*/public/`.

### 2. Co-Development (Web + Mobile)

When implementing any new UI feature, always implement it in BOTH `apps/web` AND `apps/react-native` simultaneously. Web uses shadcn/ui components; React Native uses NativeWind equivalents. Use identical hook names in both apps.

Component mapping:

| Web (shadcn/ui)     | React Native (NativeWind)                |
|---------------------|------------------------------------------|
| `<Button>`          | `<TouchableOpacity className="...">`     |
| `<Card>`            | `<View className="...">`                 |
| `<Input>`           | `<TextInput className="...">`            |
| `<Dialog>`          | `<Modal>`                                |
| Next.js `<Link>`    | Expo Router `<Link>`                     |

Do NOT implement a feature in web only and "plan to add mobile later."

### 3. API Changes → Swagger

Every new or modified API endpoint in `apps/server` MUST include a Fastify schema definition for automatic Swagger/OpenAPI generation. All endpoints live in `apps/server/src/routes/`. Register routes in `apps/server/src/app.ts`. Verify the endpoint appears at `http://localhost:3001/docs`.

### 4. API Consumption → React Query Hooks

All API calls on the frontend MUST go through React Query hooks.

- Location: `src/hooks/` (web/admin) or `hooks/` (react-native)
- One hook per file: `use-get-users.ts`, `use-create-post.ts`
- Queries: `useGet[Resource]` or `useList[Resources]`
- Mutations: `use[Verb][Resource]` (e.g., `useCreatePost`, `useUpdateUser`)

### 5. Database Changes → packages/db

All schema changes go through `packages/db/src/schema/`. Never write raw SQL for schema changes. Always run `pnpm db:generate` after schema modifications. Export types from `@repo/db`.

Conventions:
- Table names: plural snake_case (`users`, `blog_posts`)
- Column names: snake_case (`created_at`, `user_id`)
- Always include `id`, `createdAt`, `updatedAt` on every table
- Use `uuid` for primary keys with `.defaultRandom()`
- Use `timestamp("...", { withTimezone: true })` for all timestamps

### 6. Documentation Updates

When adding user-facing features or API changes, update `apps/docs/`. Keep docs concise — no filler content. Update `mint.json` navigation when adding new pages. Use Mintlify components where they add clarity.

### 7. shadcn/ui Components

Each Next.js app has independent shadcn installs. Add components with `npx shadcn@latest add <component>` from the app directory. Do NOT manually edit `components/ui/` files. Do NOT copy between apps.

### 8. Remotion Video Creation — Branding

When creating or editing Remotion video compositions, always use `@repo/app-config` for brand identity:

```typescript
import { appConfig } from "@repo/app-config";
```

- `appConfig.name` — app name (never hardcode)
- `appConfig.colors.primary` — primary brand color
- `appConfig.urls.website` — website URL for CTAs / watermarks

Use logo/icon assets from `packages/app-config/assets/` (logo-light.svg, logo-dark.svg, favicon.svg). Load with Remotion's `staticFile()` or `<Img>`. Do NOT hardcode brand colors or store duplicate assets in `apps/remotion/`.

Ensure `@repo/app-config` is in `apps/remotion/package.json`:

```json
"@repo/app-config": "workspace:*"
```

### 9. Code Style

- TypeScript strict mode everywhere, no `any` without justification
- File naming: kebab-case for files, PascalCase for components
- Path alias `@/` maps to `src/`
- Use named exports (not default exports) except for Next.js pages/layouts
- Group imports: (1) external packages, (2) `@repo/*`, (3) local `@/`
- Always use `async/await` over `.then()` chains
- Server Components by default in Next.js; `"use client"` only when needed

### 10. Performance

**Next.js**: Server Components by default, dynamic imports for heavy client components, `next/image` for images, ISR/static for non-realtime pages, appropriate `staleTime`/`gcTime` on queries.

**React Native**: FlatList/FlashList for lists, `useMemo` for expensive computations, `React.memo` for list items, Reanimated for animations.

**Fastify**: Register schemas globally, connection pooling via Neon driver, response compression, proper caching headers.

### 11. Testing

- Colocate test files: `user-service.ts` → `user-service.test.ts`
- Unit/Integration: Vitest; E2E: Playwright; API: Vitest + `app.inject()`; RN: Jest + RNTL
- Test names read as sentences: `it("returns 404 when user not found")`
- Prefer testing behavior over implementation details

### 12. Git Commits

Use conventional commits: `feat(web): add user profile`, `fix(server): handle null email`, `chore(db): add posts schema`.

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`. Scope = app/package name. Omit scope for cross-cutting changes.

Never commit `.env` files. Commit `pnpm-lock.yaml`. Run `pnpm lint` and `pnpm check-types` before committing.

## Environment Variables

Required: `DATABASE_URL` (Neon PostgreSQL connection string)

Copy `.env.example` to `.env` and fill in values. Never commit `.env` files.
