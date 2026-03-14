# Summary

A nostalgic design system that channels the warmth of analog media — film photography, letterpress printing, and mid-century graphic design. Muted earth tones, visible texture (grain, halftone dots), and vintage-inspired typography create a tactile, handcrafted quality. Ideal for artisan brands, coffee shops, creative agencies, editorial blogs, and products that value authenticity over slickness.

# Style

Everything feels like it was printed on thick stock paper. Colors are pulled from nature and aged materials — olive greens, burnt siennas, warm creams, and faded denim blues. Textures are essential: a film grain overlay covers the page, halftone dot patterns decorate section backgrounds, and paper-like noise adds depth to flat surfaces. Typography mixes a characterful display font (Syne or Familjen Grotesk) with a readable workhorse body (Source Serif 4). Imagery uses muted, desaturated color grading with warm undertones.

## Spec

- **Palette**: Background #F5ECD7 (aged cream). Surface #FFFDF5 (clean paper). Text: #2C2416 (espresso). Olive #5C6B4F. Burnt sienna #C47335. Faded blue #6B8CA3. Muted rose #B87B7B. Borders: #2C2416 at 15% opacity.
- **Typography**: Headlines in 'Syne' (bold, weight 700), tracking -0.01em, leading 1.1. Body in 'Source Serif 4' (regular, weight 400), line-height 1.75, 17px. Labels: 'Syne' medium, 11px, uppercase, tracking 0.14em, color #5C6B4F.
- **Grain Overlay**: Full-page pseudo-element with a repeating noise texture at 5% opacity. Use an SVG filter with `feTurbulence` (baseFrequency 0.65, type fractalNoise) and `feColorMatrix` for a monochrome grain.
- **Halftone Dots**: CSS radial-gradient pattern: `radial-gradient(circle, #2C2416 1px, transparent 1px)` with background-size: 8px 8px at 4% opacity, used as section background decoration.
- **Image Treatment**: All photographs get `filter: saturate(0.7) contrast(1.05) sepia(0.08)` plus a subtle warm overlay (pseudo-element with #C47335 at 6% opacity, mix-blend-mode: multiply).
- **Micro-interactions**: 350ms ease-in-out. Typewriter text reveals (one character at a time, 40ms per character). Image hover: scale 1.03, filter resets to full saturation over 400ms. Links: underline offset animation (text-underline-offset transitions from 4px to 2px on hover).

# Layout & Structure

Classic editorial layout with a clear hierarchy. Sections have paper-stack layering — slightly offset backgrounds that peek out from behind content areas. Generous margins and a visible baseline grid feel.

## Navigation

Height 72px, border-bottom: 1px solid rgba(44,36,22,0.12). Background: #F5ECD7. Logo: Syne bold, 20px, #2C2416, with a small halftone dot decoration after the name. Links: 14px Syne medium, #5C6B4F → #2C2416 on hover. CTA: rounded-lg button, burnt sienna fill #C47335, cream text #F5ECD7, on hover: darken 10%.

## Hero Section

Full-width, min-height 80vh. Background: #F5ECD7 with subtle grain overlay. Centered layout. Small olive label (uppercase, tracking 0.2em). Headline: 7vw, Syne bold, #2C2416. One word underlined with a hand-drawn-style SVG underline (wavy, in burnt sienna). Subtext: Source Serif 4, 20px, #5C6B4F, max-width 540px. Below: a row of two buttons — primary (olive fill, cream text, rounded-lg) and secondary (outlined, 1.5px #2C2416 border).

## Featured Image

Full-bleed image with the sepia/warm treatment. Overlay: a subtle film-frame border effect using a CSS box-shadow inset (0 0 60px rgba(44,36,22,0.15) inset). Caption below: Source Serif 4 italic, 14px, #5C6B4F, with an em-dash prefix.

## Three Column Editorial

Background: #FFFDF5 with a single halftone dot band across the top (40px height). 3-column grid, 32px gap. Each column: Syne heading (22px), Source Serif 4 body (16px). Thin 1px top border (#2C2416/10) on each column. Optional: a small circular number badge (Syne bold, olive background, cream text, 32px circle) for each column.

## Image Grid

Masonry-style 3-column grid. All images receive the warm treatment filter. On hover: filter clears to full saturation, subtle scale 1.03. Each image sits in a container with a 2px #2C2416/10 border and border-radius 8px. Stagger entry animations (translateY 20px, opacity 0 → 1) with 100ms delays between items.

## Quote Block

Centered. Background: olive #5C6B4F. Text: #F5ECD7. Large Source Serif 4 italic quote, 36px. Oversized open-quote character (120px, #F5ECD7 at 15% opacity) positioned top-left. Attribution: Syne, 13px, uppercase tracking, below a 40px cream divider line.

## Footer

Background: #2C2416. Text: #F5ECD7 at 65% opacity. 3-column layout. Links in Source Serif 4, 14px. Small halftone dot decoration in the brand column. Bottom: thin 1px rgba(245,236,215,0.08) top border, copyright centered.

# Special Components

## Film Grain Overlay

A full-page texture that gives everything a tactile, analog feel.

`position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; opacity: 0.04;` Apply an SVG filter: `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>` Reference via `filter: url(#grain)` on a covering div.

## Hand-Drawn Underline

A wavy SVG underline that replaces mechanical text-decoration.

Create an SVG path with a gentle wave: `<path d="M0,4 C10,0 20,8 30,4 C40,0 50,8 60,4" stroke="#C47335" stroke-width="2" fill="none"/>`. Display it below the target word using position: absolute, bottom: -6px, width matched to the text. Set `stroke-dasharray` to the path length and animate `stroke-dashoffset` from full to 0 on viewport entry for a drawing effect.

## Paper Stack Card

A card that appears layered on stacked sheets of paper.

Main card: background #FFFDF5, border: 1px solid rgba(44,36,22,0.1), border-radius 8px. Two pseudo-elements (::before, ::after) positioned behind it: same dimensions, rotated 1deg and 2deg respectively, background #F5ECD7 and #EDE4CC, z-index -1 and -2. Creates a stacked paper illusion.
