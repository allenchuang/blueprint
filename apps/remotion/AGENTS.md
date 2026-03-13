# Remotion - Agent Instructions

Programmatic video generation using React components.

## Key Files

- `src/Root.tsx` — Composition registry (register all videos here)
- `src/index.ts` — Entry point
- `src/*.tsx` — Video compositions (each video is a React component)

## Branding — Use `@repo/app-config`

All brand identity must come from `packages/app-config`. Never hardcode app names, colors, or logos.

```typescript
import { appConfig } from "@repo/app-config";
```

- `appConfig.name` — app name
- `appConfig.colors.primary` — primary brand color
- `appConfig.urls.website` — website URL for CTAs / watermarks

### Brand Assets

Use logos and icons from `packages/app-config/assets/`:

- `logo-light.svg` — logo on dark backgrounds
- `logo-dark.svg` — logo on light backgrounds
- `favicon.svg` — small icon / watermark

Load with Remotion's `staticFile()` or `<Img>`. Do NOT store duplicate assets in this app — always reference `packages/app-config/assets/`.

### Dependency

`@repo/app-config` must be in `package.json` dependencies:

```json
"@repo/app-config": "workspace:*"
```

## Rules

- Each video is a React component registered as `<Composition>` in `Root.tsx`
- Use props for dynamic data-driven videos
- Always use `@repo/app-config` for name, colors, URLs, and assets
- Never hardcode brand colors or app name in compositions
- Preview with Remotion Studio: `pnpm --filter remotion dev`

## Commands

```bash
pnpm --filter remotion dev          # Open Remotion Studio
pnpm --filter remotion render       # Render a video
```
