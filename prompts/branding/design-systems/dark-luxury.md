# Summary

A refined, high-end design system anchored in deep charcoal tones, warm gold accents, and classical serif typography. Inspired by luxury fashion houses and five-star hospitality brands, this aesthetic communicates exclusivity, craftsmanship, and timeless elegance. Best for premium products, membership platforms, luxury e-commerce, and personal brands seeking gravitas.

# Style

The visual language is restrained and deliberate. Dark surfaces provide a theatrical backdrop for warm gold details — thin dividers, accent text, and subtle border highlights. Typography mixes a refined serif (Playfair Display) for editorial headlines with a clean, light-weight sans-serif (Libre Franklin or Outfit) for body text. Textures are understated: a subtle film grain overlay and soft vignette edges. Every element has room to breathe; whitespace (or rather, "darkspace") is generous.

## Spec

- **Palette**: Primary background #0C0C0C (rich black). Secondary surface #161616. Gold accent #C9A96E. Text: #F0EDE6 (warm off-white). Muted text: #7A7468. Dividers: #C9A96E at 30% opacity.
- **Typography**: Headlines in 'Playfair Display' (bold, weight 700), tracking -0.02em, leading 1.1. Body in 'Libre Franklin' (light, weight 300), line-height 1.75, 16px. Labels: 'Libre Franklin' uppercase, 11px, tracking 0.2em, weight 500, color #C9A96E.
- **Grain Texture**: Apply a CSS pseudo-element overlay with a subtle noise SVG: `background-image: url("data:image/svg+xml,...")` at 4-6% opacity, pointer-events: none, covering the full page.
- **Dividers**: Thin 1px lines using linear-gradient(90deg, transparent, #C9A96E, transparent) for a fading center-line effect.
- **Micro-interactions**: 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) for reveals. Gold elements pulse glow on hover: `text-shadow: 0 0 20px rgba(201,169,110,0.3)`. Images: 600ms clip-path reveal (inset 100% 0 0 0 → inset 0 0 0 0).

# Layout & Structure

Vertically flowing, cinema-ratio sections with dramatic spacing (120-160px between sections). The rhythm alternates between full-bleed dark imagery and text-centric sections with centered, narrow measure (max-width 680px).

## Navigation

Fixed, height 80px. Background: #0C0C0C with 95% opacity and backdrop-blur(8px). Logo: Playfair Display, gold #C9A96E, 20px. Links: Libre Franklin 13px, uppercase, tracking 0.15em, #7A7468 → #F0EDE6 on hover with 200ms ease. CTA: text "Reserve" with a thin 1px gold border, padding 10px 24px, letter-spacing 0.12em. On hover: background fills to #C9A96E, text becomes #0C0C0C.

## Hero Section

Full viewport. Centered vertically. Small uppercase label ("Est. 2024") in gold, 11px, tracking 0.25em. Main heading: 7vw to 9vw Playfair Display, #F0EDE6, max-width 900px. Below: thin gold divider (80px wide, centered), then 18px body text in #7A7468, max-width 480px. No images — let typography and space command attention. Optional: a slow, barely perceptible parallax drift on the heading (0.5px per scroll pixel).

## Editorial Image Band

Full-bleed section. A 16:7 aspect ratio image with a dark vignette overlay (radial-gradient from transparent center to #0C0C0C edges). Image enters with a clip-path reveal from left on scroll. Overlay a small caption in the bottom-right: 11px uppercase, #7A7468, tracking 0.15em.

## Three Pillars Section

Centered. Top: uppercase gold label + Playfair heading (48px). Below: a 3-column grid (gap 48px), each column with a thin gold top border (1px), a bold 24px heading, and 16px light body text. On hover, the gold top border expands from 1px to 3px with a 300ms transition.

## Showcase Gallery

2-column asymmetric layout. Left column: tall portrait image (3:4). Right column: two stacked landscape images (16:9) with 24px gap. All images: grayscale by default, transitioning to full color on hover with a 600ms ease. Thin 1px #C9A96E/20 border around each image.

## Quotation Section

Centered. Large Playfair Display italic quote at 40px, #F0EDE6, max-width 720px. An oversized gold quotation mark (120px, #C9A96E at 20% opacity) positioned absolutely top-left as decoration. Author attribution below: small caps, gold, 13px.

## Footer

Background: #0A0A0A. Top border: gradient gold divider. 4-column layout. Brand: gold logo mark + 14px tagline. Link columns: 13px Libre Franklin, #7A7468, gold on hover. Bottom row: centered copyright in 12px #7A7468, padded 40px.

# Special Components

## Clip-Path Image Reveal

Images that unveil on scroll using clip-path animation.

Start: `clip-path: inset(0 100% 0 0)`. End: `clip-path: inset(0 0 0 0)`. Trigger via IntersectionObserver. Transition: 800ms cubic-bezier(0.77, 0, 0.175, 1). Add a 200ms delay for staggered grid items.

## Gold Gradient Divider

A centered, fading horizontal rule using the gold accent.

`width: 120px; height: 1px; margin: 0 auto; background: linear-gradient(90deg, transparent, #C9A96E, transparent);`

## Hover Glow Text

Gold text that emits a soft glow on hover.

Default: `color: #C9A96E; transition: text-shadow 400ms ease;`. Hover: `text-shadow: 0 0 12px rgba(201,169,110,0.4), 0 0 40px rgba(201,169,110,0.15);`
