# Blueprint - Agent Instructions

## Repository Map

This is a Turborepo monorepo with the following structure:

```
blueprint/
├── apps/
│   ├── web/            → Main web app (Next.js 15 + shadcn/ui + Tailwind CSS v4, port 3000)
│   ├── admin/          → Admin panel (Next.js 15 + shadcn/ui + Tailwind CSS v4, port 3002)
│   ├── docs/           → Documentation (Mintlify, port 3003)
│   ├── react-native/   → Mobile app (Expo + Expo Router + NativeWind)
│   ├── remotion/       → Video generation (Remotion, port 3004)
│   ├── os/             → Desktop environment (Next.js 15 + shadcn/ui + Tailwind CSS v4, port 7777)
│   ├── clawdash/       → OpenClaw diagnostics dashboard (Next.js 15 + shadcn/ui, port 7778)
│   └── server/         → API server (Fastify + Swagger, port 3001)
├── packages/
│   ├── app-config/     → Centralized app metadata, branding, and assets
│   ├── blueprint-cli/  → npx blueprint CLI (scaffold & workspace commands)
│   ├── db/             → Drizzle ORM + Neon PostgreSQL schema
│   ├── eslint-config/  → Shared ESLint configs
│   └── typescript-config/ → Shared TypeScript configs
├── prompts/            → AI prompt library (branding, design systems, components)
```

## Build & Dev Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all apps
pnpm dev:web          # Start web only
pnpm dev:admin        # Start admin only
pnpm dev:server       # Start server only
pnpm dev:os           # Start OS desktop only
pnpm dev:clawdash     # Start ClawDash dashboard only
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

## Runtime

Node.js >= 23 (`.nvmrc` is provided — run `nvm use`).

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
- `og-banner.png` / `og-banner.jpg` — banner for OG image generation
- `og-font.ttf` — (optional) custom font for OG image text

The config also includes `slogan` (used on OG images and landing pages).

Run `pnpm sync-config` after editing the config or assets. This generates theme CSS, OG images, and copies assets to all apps.

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

When adding user-facing features or API changes, update `apps/docs/`. Keep docs concise — no filler content. Update `docs.json` navigation when adding new pages. Use Mintlify components where they add clarity.

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

### 12. Mobile Web Patterns

On mobile viewports (`< 768px`), `apps/web` uses native-like navigation and interaction patterns:

- **`MobileTopNav`** — fixed top bar with back chevron (left), centered title, optional right slot
- **`MobileFooter`** — sticky bottom tab bar for primary navigation with safe-area handling
- **`MobileLayout`** — wrapper that renders `MobileTopNav` + `MobileFooter` on mobile, passes children through on desktop
- **`BottomSheet`** — drag-to-dismiss bottom drawer (composes shadcn Drawer / vaul) for actions, filters, confirmations
- **`SlideInSheet`** — full-screen slide-from-right panel with its own back-nav header for detail views

Animation presets in `@/lib/mobile-animations` (spring physics, page transitions, tap feedback). Use `useIsMobile()` from `@/hooks/use-mobile` for JS detection, Tailwind `md:hidden`/`md:block` for CSS.

PWA support: `manifest.json`, `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` are generated by `pnpm sync-config`. Apple Web App meta tags are in `apps/web/src/app/layout.tsx`.

### 13. Git Commits

Use conventional commits: `feat(web): add user profile`, `fix(server): handle null email`, `chore(db): add posts schema`.

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`. Scope = app/package name. Omit scope for cross-cutting changes.

Never commit `.env` files. Commit `pnpm-lock.yaml`. Run `pnpm lint` and `pnpm check-types` before committing.

### 13. Internationalization (i18n)

All user-facing strings in `apps/web` and `apps/react-native` must use i18next. Never hardcode display text.

Supported languages are defined in `packages/app-config/src/languages.json` (currently: `en`, `zh`, `es`).

Translation files are one flat JSON file per locale (no namespaces):
- `apps/web/src/i18n/locales/{locale}.json`
- `apps/react-native/i18n/locales/{locale}.json`

When adding strings for a new feature:
1. Add keys to every locale file (`en.json`, `zh.json`, `es.json`)
2. Use `useTranslation()` (no namespace argument) in components
3. Add translations to all locales (use English as placeholder if unavailable)

Key naming: flat camelCase (`"welcomeMessage"`, not `"welcome.message"`).

Web uses `i18next-browser-languagedetector`; React Native uses `expo-localization`. Do NOT mix them.

### 14. Authentication (Dynamic or Privy)

Blueprint supports two mutually exclusive auth providers, chosen during CLI scaffolding.

**Dynamic Auth** — email-only OTP via [Dynamic](https://www.dynamic.xyz/):
- **Web**: `DynamicContextProvider` from `@dynamic-labs/sdk-react-core`. Feature flag: `dynamicEnabled` in `lib/dynamic.ts`.
- **React Native**: `createClient` from `@dynamic-labs/client` + `ReactNativeExtension`.
- **Server**: JWT verification via JWKS (RS256). Upserts user via `dynamic_user_id`.
- Gated on: `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` / `EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID` / `DYNAMIC_ENVIRONMENT_ID`

**Privy Auth** — email OTP, social logins, wallets, embedded wallets via [Privy](https://www.privy.io/):
- **Web**: `PrivyProvider` from `@privy-io/react-auth`. Feature flag: `privyEnabled` in `lib/privy.ts`.
- **React Native**: `PrivyProvider` from `@privy-io/expo`.
- **Server**: JWT verification via `@privy-io/node` (ES256). Upserts user via `privy_user_id`.
- Gated on: `NEXT_PUBLIC_PRIVY_APP_ID` / `EXPO_PUBLIC_PRIVY_APP_ID` / `PRIVY_APP_ID` + `PRIVY_APP_SECRET`

Both providers expose the same `useAuth()` hook interface (`{ user, isLoggedIn, getToken }`). Send JWT as `Authorization: Bearer <token>` to `apps/server`. Never use NextAuth, Clerk, or other auth libraries.

### 15. ElevenLabs Voice Agent

Real-time voice conversations with AI agents via ElevenLabs Conversational AI (ElevenAgents).

- **Web**: `@elevenlabs/react` — `useConversation` hook, browser-native WebRTC/WebSocket
- **React Native**: `@elevenlabs/react-native` — `ElevenLabsProvider` + `useConversation`, WebRTC via LiveKit

Feature flag: `elevenlabsEnabled` in `lib/elevenlabs.ts` (both apps). Gated on:
- Web: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`
- RN: `EXPO_PUBLIC_ELEVENLABS_AGENT_ID`

Use the `useVoiceAgent()` wrapper hook for consistent patterns. Check `elevenlabsEnabled` before rendering voice UI. Shows "not configured" fallback when env var is missing.

## Environment Variables

Required: `DATABASE_URL` (Neon PostgreSQL connection string)

Copy `.env.example` to `.env` and fill in values. Never commit `.env` files.

---

## OpenClaw Agent Governance

### This Repository Is Your Operating System

This monorepo is the workspace for OpenClaw AI agents. It is the agent's codebase, command center, and operating environment. The agent reads files, runs commands, and makes changes inside this repo. Treat it with care.

### Boundaries (HARD RULES)

1. **DO NOT** delete, rename, or restructure any existing app in `apps/`
2. **DO NOT** delete, rename, or restructure any existing package in `packages/`
3. **DO NOT** modify `turbo.json`, `pnpm-workspace.yaml`, or root `package.json` structure without explicit user approval
4. **DO NOT** modify `.env` files or commit secrets
5. **DO NOT** force-push to `main` branch
6. **DO NOT** run `rm -rf`, `drop table`, or any destructive command on production data
7. **DO NOT** change the OpenClaw gateway config (`~/.openclaw/openclaw.json`) without explicit user approval

### What You CAN Do

1. **Add a new app**: Create a directory under `apps/` following existing conventions. Add its entry to `packages/app-config/src/apps-registry.ts` and a `dev:<name>` script to root `package.json`.
2. **Edit existing code**: Fix bugs, add features, update components — always on a feature branch, never directly on `main`.
3. **Run dev/build commands**: `pnpm install`, `pnpm build`, `pnpm dev:*`, `pnpm db:push`, `pnpm db:generate`
4. **Git operations**: Create branches, commit with conventional commits, push to feature branches, create PRs.
5. **Download assets**: Save to `storage/` directory (images, videos, documents).
6. **Read any file** in the workspace for context.
7. **Rebuild and restart**: `pnpm build --filter=<app>` then `pm2 restart <app>` after code changes.

### Git Workflow for Agents

- Always create a feature branch: `feat/openclaw-<description>`
- Commit with conventional commits: `feat(web): add new component`
- Push to the feature branch (never main)
- Notify the user via messaging channel that a PR is ready

### Asset Storage

Downloaded assets go in `storage/`:

- `storage/images/` — images (PNG, JPG, SVG, WebP)
- `storage/videos/` — video files (MP4, WebM)
- `storage/documents/` — PDFs, CSVs, text files
- `storage/temp/` — temporary files (auto-cleaned weekly)

### Rebuilding After Changes

After code changes on the VPS, run:

1. `pnpm install` (if dependencies changed)
2. `pnpm build` (rebuild all apps — or `pnpm build --filter=<app>` for one)
3. `pm2 restart all` (or `pm2 restart <app>` for one)

### Production Infrastructure

- **Process manager**: PM2 (`ecosystem.config.cjs` at repo root)
- **Reverse proxy**: Caddy (`/etc/caddy/Caddyfile`) — auto-HTTPS via Let's Encrypt
- **Private access**: Tailscale for admin, OS, and OpenClaw Gateway
- **App registry**: `packages/app-config/src/apps-registry.ts` — single source of truth for all app metadata

---

## Paperclip Integration

Paperclip is the **living task board** for Blueprint OS. When Ash dispatches a task to any agent, it must be tracked as a Paperclip issue. Paperclip is the source of truth for what's in progress, blocked, or done.

### Helper Module

The helper lives at `~/.openclaw/workspace/paperclip.mjs` (Ash's workspace — not in the repo). Import it at runtime:

```js
import { createIssue, updateIssue, listIssues, deleteIssue, AGENT_IDS, PRIORITY } from '~/workspace/paperclip.mjs';
```

### Agent → Paperclip ID Map

| Agent  | Paperclip ID                           |
|--------|----------------------------------------|
| Ash    | `9b0e68d3-c975-448b-b2bd-ceaf4a604413` |
| Ocean  | `799c3795-b274-4694-bb10-79a14ee9413c` |
| Skylar | `9ff965c3-cf06-49d8-98fd-177ca4cc8218` |
| Coral  | `8be15c18-c99f-4872-a5b3-b0eb75de438c` |
| Arctic | `10668412-f4a4-4e9d-8ebe-004765047c97` |

Use `AGENT_IDS.ocean`, `AGENT_IDS.ash`, etc. from the module.

### Workflow

**When Ash dispatches a task to an agent:**

```js
const issue = await createIssue({
  title: 'Short description of the task',
  description: 'Full context and requirements for the agent',
  assignedAgentId: AGENT_IDS.ocean,  // or whichever agent
  priority: PRIORITY.normal,         // maps to "medium"
});
// Store issue.id → call updateIssue(issue.id, { status: 'done' }) on completion
```

**When a task completes:**

```js
await updateIssue(issueId, { status: 'done' });
```

**To review what's in flight:**

```js
const active = await listIssues({ status: 'in_progress' });
const queued = await listIssues({ status: 'todo' });
```

### Priority Mapping

| Ash Convention | Paperclip Priority |
|----------------|--------------------|
| `urgent`       | `high`             |
| `normal`       | `medium`           |
| `background`   | `low`              |

Use `PRIORITY.urgent`, `PRIORITY.normal`, `PRIORITY.background` from the module.

### Issue Statuses

`backlog` → `todo` → `in_progress` → `in_review` → `done`

Also valid: `blocked`, `cancelled`

### Infrastructure

- **URL:** http://54.151.66.76:3100
- **Company ID:** `e74c5621-fdd3-4004-bd6a-a10a861018f6`
- **Auth:** POST `/api/auth/sign-in/email` → `better-auth.session_token` cookie
- **Note:** Use public IP (not localhost) — Node.js fetch strips Origin on same-origin requests, breaking better-auth's origin validation.
