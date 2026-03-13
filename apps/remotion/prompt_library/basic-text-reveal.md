# Basic Text Reveal

## Description

A clean animated title card that fades and slides text in over a solid background color. Great for intro/outro sequences, chapter titles, announcement cards, or any moment where you need a single focused message on screen.

## Props

| Variable | Description | Example |
|----------|-------------|---------|
| `<TITLE>` | Main headline text | `Introducing Mastermind` |
| `<SUBTITLE>` | Optional supporting line (leave blank to omit) | `The AI-powered video platform` |
| `<BG_COLOR>` | Background hex color | `#0D9373` |
| `<TEXT_COLOR>` | Text hex color | `#ffffff` |
| `<DURATION_SECONDS>` | Total video length in seconds | `5` |

---

## Prompt

> Copy everything below this line, fill in the values, and paste into Cursor chat with `@apps/remotion/src/Root.tsx` tagged.

---

Create a new Remotion composition in `apps/remotion/src/` and register it in `@apps/remotion/src/Root.tsx`.

**What it should look like:**
- Background color: `<BG_COLOR>`
- A title `<TITLE>` centered on screen, animating in with a fade + upward slide over the first second
- A subtitle `<SUBTITLE>` below the title, animating in 0.3s after the title with the same motion
- Text color: `<TEXT_COLOR>`
- Total duration: `<DURATION_SECONDS>` seconds at 30fps, 1920×1080

**Animation requirements:**
- Use `interpolate` from `remotion` for the fade (opacity 0 → 1) and slide (translateY 40px → 0)
- Use `spring` from `remotion` for the slide motion so it feels natural
- Stagger the subtitle 9 frames after the title

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
