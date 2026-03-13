# Remotion

Video generation and editing powered by [Remotion](https://www.remotion.dev/). Create programmatic videos using React components.

## Tech Stack

- **Remotion 4** for video composition
- **React 18** for component rendering
- **TypeScript** for type safety

## Development

```bash
# From monorepo root
pnpm dev:remotion

# Or directly
pnpm --filter remotion dev
```

Opens **Remotion Studio** for previewing and editing compositions.

## Directory Structure

```
apps/remotion/
├── src/
│   ├── index.ts         → Remotion entry point (registerRoot)
│   ├── Root.tsx          → Composition registry
│   └── HelloWorld.tsx    → Example composition
└── tsconfig.json
```

## Patterns

- **Each video** is a React component registered as a `<Composition>` in `Root.tsx`
- **Props-driven** — pass data as props to compositions for dynamic content
- Keep compositions in `src/` with descriptive names

## Adding a New Composition

1. Create a new component in `src/` (e.g., `src/MyVideo.tsx`)
2. Register it in `src/Root.tsx`:

```tsx
<Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

3. Preview in Remotion Studio

## Rendering

```bash
# Render a specific composition
pnpm --filter remotion render -- HelloWorld out/hello-world.mp4
```

## Build

```bash
pnpm --filter remotion build
```
