# Summary

Four scroll-driven animation patterns: depth-creating parallax layers, viewport-triggered reveal entrances, scroll-pinned sections for storytelling, and horizontal scroll for gallery-like experiences. Each includes timing, trigger logic, and performance considerations.

# Variants

---

## 1. Parallax Layers

Background, midground, and foreground elements move at different speeds during scroll, creating an illusion of depth.

### Spec

- Approach: use `transform: translateY(calc(var(--scroll-progress) * SPEED))` on each layer, where `--scroll-progress` is a normalized value (0 to 1) representing how far the section has scrolled through the viewport.
- **Background layer**: speed multiplier -0.3 (moves slower, appears farther away). Typically a large image or gradient shape. `will-change: transform;` for GPU compositing.
- **Midground layer**: speed multiplier -0.15. Decorative elements, secondary images, floating shapes.
- **Foreground layer**: speed multiplier 0 (moves with scroll, normal speed). This is the main content — text, cards, buttons.
- Optional **fast layer**: speed multiplier +0.1 (moves faster than scroll). Small decorative dots, lines, or icons that create a sense of passing quickly.
- Scroll tracking: use `IntersectionObserver` to detect when the parallax container is in the viewport, then attach a `scroll` listener (throttled via `requestAnimationFrame`) that calculates progress: `(viewportBottom - containerTop) / (viewportHeight + containerHeight)`.
- Performance: only apply transforms (GPU-composited). Avoid animating `top`, `left`, `margin`, or `background-position`. Use `will-change: transform` on animated layers. Disable on `prefers-reduced-motion: reduce`.
- Mobile: reduce or disable parallax (halve the speed multipliers). Many mobile browsers handle scroll events less smoothly.
- Library option: use Lenis for smooth scroll normalization + GSAP ScrollTrigger for declarative parallax.

---

## 2. Scroll Reveal

Elements animate into view as they enter the viewport. The most common scroll animation — subtle, effective, and expected by users.

### Spec

- Initial state (elements start hidden):
  - **Fade up**: `opacity: 0; transform: translateY(30px);`
  - **Fade in**: `opacity: 0;` (no transform — simplest)
  - **Slide from left**: `opacity: 0; transform: translateX(-40px);`
  - **Scale up**: `opacity: 0; transform: scale(0.95);`
- Revealed state: `opacity: 1; transform: none;`
- Transition: `600ms cubic-bezier(0.22, 1, 0.36, 1)` (ease-out with a smooth settle).
- Trigger: `IntersectionObserver` with `threshold: 0.15` (triggers when 15% of the element is visible). Set `rootMargin: "0px 0px -50px 0px"` to trigger slightly after the element enters (prevents triggering at the very edge).
- Stagger for groups: when multiple siblings reveal together (e.g., cards in a grid), add incremental `transition-delay: calc(var(--index) * 80ms)`. Set `--index` via JS or CSS `:nth-child()`.
- One-time vs. repeating: for most cases, add the reveal class once and never remove it (`observer.unobserve(entry.target)` after triggering). For repeating reveals (elements that re-animate when scrolled back into view), keep observing.
- CSS-only approach: `@starting-style` + scroll-driven animations (CSS `animation-timeline: view()`) for modern browsers. Fallback to JS IntersectionObserver for broad support.
- Performance: batch DOM reads/writes. Use `will-change: transform, opacity` on pre-animation elements, remove after animation completes.

---

## 3. Scroll Pin (Sticky Storytelling)

A section that pins in place while the user scrolls through content panels — used for step-by-step storytelling, feature demos, or before/after reveals.

### Spec

- Structure: an outer container tall enough to hold all content panels (height: `panelCount * 100vh`). Inside: a `position: sticky; top: 0; height: 100vh;` viewport-filling wrapper that stays in place.
- Content panels: stacked or layered. As the user scrolls through the outer container, different panels become active based on scroll progress.
- Scroll progress calculation: `(scrollTop - containerTop) / (containerHeight - viewportHeight)`. This gives a 0-to-1 value.
- Panel transitions based on progress:
  - Panel 1 active: progress 0 to 0.25
  - Panel 2 active: progress 0.25 to 0.5
  - Panel 3 active: progress 0.5 to 0.75
  - Panel 4 active: progress 0.75 to 1.0
- Between panels: crossfade (opacity transitions) or slide transitions. Active panel: `opacity: 1; transform: translateY(0);`. Inactive: `opacity: 0; transform: translateY(20px);`. Transition: 400ms ease.
- Common layout: left side pinned with a visual (image, illustration, or code block that changes), right side scrolls naturally with text content for each step. Alternative: full-screen takeover with overlay text.
- Progress indicator (optional): a vertical dot tracker on the right edge showing which panel is active. Dots: 8px circles, active = filled accent, inactive = muted.
- GSAP ScrollTrigger config: `pin: true, scrub: 1, snap: { snapTo: 1/panelCount, duration: 0.3 }` for section snapping.

---

## 4. Horizontal Scroll Section

A section where vertical scrolling translates into horizontal movement — the content scrolls sideways while the user scrolls down. Creates a gallery or timeline experience.

### Spec

- Outer container: `height: calc(var(--panel-count) * 100vw);`. This creates enough vertical scroll distance to drive the horizontal movement.
- Inner wrapper: `position: sticky; top: 0; height: 100vh; overflow: hidden;`.
- Horizontal track: `display: flex; height: 100%; transition: transform 0ms;` (no transition — movement is directly driven by scroll). `transform: translateX(calc(var(--scroll-progress) * -(100% - 100vw)));`.
- Each panel: `flex-shrink: 0; width: 100vw; height: 100%;` (or narrower for peek effect). Contains section content.
- Scroll progress: same calculation as scroll pin. Map vertical scroll of the outer container to horizontal translate of the track.
- Scroll-driven approach (modern CSS): `animation: scroll-horizontal linear; animation-timeline: view(); @keyframes scroll-horizontal { from { transform: translateX(0); } to { transform: translateX(calc(-100% + 100vw)); } }`.
- Content ideas: project timeline, product feature tour, image gallery, team member introductions.
- Progress indicator: thin horizontal progress bar at the bottom of the section. Width grows from 0% to 100% as the user scrolls through. Height: 2px, accent color.
- Accessibility: ensure all content is reachable via tab navigation regardless of horizontal scroll state. Add `aria-label` to the section describing the horizontal scroll behavior.
- Mobile: consider disabling horizontal scroll and stacking panels vertically instead. Horizontal scroll can be disorienting on touch devices without careful implementation.
