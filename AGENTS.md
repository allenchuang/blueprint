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

### 14. Dynamic Auth (Email OTP)

Authentication via [Dynamic](https://www.dynamic.xyz/) — email-only OTP, no wallets or social providers.

- **Web**: `DynamicContextProvider` from `@dynamic-labs/sdk-react-core` wraps the app. `useAuth()` hook in `src/hooks/use-auth.ts`.
- **React Native**: `createClient` from `@dynamic-labs/client` + `ReactNativeExtension`. `useAuth()` hook in `hooks/use-auth.ts`.
- **Server**: `authenticate` preHandler in `src/plugins/auth.ts` verifies JWTs via Dynamic JWKS. Upserts user in local DB (`dynamic_user_id`).
- **Gateway**: Server proxies to `INFRA_API_URL` for external infra backend calls.

Feature flag: `dynamicEnabled` in `lib/dynamic.ts` (both apps). Gated on:
- Web: `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID`
- RN: `EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID`
- Server: `DYNAMIC_ENVIRONMENT_ID`

Use `useAuth()` for auth state. Send JWT as `Authorization: Bearer <token>` to `apps/server`. Never use NextAuth, Clerk, or other auth libraries.

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
