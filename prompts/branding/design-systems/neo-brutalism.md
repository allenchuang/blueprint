# Summary

A loud, unapologetic design system built on thick black borders, hard offset shadows, and vivid primary colors. Neo-brutalism rejects polish in favor of raw honesty — visible structure, no rounded corners, and a playful-yet-aggressive energy. Ideal for creative tools, developer products, personal brands, and anything that wants to feel handmade and bold.

# Style

Every element declares its presence with a thick black border and a hard-edge drop shadow. Colors are flat and saturated — lemon yellow, coral red, mint teal — applied as solid fills without gradients. Typography is geometric and confident (Space Grotesk or Epilogue), used at large sizes. The grid is visible and structural; nothing hides. Buttons look like they could be stamped. Cards look like paper cutouts stacked on a desk.

## Spec

- **Palette**: Background #FFFDF7 (warm white). Primary fills — yellow #FFE924, coral #FF6B6B, teal #4ECDC4, lavender #C3B1E1. Text: #1a1a1a. All borders: #1a1a1a.
- **Typography**: Headlines in 'Space Grotesk' (bold, weight 700), tracking -0.02em. Body in 'Space Grotesk' (regular, weight 400), line-height 1.65. Labels: uppercase, 12px, tracking 0.1em, weight 700.
- **Borders**: Every card, button, and input gets `border: 3px solid #1a1a1a`. No exceptions. Border-radius: 0 (or 4px max for buttons).
- **Shadows**: Hard offset `box-shadow: 5px 5px 0px #1a1a1a`. On hover, shift to `3px 3px 0px #1a1a1a` with `translate(2px, 2px)` to simulate a press.
- **Micro-interactions**: 150ms ease-out for all transitions. Hover states: shadow compress + translate. Active states: shadow disappears entirely with full translate (5px, 5px). Color fills swap on interactive elements (e.g., yellow bg becomes #1a1a1a, text inverts to yellow).

# Layout & Structure

Chunky, visible grid with generous gaps (24-32px). Sections are clearly delineated with thick horizontal rules or color-block backgrounds. The page reads like a poster or a zine.

## Navigation

Height 72px, border-bottom: 3px solid #1a1a1a. Logo: bold text mark in Space Grotesk. Nav links: 15px bold uppercase, no underlines — on hover, a colored underline (4px thick, random accent color) slides in from left. CTA button: yellow #FFE924 fill, 3px black border, hard shadow, inverts on hover.

## Hero Section

Full-width, min-height 80vh. Background: a flat color block (e.g., #FFE924 or #4ECDC4). Headline: 8vw to 12vw, black, Space Grotesk bold. One word wrapped in a contrasting color pill (inline-block with different fill). Below: 20px body text, max-width 600px. A large neo-brutal button ("Get Started →") with 3px border and hard shadow. Optional: a tilted browser mockup (transform: rotate(-2deg)) with 3px border framing a screenshot.

## Feature Blocks

Alternating full-width color bands. Each band is a different accent color with #1a1a1a text. Inside: 2-column layout — large bold heading on the left (48px), descriptive text + stacked cards on the right. Cards: white fill, 3px border, hard shadow, each card slightly rotated (rotate -1deg to 2deg) for a scattered collage feel.

## Bento Grid

A 4-column, 2-row grid where each cell is a brutalist card. Varied fills: some yellow, some coral, some white. Each cell: 3px border, hard shadow, bold heading (24px), small icon or emoji (64px), short text. On hover: background color swaps to #1a1a1a, text inverts to the original bg color.

## Testimonials

Full-width #1a1a1a background. Large white pull-quote (5xl) with a coral quotation mark (120px, offset top-left). Author name in yellow, uppercase, bold. Navigation: two brutalist arrow buttons (square, bordered, hard shadow) for prev/next.

## Footer

Background: #1a1a1a. Text: #FFFDF7. 3-column layout with thick vertical dividers (3px solid #333). Links in 14px, underline on hover with a colored accent. Bottom: full-width colored band (random accent) with centered copyright text in black.

# Special Components

## Neo-Brutal Button

The core interactive element.

`padding: 14px 28px; border: 3px solid #1a1a1a; background: #FFE924; box-shadow: 5px 5px 0px #1a1a1a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; transition: all 150ms ease-out;` On hover: `transform: translate(2px, 2px); box-shadow: 3px 3px 0px #1a1a1a;` On active: `transform: translate(5px, 5px); box-shadow: none;`

## Scattered Card Stack

Cards arranged with slight random rotations to mimic paper on a desk.

Give each card a CSS custom property `--rotation` set to values between -3deg and 3deg. Apply `transform: rotate(var(--rotation))`. On hover, the card snaps to `rotate(0deg)` and lifts (translateY -8px) with shadow expanding to `8px 8px 0px #1a1a1a`.

## Color-Swap Hover

A hover effect where background and text colors invert.

Default: `background: #FFE924; color: #1a1a1a;`. Hover: `background: #1a1a1a; color: #FFE924;`. Transition: 150ms ease-out on background and color. Apply to buttons, cards, and nav items.
