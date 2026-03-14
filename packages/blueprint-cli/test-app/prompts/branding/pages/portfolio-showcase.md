# Summary

A portfolio/showcase page that presents work in a visually-driven layout. Combines multiple layout techniques — masonry grids, filterable categories, lightbox viewing, and case study cards — to create an engaging browsing experience for creative agencies, photographers, product studios, and design teams.

# Layout & Structure

## Hero

Minimal and confident. Headline (48-64px, bold): "Our Work", "Selected Projects", or "Portfolio". Optional: a single line of body text (18px, muted). No imagery in the hero — the work below speaks for itself. Optional: horizontal category filter tabs directly below the heading.

## Category Filter Bar

Sticky (below nav when scrolled). Horizontal row of filter pills. Each pill: padding 8px 20px, border-radius 9999px. Default: transparent background, muted text. Active: filled background (dark or accent), white text. Categories: "All", "Branding", "Web", "Mobile", "Product", etc. Transition between states: 200ms ease. On click: grid below re-filters with a fade-and-scale animation (items that leave: scale 0.95 + opacity 0 over 300ms; items that enter: scale 0.95 → 1 + opacity 0 → 1 over 400ms).

## Masonry Grid

Primary showcase layout. 3-column masonry with 16-20px gap. Items have varying heights based on image aspect ratios (landscape, portrait, square). Each item:

- Container: border-radius 12px, overflow hidden, position relative.
- Image: object-fit: cover, full container. Default: no filter. On hover: slight zoom (scale 1.04, 500ms ease).
- Overlay: position absolute, full cover, gradient from transparent top to rgba(0,0,0,0.6) bottom. Opacity 0 by default, fades to 1 on hover (300ms).
- Overlay content (visible on hover): project title (18px, white, bold), category label (12px, uppercase, white/80%), and a small arrow icon (top-right corner, → shifts 4px right on hover).
- Click: opens the lightbox or navigates to the case study page.

On mobile: 2-column grid. On small mobile: single column.

## Featured / Case Study Cards

Below or interspersed with the masonry grid. Larger format for key projects. Each card: full-width or 2-column spanning layout.

### Horizontal Case Study Card
- 2-column grid (image 60%, text 40%). Border-radius 16px, overflow hidden.
- Left: project image, object-fit cover.
- Right: padding 40px. Category label (12px uppercase, accent color). Title (28px bold). Description (16px, muted, 2-3 lines). Tags: row of small pills ("React", "Branding", "2024") in 12px, subtle border. "View project →" text link.
- On hover: image zooms slightly, text-link arrow slides right.
- Alternate: flip the image/text sides on alternating cards for visual rhythm.

## Lightbox

Modal overlay triggered by clicking any masonry item. Full-screen dark overlay (rgba(0,0,0,0.92)). Centered content: large image (max 85vw, max 85vh, object-fit contain). Below: project title (20px, white), description (15px, white/70%). Navigation: left/right arrow buttons (48px circles, white border, positioned at viewport edges). Close: X button top-right (48px). Keyboard support: Escape to close, Arrow keys to navigate. Entrance: image scales from 0.9 → 1.0 + fades in over 400ms. Exit: reverse.

## Project Stats Row (Optional)

Below the grid or at the bottom. Centered row of aggregate stats: "50+ Projects", "30 Clients", "12 Awards", "8 Years". Large numbers (40px bold), labels below (13px muted). Thin top and bottom rule lines.

## Contact CTA

Full-width accent background (or dark). Centered: "Have a project in mind?" headline (36px), body text (18px, max-width 420px), pill CTA button "Start a conversation →".
