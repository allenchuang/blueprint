---
name: blueprint
description: Build with Blueprint OS — a full-stack Turborepo monorepo (Next.js 15, Fastify, Expo, Drizzle, shadcn/ui, Tailwind v4). Use when working in a Blueprint repository, scaffolding Blueprint apps, adding features to Blueprint projects, or when the user mentions Blueprint OS. Covers architecture, how apps relate, scaffolding, and ecosystem-level knowledge.
---

## If Working in a Blueprint Repo

If you have the Blueprint repo cloned, read these files FIRST — they are authoritative:
1. `CLAUDE.md` at repo root
2. All `.mdc` files in `.claude/rules/`
3. All `.mdc` files in `.agents/rules/`

This skill provides supplementary ecosystem context. The repo rules are the source of truth for code standards.

# Blueprint OS

Blueprint is a production-ready Turborepo monorepo for building full-stack apps with AI agents.

## Architecture

```
blueprint/
├── apps/
│   ├── web/            → Next.js 15 + shadcn/ui + Tailwind CSS v4       :3000
│   ├── admin/          → Next.js 15 + shadcn/ui + Tailwind CSS v4       :3002
│   ├── docs/           → Mintlify documentation                         :3003
│   ├── react-native/   → Expo + Expo Router + NativeWind
│   ├── remotion/       → Remotion video generation                      :3004
│   ├── os/             → Desktop environment (Next.js 15 + shadcn/ui)   :7777
│   ├── clawdash/       → OpenClaw diagnostics dashboard                 :7778
│   └── server/         → Fastify + Swagger API server                   :3001
├── packages/
│   ├── app-config/     → Centralized branding, metadata, assets (SSOT)
│   ├── blueprint-cli/  → npx blueprint CLI
│   ├── db/             → Drizzle ORM + Neon PostgreSQL
│   ├── eslint-config/  → Shared ESLint
│   └── typescript-config/ → Shared TSConfig
├── prompts/            → AI prompt library
```

## How Apps Relate

- **web** is the main consumer-facing app; **admin** is the internal management panel. Both share the same API server and database.
- **react-native** mirrors web features using NativeWind equivalents of shadcn/ui. Features must ship to both simultaneously.
- **server** is the shared Fastify API backend — all frontend apps consume it via React Query hooks.
- **app-config** is the single source of truth for branding, metadata, and assets. All apps import from `@repo/app-config`. Run `pnpm sync-config` after changes.
- **db** holds all Drizzle ORM schemas. All apps share this package for types and queries.
- **docs** is Mintlify-powered documentation for the project.
- **remotion** generates branded video content using app-config for colors/logos.
- **os** is a macOS-style desktop environment UI.
- **clawdash** is the OpenClaw agent diagnostics dashboard.
- **blueprint-cli** (`npx blueprint`) scaffolds new Blueprint projects with optional features.

## Essential Commands

```bash
pnpm install              # Install deps (always pnpm, never npm/yarn)
pnpm dev                  # Start all apps
pnpm dev:<app>            # Start one app (web, admin, server, os, clawdash)
pnpm build                # Build all
pnpm lint && pnpm check-types  # Pre-commit checks
pnpm db:generate          # Generate Drizzle migrations
pnpm db:push              # Push schema to database
pnpm sync-config          # Sync app-config → all apps (theme, assets, OG)
```

**Runtime:** Node.js >= 23 (`.nvmrc` provided), pnpm 10.

## Scaffolding with the CLI

`npx blueprint new` scaffolds a new project with interactive feature selection:

- **Apps:** web (always included), admin, docs, react-native, remotion
- **Database:** Drizzle + Neon PostgreSQL (optional)
- **Auth:** Dynamic (email OTP) or Privy (email, social, wallets) — mutually exclusive
- **Payments:** Stripe integration
- **Integrations:** World MiniApp (MiniKit), ElevenLabs voice, analytics
- **Web features:** i18n, PWA support

Features are gated by environment variables — unconfigured features show fallback UI or unlock everything (Stripe).

## Detailed References

For deeper ecosystem patterns, see:

- **[references/patterns.md](references/patterns.md)** — API schema examples, database conventions, component mapping, testing and performance patterns
- **[references/integrations.md](references/integrations.md)** — Auth (Dynamic/Privy), Stripe payments, World MiniApp, ElevenLabs voice, feature gating
- **[references/governance.md](references/governance.md)** — Agent hard boundaries, git workflow, deployment, asset storage
