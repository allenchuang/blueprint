# Prompt Library

A collection of detailed, copy-paste-ready design prompts for building world-class app interfaces. Each prompt is a complete specification — palette, typography, layout, components, and micro-interactions — ready to hand to an AI coding assistant.

## How to Use

1. Browse the folders below and pick a prompt that matches the aesthetic you want.
2. Open the `.md` file and copy everything under the **Prompt** / **Spec** section.
3. Paste it into your AI assistant (Cursor, Claude, etc.) along with the relevant file references (e.g., `@apps/web/src/app/page.tsx`).
4. Replace any `<PLACEHOLDER>` variables with your own values.

---

## Starting a New Project? Generate a PRD First

Use the **PRD Generator** to turn any app idea into a full Product Requirements Document before you start building.

```bash
ANTHROPIC_API_KEY=sk-... pnpm generate-prd "Your app idea here"
```

See [`prd/generate-prd.md`](./prd/generate-prd.md) for the full prompt, manual (paste) usage, and CLI docs.

---

## Categories

### `branding/design-systems/`

Complete end-to-end design system specifications. Each file defines a distinct visual identity — palette, typography, layout grid, section-by-section breakdown, and signature components.

| File | Aesthetic |
|------|-----------|
| `swiss-minimalist.md` | Luxury-brutalist, echo text, monochromatic, Clash Display + Satoshi |
| `glassmorphism-aurora.md` | Frosted glass, gradient borders, aurora accents, dark base |
| `neo-brutalism.md` | Thick borders, offset shadows, loud primaries, raw energy |
| `dark-luxury.md` | Deep charcoal, gold accents, serif headlines, grain texture |
| `soft-organic.md` | Rounded shapes, pastel gradients, warm cream, gentle springs |
| `retro-analog.md` | Film grain, earth tones, halftone dots, vintage warmth |
| `cyberpunk-neon.md` | True black, neon glows, monospace, glitch effects, scanlines |
| `editorial-serif.md` | Magazine-style, enormous serifs, dramatic whitespace, full-bleed photos |
| `japanese-minimalism.md` | Extreme whitespace, thin lines, zen asymmetry, single accent |
| `gradient-mesh.md` | Vibrant mesh gradients, floating cards, rainbow borders, playful |

### `branding/pages/`

Page-level design prompts with multiple variants per file.

| File | What It Covers |
|------|----------------|
| `hero-sections.md` | Typographic, video background, split-screen, parallax, 3D heroes |
| `pricing-page.md` | Comparison tiers, monthly/annual toggle, feature matrix |
| `about-team-page.md` | Team photo grid, company narrative, values cards |
| `portfolio-showcase.md` | Masonry grid, lightbox, case study cards |
| `onboarding-flow.md` | Multi-step wizard, progress indicator, illustrations |
| `waitlist-launch.md` | Countdown timer, email capture, social proof badges |

### `branding/components/`

Individual UI component patterns with implementation specs.

| File | What It Covers |
|------|----------------|
| `navigation-patterns.md` | Sticky header, mega-menu, mobile drawer, command palette |
| `card-designs.md` | Glass card, stacked, flip, expandable, tilt-on-hover |
| `animated-typography.md` | Text reveal, character scramble, gradient text, split lines |
| `image-galleries.md` | Masonry, carousel, lightbox, before/after slider |
| `testimonial-sections.md` | Infinite marquee, card carousel, pull-quote highlight |
| `cta-sections.md` | Banner CTA, inline CTA, sticky bottom CTA, exit-intent modal |

### `branding/motion/`

Animation and interaction design patterns with exact timing specs.

| File | What It Covers |
|------|----------------|
| `page-transitions.md` | Slide, crossfade, morph, shared-element transitions |
| `scroll-animations.md` | Parallax, scroll-reveal, scroll-pin, horizontal scroll |
| `loading-states.md` | Skeleton screens, shimmer, branded spinner, progress bar |
| `hover-micro-interactions.md` | Magnetic buttons, cursor followers, glow effects, tilt |

## Prompt Format

Every design system file follows this structure:

```
# Summary         — One-paragraph aesthetic overview
# Style           — Visual language description
## Spec           — Exact palette, typography, effects, interactions
# Layout          — Section-by-section breakdown with measurements
# Special Components — Reusable patterns with CSS specs
```

Page, component, and motion files present multiple **variants** within a single file, each fully specified with implementation details.
