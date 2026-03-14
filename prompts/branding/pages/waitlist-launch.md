# Summary

A pre-launch waitlist page designed to capture emails, build anticipation, and create urgency. Combines a bold countdown timer, social proof indicators, a clean email capture form, and shareable elements to maximize sign-ups before launch day. Ideal for product launches, beta invitations, and early-access campaigns.

# Layout & Structure

## Hero / Above the Fold

Everything needed to convert is visible without scrolling.

- Background: solid dark (#0F0F0F) for drama, or a bold gradient/mesh from your palette. Alternatively, a subtle animated particle field or floating geometric shapes.
- Centered layout, max-width 640px.
- Small badge/pill at top: "Launching Soon" or "Early Access" — accent color background, white text, 12px bold, border-radius 9999px, padding 6px 16px. Optional: subtle pulse animation on the badge.
- Headline: 48-64px, bold, high contrast. A single compelling sentence about what the product does. Make it benefit-oriented, not feature-oriented. E.g., "Stop drowning in spreadsheets." not "AI-powered data tool."
- Subtext: 18px, muted, max-width 480px. One sentence expanding on the value prop.
- Email form: inline layout (input + button on same row). Input: 48px height, border-radius 9999px (pill) or 12px, 1px border, placeholder "Enter your email". Button: filled, accent color, "Join waitlist" or "Get early access", bold, border-radius matching input. On mobile: stack vertically. On submit: button shows a spinner (400ms), then checkmark + "You're in!" confirmation.
- Social proof line below form: "Join 2,400+ people on the waitlist" — avatar stack (5 small circles with photos, overlapping) + count text. 14px, muted.

## Countdown Timer

Below the fold or integrated into the hero.

- 4 time units: Days, Hours, Minutes, Seconds. Each unit in a card/box: 80x80px (desktop), border-radius 12px, subtle background (#FFFFFF/10 on dark or #F5F5F5 on light), bold number (32-40px), unit label below (11px uppercase, muted). Gap: 12px between boxes.
- Number flip animation: when a digit changes, the outgoing number slides up + fades out while the incoming number slides up from below + fades in. 300ms ease-out. CSS approach: use two stacked spans, toggle classes on interval.
- On countdown completion: replace timer with "We're live!" message and change CTA to "Launch" button.

## Product Preview / Teaser

A glimpse of what's coming without giving everything away.

- Single product screenshot or mockup, partially masked: show only the top 60% of a UI screenshot, with a gradient fade to transparent at the bottom (mask-image: linear-gradient(to bottom, black 60%, transparent 100%)).
- Frame it in a browser or device mockup (subtle gray border, rounded corners, three dots in title bar).
- Perspective tilt: `transform: perspective(1200px) rotateX(5deg) rotateY(-2deg)` with a large soft shadow below.
- Optional: a frosted glass "Coming Soon" overlay badge on top of the preview.

## Feature Teasers

3-column grid of what's coming. Each item: minimal — icon (32px, accent or muted), title (16px bold), one-line description (14px muted). No cards, no borders — just clean rows of information. Keep it brief; the goal is intrigue, not documentation.

## Social Proof / Press Logos

Optional section if you have it. "Featured in" or "Backed by" with logo strip. Logos: 32px height, grayscale, opacity 0.4. Row with generous spacing (48px between logos).

## Referral Nudge

Boost viral sign-ups.

- After email submission, show a referral section: "Move up the waitlist — share with friends."
- Unique referral link in a copy-able input field (readonly, with a "Copy" button that briefly shows "Copied!" on click).
- Social share buttons: Twitter/X, LinkedIn, email. Each: icon + platform name, subtle border, on hover: fills with platform brand color.
- Waitlist position indicator: "You're #247 in line" — large number (32px bold), with a note: "Refer 3 friends to unlock early access."

## Footer

Minimal. Dark or matching hero background. Centered: brand logo (small, muted), copyright, and links to Twitter/X and privacy policy. No multi-column layout — this page is single-purpose.
