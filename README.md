# Mastermind

Full-stack monorepo for rapidly building and shipping app ideas. Built with Turborepo for orchestration, with shared packages for app configuration, database access, linting, and TypeScript configuration.

## Architecture

```
mastermind/
├── apps/
│   ├── web/            → Main web app (Next.js + shadcn/ui + Tailwind)         :3000
│   ├── admin/          → Admin panel (Next.js + shadcn/ui + Tailwind)          :3002
│   ├── docs/           → Documentation (Mintlify)                              :3003
│   ├── react-native/   → Mobile app (Expo + Expo Router + NativeWind)
│   ├── remotion/       → Video generation (Remotion)                           :3004
│   └── server/         → API server (Fastify + Swagger)                        :3001
├── packages/
│   ├── app-config/     → Centralized app metadata, branding, and assets
│   ├── db/             → Database schema & client (Drizzle + Neon PostgreSQL)
│   ├── eslint-config/  → Shared ESLint configuration
│   └── typescript-config/ → Shared TypeScript configuration
├── turbo.json          → Turborepo task pipeline
└── pnpm-workspace.yaml → Workspace definition
```

## Prerequisites

- **Node.js** >= 23 (use `nvm use` — the repo includes an `.nvmrc`)
- **pnpm** >= 10 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Neon** PostgreSQL database (or any PostgreSQL instance)

## Getting Started

```bash
# 1. Switch to the correct Node version
nvm use

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Push database schema
pnpm db:push

# 5. Customize your app identity (see "Configuring Your App" below)
# Edit packages/app-config/src/config.ts, then:
pnpm sync-config

# 6. Start all apps in development
pnpm dev
```

---

## Configuring Your App

All app identity — name, branding, colors, URLs, and assets — is managed from a single place: `packages/app-config/`.

### 1. Edit the config

Open `packages/app-config/src/config.ts` and set your values:

```typescript
export const appConfig = {
  name: "My App",                          // Display name everywhere
  slug: "my-app",                          // URL-safe slug, bundle IDs
  description: "What my app does",         // Meta descriptions, store listings
  slogan: "Your catchy tagline here",      // OG images, landing pages
  version: "0.1.0",

  colors: {
    primary: "#6366f1",                    // Brand color — generates full theme
  },

  urls: {
    website: "https://myapp.com",
    api: "http://localhost:3001",
    docs: "https://docs.myapp.com",
    supportEmail: "support@myapp.com",
  },

  mobile: {
    bundleId: "com.myapp.app",
    scheme: "myapp",
  },

  socials: {
    github: "https://github.com/my-org/my-app",
    twitter: "https://twitter.com/myapp",
  },
} satisfies AppConfig;
```

### 2. Add brand assets

Place your assets in `packages/app-config/assets/`:

| File | Purpose |
|------|---------|
| `logo-light.svg` | Logo for light backgrounds |
| `logo-dark.svg` | Logo for dark backgrounds |
| `favicon.svg` | Browser favicon |
| `icon-512.png` | App icon (mobile + PWA) |
| `icon-192.png` | Small app icon (PWA) |
| `splash.png` | Mobile splash screen |
| `og-banner.png` | Banner image for OG image generation (1200x630 recommended) |
| `og-font.ttf` | (Optional) Custom font for OG image text |

### 3. Sync to all apps

```bash
pnpm sync-config
```

This single command:

- Generates a full OKLCH light/dark **theme.css** from your primary color → `apps/web` and `apps/admin`
- Copies **logos, favicons, and icons** to all web apps
- Patches **React Native** `app.json` (name, slug, bundle ID, splash colors)
- Patches **Mintlify** `mint.json` (name, colors, socials, links)
- Generates an **OpenGraph image** (`og.png`) from your banner + slogan → `apps/web` and `apps/admin`

### 4. Use in code

```typescript
import { appConfig } from "@repo/app-config";

// Access any value
appConfig.name        // "My App"
appConfig.slogan      // "Your catchy tagline here"
appConfig.colors.primary  // "#6366f1"
appConfig.urls.api    // "http://localhost:3001"
```

---

## Scripts Reference

### Global (run from repo root)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in parallel |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps and packages |
| `pnpm check-types` | Type-check all apps and packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm sync-config` | Sync app-config branding, theme, and assets to all apps |

### Web App (`apps/web` — port 3000)

| Command | Description |
|---------|-------------|
| `pnpm dev:web` | Start the Next.js dev server |
| `pnpm --filter web build` | Production build |
| `pnpm --filter web lint` | Lint the web app |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component (run from `apps/web/`) |

### Admin Panel (`apps/admin` — port 3002)

| Command | Description |
|---------|-------------|
| `pnpm dev:admin` | Start the admin dev server |
| `pnpm --filter admin build` | Production build |
| `pnpm --filter admin lint` | Lint the admin app |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component (run from `apps/admin/`) |

### API Server (`apps/server` — port 3001)

| Command | Description |
|---------|-------------|
| `pnpm dev:server` | Start the Fastify dev server |
| `pnpm --filter server build` | Production build |
| Visit `http://localhost:3001/docs` | Interactive Swagger/OpenAPI docs |

### Documentation (`apps/docs` — port 3003)

| Command | Description |
|---------|-------------|
| `pnpm dev:docs` | Start the Mintlify dev server |

### Mobile (`apps/react-native`)

| Command | Description |
|---------|-------------|
| `pnpm --filter react-native dev` | Start the Expo dev server |
| `pnpm --filter react-native ios` | Run on iOS simulator |
| `pnpm --filter react-native android` | Run on Android emulator |

### Remotion (`apps/remotion` — port 3004)

| Command | Description |
|---------|-------------|
| `pnpm dev:remotion` | Start Remotion Studio |
| `pnpm --filter remotion build` | Render video compositions |

### Database

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate Drizzle migration files from schema changes |
| `pnpm db:migrate` | Run pending migrations against the database |
| `pnpm db:push` | Push schema directly to database (skips migrations — good for dev) |
| `pnpm db:studio` | Open Drizzle Studio to browse/edit data |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 15, React 19, shadcn/ui, Tailwind CSS v4 |
| Admin Panel | Next.js 15, React 19, shadcn/ui, Tailwind CSS v4 |
| Mobile | Expo, Expo Router, NativeWind, React Native |
| Video | Remotion |
| API Server | Fastify, Swagger/OpenAPI |
| Database | Drizzle ORM, Neon (serverless PostgreSQL) |
| Monorepo | Turborepo, pnpm workspaces |
| Language | TypeScript (strict mode) |

## Shared Packages

- **`@repo/app-config`** — Centralized app metadata, branding colors, URLs, slogan, and assets. Used by all apps. Run `pnpm sync-config` after edits. Also generates OG images from a banner + slogan.
- **`@repo/db`** — Drizzle ORM schema definitions and database client. Used by `web`, `admin`, and `server`.
- **`@repo/eslint-config`** — Shared ESLint configurations (base, Next.js, React).
- **`@repo/typescript-config`** — Shared TypeScript configurations (base, Next.js, React library).

## Environment Variables

Create a `.env` file at the root (or per-app) with:

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

See each app's README for app-specific environment variables.
