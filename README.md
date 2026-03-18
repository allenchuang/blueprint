# Blueprint

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
│   ├── blueprint-cli/  → npx blueprint CLI (scaffold & workspace commands)
│   ├── db/             → Database schema & client (Drizzle + Neon PostgreSQL)
│   ├── eslint-config/  → Shared ESLint configuration
│   └── typescript-config/ → Shared TypeScript configuration
├── prompts/            → AI prompt library (branding, design systems, components)
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

## Built-in Features

Blueprint ships with production-ready scaffolding out of the box. Every feature below is pre-wired — no setup beyond filling in environment variables.

- 🎨 Centralized App Config
- 🌐 World Mini App (MiniKit SDK)
- 🌍 Internationalization (i18n)
- 📱 Mobile-First Web UX
- 📲 PWA Support
- 🧩 shadcn/ui Component Library
- 🔄 React Query Data Fetching
- 🗄️ Database (Drizzle + Neon)
- ⚡ API Server (Fastify + Swagger)
- 🎬 Video Generation (Remotion)
- 📖 Documentation (Mintlify)
- 📊 Google Analytics
- 🔀 Co-Development (Web + Mobile)

### Centralized App Config

All app identity (name, colors, URLs, socials, mobile bundle IDs) lives in a single file: `packages/app-config/src/config.ts`. Every app imports from `@repo/app-config` — nothing is hardcoded. Running `pnpm sync-config` propagates branding, theme CSS, OG images, favicons, and mobile config to every app automatically.

### World Mini App (MiniKit SDK)

`apps/web` is pre-configured as a [World Mini App](https://docs.world.org/mini-apps) — a web app that runs natively inside World App's webview.

- **MiniKitProvider** wraps the app in the root layout for SDK initialization
- **Convenience hook** (`src/hooks/use-minikit.ts`) exposes `isInstalled`, user info, device properties, and launch location
- **Server-side API routes** under `src/app/api/minikit/`:
  - `verify/` — World ID proof verification via `verifyCloudProof()`
  - `confirm-payment/` — payment confirmation via Developer Portal API
  - `nonce/` — SIWE nonce generation for wallet authentication
  - `complete-siwe/` — SIWE signature verification for wallet auth
- **Webview-optimized CSS** — `overscroll-behavior: none`, `viewport-fit: cover`, `user-scalable: false`
- Supports all MiniKit commands: verify, pay, wallet auth, send transaction, sign message, share contacts, haptic feedback, notifications, and sharing

### Internationalization (i18n)

Multi-language support via i18next is wired into both `apps/web` and `apps/react-native`.

- Supported languages defined in `packages/app-config/src/languages.json` (currently English, Chinese Simplified, Spanish)
- Translation files organized by locale and namespace: `src/i18n/locales/{locale}/{namespace}.json`
- Auto-detects browser language with `i18next-browser-languagedetector` (web) and `expo-localization` (mobile)
- `I18nProvider` wraps the app — all user-facing strings use `useTranslation()` hooks

### Mobile-First Web UX

`apps/web` includes native-like mobile interaction patterns for sub-768px viewports.

- **MobileTopNav** — fixed top bar with back chevron, centered title, optional right slot
- **MobileFooter** — sticky bottom tab bar with safe-area handling
- **MobileLayout** — responsive wrapper that renders mobile nav on small screens
- **BottomSheet** — drag-to-dismiss bottom drawer (built on vaul)
- **SlideInSheet** — full-screen slide-from-right panel for detail views
- **Animation presets** in `src/lib/mobile-animations.ts` — spring physics, page transitions, tap feedback, stagger animations
- **`useIsMobile()`** hook for JS detection + Tailwind `md:hidden`/`md:block` for CSS

### PWA Support

- `manifest.json`, app icons (`icon-192.png`, `icon-512.png`), and `apple-touch-icon.png` auto-generated by `pnpm sync-config`
- Apple Web App meta tags pre-configured in the root layout
- Viewport set with `viewport-fit: cover` for edge-to-edge rendering

### shadcn/ui Component Library

Each Next.js app (`web`, `admin`) has an independent shadcn/ui install with the `new-york` style and CSS variables. Pre-installed primitives include Button, Dialog, Drawer, and Sheet. Add more with `npx shadcn@latest add <component>` from the app directory.

### React Query Data Fetching

`@tanstack/react-query` is installed and ready. All API calls should go through React Query hooks in `src/hooks/` following the naming convention: `useGet[Resource]`, `useList[Resources]`, `use[Verb][Resource]`.

### Database (Drizzle + Neon)

Schema-first database access via Drizzle ORM with Neon serverless PostgreSQL. Schema lives in `packages/db/src/schema/` and is shared across `web`, `admin`, and `server`. Includes migration generation, direct push, and Drizzle Studio for visual data browsing.

### API Server (Fastify + Swagger)

`apps/server` provides a Fastify API with auto-generated Swagger/OpenAPI docs at `/docs`. Every endpoint includes a schema definition for type-safe request/response validation and documentation.

### Video Generation (Remotion)

`apps/remotion` supports programmatic video creation in React. Compositions automatically pull branding from `@repo/app-config`.

### Documentation (Mintlify)

`apps/docs` is a Mintlify documentation site. Name, colors, and links are auto-synced from app-config via `pnpm sync-config`.

### Google Analytics

Optional GA4 integration via `@next/third-parties`. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env` to enable.

### Co-Development (Web + Mobile)

Every UI feature is expected to ship in both `apps/web` and `apps/react-native` simultaneously. Shared hook names, shared data shapes, platform-specific UI primitives.

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
- Patches **Mintlify** `docs.json` (name, colors, and supported links)
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

- **`blueprint`** (`packages/blueprint-cli`) — Published CLI for scaffolding and managing Blueprint projects. See [CLI Usage](#cli-usage) below.
- **`@repo/app-config`** — Centralized app metadata, branding colors, URLs, slogan, and assets. Used by all apps. Run `pnpm sync-config` after edits. Also generates OG images from a banner + slogan.
- **`@repo/db`** — Drizzle ORM schema definitions and database client. Used by `web`, `admin`, and `server`.
- **`@repo/eslint-config`** — Shared ESLint configurations (base, Next.js, React).
- **`@repo/typescript-config`** — Shared TypeScript configurations (base, Next.js, React library).

---

## CLI Usage

The `blueprint` CLI is published to npm and lets anyone scaffold or manage a Blueprint project.

### Scaffold a new project

```bash
npx blueprint new my-app
```

This will:
1. Clone the Blueprint repo into `./my-app`
2. Remove the origin git history
3. Optionally prompt for `DATABASE_URL` and write `.env`
4. Run `pnpm install`
5. Initialize a fresh git repository

### Run workspace commands

When inside an existing Blueprint project, the CLI proxies to the root pnpm scripts:

```bash
blueprint dev              # pnpm dev (all apps)
blueprint dev:web          # pnpm dev:web
blueprint sync-config      # pnpm sync-config
blueprint build            # pnpm build
blueprint lint             # pnpm lint
blueprint check-types      # pnpm check-types
blueprint db:push          # pnpm db:push
blueprint db:studio        # pnpm db:studio
```

### Publishing the CLI

```bash
cd packages/blueprint-cli
pnpm build
npm publish --access public
```

## Environment Variables

Create a `.env` file at the root (or per-app) with:

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

See each app's README for app-specific environment variables.
