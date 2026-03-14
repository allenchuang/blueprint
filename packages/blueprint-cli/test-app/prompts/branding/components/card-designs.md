# Summary

Five card design patterns ranging from subtle glass effects to dramatic 3D interactions. Cards are the building blocks of most interfaces — these variants provide distinct visual personalities for different contexts: dashboards, portfolios, feature grids, and interactive showcases.

# Variants

---

## 1. Glass Card

A frosted, semi-transparent card that floats over a colorful background. Works best on dark or gradient backgrounds.

### Spec

- `background: rgba(255,255,255,0.08)` (dark mode) or `rgba(255,255,255,0.65)` (light mode).
- `backdrop-filter: blur(16px) saturate(120%)`.
- `border: 1px solid rgba(255,255,255,0.15)`.
- `border-radius: 16px`.
- `box-shadow: 0 4px 30px rgba(0,0,0,0.1)`.
- Padding: 24px.
- On hover: background opacity increases by 0.04, border brightens to rgba(255,255,255,0.25), shadow expands. Transition: 300ms ease.
- Content: icon/badge top, heading (18px bold), body text (14px, 80% opacity), optional action link at bottom.
- Arrange in a 3-column grid over a mesh gradient or dark background for maximum effect.

---

## 2. Stacked Card (Paper Layers)

A card that appears to sit on a stack of slightly offset papers, creating physical depth.

### Spec

- Main card: `background: #FFFFFF; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); padding: 28px; position: relative; z-index: 2;`.
- Pseudo-layer 1 (`::before`): `content: ''; position: absolute; top: 6px; left: 6px; right: -6px; bottom: -6px; background: #F3F3F3; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); z-index: -1; transform: rotate(1deg);`.
- Pseudo-layer 2 (`::after`): same as above but `top: 12px; left: 12px; right: -12px; bottom: -12px; background: #EAEAEA; transform: rotate(2deg); z-index: -2;`.
- On hover: main card lifts (translateY -4px), pseudo-layers fan out more (rotation increases to 2deg and 4deg). Transition: 400ms spring easing.
- Use for testimonials, blog post previews, or note cards.

---

## 3. Flip Card

A card with distinct front and back faces that flips 180 degrees on hover to reveal more information. Good for team members, product features, or before/after comparisons.

### Spec

- Container: `perspective: 1000px`. Fixed dimensions (e.g., 320px x 400px).
- Inner wrapper: `position: relative; width: 100%; height: 100%; transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d;`.
- On hover: inner wrapper gets `transform: rotateY(180deg)`.
- Front face: `position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 16px; overflow: hidden;`. Contains: image, name, title. Background: white.
- Back face: same as front but with `transform: rotateY(180deg)`. Contains: bio text, links, or details. Background: dark or accent color, white text.
- Both faces: `backface-visibility: hidden` to prevent showing the reverse side.
- Accessibility: on mobile/touch, use a tap toggle instead of hover (toggle a class).

---

## 4. Expandable Card

A compact card that expands in place to reveal detailed content. Ideal for FAQ items, feature details, or dashboard widgets.

### Spec

- Collapsed state: 80-100px height. Flex row: icon/image left (48px), title center (16px bold), expand chevron right (20px, rotates 180deg when open). Padding: 20px. Border: 1px solid rgba(0,0,0,0.08). Border-radius: 12px.
- Expanded state: `max-height` transitions from collapsed value to content height. Additional content (body text 15px, action buttons, data) fades in (opacity 0 → 1, 200ms delay after height transition begins).
- Height transition: 400ms ease-out using `max-height` or `grid-template-rows: 0fr → 1fr` (modern CSS approach for smooth height animation).
- Chevron rotation: 300ms ease.
- When one card expands in a group, optionally collapse others (accordion behavior). Or allow multiple open (independent toggle).
- Border changes on expanded: accent left border (3px) or subtle background tint.

---

## 5. Tilt-on-Hover Card

A 3D interactive card that tilts to follow the cursor, creating a premium, tactile feeling. Best for product showcases or feature highlights.

### Spec

- Container: `perspective: 800px`.
- Card: `border-radius: 16px; padding: 32px; background: #FFFFFF; transition: transform 200ms ease-out; transform-style: preserve-3d;`.
- On mouse move within card: calculate cursor position relative to card center. Set CSS variables: `--rotateX: (y - centerY) / centerY * -8` and `--rotateY: (x - centerX) / centerX * 8`. Apply `transform: rotateX(calc(var(--rotateX) * 1deg)) rotateY(calc(var(--rotateY) * 1deg))`. Max tilt: 8 degrees each axis.
- Shadow follows tilt: `box-shadow: calc(var(--rotateY) * -1px) calc(var(--rotateX) * 1px) 20px rgba(0,0,0,0.08)`.
- **Shine effect**: overlay pseudo-element with `background: radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.15), transparent 60%); pointer-events: none;`. `--x` and `--y` track cursor position within the card. Creates a light reflection that follows the mouse.
- On mouse leave: smooth spring back to neutral (rotateX 0, rotateY 0) over 400ms.
- Card contents (icon, heading, text) can have a slight `transform: translateZ(20px)` for a parallax depth effect within the card (requires `transform-style: preserve-3d` on parent).
