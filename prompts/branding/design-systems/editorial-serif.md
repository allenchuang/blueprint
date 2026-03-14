# Summary

A refined, magazine-inspired design system that treats the screen like a printed spread. Enormous serif headlines, dramatic whitespace, full-bleed photography, and meticulous typographic hierarchy create an editorial aesthetic that communicates authority and sophistication. Ideal for media publications, luxury brands, architecture studios, photography portfolios, and long-form content platforms.

# Style

The design language borrows from the best of print editorial: oversized serif headlines that anchor the page, generous gutters, pull-quotes that punctuate the reading experience, and full-bleed imagery that bleeds to the edges. Typography is the star — a high-contrast serif (Libre Bodoni or Fraunces) for headlines paired with a clean contemporary sans (Instrument Sans) for body text. The color palette is nearly monochromatic, letting imagery and type do all the work.

## Spec

- **Palette**: Background #FAFAF8 (warm off-white). Text: #1A1A1A (near-black). Muted: #8C8C8C. Rule lines: #1A1A1A at 10% opacity. Accent (sparingly): single muted tone — either warm terracotta #C4654A or cool slate #5A6E78.
- **Typography**: Headlines in 'Fraunces' (black, weight 900, optical size auto), tracking -0.03em, leading 0.95. Body in 'Instrument Sans' (regular, weight 400), line-height 1.8, 17px, max-width 680px. Pull-quotes: Fraunces italic, 36px, weight 300. Bylines/labels: Instrument Sans 12px, uppercase, tracking 0.12em, #8C8C8C.
- **Rule Lines**: 1px solid rgba(26,26,26,0.1) used liberally — between sections, above/below quotes, and as column dividers.
- **Whitespace**: Section padding minimum 120px vertical. Heading-to-body gap: 32px. Between content blocks: 80px.
- **Micro-interactions**: 600ms cubic-bezier(0.25, 0.1, 0.25, 1) for scroll reveals. Images: clip-path reveal from bottom (inset 100% 0 0 0 → 0). Text blocks: fade-up (opacity 0, translateY 30px → visible). Minimal hover states — the design is intentionally restrained.

# Layout & Structure

Classic editorial grid: primarily 4-column for text spreads, 12-column for mixed layouts. Content width is narrow (max 720px for body text, up to 1200px for mixed sections). The rhythm alternates between text-heavy reading sections and full-bleed visual breaks.

## Navigation

Fixed, height 64px. Background: #FAFAF8, 95% opacity, backdrop-blur(8px). Simple: logo (Fraunces, 18px, weight 900) left, minimal nav links (Instrument Sans, 14px, #8C8C8C → #1A1A1A on hover) right. No backgrounds on links — just color shift. Thin 1px bottom rule when scrolled (appear with 300ms fade). CTA: just text "Subscribe" with a thin underline that slides in on hover.

## Hero Section

Full viewport height. Two variants:

**Typographic Hero**: Centered. Uppercase label (12px, tracking 0.2em, #8C8C8C). Massive headline: 10vw to 14vw, Fraunces black, #1A1A1A. A thin rule line (1px, 60px wide, centered) below the headline. Subtitle: Instrument Sans, 18px, #8C8C8C, max-width 480px.

**Image Hero**: Full-bleed background image (object-fit: cover, 100vh). Dark gradient overlay from bottom (transparent → rgba(0,0,0,0.5)). Overlaid text at bottom-left: large Fraunces headline (6vw, white), category label above (uppercase, tracking).

## Full-Bleed Image Break

A section that is purely a full-width, edge-to-edge image with 56:25 aspect ratio. No text overlay. Thin 1px rule line above and below. Image enters via clip-path reveal from bottom on scroll.

## Article / Body Section

Centered, narrow column (max-width 680px). Fraunces heading (40-48px) with a thin top rule. Body: Instrument Sans 17px, 1.8 line height. Paragraphs separated by 32px. Drop cap on the first paragraph: Fraunces, 5-line height, float left, margin-right 12px, color accent or #1A1A1A.

## Pull-Quote Interlude

Full-width centered. Fraunces italic, 36-48px, #1A1A1A, max-width 800px. Rule lines above and below (1px, 120px wide, centered). A large decorative quotation mark (Fraunces, 200px, #1A1A1A at 6% opacity) positioned behind the text.

## Three-Column Feature Grid

12-column grid, 3 equal columns with 48px gaps. Each column separated by a 1px vertical rule line. Content: uppercase category label (12px), Fraunces heading (24px), Instrument Sans body (15px), and a "Read more" text link with an arrow that slides right 4px on hover. Optional: each column topped with a 4:3 image.

## Masthead / Credits Footer

Background: #1A1A1A. Text: #FAFAF8. Centered narrow layout. Large Fraunces wordmark (48px). Below: thin rule, then 3-column links in 13px Instrument Sans, #8C8C8C → #FAFAF8 on hover. Bottom row: small copyright, thin rule above.

# Special Components

## Drop Cap

An oversized first letter in the editorial tradition.

Target the first letter of the lead paragraph: `p:first-of-type::first-letter { font-family: 'Fraunces'; font-size: 4.5em; float: left; line-height: 0.8; margin-right: 12px; margin-top: 6px; color: #1A1A1A; }`.

## Decorative Pull-Quote

A typographic accent element that breaks up long-form content.

Container: `text-align: center; padding: 80px 0; position: relative;`. Quote: `font-family: 'Fraunces'; font-style: italic; font-size: 36px; max-width: 680px; margin: 0 auto; position: relative; z-index: 1;`. Decorative mark: `position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 200px; opacity: 0.06; font-family: 'Fraunces'; z-index: 0;`. Rules above and below: 1px, 120px width, centered.

## Clip-Path Image Reveal

A cinematic image entrance on scroll.

Start: `clip-path: inset(100% 0 0 0); transition: clip-path 800ms cubic-bezier(0.77, 0, 0.175, 1);`. When in viewport: `clip-path: inset(0 0 0 0);`. Trigger via IntersectionObserver with threshold 0.15.
