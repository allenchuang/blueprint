# Social Media Short

## Description

A vertical 9:16 short-form video optimized for Instagram Reels, TikTok, and YouTube Shorts. Features a bold hook text at the top, a center visual area, and a CTA at the bottom — each section animating in with punchy spring motions. Designed to grab attention in the first 2 seconds.

## Props

| Variable | Description | Example |
|----------|-------------|---------|
| `<HOOK_TEXT>` | Bold opening line at top | `We just launched on Product Hunt 🚀` |
| `<BODY_TEXT>` | Main message in the center area | `Blueprint lets you create videos from React components` |
| `<CTA_TEXT>` | Call-to-action line at the bottom | `Link in bio →` |
| `<BG_COLOR>` | Background hex color | `#38BDF8` |
| `<TEXT_COLOR>` | Text hex color | `#ffffff` |
| `<ACCENT_COLOR>` | Accent highlight hex (used for CTA) | `#fbbf24` |
| `<DURATION_SECONDS>` | Total video length in seconds (max 60) | `15` |

---

## Prompt

> Copy everything below this line, fill in the values, and paste into Cursor chat with `@apps/remotion/src/Root.tsx` tagged.

---

Create a new Remotion composition in `apps/remotion/src/` and register it in `@apps/remotion/src/Root.tsx`.

**Canvas size: 1080×1920 (vertical 9:16)**

**What it should look like:**
- Background color: `<BG_COLOR>`
- Three text zones stacked vertically with generous padding:
  1. **Hook** (top ~20% of screen): `<HOOK_TEXT>` — large bold font (72px+), centered
  2. **Body** (middle ~50% of screen): `<BODY_TEXT>` — medium font (48px), centered, slightly transparent
  3. **CTA** (bottom ~20% of screen): `<CTA_TEXT>` — bold, colored with `<ACCENT_COLOR>`, centered
- Text color: `<TEXT_COLOR>`
- Total duration: `<DURATION_SECONDS>` seconds at 30fps

**Animation requirements:**
- Hook: enters with `spring` scale (0.5 → 1) + `interpolate` opacity (0 → 1) starting at frame 0 — fast and punchy (low damping)
- Body: enters with `interpolate` opacity (0 → 1) + translateY (30px → 0) starting at frame 18
- CTA: enters with `spring` translateY (60px → 0) + opacity at frame 36 — bouncy spring (high mass)
- All text stays visible for the remainder of the video after it enters (clamp extrapolation)

Use named exports. No default exports.

---

## Usage

After Cursor generates the files:

```bash
pnpm dev:remotion
```

Open [localhost:3004](http://localhost:3004), find `<COMPOSITION_ID>` in the left sidebar, and click to preview. The studio will show it in the correct 9:16 aspect ratio.

To render to MP4:
```bash
pnpm --filter remotion render -- <COMPOSITION_ID> out/<FILE_NAME>.mp4
```
