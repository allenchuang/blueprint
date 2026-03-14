# Summary

Four page transition patterns for single-page apps and multi-page navigations: a directional slide, a smooth crossfade, a morphing element transition, and a shared-element animation. These elevate perceived quality and create spatial awareness between views.

# Variants

---

## 1. Directional Slide

Pages slide in from the direction of navigation — forward pushes from right, backward from left. Creates a linear spatial model.

### Spec

- Implementation: wrap page content in a transition container. Use Framer Motion's `AnimatePresence` + `motion.div` or CSS transitions with route-change detection.
- **Enter (forward navigation)**:
  - Initial: `transform: translateX(100%); opacity: 0;`
  - Animate to: `transform: translateX(0); opacity: 1;`
  - Duration: 400ms. Easing: `cubic-bezier(0.32, 0.72, 0, 1)`.
- **Exit (current page leaving)**:
  - Animate to: `transform: translateX(-30%); opacity: 0;`
  - Duration: 300ms. Easing: `cubic-bezier(0.32, 0.72, 0, 1)`.
- **Backward navigation**: reverse directions. Enter from left (-100%), exit to right (+30%).
- Track direction: compare route depth or use a navigation stack. Pass direction as a prop or CSS variable.
- Stacking: during transition, both pages are visible simultaneously. The entering page has `z-index: 2`, the exiting page has `z-index: 1`. Container: `position: relative; overflow: hidden;`.
- Mobile: reduce translateX distances to 60% (less dramatic) and shorten to 300ms for snappier feel.
- Framer Motion config: `transition: { type: "spring", stiffness: 300, damping: 30 }` for a natural spring feel.

---

## 2. Crossfade

The simplest and most universally safe transition. The outgoing page fades out while the incoming page fades in. Clean and unobtrusive.

### Spec

- **Exit**: `opacity: 1 → 0;` Duration: 200ms. Easing: `ease-in`.
- **Enter**: `opacity: 0 → 1;` Duration: 300ms. Easing: `ease-out`. Delay: 100ms (slight overlap creates a smoother blend than a hard cut).
- Optional scale: combine with a subtle scale for more presence.
  - Exit: `transform: scale(1) → scale(0.98);`
  - Enter: `transform: scale(1.02) → scale(1);`
- Both pages stack during the transition. Use `position: absolute` on both, inside a `position: relative` container.
- For Next.js App Router: use a layout-level `AnimatePresence` wrapping `{children}` with a key derived from the pathname.
- Loading state bridge: if the next page needs data, show a skeleton/loading state during the fade-in rather than a blank screen. Fade in the skeleton, then crossfade skeleton → content once loaded.

---

## 3. Morph Transition

A dramatic full-screen wipe or shape morph between pages. A colored or branded shape expands to cover the screen, then recedes to reveal the new page.

### Spec

- **Phase 1 — Cover (300ms)**:
  - A full-screen div (brand color or black) expands from a point of origin (the clicked element's position, or screen center).
  - Use `clip-path: circle(0% at var(--originX) var(--originY))` → `clip-path: circle(150% at var(--originX) var(--originY))`.
  - Or use a rectangular wipe: `clip-path: inset(0 100% 0 0)` → `clip-path: inset(0 0 0 0)`.
  - Easing: `cubic-bezier(0.77, 0, 0.175, 1)`.
  - During this phase, the old page is still visible behind the expanding shape.

- **Phase 2 — Swap (0ms)**:
  - At the midpoint (overlay fully covers screen), swap the underlying page content. This is instantaneous — the overlay hides the swap.

- **Phase 3 — Reveal (400ms)**:
  - The overlay recedes: `clip-path: circle(150%)` → `clip-path: circle(0%)` from the center or a target point.
  - Or reverse the wipe direction.
  - Easing: `cubic-bezier(0.77, 0, 0.175, 1)`.
  - The new page content is now visible.

- Origin tracking: capture the click event's `clientX`/`clientY` and pass as CSS variables to position the circle expansion origin.
- Variant — Diagonal wipe: `clip-path: polygon(0 0, 0 0, 0 0, 0 0)` → `polygon(-20% 0, 120% 0, 100% 100%, 0% 100%)` for an angular reveal.

---

## 4. Shared-Element Transition

An element (image, card, heading) appears to physically move from its position on the current page to its position on the next page. Creates a strong visual connection between list and detail views.

### Spec

- Concept: identify a shared element on both pages (e.g., a product image that exists in the grid view and the detail view).
- **Step 1 — Capture source**: on navigation trigger, read the shared element's `getBoundingClientRect()` (position, dimensions) and capture its visual state (image src, text content).
- **Step 2 — Clone and animate**: create an absolute-positioned clone of the element at its source coordinates. Fix it to the viewport. Meanwhile, navigate to the new page.
- **Step 3 — Capture target**: on the new page, read the target element's `getBoundingClientRect()`.
- **Step 4 — Tween**: animate the clone from source rect to target rect using `transform: translate() scale()`. Duration: 500ms. Easing: `cubic-bezier(0.32, 0.72, 0, 1)`. The source and target elements are hidden during the animation (opacity 0).
- **Step 5 — Cleanup**: once animation completes, remove the clone and show the target element.
- Background transition: while the element morphs, the rest of the page crossfades (variant 2) underneath.
- Framer Motion approach: use `layoutId` prop on the shared element in both views. Wrap pages in `AnimatePresence` with `mode="popLayout"`. Framer handles the rect calculation and tweening automatically.
- Fallback: if no shared element is found (e.g., direct URL navigation), fall back to a simple crossfade.
- Best for: image grid → detail page, card list → card detail, thumbnail → full view.
