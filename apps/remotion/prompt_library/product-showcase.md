# Product Showcase

## Description

A multi-section feature highlight reel at 16:9. Each section shows a feature name, short description, and optional icon/emoji, with smooth transitions between sections. Great for product demos, feature announcements, onboarding explainers, or sales decks turned into video.

## Props

| Variable | Description | Example |
|----------|-------------|---------|
| `<PRODUCT_NAME>` | Product/brand name shown in the intro | `Blueprint` |
| `<TAGLINE>` | One-line description shown under product name | `The AI-powered video platform` |
| `<FEATURES>` | JSON array of feature objects (see format below) | see example |
| `<BG_COLOR>` | Background hex color | `#0f172a` |
| `<ACCENT_COLOR>` | Accent / highlight hex color | `#38BDF8` |
| `<TEXT_COLOR>` | Body text hex | `#ffffff` |
| `<SECTION_DURATION_SECONDS>` | How long each feature section is shown | `3` |

**`<FEATURES>` format:**
```json
[
  { "icon": "🎬", "title": "Video Generation", "description": "Create videos from React components in seconds" },
  { "icon": "📊", "title": "Data Visualization", "description": "Animate charts and metrics programmatically" },
  { "icon": "🚀", "title": "One-click Render", "description": "Export to MP4 with a single command" }
]
```

---

## Prompt

> Copy everything below this line, fill in the values, and paste into Cursor chat with `@apps/remotion/src/Root.tsx` tagged.

---

Create a new Remotion composition in `apps/remotion/src/` and register it in `@apps/remotion/src/Root.tsx`.

**What it should look like:**

The video has these sections in sequence, each lasting `<SECTION_DURATION_SECONDS>` seconds:

1. **Intro section** — product name `<PRODUCT_NAME>` and tagline `<TAGLINE>` centered on screen, fade + scale in
2. **Feature sections** — one section per feature in `<FEATURES>`, each showing the icon, title, and description. The feature title slides in from the left, description fades in below it. Accent color `<ACCENT_COLOR>` underlines the title.
3. **Outro section** — product name `<PRODUCT_NAME>` centered again, fades in as a call to action

Background: `<BG_COLOR>`, text: `<TEXT_COLOR>`, accent: `<ACCENT_COLOR>`. Total canvas: 1920×1080.

**Animation requirements:**
- Use `<Series>` from `remotion` to sequence sections, each `<SECTION_DURATION_SECONDS> * 30` frames long
- Intro/outro: use `spring` for scale (0.8 → 1) and `interpolate` for opacity (0 → 1)
- Feature slides: title uses `spring` translateX (-80px → 0), description uses `interpolate` opacity (0 → 1) with a 15-frame delay
- Use `useCurrentFrame` and `useVideoConfig` where needed

Use named exports. No default exports.

---

## Usage

After Cursor generates the files:

```bash
pnpm dev:remotion
```

Open [localhost:3004](http://localhost:3004), find `<COMPOSITION_ID>` in the left sidebar, and click to preview.

To render to MP4:
```bash
pnpm --filter remotion render -- <COMPOSITION_ID> out/<FILE_NAME>.mp4
```
