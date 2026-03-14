# Summary

A moody, atmospheric design system built on frosted glass panels floating over dark gradients. Aurora-inspired color shifts (teal to violet) bleed through translucent surfaces, creating depth and dimension without visual clutter. Best suited for SaaS dashboards, creative portfolios, and modern product sites that need a premium, futuristic feel.

# Style

The visual language is defined by layered translucency. Every surface is a frosted glass panel — semi-transparent backgrounds with heavy backdrop blur — sitting over a deep, near-black canvas. Color comes exclusively from gradient accents that shift between teal and violet, visible through the glass or as border highlights. Typography is clean and geometric (Inter or General Sans) to keep the focus on the luminous material effects.

## Spec

- **Palette**: Base background #0a0a0f (near-black with blue undertone). Glass panels use rgba(255,255,255,0.06) to rgba(255,255,255,0.12). Primary gradient: linear-gradient(135deg, #00d4aa, #7c3aed). Text: #e8e8e8 (primary), #888899 (secondary).
- **Typography**: Headlines in 'General Sans' (semibold, weight 600), tracking -0.03em. Body in 'Inter' (regular, weight 400), line-height 1.6. Accent labels in uppercase Inter 12px, tracking 0.12em, color #888899.
- **Glass Effect**: `background: rgba(255,255,255,0.08); backdrop-filter: blur(20px) saturate(150%); -webkit-backdrop-filter: blur(20px) saturate(150%); border: 1px solid rgba(255,255,255,0.12);`
- **Gradient Borders**: Use a pseudo-element with `background: linear-gradient(135deg, rgba(0,212,170,0.4), rgba(124,58,237,0.4))` behind a 1px transparent border, masked with `border-radius` matching the parent.
- **Glow Shadows**: `box-shadow: 0 0 40px rgba(0,212,170,0.08), 0 8px 32px rgba(0,0,0,0.4)` on elevated cards.
- **Micro-interactions**: 300ms cubic-bezier(0.4, 0, 0.2, 1) for all transitions. Cards lift 4px on hover with increased glow intensity. Buttons use a gradient shimmer that translates across on hover (background-position shift).

# Layout & Structure

Dark, spacious layout with generous padding (80-120px vertical sections). Content floats in glass cards over a subtle aurora gradient background that shifts slowly with CSS animation.

## Navigation

Fixed top bar, height 72px. Glass background: rgba(10,10,15,0.8) with backdrop-blur(16px). Logo on left (gradient text or icon). Nav links in Inter 14px, #888899, transitioning to #e8e8e8 on hover. Right side: gradient-outlined pill button "Get Started" with a soft glow on hover.

## Hero Section

Full viewport height. Large centered headline (6vw to 8vw) in General Sans semibold, white (#e8e8e8). Subtext in #888899, 18px, max-width 540px, centered. Behind the text, render a large radial aurora gradient (teal center bleeding to violet edges at 30% opacity) using a CSS radial-gradient on a positioned div. Add a slow 20s infinite CSS keyframe animation that shifts the gradient position.

## Feature Cards Grid

3-column grid of glass cards. Each card: 24px padding, glass background, gradient top-border (2px height, full width). Inside: 40px icon area (outlined Lucide icon in gradient color), bold 20px heading, 15px body text in #888899. On hover: card lifts (translateY -4px), glow shadow intensifies, top border brightens.

## Metrics / Social Proof Band

Full-width glass panel, single row. 4 stat items evenly spaced: large number (48px, gradient text using background-clip: text) with label below (12px uppercase, #888899). Thin 1px rgba(255,255,255,0.08) vertical dividers between items.

## Showcase Section

Asymmetric two-column layout. Left: large glass-bordered screenshot/mockup with subtle tilt (transform: perspective(1000px) rotateY(-3deg)). Right: stacked text blocks — section label (uppercase, gradient), headline (32px), paragraph, and a text link with arrow that slides right on hover.

## Footer

Background: #06060a. 4-column grid. Brand column with gradient logo mark. Link columns in 14px Inter, #888899 → #e8e8e8 on hover. Bottom row: thin 1px rgba(255,255,255,0.06) top border, copyright text centered, 13px #555566.

# Special Components

## Aurora Background

A full-screen positioned div behind all content.

Use two overlapping radial gradients: `radial-gradient(ellipse at 20% 50%, rgba(0,212,170,0.15), transparent 60%)` and `radial-gradient(ellipse at 80% 50%, rgba(124,58,237,0.15), transparent 60%)`. Animate with a 20s infinite alternate keyframe that shifts the gradient positions by 10-15%.

## Gradient Text

Apply to hero numbers, stat values, or accent headings.

`background: linear-gradient(135deg, #00d4aa, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`

## Shimmer Button

A call-to-action button with a traveling light effect.

Button with `position: relative; overflow: hidden;` and a gradient background. Add a pseudo-element: `content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: left 600ms;`. On hover: `left: 100%`.
