# Summary

Four call-to-action patterns for different contexts: a bold full-width banner for page-ending conversion, a contextual inline CTA for mid-content nudges, a persistent sticky bottom bar for ever-present conversion, and an exit-intent modal for last-chance captures.

# Variants

---

## 1. Banner CTA

A full-width, high-contrast section that serves as the final conversion push before the footer. Every landing page needs one.

### Spec

- Full-width section. Background: accent gradient (primary → secondary, 135deg angle), solid dark (#0F0F0F), or a brand image with dark overlay.
- Padding: 80-120px vertical. Content centered, max-width 640px.
- Headline: 36-48px, bold, white (or high-contrast against background). A direct, action-oriented statement: "Ready to get started?" or "Start building today."
- Body: 18px, white/80% opacity, max-width 480px. One sentence reinforcing value.
- Button row: centered. Primary button: large (52px height), filled white (dark text) or high-contrast, bold, pill or rounded-lg. Text: clear action verb ("Start free trial", "Create your account"). Secondary link: underlined text below or beside the button ("No credit card required" or "View pricing →"), 14px, white/60%.
- Optional: avatar stack + user count line ("Join 10,000+ teams") above or below the buttons for social proof.
- Border-radius (if inset from page edges): 24px, with 32px margin on sides. Creates a floating card feel.
- Entrance: on viewport entry, headline fades in, button scales from 0.95 → 1.0 with spring. Stagger 200ms.

---

## 2. Inline CTA

A contextual conversion element embedded within content — between blog paragraphs, inside feature sections, or after key information. Less aggressive, more integrated.

### Spec

- Container: max-width matching content column (e.g., 680px for blog). Background: subtle tint (accent at 4% opacity) or light gray (#F8F8F8). Border: 1px solid rgba(0,0,0,0.06). Border-radius: 16px. Padding: 32px.
- Layout: horizontal on desktop (text left, button right). Vertical on mobile (stacked, centered).
- Content: small icon or emoji (24px) top-left (optional). Heading (20px bold): a concise value prop — "Want to try this yourself?" Body (15px, muted): one supporting sentence.
- Button: medium size (44px height), filled accent, white text, bold. Aligned right on desktop, full-width on mobile.
- Avoid: competing with the surrounding content. The tint and border create a gentle boundary without aggressive interruption.
- Variation: "newsletter subscribe" inline CTA with an email input + submit button instead of a single CTA button. Input: 44px height, pill or rounded, 1px border. Button: accent fill, "Subscribe" text.

---

## 3. Sticky Bottom Bar

A persistent, thin CTA bar fixed to the bottom of the viewport. Always visible, never intrusive. Ideal for free trial prompts, cookie notices, or announcement banners.

### Spec

- Container: `position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;`. Height: 56-64px. Background: #FFFFFF with `box-shadow: 0 -2px 12px rgba(0,0,0,0.06)` or dark (#1A1A1A) with light text.
- Layout: flex, justify-between, align-center, max-width container centered. Padding: 0 24px.
- Left: text message (14px, medium weight): "Start your free 14-day trial — no credit card required."
- Right: CTA button (small pill, 36px height, accent fill, white text, 14px bold). And a dismiss X (20px icon, muted) that hides the bar for the session (set a sessionStorage flag).
- Entrance: slides up from below viewport (translateY 100% → 0) over 400ms ease-out. Delay: 3s after page load or after scrolling past 50% of the page.
- Exit (on dismiss): slides back down (translateY 0 → 100%) over 300ms.
- Mobile: stack text and button vertically, increase height to 80px. Add `padding-bottom: env(safe-area-inset-bottom)` for notched devices.
- Respect: add a body `padding-bottom: 64px` to prevent the bar from covering footer content.

---

## 4. Exit-Intent Modal

A modal that triggers when the user's cursor moves toward the browser chrome (indicating intent to leave). Last-chance conversion for high-value pages.

### Spec

- Trigger (desktop): track `mouseleave` event on the `<html>` element. Only trigger when `event.clientY < 0` (cursor leaving from the top of the viewport — toward the address bar or close button). Only fire once per session (set a sessionStorage flag). Don't fire within the first 5s of page load.
- Trigger (mobile): fire after 30s on page with no conversion action, or on rapid scroll-up (suggests user is going back).
- Backdrop: `position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 100;`. Entrance: opacity 0 → 1 over 300ms.
- Modal: centered, max-width 480px. Background: #FFFFFF. Border-radius: 20px. Padding: 40px. Box-shadow: 0 20px 60px rgba(0,0,0,0.15).
- Close: X button top-right (absolute positioned, 32px, muted → dark on hover). Clicking backdrop also closes.
- Content:
  - Headline: 28px bold, centered. Urgency-driven: "Wait! Don't miss out." or value-driven: "Get 20% off your first month."
  - Body: 16px, muted, centered, max-width 360px.
  - Form (if email capture): email input (full width, 48px, 12px radius) + submit button (full width, accent, 48px, bold). Or a single large CTA button if the action is different (e.g., "Claim your discount →").
  - Trust line: 12px muted, centered, below the form. "No spam. Unsubscribe anytime." or "Used by 10,000+ teams."
- Entrance: modal `transform: scale(0.9); opacity: 0;` → `scale(1); opacity: 1;` over 350ms cubic-bezier(0.34, 1.56, 0.64, 1) (spring overshoot for attention).
- Exit: scale(1) → scale(0.95), opacity 0 over 250ms.
