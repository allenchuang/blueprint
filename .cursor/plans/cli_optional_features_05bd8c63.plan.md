---
name: CLI optional features
overview: Add comprehensive interactive feature selection to the blueprint CLI scaffold command, organized into Apps, Integrations, Web Features, and Database categories. Users opt-in via prompts or CLI flags; unselected features get stripped from the cloned project.
todos:
  - id: feature-types
    content: Create feature manifest types and registry in `src/features/index.ts` covering all 4 categories (apps, integrations, web features, database)
    status: completed
  - id: util-patch-json
    content: Create `src/utils/patch-json.ts` utility for removing deps and scripts from package.json files
    status: completed
  - id: util-patch-file
    content: Create `src/utils/patch-file.ts` utility for removing code blocks (imports, provider wrappers, home page links) from source files
    status: completed
  - id: manifests-apps
    content: "Create feature manifests for app-level options: Admin, React Native, Docs, Remotion"
    status: completed
  - id: manifests-integrations
    content: "Create feature manifests for integrations: Dynamic Auth, Stripe, ElevenLabs, World MiniKit, Google Analytics"
    status: completed
  - id: manifests-webfeatures
    content: "Create feature manifests for web features: i18n, Mobile Web / PWA"
    status: completed
  - id: manifest-database
    content: Create database selection logic (Neon serverless, standard PostgreSQL, none) with driver swapping in packages/db
    status: completed
  - id: strip-engine
    content: Implement the generic stripping engine in `src/features/strip.ts` that processes all manifest types
    status: completed
  - id: update-new-cmd
    content: Update `src/commands/new.ts` with sectioned interactive prompts and Commander CLI flags for all options
    status: completed
  - id: cleanup-docs
    content: Strip deselected features from README.md, AGENTS.md, and architecture tree during scaffold
    status: completed
  - id: test-combinations
    content: Test various flag combinations (minimal, all, individual features, mixed)
    status: completed
  - id: add-cli-feature-rule
    content: "Create rule 020-cli-feature-registration.mdc: when adding a new optional feature, always add a CLI manifest and update the blueprint CLI"
    status: completed
isProject: false
---

# CLI Optional Feature Selection

## Current State

The CLI (`[packages/blueprint-cli/src/commands/new.ts](packages/blueprint-cli/src/commands/new.ts)`) clones the full Blueprint repo and always includes every integration. All integrations already have runtime feature flags (env-var gating with graceful fallbacks), but the unused code, dependencies, pages, and providers are still present in the project.

## Design

### Feature Selection UX

**Interactive mode** (default): After cloning and before branding, walk the user through 4 sections:

```
? Which apps do you want to include? (space to toggle, web is always included)
  [x] Web (Next.js 15) — always included
  [ ] Admin Panel (Next.js 15)
  [ ] React Native (Expo)
  [ ] Documentation (Mintlify)
  [ ] Remotion (video generation)

? Which integrations do you want? (space to toggle)
  [ ] Dynamic Auth — wallet-based authentication via Dynamic Labs
  [ ] Stripe Payments — subscriptions, checkout, feature gating
  [ ] ElevenLabs Voice Agent — real-time AI voice conversations
  [ ] World MiniKit — World App integration
  [ ] Google Analytics — web + mobile analytics

? Which web features do you want? (space to toggle)
  [ ] Internationalization (i18n) — multi-language support (en, zh, es)
  [ ] Mobile Web / PWA — native-like mobile patterns, manifest, icons

? Database provider:
  ( ) Neon PostgreSQL (serverless) — current default
  ( ) Supabase — Supabase-hosted PostgreSQL
  ( ) Standard PostgreSQL (pg driver)
  ( ) None — no database
```

**CLI flags** for non-interactive / CI use:

```bash
# Selective
npx blueprint-stack new my-app --with-stripe --with-admin --with-i18n --db=supabase

# Include everything
npx blueprint-stack new my-app --all

# Minimal (just web + server, no integrations, no database)
npx blueprint-stack new my-app --minimal
```

`--all` includes everything (current behavior). `--minimal` produces the leanest possible scaffold. Flags can be combined freely.

### Post-Clone Stripping

After cloning and before `pnpm install`, the CLI removes files, dependencies, layout wiring, i18n keys, server routes, DB schema, agent rules, home page links, and documentation for each **deselected** feature.

---

## Feature Catalog

### Category 1: Apps

#### Admin Panel (`--with-admin`)

- **Directory**: remove `apps/admin/` entirely
- **Root scripts**: remove `dev:admin` from root `package.json`
- **Turbo config**: no special entries (uses default `dev`/`build` tasks)
- **Docs**: remove admin references from README architecture tree

#### React Native (`--with-mobile`)

- **Directory**: remove `apps/react-native/` entirely
- **Root config**: no root scripts reference RN specifically (it runs via `turbo dev`)
- **Co-development rule**: remove `001-co-development.mdc` (all 3 rule dirs)
- **Docs**: remove React Native from README architecture tree, component mapping tables, tech stack

When React Native is excluded, integration manifests skip all RN-specific removals (RN files, RN layout patches, RN deps). The web-only versions of features remain.

#### Documentation (`--with-docs`)

- **Directory**: remove `apps/docs/` entirely
- **Root scripts**: remove `dev:docs` from root `package.json`
- **Sync config**: skip docs patching in `packages/app-config/scripts/sync.ts`
- **Rules**: remove `004-docs-patterns.mdc` (all 3 rule dirs)
- **Docs**: remove docs app from README architecture tree

#### Remotion (`--with-remotion`)

- **Directory**: remove `apps/remotion/` entirely
- **Root scripts**: remove `dev:remotion` from root `package.json`
- **Turbo config**: remove `render` task from `turbo.json`
- **Rules**: remove `011-remotion-branding.mdc` (all 3 rule dirs)
- **Skills**: remove `remotion-best-practices/` (all 3 skill dirs)
- **Prompts**: remove `prompts/` directory if only Remotion prompts

---

### Category 2: Integrations

#### Dynamic Auth (`--with-dynamic`)

- **Web files**: `src/lib/dynamic.ts`, `src/components/dynamic-provider.tsx`, `src/components/auth-demo.tsx`, `src/hooks/use-auth.ts`
- **Web layout**: remove `<DynamicAuthProvider>` wrapping from `[apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx)` and its import
- **Web home page**: remove `<AuthDemo />` component, its import, and wrapper `<div>` from `[apps/web/src/app/page.tsx](apps/web/src/app/page.tsx)`
- **Web deps**: `@dynamic-labs/sdk-react-core`
- **i18n keys**: `loggedInAs`, `logout`, `authNotConfigured`, `authNotConfiguredHint` from all locale files
- **RN files** (if RN included): `lib/dynamic.ts`, `lib/dynamic-client.ts`, `hooks/use-auth.ts`
- **RN layout**: remove `DynamicWrapper` function and its usage from `[apps/react-native/app/_layout.tsx](apps/react-native/app/_layout.tsx)`
- **RN deps**: `@dynamic-labs/react-native-extension`
- **Server**: remove Dynamic-related auth logic from `[apps/server/src/plugins/auth.ts](apps/server/src/plugins/auth.ts)`
- **DB schema**: remove `dynamicUserId` column from `packages/db/src/schema/users.ts`, remove `wallets.ts` and `subaccounts` tables
- **Env example keys**: `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID`, `EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID`

#### Stripe Payments (`--with-stripe`)

- **Web files**: `src/lib/stripe.ts`, `src/lib/features.ts`, `src/components/stripe-provider.tsx`, `src/hooks/use-subscription.ts`, `src/app/pricing/` (directory)
- **Web deps**: `@stripe/react-stripe-js`, `@stripe/stripe-js`
- **Web home page**: remove pricing link from `page.tsx`
- **RN files** (if RN included): `lib/features.ts`, `hooks/use-subscription.ts`, `hooks/use-stripe-checkout.ts`, `app/(tabs)/pricing.tsx`
- **RN layout**: remove `StripeWrapper` function and usage from `_layout.tsx`
- **RN tab nav**: remove pricing tab from `app/(tabs)/_layout.tsx`
- **RN deps**: `@stripe/stripe-react-native`
- **Server files**: `src/routes/stripe.ts`
- **Server wiring**: remove `stripeRoutes` import and registration from `[apps/server/src/app.ts](apps/server/src/app.ts)`
- **Server deps**: `stripe`
- **DB schema**: `packages/db/src/schema/subscriptions.ts`, remove `stripeCustomerId` from users schema
- **Rules**: `016-stripe-payments.mdc`, `017-feature-gating.mdc` (all 3 rule dirs)
- **Skills**: `stripe-integration/`, `feature-gating/` (all 3 skill dirs)
- **Env example keys**: all `STRIPE_` vars
- **i18n keys**: pricing/subscription-related keys from all locale files

#### ElevenLabs Voice Agent (`--with-elevenlabs`)

- **Web files**: `src/lib/elevenlabs.ts`, `src/hooks/use-voice-agent.ts`, `src/app/voice-agent/` (directory)
- **Web deps**: `@elevenlabs/react`
- **Web home page**: remove voice-agent link from `page.tsx`
- **RN files** (if RN included): `lib/elevenlabs.ts`, `hooks/use-voice-agent.ts`, `app/(tabs)/voice-agent.tsx`
- **RN layout**: remove `ElevenLabsWrapper` function and usage from `_layout.tsx`
- **RN tab nav**: remove voice-agent tab from `app/(tabs)/_layout.tsx`
- **RN deps**: `@elevenlabs/react-native`
- **Rules**: `019-elevenlabs-voice-agent.mdc` (all 3 rule dirs)
- **Env example keys**: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`, `EXPO_PUBLIC_ELEVENLABS_AGENT_ID`
- **i18n keys**: voice-agent-related keys from all locale files

#### World MiniKit (`--with-minikit`)

- **Web files**: `src/components/minikit-provider.tsx`, `src/hooks/use-minikit.ts`, `src/app/api/minikit/` (directory)
- **Web layout**: remove `<WorldMiniKitProvider>` wrapping from layout and its import
- **Web deps**: `@worldcoin/minikit-js`, `@worldcoin/minikit-react`
- **Env example keys**: `NEXT_PUBLIC_WORLD_APP_ID`, `WORLD_APP_DEV_PORTAL_API_KEY` (from `apps/web/.env.example`)
- **Rules**: `015-world-miniapp.mdc` (all 3 rule dirs)

#### Google Analytics (`--with-analytics`)

- **Web layout**: remove `GoogleAnalytics` component and its import from `[apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx)`, remove `gaId` logic
- **Web deps**: `@next/third-parties`
- **RN files** (if RN included): `lib/analytics.ts`, `hooks/use-screen-tracking.ts`
- **RN layout**: remove `useScreenTracking()` call from `_layout.tsx`
- **Env example keys**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `EXPO_PUBLIC_GA_MEASUREMENT_ID`, `EXPO_PUBLIC_GA_API_SECRET`

---

### Category 3: Web Features

#### Internationalization (`--with-i18n`)

- **Web files**: `src/i18n/` (directory), `src/components/i18n-provider.tsx`
- **Web layout**: remove `<I18nProvider>` wrapping from layout and its import
- **Web deps**: `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **RN files** (if RN included): `i18n/` (directory)
- **RN layout**: remove `<I18nextProvider>` wrapping and `i18n` import from `_layout.tsx`
- **RN deps**: `i18next`, `react-i18next`, `expo-localization`
- **App config**: `packages/app-config/src/languages.json`
- **Rules**: `014-i18n.mdc` (all 3 rule dirs)
- **All components**: Replace `t("key")` calls with static English strings throughout all pages (or leave the English key text inline)

Note: When i18n is stripped, all `useTranslation()` calls and `t()` references in components must be replaced with the English fallback strings from `en.json`. This is the most complex stripping operation.

#### Mobile Web / PWA (`--with-pwa`)

- **Web files**: `src/components/layout/` (directory), `src/components/mobile/` (directory), `src/lib/mobile-animations.ts`
- **Web deps**: `vaul` (Drawer component for bottom sheet); `motion` stays since it may be used elsewhere
- **Web layout metadata**: remove `manifest`, `appleWebApp`, `mobile-web-app-capable` from layout metadata
- **Web public files**: remove `manifest.json`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`
- **Web hooks**: `src/hooks/use-mobile.ts`
- **Sync config**: skip manifest + PWA icon generation in `packages/app-config/scripts/sync.ts`
- **Rules**: `014-mobile-web-patterns.mdc` (all 3 rule dirs)

---

### Category 4: Database

Single-select (radio) instead of multi-select:

#### Neon PostgreSQL (default)

No changes needed. Current setup with `@neondatabase/serverless` and `drizzle-orm/neon-http`.

#### Supabase (`--db=supabase`)

- **packages/db**: swap `@neondatabase/serverless` for `postgres` (postgres.js) in `package.json`
- **packages/db/src/index.ts**: replace driver setup:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl, { prepare: false });
  return drizzle(client, { schema });
}
```

The `{ prepare: false }` is required for Supabase's Transaction pooler mode.

- **drizzle.config.ts**: no changes needed (same `dialect: "postgresql"`, same `DATABASE_URL`)
- **Env example**: update placeholder to `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

#### Standard PostgreSQL (`--db=pg`)

- **packages/db**: swap `@neondatabase/serverless` for `postgres` (postgres.js) in `package.json`
- **packages/db/src/index.ts**: replace driver setup:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle(client, { schema });
}
```

- **drizzle.config.ts**: no changes needed
- **Env example**: keep `DATABASE_URL` but update the placeholder to `postgresql://user:password@localhost:5432/mydb`

#### None (`--db=none`)

- **Directory**: remove `packages/db/` entirely (including `packages/db/.env.example`)
- **Dependents**: remove `@repo/db` from `dependencies` in `apps/web/package.json`, `apps/admin/package.json`, `apps/server/package.json`
- **Server**: remove DB-related imports and logic from server routes/plugins (auth plugin, any route using `createDb`)
- **Root scripts**: remove `db:generate`, `db:migrate`, `db:push`, `db:studio` from root `package.json`
- **Turbo config**: remove `db:` tasks from `turbo.json`
- **Env examples**: strip `DATABASE_URL` lines (and associated comments) from `.env.example` (root) and `apps/server/.env.example`
- **Env prompt**: skip the `DATABASE_URL` prompt in the CLI's env configuration step
- **Rules**: remove `003-database-patterns.mdc` (all 3 rule dirs)
- Stripe and Dynamic Auth require a database; if `--db=none` is chosen and either is selected, warn and skip those integrations or prompt the user to reconsider

---

## Implementation Architecture

### New files in `packages/blueprint-cli/src/`

```
src/
├── commands/
│   └── new.ts                  # Modified: add sectioned feature selection
├── features/
│   ├── index.ts                # Feature registry, types, all manifests
│   ├── strip.ts                # Generic stripping engine
│   ├── apps/
│   │   ├── admin.ts
│   │   ├── react-native.ts
│   │   ├── docs.ts
│   │   └── remotion.ts
│   ├── integrations/
│   │   ├── dynamic.ts
│   │   ├── stripe.ts
│   │   ├── elevenlabs.ts
│   │   ├── minikit.ts
│   │   └── analytics.ts
│   ├── web-features/
│   │   ├── i18n.ts
│   │   └── pwa.ts
│   └── database/
│       └── index.ts            # Database provider selection + driver swapping
└── utils/
    ├── patch-json.ts           # Read/modify/write JSON files (package.json, turbo.json)
    ├── patch-file.ts           # Remove code blocks from source files
    └── patch-i18n.ts           # Replace t() calls with static strings
```

### Feature manifest type

```typescript
interface FeatureManifest {
  id: string;
  name: string;
  description: string;
  category: "app" | "integration" | "web-feature" | "database";
  cliFlag: string; // e.g. "--with-stripe"
  filesToRemove: string[]; // relative to project root
  dirsToRemove: string[]; // recursive delete
  depsToRemove: Record<string, string[]>; // { "apps/web": ["@stripe/stripe-js"] }
  layoutPatches: LayoutPatch[]; // code removal instructions per file
  envKeysToRemove: string[]; // keys to strip from .env.example files
  i18nKeysToRemove: string[]; // key prefixes to strip from locale JSONs
  ruleFilesToRemove: string[]; // e.g. ["016-stripe-payments.mdc"]
  skillDirsToRemove: string[]; // e.g. ["stripe-integration"]
  rootScriptsToRemove: string[]; // e.g. ["dev:remotion"]
  turboTasksToRemove: string[]; // e.g. ["render"]
  dependsOnRN?: boolean; // true if manifest has RN-specific entries
  conflicts?: string[]; // e.g. db=none conflicts with stripe
}

interface LayoutPatch {
  file: string; // relative path to file
  type: "remove-import" | "remove-wrapper" | "remove-block" | "remove-line";
  match: string; // string or regex pattern to identify the code
  replacement?: string; // optional replacement (default: remove entirely)
}
```

### Stripping logic in `strip.ts`

1. **Delete files/dirs**: `fs.rmSync` for each path
2. **Remove deps**: Parse each `package.json`, delete from `dependencies`/`devDependencies`, write back
3. **Patch layouts**: Use string replacement to remove provider wrappers and imports (the wrapper patterns are consistent and predictable)
4. **Clean env examples**: Process all 5 `.env.example` files:

- `.env.example` (root)
- `apps/web/.env.example`
- `apps/server/.env.example`
- `apps/react-native/.env.example` (skip if RN not included)
- `packages/db/.env.example` (removed entirely if `--db=none`)
For each removed key, also strip associated comment blocks above the key line (lines starting with `#` that form a contiguous group before the key). For example, removing `STRIPE_SECRET_KEY` also removes the `# Stripe (optional — ...)` and `# Get keys from ...` comment lines above it.

1. **Clean i18n**: Parse locale JSON files, delete matching keys, write back
2. **Clean rules/skills**: Delete from all 3 parallel directories (`.cursor/`, `.agents/`, `.claude/`)
3. **Patch root configs**: Remove scripts from `package.json`, tasks from `turbo.json`
4. **Clean home page**: Remove links to deselected feature pages from `apps/web/src/app/page.tsx`
5. **Clean README/AGENTS.md**: Remove feature sections, update architecture tree

### Changes to `new.ts`

```typescript
// 1. Clone repo
// 2. Remove .git
// 3. NEW: Feature selection (interactive prompts or CLI flags)
//    3a. Apps selection (multi-select)
//    3b. Integrations selection (multi-select)
//    3c. Web features selection (multi-select)
//    3d. Database provider (single-select)
// 4. NEW: Validate (check conflicts, e.g. db=none + stripe)
// 5. NEW: Strip deselected features
// 6. Configure branding (existing)
// 7. Configure env (existing, adapted to selected features)
// 8. pnpm install
// 9. git init + commit
// 10. pnpm dev
```

Commander options on `new` command:

```typescript
.option("--with-admin", "Include Admin Panel")
.option("--with-mobile", "Include React Native app")
.option("--with-docs", "Include Mintlify docs")
.option("--with-remotion", "Include Remotion video generation")
.option("--with-dynamic", "Include Dynamic Auth")
.option("--with-stripe", "Include Stripe Payments")
.option("--with-elevenlabs", "Include ElevenLabs Voice Agent")
.option("--with-minikit", "Include World MiniKit")
.option("--with-analytics", "Include Google Analytics")
.option("--with-i18n", "Include internationalization")
.option("--with-pwa", "Include Mobile Web / PWA patterns")
.option("--db <provider>", "Database: neon | supabase | pg | none", "neon")
.option("--all", "Include all optional features")
.option("--minimal", "Minimal scaffold (web + server only, no integrations)")
```

---

## Edge Cases and Dependencies

- **Stripe + Feature Gating**: Removing Stripe also removes `features.ts` and `useSubscription`. They are coupled.
- **Dynamic Auth + Wallets**: Removing Dynamic Auth also removes the `wallets` and `subaccounts` DB tables and the auth plugin logic.
- **db=none + Stripe/Dynamic**: These integrations require a database. The CLI should warn: "Stripe/Dynamic Auth require a database. Deselecting database will also deselect those integrations."
- **React Native excluded**: When RN is not selected, all RN-specific entries in integration manifests are skipped (no RN files to remove, no RN deps to clean). Also removes the co-development rule.
- **i18n removal complexity**: Stripping i18n requires replacing all `t("key")` calls with static English strings. The strip engine should read `en.json`, build a key-to-string map, and do a find-replace across all component files.
- **Home page cleanup**: Remove links/cards for deselected features from `apps/web/src/app/page.tsx`.
- **README/AGENTS.md cleanup**: Update architecture trees, built-in features lists, and tech stack tables to reflect only included features. This can use block markers (HTML comments) in the source files to identify removable sections.

