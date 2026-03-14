# Summary

Three testimonial display patterns: an infinite auto-scrolling marquee for high-volume social proof, a navigable card carousel for curated quotes, and a single dramatic pull-quote highlight for editorial impact.

# Variants

---

## 1. Infinite Marquee

A horizontally auto-scrolling strip of testimonial cards that loops infinitely. No user interaction needed — pure ambient social proof. Inspired by Twitter/X embed walls.

### Spec

- Outer container: `overflow: hidden; width: 100%;`. Optional: mask edges with `mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent)` to create fade-outs on both sides.
- Inner track: `display: flex; gap: 20px; width: max-content; animation: marquee var(--duration, 40s) linear infinite;`.
- Keyframe: `@keyframes marquee { to { transform: translateX(-50%); } }`. The inner track contains the list of cards duplicated (rendered twice, back-to-back) so the loop is seamless.
- Each card: `flex-shrink: 0; width: 320px; padding: 24px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); border-radius: 16px;`.
  - Content: quote text (15px, #1A1A1A, 3-4 lines max), author row at bottom (avatar 36px circle, name 14px bold, role/company 13px muted).
  - Star rating (optional): 5 small star icons (14px), accent fill for earned, muted for unearned.
- On hover: `animation-play-state: paused` on the inner track. The marquee stops so users can read.
- Multiple rows (optional): stack 2-3 marquee strips, each scrolling in alternating directions (one `marquee`, one `marquee-reverse`) and at slightly different speeds (35s, 45s, 40s). Creates a rich wall of social proof.
- Responsive: cards shrink to 280px on mobile. Speed slows proportionally.

---

## 2. Card Carousel

A swipeable row of testimonial cards with active-state highlighting, dot navigation, and optional auto-advance. For curated, high-quality testimonials.

### Spec

- Container: `overflow: hidden; position: relative; max-width: 900px; margin: 0 auto;`. Text-align center above: section heading (32px bold), subtext (16px muted, "What our users say").
- Card track: `display: flex; transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);`. Transform shifts by `-currentIndex * (cardWidth + gap)`.
- Each card: `flex-shrink: 0; width: 100%; max-width: 600px; padding: 40px; text-align: center;`.
  - Large quote: 22px, leading 1.6, #1A1A1A. Use decorative quotation marks (40px, accent color, 15% opacity) positioned above the text.
  - Author: centered below. Avatar 56px circle, name 16px bold, role + company 14px muted. Optional: company logo (24px height, grayscale).
- Active card: full opacity. Adjacent cards (visible as peeks): `opacity: 0.4; transform: scale(0.92);` with transitions matching the track.
- Navigation: dot indicators below (8px circles, 12px gap, accent fill for active, muted for others). Click jumps to that card.
- Arrow buttons (optional): positioned at horizontal edges of the container. 40px circles, subtle border, chevron icons. Disable at boundaries.
- Auto-advance (optional): every 6s, advance to next card. Reset timer on manual interaction. Pause on hover.
- Swipe: track touch/mouse drag. If horizontal drag > 60px, advance/retreat one card. Use `pointermove` for smooth tracking during the gesture.

---

## 3. Pull-Quote Highlight

A single, large-format testimonial displayed as an editorial pull-quote. High-impact, designed for a key customer endorsement or press quote.

### Spec

- Section: full-width, generous vertical padding (100-140px). Background: subtle tint (2-3% accent color) or a contrasting dark block.
- Layout: centered, max-width 800px.
- Decorative quotation mark: Positioned top-left of the quote block. Display font or serif, 120-180px, accent color at 10-15% opacity. `position: absolute; top: -20px; left: -10px;` (adjust for visual alignment).
- Quote text: 32-40px, display font (serif or bold sans), leading 1.3, main text color. The quote should be 1-3 sentences — punchy and impactful. Highlight one key phrase with accent color or italic styling.
- Divider: thin line (1px, 60px width, accent or muted) centered below the quote, margin 32px 0.
- Author block: centered.
  - Avatar: 64px circle, border: 3px solid white (if on a dark/tinted background), subtle shadow.
  - Name: 16px bold, margin-top 16px.
  - Title and company: 14px muted.
  - Company logo (optional): 24px height, grayscale, below the title.
- Rating row (optional): 5 star icons (18px, accent fill) centered above or below the author.
- Entrance animation: quote text fades in + translateY(20px → 0) over 800ms. Author fades in 300ms after.
