# Remotion - Agent Instructions

Programmatic video generation using React components.

## Key Files

- `src/Root.tsx` — Composition registry (register all videos here)
- `src/index.ts` — Entry point
- `src/*.tsx` — Video compositions (each video is a React component)

## Rules

- Each video is a React component registered as `<Composition>` in `Root.tsx`
- Use props for dynamic data-driven videos
- Preview with Remotion Studio: `pnpm --filter remotion dev`

## Commands

```bash
pnpm --filter remotion dev          # Open Remotion Studio
pnpm --filter remotion render       # Render a video
```
