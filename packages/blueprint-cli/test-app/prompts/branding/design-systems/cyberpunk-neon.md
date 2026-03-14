# Summary

A high-voltage design system that plunges users into a dark digital world lit by neon. True black backgrounds, electric cyan and hot pink accents, monospace typography, and CRT-inspired effects (scanlines, glitch, glow) create an immersive cyberpunk atmosphere. Built for developer tools, gaming platforms, crypto products, and any brand that wants to feel like the future — raw, electric, and slightly dangerous.

# Style

The screen is the medium. Everything glows against absolute darkness — text radiates colored light, borders pulse with neon, and occasional glitch artifacts disrupt the polish to suggest a living system. Typography is strictly monospace (JetBrains Mono or Space Mono), reinforcing a terminal/hacker aesthetic. Color is used surgically: cyan and pink are the only hues, deployed as neon accents against black and dark gray surfaces. Interfaces feel like mission control panels.

## Spec

- **Palette**: Background #000000 (true black). Surfaces: #0a0a0a, #111111. Neon cyan: #00FFD1. Hot pink: #FF007A. Muted gray: #3a3a3a. Text: #E0E0E0 (primary), #666666 (secondary). Danger: #FF3333.
- **Typography**: Headlines in 'Space Mono' (bold, weight 700), tracking 0.02em, leading 1.2. Body in 'JetBrains Mono' (regular, weight 400), line-height 1.65, 15px. Labels: uppercase, 11px, tracking 0.15em, weight 700, neon cyan #00FFD1.
- **Neon Glow**: Text: `text-shadow: 0 0 7px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;` applied at reduced intensity (40-60% alpha). Border: `box-shadow: inset 0 0 8px rgba(0,255,209,0.15), 0 0 15px rgba(0,255,209,0.1);` with `border: 1px solid rgba(0,255,209,0.4)`.
- **Scanlines**: Pseudo-element overlay: `background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px); pointer-events: none;` covering the full viewport.
- **Glitch Effect**: On hover or load, apply a brief 200ms animation that offsets RGB channels: duplicate the text element in cyan (translate -2px, 1px) and pink (translate 2px, -1px) with mix-blend-mode: screen, rapidly toggling clip-path rects.
- **Micro-interactions**: 200ms ease-out default. Neon elements pulse (box-shadow intensity oscillates with a 2s infinite animation). Hover on buttons: glow intensifies + slight scale(1.03). Click: brief white flash (30ms bg-white at 10% opacity).

# Layout & Structure

Dense, panel-based layout inspired by sci-fi control interfaces. Thin neon grid lines subtly mark the background. Content is organized in clearly bordered panels/cards with header bars, like terminal windows.

## Navigation

Height 64px, border-bottom: 1px solid rgba(0,255,209,0.2). Background: #000000. Logo: Space Mono bold, neon cyan glow. Nav links: 13px JetBrains Mono uppercase, #666666 → #00FFD1 on hover with glow. Right side: a terminal-style command input `[>_]` visual as a search trigger (1px cyan border, black fill, blinking cursor animation). CTA button: 1px #FF007A border, transparent bg, pink text with glow, on hover: fills #FF007A, text goes black.

## Hero Section

Full viewport, black. Center: a large monospace headline (8vw) in #E0E0E0, with one word in neon cyan glow. The headline types itself in (typewriter effect, 60ms per character, with a blinking block cursor). Below: a single line of muted description (15px, #666666). Two buttons: cyan outline (1px, glow) and pink filled. Background: a very subtle grid pattern (1px lines at #111111, 60px spacing) covering the viewport. Optional: a brief glitch animation on the hero text every 8 seconds.

## Feature Terminal Cards

3-column grid. Each card styled as a terminal window: top bar (24px height, #111111, three colored dots — red, yellow, green — 8px circles), content area with #0a0a0a background, 1px #3a3a3a border. Inside: a neon label (cyan, uppercase), heading (20px white), body text (14px, #666666). The card's top border changes to the accent color (cyan or pink) on hover, with the glow shadow activating.

## Stats Dashboard Strip

Full-width, #0a0a0a background. Horizontal layout: 4 data panels, each with a large value (40px, neon color, glow), a unit label (14px, #666666), and a tiny sparkline graph (SVG, 60px wide, neon stroke). Thin 1px #3a3a3a vertical dividers.

## Showcase / Demo Section

Split layout. Left: terminal-style code block with syntax highlighting (cyan for keywords, pink for strings, white for identifiers) on #0a0a0a. Right: description text with a stacked list of features, each prefixed with a cyan ">" character. The code block has a typing animation that writes out key lines.

## Testimonials

Dark. Single centered testimonial. Quote in 28px #E0E0E0 monospace. Author name in neon pink. Navigation: two arrow keys styled as keyboard key caps (raised 3D look with subtle bottom shadow, 1px cyan border).

## Footer

Background: #000000. Border-top: 1px solid #00FFD1 at 20% opacity. 4-column grid. All text monospace, 13px. Links: #666666 → cyan on hover. Bottom: ASCII art divider or a single `>_` prompt with blinking cursor, copyright in #3a3a3a.

# Special Components

## Neon Text Glow

Text that emits colored light against the dark background.

For cyan: `color: #00FFD1; text-shadow: 0 0 7px rgba(0,255,209,0.6), 0 0 20px rgba(0,255,209,0.3), 0 0 40px rgba(0,255,209,0.15);`. For pink: swap to #FF007A values. Add a subtle 2s infinite pulse animation that oscillates shadow spread by 20%.

## Glitch Effect

A brief RGB-split distortion on text or images.

Clone the element twice. Clone 1: `color: #00FFD1; mix-blend-mode: screen;` offset by translate(-2px, 1px). Clone 2: `color: #FF007A; mix-blend-mode: screen;` offset by translate(2px, -1px). Apply a 200ms keyframe that rapidly toggles `clip-path: inset(random% 0 random% 0)` on each clone. Trigger on hover or on a timed interval.

## Terminal Card

A UI container styled as a system terminal.

Outer: `border: 1px solid #3a3a3a; border-radius: 8px; overflow: hidden;`. Title bar: `height: 32px; background: #111111; display: flex; align-items: center; padding: 0 12px; gap: 6px;` with three dots (8px circles: #FF5F57, #FEBC2E, #28C840). Body: `background: #0a0a0a; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #E0E0E0;`.

## Blinking Block Cursor

A terminal-style cursor for typewriter effects.

`display: inline-block; width: 10px; height: 1.2em; background: #00FFD1; vertical-align: text-bottom; animation: blink 1s step-end infinite;` with `@keyframes blink { 50% { opacity: 0; } }`.
