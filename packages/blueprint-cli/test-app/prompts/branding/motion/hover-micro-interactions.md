# Summary

Four hover-triggered micro-interaction patterns that add tactile, premium-feeling responsiveness to UI elements: magnetic buttons that attract toward the cursor, a cursor follower that replaces the default pointer, border glow effects that light up on proximity, and perspective tilt cards that respond to mouse position.

# Variants

---

## 1. Magnetic Button

A button that subtly gravitates toward the cursor when the pointer is nearby, creating a playful, magnetic pull effect. The button physically moves toward the mouse before snapping back on leave.

### Spec

- Detection zone: an invisible area around the button, typically 1.5x the button size. Use the button's parent or a larger wrapper with padding.
- On `mousemove` within the detection zone:
  - Calculate the offset between cursor position and button center: `dx = mouseX - buttonCenterX`, `dy = mouseY - buttonCenterY`.
  - Apply a fraction of the offset as a transform: `transform: translate(${dx * 0.3}px, ${dy * 0.3}px)`.
  - The multiplier (0.3) controls the pull strength. Lower = more subtle.
- On `mouseleave`: spring back to origin. `transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);` then `transform: translate(0, 0)`.
- During attraction, also scale the button slightly: `scale(1.05)`.
- Inner text/icon can move at a different rate (0.15 multiplier) for a parallax effect within the button itself.
- Performance: use `requestAnimationFrame` to throttle the mousemove updates. Apply transforms (GPU-composited only).
- Disable on touch devices (no hover state). Use feature detection: `@media (hover: hover)`.

---

## 2. Custom Cursor Follower

Replace the default arrow cursor with a custom-designed element that follows the pointer with smooth interpolation. Changes shape/size based on what the user is hovering.

### Spec

- Cursor element: `position: fixed; pointer-events: none; z-index: 9999;`. A small circle (12px diameter) by default.
- Tracking: on `mousemove`, update `left` and `top` (or `transform: translate()`) to match `clientX`, `clientY`. Apply a lerp (linear interpolation) for smooth following:
  ```
  currentX += (targetX - currentX) * 0.15;
  currentY += (targetY - currentY) * 0.15;
  ```
  Run in a `requestAnimationFrame` loop. The 0.15 factor creates a trailing, floaty feel.
- Default state: 12px circle, border: 2px solid #1A1A1A, background transparent. `mix-blend-mode: difference` (inverts over light/dark content).
- **On link/button hover**: expand to 48px diameter, background fills with accent at 10% opacity. Transition: 300ms spring. Optionally show label text ("View", "Click") inside the expanded cursor.
- **On image hover**: expand further (64px), shape changes to ring with a "View" label centered inside.
- **On text hover**: shrink to 4px filled dot (text cursor replacement).
- **On click**: brief scale pulse (1.0 → 0.8 → 1.0, 150ms).
- Hide default cursor: `* { cursor: none; }` when custom cursor is active.
- Mobile: disable entirely. Only activate on `@media (hover: hover) and (pointer: fine)`.

---

## 3. Border Glow / Proximity Light

Element borders or backgrounds that illuminate as the cursor approaches, as if a flashlight is moving across the UI. Creates a reactive, living-surface feeling.

### Spec

- Track cursor position globally (on `mousemove` at the document level). Store as CSS variables on `document.documentElement`: `--mouse-x` and `--mouse-y`.
- Each glow-enabled element: use a pseudo-element or `background` with a `radial-gradient` centered at the cursor position relative to the element:
  ```
  background: radial-gradient(
    400px circle at var(--local-x) var(--local-y),
    rgba(accent, 0.12),
    transparent 60%
  );
  ```
  `--local-x` and `--local-y` are the cursor position relative to the element's bounds (calculate via `getBoundingClientRect()` and subtract from global mouse position).
- **Border glow variant**: instead of a background fill, apply the radial gradient to a `border-image` or use a pseudo-element positioned as a border:
  ```
  border: 1px solid transparent;
  background-clip: padding-box;
  position: relative;
  ```
  `::before` pseudo: `background: radial-gradient(300px circle at var(--local-x) var(--local-y), rgba(accent, 0.3), transparent 60%);` positioned as the border area using `inset: -1px; border-radius: inherit; z-index: -1;`.
- Performance: update CSS variables in `requestAnimationFrame`. Only calculate `--local-x/y` for elements currently in the viewport (use IntersectionObserver to toggle tracking). Limit to 20-30 elements max.
- Intensity falloff: the glow naturally fades with the `radial-gradient`. Adjust the `400px` circle size for wider or tighter proximity detection.
- Dark mode works best for this effect (the glow is more visible on dark surfaces).

---

## 4. Perspective Tilt

Elements that rotate in 3D space in response to cursor position, creating a sense of physical depth and tangibility. More immersive than a flat hover state.

### Spec

- Container: `perspective: 800px;` (set on the parent or the element itself).
- Element: `transition: transform 200ms ease-out; transform-style: preserve-3d;`.
- On `mousemove` within the element:
  - Calculate normalized position: `normalX = (mouseX - rect.left) / rect.width - 0.5` (range: -0.5 to 0.5). Same for Y.
  - Apply tilt: `transform: rotateX(${normalY * -MAX_TILT}deg) rotateY(${normalX * MAX_TILT}deg);`. `MAX_TILT`: 6-10 degrees for cards, 3-5 for larger surfaces.
- On `mouseleave`: return to neutral with a spring transition: `transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1); transform: rotateX(0) rotateY(0);`.
- **Shine layer**: add a pseudo-element with `background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.12), transparent 50%); pointer-events: none;`. The shine follows the cursor within the card, simulating light reflection.
- **Shadow response**: shift the shadow opposite to the tilt direction: `box-shadow: calc(normalX * -10px) calc(normalY * -10px) 30px rgba(0,0,0,0.1);`. The shadow moves as if a fixed light source is overhead.
- **Depth layers**: child elements with `transform: translateZ(20px)` or `translateZ(40px)` create a parallax depth effect within the tilting card. Text floats above the background. Requires `transform-style: preserve-3d` on the card.
- Performance: throttle with `requestAnimationFrame`. Use `will-change: transform` on the tilting element. Disable on touch devices and when `prefers-reduced-motion: reduce`.
