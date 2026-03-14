# Data Visualization

## Description

An animated chart that draws itself over time — bars grow upward or a line traces across the screen. Ideal for showing metrics, growth curves, comparisons, or any numerical story. Built with plain SVG and Remotion's `interpolate`, no external chart library needed.

## Props

| Variable | Description | Example |
|----------|-------------|---------|
| `<CHART_TYPE>` | `bar` or `line` | `bar` |
| `<CHART_TITLE>` | Headline above the chart | `Monthly Active Users` |
| `<DATA_LABELS>` | Comma-separated x-axis labels | `Jan, Feb, Mar, Apr, May, Jun` |
| `<DATA_VALUES>` | Comma-separated numeric values (0–100 scale) | `20, 35, 45, 60, 72, 88` |
| `<PRIMARY_COLOR>` | Bar/line color hex | `#0D9373` |
| `<BG_COLOR>` | Background hex color | `#0f172a` |
| `<TEXT_COLOR>` | Label and title text hex | `#ffffff` |
| `<DURATION_SECONDS>` | Total video length in seconds | `8` |

---

## Prompt

> Copy everything below this line, fill in the values, and paste into Cursor chat with `@apps/remotion/src/Root.tsx` tagged.

---

Create a new Remotion composition in `apps/remotion/src/` and register it in `@apps/remotion/src/Root.tsx`.

**Chart type:** `<CHART_TYPE>`

**What it should look like:**
- Background color: `<BG_COLOR>`
- A title `<CHART_TITLE>` at the top, fading in over the first 20 frames
- A `<CHART_TYPE>` chart centered on screen using plain SVG (no third-party chart libraries)
- X-axis labels: `<DATA_LABELS>`
- Data values (normalized 0–100): `<DATA_VALUES>`
- Bar/line color: `<PRIMARY_COLOR>`, text color: `<TEXT_COLOR>`
- Total duration: `<DURATION_SECONDS>` seconds at 30fps, 1920×1080

**Animation requirements:**
- For **bar chart**: each bar animates from height 0 to its target height, staggered by 6 frames per bar using `interpolate` with an easeOut curve
- For **line chart**: the SVG `stroke-dashoffset` animates to draw the line from left to right over 2 seconds using `interpolate`
- Data value labels above each bar / at each data point fade in after the bar/line finishes drawing
- Use only `interpolate` and `spring` from `remotion` — no external animation libraries

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
