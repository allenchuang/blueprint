# Summary

A warm, approachable design system defined by rounded shapes, pastel gradients, and gentle motion. Every surface feels soft and tactile — pill buttons, cloud-like cards, and blob accents create a friendly, calming aesthetic. Ideal for wellness apps, consumer products, fintech for non-technical users, and any brand that wants to feel inviting without sacrificing modern polish.

# Style

Organic shapes dominate: border-radius is always generous (16px minimum, often 24px or full pill). Colors are soft pastels with enough saturation to feel modern rather than washed out. Gradients flow between adjacent warm tones (peach to lavender, mint to sky). Shadows are diffused and barely visible — just enough to create the sensation of floating. Typography is rounded and friendly (DM Sans or Nunito) with comfortable proportions. Decorative blob SVGs float in the background at low opacity.

## Spec

- **Palette**: Base #FFF9F0 (warm cream). Cards: #FFFFFF. Primary gradient: linear-gradient(135deg, #FFECD2, #E8D5F5). Accent gradient: linear-gradient(135deg, #A8E6CF, #88D4F2). Text: #2D2D3A (warm dark). Muted: #9494A8. Border: rgba(45,45,58,0.06).
- **Typography**: Headlines in 'DM Sans' (bold, weight 700), tracking -0.02em, leading 1.15. Body in 'DM Sans' (regular, weight 400), line-height 1.7, 16px. Labels: 'DM Sans' medium, 12px, tracking 0.06em, color #9494A8.
- **Border Radius**: Cards 24px, buttons 9999px (full pill), inputs 14px, avatars 50%, image containers 20px.
- **Shadows**: Cards: `box-shadow: 0 4px 24px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)`. Elevated: `box-shadow: 0 8px 40px rgba(0,0,0,0.06)`. No hard edges.
- **Blob Decorations**: SVG blob shapes (use blobmaker or hand-draw) at 5-8% opacity, positioned absolutely in section backgrounds, using pastel gradient fills.
- **Micro-interactions**: 400ms cubic-bezier(0.34, 1.56, 0.64, 1) (spring) for hover lifts. Buttons scale to 1.02x on hover. Cards: translateY(-4px) with shadow increase. Gradient buttons shift background-position on hover for a flowing color effect.

# Layout & Structure

Flowing, centered layout with wide padding (80-100px sections). Content is narrow (max-width 1100px) with generous internal spacing. Sections gently blend into each other rather than having hard borders.

## Navigation

Height 72px, floating with 16px top margin and border-radius 9999px (pill shape), centered with max-width 1100px. Background: #FFFFFF with border: 1px solid rgba(45,45,58,0.06). Soft shadow. Logo: DM Sans bold, gradient text (primary gradient). Links: 14px, #9494A8, → #2D2D3A on hover, 200ms ease. CTA button: pill, primary gradient background, white text, 14px bold, shadow on hover.

## Hero Section

Min-height 85vh, centered text. Background: two overlapping blob SVGs at 6% opacity (peach and lavender). Headline: 56px to 72px, DM Sans bold, #2D2D3A. One keyword wrapped in a gradient text span (primary gradient with background-clip: text). Subtext: 20px, #9494A8, max-width 520px. Two pill buttons: primary (gradient fill, white text) and secondary (white fill, 1px border, dark text). Below buttons: a row of overlapping circular avatars (stacked with negative margin) + "Join 2,000+ users" text.

## Feature Cards

3-column grid, 24px gap. Each card: white background, 24px padding, 24px border-radius. Soft shadow. Top: 56px icon circle with pastel gradient fill and white icon. Heading: 20px bold. Body: 15px, #9494A8. On hover: card lifts 4px, shadow expands, icon circle gently rotates 8 degrees.

## Gradient Banner Section

Full-width section with primary gradient background and 48px border-radius (inset from edges by 32px). White text. Centered: headline (40px), body (18px), pill button (white fill, dark text). The gradient slowly shifts via a 10s CSS animation (background-position oscillation).

## Testimonials

Horizontally scrollable row of cards (scroll-snap). Each card: white, 24px radius, 20px padding. Large 22px quote text, author with avatar (48px circle), name bold, title muted. Active card has a pastel gradient left border (4px, border-radius inherited).

## Stats Row

Centered row, 4 items. Each: large number (48px, gradient text), label below (13px, muted). Separated by soft vertical dividers (1px, rgba(45,45,58,0.06)).

## Footer

Background: #2D2D3A (warm dark). Text: #FFF9F0 at 70% opacity. 4-column layout, 16px rounded link hover underlines. Bottom: thin 1px rgba(255,255,255,0.06) top border, centered copyright.

# Special Components

## Floating Blob Background

Decorative organic shapes that drift gently behind content.

Two to three SVG blobs, each 300-500px wide, positioned absolutely. Fill: pastel gradients at 6-8% opacity. Apply a slow 15s infinite CSS float animation: `@keyframes float { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(20px, -15px) rotate(3deg); } }`.

## Gradient Pill Button

The primary CTA throughout the system.

`padding: 14px 32px; border-radius: 9999px; background: linear-gradient(135deg, #FFECD2, #E8D5F5); background-size: 200% 200%; color: #2D2D3A; font-weight: 700; transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);` On hover: `transform: scale(1.02); box-shadow: 0 8px 30px rgba(232,213,245,0.4); background-position: 100% 0;`

## Avatar Stack

A row of overlapping circular user avatars for social proof.

Each avatar: `width: 40px; height: 40px; border-radius: 50%; border: 3px solid #FFF9F0;` Stack with `margin-left: -12px` on all but the first. Wrap in a flex container. The final "circle" can be a count badge: pastel gradient background, "+99" text, same dimensions.
