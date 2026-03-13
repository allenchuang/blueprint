# Mastermind

Full-stack monorepo for rapidly building and shipping app ideas. Built with Turborepo for orchestration, with shared packages for database access, linting, and TypeScript configuration.

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
│   ├── db/             → Database schema & client (Drizzle + Neon PostgreSQL)
│   ├── eslint-config/  → Shared ESLint configuration
│   └── typescript-config/ → Shared TypeScript configuration
├── turbo.json          → Turborepo task pipeline
└── pnpm-workspace.yaml → Workspace definition
```

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10 (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Neon** PostgreSQL database (or any PostgreSQL instance)

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
pnpm db:push

# Start all apps in development
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:web` | Start web app only (port 3000) |
| `pnpm dev:admin` | Start admin panel only (port 3002) |
| `pnpm dev:server` | Start API server only (port 3001) |
| `pnpm dev:docs` | Start documentation (port 3003) |
| `pnpm dev:remotion` | Start Remotion studio |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps and packages |
| `pnpm check-types` | Type check all apps and packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema directly to database |
| `pnpm db:studio` | Open Drizzle Studio |

## Running Individual Apps

```bash
# Using turbo filter
pnpm --filter web dev
pnpm --filter server dev
pnpm --filter react-native dev

# Or use the shorthand scripts
pnpm dev:web
pnpm dev:server
```

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

- **`@repo/db`** — Drizzle ORM schema definitions and database client. Used by `web`, `admin`, and `server`.
- **`@repo/eslint-config`** — Shared ESLint configurations (base, Next.js, React).
- **`@repo/typescript-config`** — Shared TypeScript configurations (base, Next.js, React library).

## Environment Variables

Create a `.env` file at the root (or per-app) with:

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

See each app's README for app-specific environment variables.
