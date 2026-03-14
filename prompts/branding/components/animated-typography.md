# Summary

Four text animation techniques that bring typography to life: smooth character-by-character reveals, randomized scramble effects, flowing gradient fills, and cinematic split-line entrances. Use these to make headlines memorable, loading states engaging, and page transitions dramatic.

# Variants

---

## 1. Character-by-Character Reveal

Each character fades and slides into place sequentially, creating a ripple effect across the text. Classic and versatile.

### Spec

- Wrap each character in an inline `<span>` (use JS to split the text string). Preserve spaces as `&nbsp;` spans with visibility.
- Initial state per span: `opacity: 0; transform: translateY(20px); display: inline-block;`.
- Animate to: `opacity: 1; transform: translateY(0);`.
- Transition per span: `600ms cubic-bezier(0.22, 1, 0.36, 1)`.
- Stagger: apply `transition-delay: calc(var(--char-index) * 30ms)` using a CSS variable set inline or via JS.
- Trigger: on viewport entry (IntersectionObserver) or on page load.
- Total animation duration: ~30ms * character count + 600ms. For a 20-character word: ~1.2s total.
- **Variant — From below with blur**: add `filter: blur(4px)` to initial state, transitioning to `blur(0)` alongside the Y movement. Creates a softer, more organic entrance.
- **Variant — From random directions**: randomize the initial translateX/translateY per character between -20px to 20px. Characters converge into position from scattered origins.

---

## 2. Text Scramble / Decode

Characters rapidly cycle through random letters before settling on the correct value. Gives a "decrypting" or "digital" feel.

### Spec

- Target: a heading or label element with known final text.
- Algorithm (JS):
  1. Define a character set: `"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*"`.
  2. Start with all characters randomized from the charset.
  3. On each frame (requestAnimationFrame), progressively lock characters from left to right. After `(index * 40ms)` elapsed time, that character is finalized to the correct value. Unfinalized characters continue cycling randomly every 30ms.
  4. Total duration: `text.length * 40ms + 200ms` buffer.
- Styling: use a monospace font during the scramble for consistent character width (prevent layout shift). Switch to display font once fully resolved. Or use `font-variant-numeric: tabular-nums` if the text is numeric.
- Trigger: on hover, on viewport entry, or on route change.
- **Variation — Reverse scramble (exit)**: on mouse leave, the text dissolves back into random characters over 300ms.
- CSS-only alternative (limited): use `@keyframes` with `content` changes on a pseudo-element cycling through 10-15 random strings. Less precise but no JS needed.

---

## 3. Gradient Text Animation

Text filled with a moving gradient, creating a shimmering or flowing color effect. Eye-catching for hero headlines and logo text.

### Spec

- Apply gradient as text fill:
  ```
  background: linear-gradient(
    90deg,
    #2563EB 0%,
    #7C3AED 25%,
    #E11D48 50%,
    #F59E0B 75%,
    #2563EB 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  ```
- Animation: `@keyframes gradient-shift { to { background-position: 200% center; } }`.
- Apply: `animation: gradient-shift 3s linear infinite;`.
- For a subtler effect: use only 2-3 colors, slow the animation to 6-8s, and use `ease-in-out` for a pulsing flow.
- **On-hover only**: set `animation-play-state: paused` by default, `running` on hover. Or animate `background-position` via transition instead of keyframe.
- **Spotlight variant**: Instead of a full repeating gradient, use a narrow highlight band: `linear-gradient(90deg, #1A1A1A 40%, #ACCENT 50%, #1A1A1A 60%)` with background-size: 300%. Animate position from left to right. Creates a light passing over the text.

---

## 4. Split-Line Entrance

Each line of a multi-line heading animates in independently — sliding from alternating directions or with staggered timing. Creates a cinematic, editorial feel.

### Spec

- Wrap each line in a container div with `overflow: hidden` (masks the sliding text).
- Inside each container, the actual text span has:
  - Initial: `transform: translateY(100%); opacity: 0;` (text sits below its visible area).
  - Animate to: `transform: translateY(0); opacity: 1;`.
  - Transition: `800ms cubic-bezier(0.77, 0, 0.175, 1)`.
  - Stagger per line: 150ms delay.
- Trigger: on viewport entry.
- **Alternating direction variant**: odd lines enter from the left (`translateX(-100%)`), even lines from the right (`translateX(100%)`). Each container has `overflow: hidden` to mask the horizontal slide.
- **Scale variant**: initial state includes `scale(1.2)` → `scale(1)`, adding a zoom-in effect per line.
- **Clip-path variant (no wrapper needed)**: use `clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)` with `transform: translateY(20px) → translateY(0)`. The clip-path acts as the mask without needing an overflow-hidden wrapper.
- Best with 2-4 lines of large display text (40px+). On body text, the effect becomes distracting.
