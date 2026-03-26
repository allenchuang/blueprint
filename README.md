# Blueprint OS

<div align="center">

**The full-stack developer OS. Build and ship apps faster.**

[![GitHub Stars](https://img.shields.io/github/stars/allenchuang/blueprint?style=social)](https://github.com/allenchuang/blueprint/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-orange?logo=pnpm)](https://pnpm.io/)

[⭐ Star on GitHub](https://github.com/allenchuang/blueprint) · [📖 Docs](https://docs.example.com) · [🚀 Getting Started](#getting-started-in-60-seconds)

</div>

---

## Why Blueprint OS?

Stop stitching together boilerplates. Blueprint OS is a production-ready monorepo that ships everything a modern full-stack team needs — wired together and ready to go.

- **⚡ Ship in hours, not weeks** — Auth, database, API, mobile, video, and AI assistant all pre-configured. Clone and start building your actual product.
- **🏗️ Battle-tested stack** — Next.js 15, Fastify, Drizzle ORM, Expo, Remotion, and shadcn/ui. No experimental tech, no lock-in.
- **🎨 One config, every app** — Change your brand name, color, or logo once in `app-config`. Every app updates automatically via `pnpm sync-config`.
- **🤖 AI assistant built in** — An OpenClaw-powered AI dev assistant is part of the OS. Get help, run commands, and automate tasks without leaving your workflow.

---

## Getting Started in 60 seconds

```bash
# Scaffold a new project
npx blueprint new my-app

# Or clone directly
git clone https://github.com/allenchuang/blueprint.git my-app
cd my-app

# Install dependencies (requires Node 23+, nvm recommended)
nvm install && nvm use
pnpm install

# Set up environment
cp .env.example .env
# → Edit .env: add your DATABASE_URL

# Push DB schema and start everything
pnpm db:push
pnpm dev
```

That's it. All apps start in parallel:
- **Web** → http://localhost:3000
- **API** → http://localhost:3001
- **Admin** → http://localhost:3002
- **Docs** → http://localhost:3003

---

## What's Included

| App | Stack | Port |
|-----|-------|------|
| `apps/web` | Next.js 15 + shadcn/ui + Tailwind | 3000 |
| `apps/server` | Fastify + Swagger/OpenAPI | 3001 |
| `apps/admin` | Next.js 15 + shadcn/ui | 3002 |
| `apps/docs` | Mintlify | 3003 |
| `apps/remotion` | Remotion video generation | 3004 |
| `apps/react-native` | Expo + Expo Router + NativeWind | — |
| `apps/os` | Desktop OS environment | 7777 |

### Built-in Features (pre-wired, no setup beyond `.env`)

- 🔐 **Auth** — Dynamic or Privy (email OTP, social, wallets)
- 🗄️ **Database** — Drizzle ORM + Neon serverless PostgreSQL
- ⚡ **API** — Fastify with auto-generated Swagger docs
- 📱 **Mobile** — Expo with shared hooks and co-development pattern
- 🎬 **Video** — Remotion for programmatic video generation
- 🌍 **i18n** — Multi-language support (EN, ZH, ES) out of the box
- 📲 **PWA** — Manifest, icons, and apple-touch-icon auto-generated
- 🌐 **World Mini App** — MiniKit SDK pre-configured for World App
- 🎙️ **Voice Agent** — ElevenLabs conversational AI, web + mobile
- 📊 **Analytics** — Google Analytics 4 with a single env var
- 🤖 **AI Dev Assistant** — OpenClaw-powered OS desktop environment

---

## Architecture

```
blueprint/
├── apps/
│   ├── web/            → Main web app (Next.js + shadcn/ui + Tailwind)         :3000
│   ├── admin/          → Admin panel (Next.js + shadcn/ui + Tailwind)          :3002
│   ├── docs/           → Documentation (Mintlify)                              :3003
│   ├── react-native/   → Mobile app (Expo + Expo Router + NativeWind)
│   ├── remotion/       → Video generation (Remotion)                           :3004
│   ├── os/             → Desktop environment (Next.js + shadcn/ui + Tailwind)  :7777
│   ├── clawdash/       → OpenClaw diagnostics dashboard (Next.js + shadcn/ui) :7778
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

---

## Prerequisites

- **Node.js** >= 23 — the repo includes an `.nvmrc` (see setup below)
- **nvm** (recommended) — [install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node versions
- **pnpm** >= 10 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Neon** PostgreSQL database (or any PostgreSQL instance)

### Node.js Setup

```bash
# Install nvm (if you don't have it)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Install and use the required Node version
nvm install
nvm use
```

---

## Configuring Your App

All app identity — name, branding, colors, URLs, and assets — lives in one file: `packages/app-config/src/config.ts`.

```typescript
export const appConfig = {
  name: "My App",
  slug: "my-app",
  description: "What my app does",
  slogan: "Your catchy tagline here",
  colors: { primary: "#6366f1" },
  urls: {
    website: "https://myapp.com",
    api: "http://localhost:3001",
  },
  socials: {
    github: "https://github.com/my-org/my-app",
  },
} satisfies AppConfig;
```

Then run:
```bash
pnpm sync-config
```

This single command syncs your branding — theme CSS, logos, favicons, OG images, mobile config — to every app automatically.

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in parallel |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps and packages |
| `pnpm check-types` | Type-check all apps and packages |
| `pnpm sync-config` | Sync branding, theme, and assets to all apps |
| `pnpm db:push` | Push schema to database (dev shortcut) |
| `pnpm db:studio` | Open Drizzle Studio |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 15, React 19, shadcn/ui, Tailwind CSS v4 |
| Mobile | Expo, Expo Router, NativeWind, React Native |
| API Server | Fastify, Swagger/OpenAPI |
| Database | Drizzle ORM, Neon (serverless PostgreSQL) |
| Video | Remotion |
| Monorepo | Turborepo, pnpm workspaces |
| Language | TypeScript (strict mode) |

---

## CLI

```bash
# Scaffold a new Blueprint project
npx blueprint new my-app

# Inside an existing project, proxy to workspace scripts
blueprint dev
blueprint sync-config
blueprint db:push
```

---

## License

MIT © [allenchuang](https://github.com/allenchuang)

---

<div align="center">
  <strong>If Blueprint OS saves you time, please ⭐ star the repo — it helps more developers discover it.</strong>
  <br />
  <a href="https://github.com/allenchuang/blueprint">github.com/allenchuang/blueprint</a>
</div>
