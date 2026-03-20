# Web App - Agent Instructions

Next.js 15 app with App Router, shadcn/ui, and Tailwind CSS v4. Pre-configured as a World Mini App via MiniKit SDK.

## Key Directories

- `src/app/` — Pages and layouts (App Router file-based routing)
- `src/app/api/minikit/` — World MiniKit API routes (verify, payment, wallet auth)
- `src/components/ui/` — shadcn/ui primitives (managed by CLI, do not manually edit)
- `src/components/layout/` — Layout components (mobile-top-nav, mobile-footer, mobile-layout)
- `src/components/mobile/` — Mobile interaction components (bottom-sheet, slide-in-sheet)
- `src/components/minikit-provider.tsx` — MiniKitProvider wrapper
- `src/components/dynamic-provider.tsx` — DynamicContextProvider wrapper (email-only auth)
- `src/components/privy-provider.tsx` — PrivyProvider wrapper (email, social, wallets)
- `src/components/` — Composed feature components
- `src/hooks/` — React Query hooks + utility hooks (e.g., `use-auth.ts`, `use-mobile.ts`, `use-minikit.ts`, `use-voice-agent.ts`)
- `src/lib/utils.ts` — `cn()` utility for Tailwind class merging
- `src/lib/dynamic.ts` — Dynamic auth feature flag and environment ID
- `src/lib/privy.ts` — Privy auth feature flag and app ID
- `src/lib/elevenlabs.ts` — ElevenLabs feature flag and agent ID
- `src/lib/mobile-animations.ts` — Shared animation presets for native-like mobile UX
- `src/i18n/` — i18next config and locale files

## Rules

- Default to Server Components. Add `"use client"` only for interactivity.
- All API calls go through React Query hooks in `src/hooks/`.
- Add shadcn components via `npx shadcn@latest add <component>` from this directory.
- When adding a feature here, also implement it in `apps/react-native`.
- Uses `@repo/db` for database access.
- Guard all MiniKit commands with `MiniKit.isInstalled()`.
- Verify all proofs and payments server-side in `src/app/api/minikit/` routes.
- Check `dynamicEnabled` or `privyEnabled` before rendering auth UI. Use `useAuth()` for auth state.
- Check `elevenlabsEnabled` before rendering voice agent UI.
- All user-facing strings must use i18next `useTranslation()` — never hardcode text.

## Commands

```bash
pnpm --filter web dev     # Dev server on port 3000
pnpm --filter web build   # Production build
```
