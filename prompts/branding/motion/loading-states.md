# Summary

Four loading state patterns that keep users engaged and informed while content loads: skeleton screens that preview layout, shimmer effects that signal activity, branded spinners that reinforce identity, and determinate progress bars for known-duration operations.

# Variants

---

## 1. Skeleton Screen

Gray placeholder shapes that mirror the layout of incoming content. Users perceive faster load times because the page "structure" appears instantly.

### Spec

- Replace each content element with a matching gray block:
  - **Text lines**: rectangles, height 14-16px, border-radius 4px, width varies (100%, 80%, 60% for natural line-length variation). Stack with 12px gap.
  - **Headings**: taller rectangles (24-28px height), width 60-70%.
  - **Avatars**: circles (40-56px diameter).
  - **Images**: rectangles matching the image container's aspect ratio, full width.
  - **Buttons**: rounded rectangles matching button dimensions.
- Background color: `#E8E8E8` (light mode) or `#2A2A2A` (dark mode).
- Layout: the skeleton layout exactly matches the loaded content layout — same grid, same padding, same gaps. This prevents layout shift when real content arrives.
- Transition to real content: skeleton elements fade out (opacity 0 over 200ms) while real content fades in (opacity 0 → 1 over 300ms, translateY 8px → 0). Or: use a crossfade by overlaying real content on top and fading it in.
- Generating skeletons: create dedicated skeleton components per layout (e.g., `CardSkeleton`, `ListItemSkeleton`) or use a generic utility that maps DOM structure to gray blocks.
- Do not use for instant operations (<200ms). Only show skeletons if the load takes >300ms (use a timeout delay before showing).

---

## 2. Shimmer / Pulse Effect

An animated shine that sweeps across skeleton elements, signaling that the system is actively working — not frozen.

### Spec

- Apply on top of skeleton elements (variant 1) as an additional visual layer.
- **Shimmer (traveling highlight)**:
  ```
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.4) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  ```
  `@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`
- Apply the shimmer as a pseudo-element (`::after`) overlaying the skeleton block, or as a second `background-image` layer on the skeleton itself.
- **Pulse (breathing opacity)**:
  ```
  animation: pulse 1.8s ease-in-out infinite;
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  ```
  Simpler than shimmer but less engaging. Good for minimal designs.
- Dark mode shimmer: use `rgba(255,255,255,0.06)` as the highlight color against a `#2A2A2A` base.
- Performance: use `will-change: background-position` (shimmer) or `will-change: opacity` (pulse). Avoid animating on many elements simultaneously — apply the animation to a parent and let it cascade visually, or stagger start times.

---

## 3. Branded Spinner

A custom loading indicator that reinforces brand identity. Replaces generic browser spinners with a purpose-built animation using brand colors, shapes, or logo elements.

### Spec

**Option A — Rotating Ring**:
- SVG circle: `stroke-dasharray: 150; stroke-dashoffset: 150;` animated to `stroke-dashoffset: 0` and `rotate: 360deg` simultaneously.
- `stroke: accent-color; stroke-width: 3; fill: none;` Circle radius: 20px.
- Animation: `1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite`. The dash chases its tail by combining rotation with dashoffset oscillation.

**Option B — Bouncing Dots**:
- 3 circles (8px each, accent color), 8px gap, horizontally centered.
- Keyframe: each dot scales from 1 → 1.4 → 1 and opacity 0.4 → 1 → 0.4.
- Stagger: dot 1 at 0ms, dot 2 at 150ms, dot 3 at 300ms. Total cycle: 1s infinite.

**Option C — Logo Pulse**:
- Brand logo mark (SVG, 32-48px). Applies a gentle pulse (scale 0.95 → 1.05, opacity 0.6 → 1). Duration: 1.5s ease-in-out infinite.
- Optional: a circular progress ring around the logo that fills over time if the duration is somewhat predictable.

**Placement**:
- Full-page loader: centered in viewport, dark overlay (optional). For initial app load or route changes.
- Inline loader: inside a button (replaces text during submission), inside a card (replaces content), or beside a label ("Loading...").
- Button loader: spinner shrinks to 20px, white color, replaces button text. Button width stays fixed (min-width) to prevent layout shift.

---

## 4. Progress Bar

A determinate indicator for operations with known progress (file uploads, multi-step processes, data imports). Shows exactly how much is complete.

### Spec

- Track: `width: 100%; height: 4px; background: #E8E8E8; border-radius: 9999px; overflow: hidden;`.
- Fill: `height: 100%; background: accent-color; border-radius: 9999px; transition: width 300ms ease-out; width: var(--progress, 0%);`.
- Update `--progress` from JS as the operation advances.
- **Gradient fill variant**: `background: linear-gradient(90deg, #2563EB, #7C3AED)` with `background-size: 100vw` (fixed gradient that "reveals" as the bar grows, creating a color sweep).
- **Indeterminate state** (when progress is unknown): the fill becomes a shorter segment (30% width) that slides back and forth: `@keyframes indeterminate { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }` Duration: 1.5s ease-in-out infinite.
- Label (optional): percentage text (14px, bold) above or to the right of the bar. Update in sync with the fill.
- Step progress (alternative): for multi-step processes, show connected circles (one per step) with a line between them. Completed steps: filled accent circle + solid connecting line. Current step: pulsing ring animation. Future steps: muted/empty circle + dashed line. Circle size: 24px. Line height: 2px.
- Completion state: when reaching 100%, the bar briefly flashes (brightens) and can optionally transform into a check mark icon with a scale-in animation (200ms spring).
