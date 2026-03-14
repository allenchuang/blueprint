# Summary

Five distinct hero section designs, each creating a different first impression. From pure typographic impact to immersive video backgrounds, these variants cover the full spectrum of modern landing page heroes. Choose based on brand personality and content type.

# Variants

---

## 1. Typographic Hero

A text-only hero that relies entirely on font scale, weight, and spacing for impact. No images, no distractions.

### Spec

- Full viewport height (100vh), centered flex layout.
- Background: solid color from your brand palette.
- Headline: 10vw to 14vw, display font (weight 800+), tight leading (0.9-0.95). Apply tracking -0.04em. Color contrast against background.
- One keyword highlighted with a different treatment: either underline (4px solid, accent color, offset 4px), different color, or italic serif swap.
- Subtext: 18-20px, body font, 60% max-width of headline, muted color, margin-top 24px.
- Two CTA buttons: primary (filled, high contrast) + secondary (outlined or ghost). Horizontal layout, 16px gap.
- Optional: small label above headline (12px uppercase, tracking 0.2em, muted color) for category or tagline.
- Entrance animation: headline fades in + translateY(40px → 0) over 800ms with a spring easing. Subtext and buttons stagger 200ms after.

---

## 2. Video Background Hero

A full-screen looping video creates atmosphere behind a clean text overlay. For brands that want to convey energy, process, or lifestyle.

### Spec

- Container: 100vh, position relative, overflow hidden.
- Video: `<video autoPlay muted loop playsInline>`, position absolute, top 0, left 0, width 100%, height 100%, object-fit: cover.
- Overlay: pseudo-element, position absolute, full cover, `background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)`.
- Text layer: position relative (above overlay), z-index 2. White text (#FFFFFF or #F5F5F5).
- Headline: 5vw to 8vw, display font bold, text-shadow: 0 2px 20px rgba(0,0,0,0.3).
- Subtext: 18px, max-width 520px, rgba(255,255,255,0.85).
- Single CTA button: white fill, dark text, or outlined white. No competing secondary button.
- Performance: use `poster` attribute on video for instant first frame. Preload: "metadata". Consider reducing video opacity to 80% for better text legibility.
- Optional: thin scroll-down indicator at bottom center — a small chevron or "Scroll" text with a bouncing animation (translateY 0 → 8px, 1.5s infinite).

---

## 3. Split-Screen Hero

Content on one side, striking visual on the other. A classic layout that balances information with imagery.

### Spec

- Container: 100vh, 2-column grid (50/50 or 45/55 favoring the image side). On mobile (<768px): stack vertically, image on top at 50vh.
- Left column (text): vertically centered, padding 64px left, max-width 520px.
  - Small category label (12px uppercase, tracking 0.15em, accent color).
  - Headline: 48px to 64px, display font bold, #1A1A1A, leading 1.05.
  - Body: 17px, muted color, margin-top 20px, max-width 420px.
  - Button row: margin-top 32px. Primary filled + secondary ghost.
  - Optional social proof: avatar stack (3-4 circles, overlapping) + "2,000+ users" text below buttons.
- Right column (image): full height, overflow hidden. Image: object-fit: cover, 100% width/height. Optional gentle zoom on load (scale 1.05 → 1.0 over 1500ms).
- Entrance: text side slides in from left (translateX -40px → 0), image fades in, staggered by 200ms.

---

## 4. Parallax Depth Hero

Multiple layers move at different scroll speeds, creating a sense of depth and immersion. The content sits in the foreground while background elements drift.

### Spec

- Container: 120vh (extra height allows parallax range), overflow hidden on parent.
- Background layer: a large abstract image or gradient, `transform: translateY(calc(var(--scroll) * -0.3))` — moves slower. Position fixed or use a parallax library (Lenis + transform approach).
- Midground layer: decorative elements (blurred shapes, floating icons, or a secondary image at 30% opacity). Parallax rate: 0.15.
- Foreground layer: centered text, moves at normal scroll speed (no transform).
  - Headline: 6vw to 9vw, display font, white or dark depending on background.
  - Subtext: 18px, max-width 480px, slightly muted.
  - CTA button: high-visibility style (filled, shadow, or glow for dark backgrounds).
- Track scroll position with a lightweight listener (requestAnimationFrame) that sets a `--scroll` CSS variable on the container.
- Mobile fallback: disable parallax, use a static layered background instead (performance).

---

## 5. 3D Perspective Hero

A product mockup or card element floats with 3D perspective tilt, responding to mouse position. Creates a premium, interactive first impression for product launches.

### Spec

- Container: 100vh, centered flex, background: subtle gradient or solid.
- Text block: centered above the 3D element. Headline (48-64px), subtext (18px), buttons. Standard centered layout.
- 3D element: below the text (margin-top 48px). A product screenshot or card in a wrapper with `perspective: 1200px`.
  - Inner element: `transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - On mouse move: calculate X/Y position relative to center. Apply `transform: rotateX(calc(var(--rotateX) * 1deg)) rotateY(calc(var(--rotateY) * 1deg))`.
  - Max tilt: 8-12 degrees in each axis.
  - Add a shadow that shifts with the tilt: `box-shadow: calc(var(--rotateY) * -2px) calc(var(--rotateX) * 2px) 40px rgba(0,0,0,0.12)`.
- Decorative: small floating elements (dots, rings, badges) around the 3D element that also respond to mouse at a lower rate (0.5x the tilt).
- Entrance: the 3D element scales from 0.9 → 1.0 and fades in over 800ms with spring easing.
- On mouse leave: smooth return to neutral (rotateX 0, rotateY 0) over 600ms.
