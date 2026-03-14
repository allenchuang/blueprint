# Summary

Four image gallery patterns for displaying visual collections: a CSS-grid masonry layout, a smooth infinite carousel, a focus-mode lightbox, and a before/after comparison slider. Each is specified with layout dimensions, animation timing, and interaction behavior.

# Variants

---

## 1. Masonry Grid

A Pinterest-style grid where items have varying heights, creating an organic, tiled composition. No fixed row heights.

### Spec

- CSS approach: `columns: 3; column-gap: 16px;` on the container. Each item: `break-inside: avoid; margin-bottom: 16px; border-radius: 12px; overflow: hidden;`.
- Alternative (CSS Grid): `grid-template-columns: repeat(3, 1fr); grid-auto-rows: 10px;` with JS calculating each item's `grid-row-end: span X` based on image natural height.
- Images: `width: 100%; display: block; object-fit: cover;`.
- Hover effect: image scales to 1.04 over 400ms ease. Optional overlay fades in (gradient from transparent to rgba(0,0,0,0.4)) with title text and category label.
- Entrance: stagger items on load. Each item: `opacity: 0; transform: translateY(20px);` → visible. Stagger: 60ms per item. Trigger via IntersectionObserver for infinite-scroll support.
- Responsive: 3 columns (desktop), 2 columns (tablet), 1 column (mobile).
- Click: opens lightbox (variant 3) or navigates to detail page.

---

## 2. Carousel / Slider

A horizontal scrolling gallery with smooth snap, auto-play, and navigation controls. Ideal for featured items, testimonials, or product images.

### Spec

- Container: `overflow-x: scroll; scroll-snap-type: x mandatory; display: flex; gap: 16px; -webkit-overflow-scrolling: touch;` with `scrollbar-width: none; -ms-overflow-style: none;` and `::-webkit-scrollbar { display: none; }`.
- Each slide: `scroll-snap-align: center; flex-shrink: 0; width: 80vw; max-width: 600px; border-radius: 16px; overflow: hidden;`.
- Images: `width: 100%; aspect-ratio: 16/10; object-fit: cover;`.
- Navigation arrows: positioned absolute, vertically centered on the container edges. 48px circles, white/dark background, subtle shadow, chevron icon. On click: `scrollTo({ left: currentScroll +/- slideWidth, behavior: 'smooth' })`. Disable at boundaries (first/last) with opacity 0.3.
- Dots indicator: centered below the carousel. One dot per slide, 8px circles. Active: accent fill. Inactive: muted fill. Click: scroll to corresponding slide.
- Auto-play (optional): scroll to next slide every 5s. Pause on hover, resume on leave. Use `setInterval` clearing on user interaction.
- Peek: show 10-15% of the adjacent slides on each side to indicate scrollability.

---

## 3. Lightbox

A full-screen focus view triggered by clicking any gallery image. Dark overlay, large centered image, keyboard navigation.

### Spec

- Trigger: click any image in a gallery (masonry, carousel, or grid).
- Backdrop: `position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 100;`. Entrance: opacity 0 → 1 over 300ms.
- Image: centered (flex center), `max-width: 85vw; max-height: 85vh; object-fit: contain; border-radius: 8px;`. Entrance: `transform: scale(0.92); opacity: 0;` → `scale(1); opacity: 1;` over 400ms ease-out.
- Caption: below image, 16px white, max-width matching image. Optional description line at 14px, 60% opacity.
- Close button: top-right, 48px, white X icon. Hover: background rgba(255,255,255,0.1).
- Navigation: left/right arrow buttons, 48px circles, positioned at viewport edges (centered vertically). Chevron icons. Hover: background tint. On click: current image exits (translateX -60px + opacity 0, 250ms), new image enters from the opposite side (translateX 60px → 0, 300ms).
- Keyboard: Escape closes. Left/Right arrows navigate. Prevent body scroll when open.
- Counter: "3 / 12" in top-left corner, 14px, white, 60% opacity.
- Pinch-to-zoom (optional): use CSS `transform: scale()` with touch gesture tracking. Double-tap toggles between fit and 2x zoom.

---

## 4. Before/After Comparison Slider

A split-view with a draggable divider showing two overlapping images. Perfect for product transformations, design iterations, or photo editing showcases.

### Spec

- Container: `position: relative; overflow: hidden; border-radius: 12px;` with set `aspect-ratio: 16/10` or fixed height.
- "After" image: fills the container, `position: absolute; inset: 0; object-fit: cover;`.
- "Before" image: same positioning but wrapped in a div with `overflow: hidden; width: var(--split, 50%);`. As `--split` changes, the visible portion of the "before" image changes.
- Divider line: `position: absolute; top: 0; bottom: 0; left: var(--split, 50%); width: 3px; background: #FFFFFF; z-index: 5;`. Shadow: `box-shadow: 0 0 8px rgba(0,0,0,0.3);`.
- Handle: centered on the divider line. A 40px circle with white background, subtle shadow, and a left-right arrow icon (or two opposing chevrons). `transform: translateX(-50%)`.
- Drag behavior: on mousedown/touchstart on the handle, track horizontal movement. Update `--split` CSS variable in real-time (clamp between 5% and 95%). Use `pointermove` for unified mouse/touch handling. Set `cursor: ew-resize` on the container during drag.
- Labels (optional): "Before" and "After" text labels in the top corners, 12px uppercase, white, semi-transparent background pill.
- Initial animation: on first viewport entry, the divider slides from 20% to 50% over 1000ms ease-out to hint at interactivity.
