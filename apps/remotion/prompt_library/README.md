# Remotion Prompt Library

A collection of ready-to-paste Cursor prompt templates for generating new Remotion video compositions.

## How to Use

### Step 1 — Pick a template

Browse the templates below and open the `.md` file that matches what you want to make.

### Step 2 — Fill in your variables

Each template has a **Props** table listing placeholder values like `<COMPOSITION_ID>`, `<TITLE>`, `<BG_COLOR>`, etc. Decide on your values before copying.

### Step 3 — Copy the Prompt section

Each template has a clearly marked `## Prompt` section. Copy everything below the divider line in that section.

### Step 4 — Paste into Cursor with @-tags

Open a Cursor chat (`Cmd+L`) and paste the prompt. The prompt tells you to tag `@apps/remotion/src/Root.tsx` — this gives Cursor the context it needs to register the new composition correctly. Type `@` in the chat input and start typing the filename to tag it.

### Step 5 — Review what Cursor generates

Cursor will create a new `.tsx` file under `apps/remotion/src/` and add a `<Composition>` entry to `Root.tsx`. Review the diff before accepting.

### Step 6 — Preview in Remotion Studio

```bash
pnpm dev:remotion
```

Open [localhost:3004](http://localhost:3004). Your new composition appears in the left sidebar. Click it to preview, scrub the timeline, and edit props live.

### Step 7 — Render to MP4 (optional)

```bash
pnpm --filter remotion render -- <COMPOSITION_ID> out/<file-name>.mp4
```

Rendered files land in `apps/remotion/out/`.

---

## Templates

| File | What It Creates | Aspect Ratio | Duration |
|------|----------------|--------------|----------|
| [basic-text-reveal.md](./basic-text-reveal.md) | Animated title card with fade/slide-in text | 16:9 | ~5s |
| [data-visualization.md](./data-visualization.md) | Animated bar or line chart with labeled axes | 16:9 | ~8s |
| [product-showcase.md](./product-showcase.md) | Feature highlight reel with sections | 16:9 | ~15s |
| [social-media-short.md](./social-media-short.md) | Vertical short-form video for Reels/TikTok/Shorts | 9:16 | ~15s |

---

## Adding New Templates

Copy any existing template and adapt the **Prompt** section. Follow the same structure:
- Description
- Props (variables)
- Prompt (copy-paste ready, includes `@`-tag instructions)
- Usage
