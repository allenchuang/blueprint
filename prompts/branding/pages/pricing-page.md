# Summary

A complete pricing page design with tiered plans, billing toggle, feature comparison matrix, and FAQ section. Designed to guide users from browsing to purchasing with clear hierarchy, trust signals, and a highlighted recommended plan.

# Style

Clean, scannable layout. The pricing cards are the focal point — everything else supports the decision. Use strong contrast on the recommended tier (elevated, bordered, or color-shifted). The toggle and feature matrix provide depth for comparison shoppers without overwhelming casual visitors.

# Layout & Structure

## Section Header

Centered. Small uppercase label ("Pricing" or "Plans", 12px tracking 0.12em, muted). Large headline (40-48px, bold): "Simple, transparent pricing" or similar. Subtext (18px, muted, max-width 480px): reinforce value — "No hidden fees. Cancel anytime."

## Billing Toggle

Centered, directly below header (margin-top 32px). A pill-shaped toggle between "Monthly" and "Annual". The pill container: 4px padding, background #F0F0F0, border-radius 9999px. Each option: padding 10px 24px, border-radius 9999px. Active state: white background, subtle shadow, bold text. Annual option gets a small badge ("Save 20%") — pill-shaped, accent color, 11px bold, positioned top-right of the annual label with a slight negative top offset.

## Pricing Cards Grid

3-column grid (4-column if you have a 4th tier), 24px gap, max-width 1100px centered.

### Free / Starter Tier
- Background: white. Border: 1px subtle border (rgba(0,0,0,0.08)). Border-radius: 16px.
- Padding: 32px.
- Plan name: 18px bold. Description: 14px muted.
- Price: 48px extrabold, #1A1A1A. Period: 16px muted ("/month").
- CTA: outlined button, full width, 14px bold. "Get Started" or "Start Free".
- Feature list: vertical, 16px gap. Each: checkmark icon (16px, muted green) + 14px text. Limit to 5-6 features.

### Pro / Recommended Tier
- Same structure as Starter, but visually elevated:
  - Border: 2px solid accent color (or gradient border).
  - Optional: subtle accent-color background tint (3-5% opacity).
  - "Most Popular" or "Recommended" badge: top-center, pill-shaped, accent background, white text, 12px bold, positioned with `position: absolute; top: -14px; left: 50%; transform: translateX(-50%);`.
  - Shadow: deeper than other cards (`box-shadow: 0 8px 40px rgba(0,0,0,0.08)`).
  - CTA: filled button (accent/primary color), white text.
  - Scale: `transform: scale(1.02)` for subtle size emphasis.

### Enterprise / Custom Tier
- Same card structure.
- Price: "Custom" in 32px instead of a dollar amount. Or "Contact us" as the subtext.
- CTA: outlined button. "Talk to Sales" or "Contact Us".
- Feature list: starts with "Everything in Pro, plus:" then lists enterprise features.

## Feature Comparison Matrix

Below cards (margin-top 80px). Toggle-expandable ("Compare all features" text button with chevron).

- Full-width table. Header row: plan names. Left column: feature names grouped by category.
- Category headers: bold, 14px, spanning full width, with subtle background tint.
- Cell values: checkmark (accent color) for included, dash or "—" (muted) for excluded, or specific limits ("5 GB", "Unlimited").
- Sticky header row on scroll. Alternating row backgrounds (rgba(0,0,0,0.02)).
- Collapse animation: max-height transition + opacity.

## FAQ Accordion

Centered (max-width 720px). Headline: "Frequently asked questions" (32px). Each item: 1px top border, padding 20px 0. Question: 16px bold, clickable row with plus/minus icon right-aligned. Answer: 15px muted, max-height animated open/close (300ms ease-out). Include 5-6 questions covering: refund policy, plan switching, payment methods, team seats, data export.

## Trust Strip

Below FAQ. Centered row of trust signals: security badge ("256-bit SSL"), payment logos (Visa, Mastercard, Stripe), guarantee badge ("30-day money back"), compliance badge ("SOC2" or "GDPR"). Icons: 24px, muted gray. Text: 12px, muted.
