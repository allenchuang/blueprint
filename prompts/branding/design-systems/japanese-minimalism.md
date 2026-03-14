# Summary

A design system rooted in the Japanese concept of "ma" (negative space) — where what is absent matters as much as what is present. Extreme whitespace, whisper-thin lines, asymmetric layouts, and a single restrained accent color create a meditative, gallery-like experience. Ideal for architecture firms, tea brands, wellness products, design studios, and any brand that communicates through restraint and precision.

# Style

The aesthetic is defined by absence. Margins are vast, elements are few, and every remaining detail is placed with surgical intent. A single accent color (indigo or vermillion) punctuates the neutral canvas, used only for navigation cues and the occasional text highlight. Typography is clean and unadorned — Noto Sans JP provides CJK harmony while Inter handles Latin text. Lines are barely visible (0.5px), serving as spatial guides rather than borders. Photography is desaturated and contemplative, composed with generous negative space within the frame itself.

## Spec

- **Palette**: Background #FAFAFA (near-white). Text: #1C1C1C. Muted text: #999999. Accent (choose one): Indigo #3D5A80 or Vermillion #C94C4C. Lines: #1C1C1C at 8% opacity.
- **Typography**: Headlines in 'Noto Sans JP' or 'Inter' (medium, weight 500 — not bold), tracking 0em, leading 1.3. Body in 'Inter' (regular, weight 400), line-height 1.85, 15px. Decorative labels: 10px, uppercase, tracking 0.25em, #999999. Vertical text labels: writing-mode: vertical-rl, 10px, tracking 0.3em.
- **Line Weight**: All borders and dividers: 0.5px solid rgba(28,28,28,0.08). Never heavier. Lines are guides, not walls.
- **Whitespace**: Section padding: 160-240px vertical. Content max-width: 1000px. Margins between elements: 48-64px. The page should feel 60% empty.
- **Image Treatment**: `filter: saturate(0.6) contrast(0.95)` by default. On hover: saturate(1) over 600ms. Images are always contained within clean rectangular frames, no rounded corners.
- **Micro-interactions**: 800ms cubic-bezier(0.22, 1, 0.36, 1) for all reveals. Elements fade and float upward (translateY 20px → 0, opacity 0 → 1). Stagger: 120ms between sequential items. No flashy effects — motion should feel like a breath.

# Layout & Structure

Asymmetric composition is fundamental. Content frequently occupies only 40-60% of the horizontal space, with the rest deliberately empty. Vertical text accents label sections from the margins. The visual rhythm is slow and measured.

## Navigation

Height 80px. No background, no border — just floating elements over the white page. Logo: Inter medium, 16px, #1C1C1C — minimal wordmark. Links: 13px, #999999 → #1C1C1C on hover, 400ms. Spaced widely (48px gaps). A single accent-colored dot (4px circle) appears below the active link. On mobile: a single "Menu" text that reveals a full-screen overlay with centered links.

## Hero Section

Full viewport. Asymmetric: text aligned left with a 40% left margin, occupying about 50% width. Headline: 5vw to 7vw, Inter medium weight 500 (deliberately not bold — restraint is key), #1C1C1C. Below: a thin 0.5px line (40px wide), then body text in 15px, #999999, max-width 360px. In the opposite gutter (right margin), a vertical text label in 10px uppercase tracking, rotated, reading bottom-to-top, providing a section identifier.

## Single Image Section

A full-width image placed with intentional asymmetry: the image occupies the right 65% of the viewport, the left 35% is empty white space with only a small caption (10px, vertical or horizontal, #999999). Image: desaturated, contained in a strict rectangle, no border-radius. Enters with a slow fade (opacity 0 → 1 over 1200ms) on scroll.

## Philosophy Section

Centered text on a vast white field. A single word or short phrase in 6vw, Inter medium, with the accent color applied to one character or word. Below, at 48px distance: body text 15px, #999999, max-width 520px. Above the heading: a small decorative element — either a thin horizontal line (0.5px, 80px) or a small accent-colored circle (6px).

## Grid of Three

Three items in a row, but with asymmetric vertical alignment — first item aligns to top, second offset 40px down, third offset 20px down. Each item: 3:4 image, below it a 13px label and 18px heading. Thin 0.5px line between items (vertical). Generous gaps (48px). Items stagger-reveal on scroll.

## Contact / Closing Section

Near-empty section. Centered: a small uppercase label ("Contact"), a large email address in Inter medium (24px), and a thin line. Nothing else. Maximum void. The email address is the accent color.

## Footer

Minimal. No background change. Just a thin 0.5px top border, then a single row: logo text left, copyright right, 13px #999999. Generous padding (80px top). Nothing more.

# Special Components

## Vertical Side Label

A rotated text element that sits in the margin, labeling sections.

`position: absolute; writing-mode: vertical-rl; text-orientation: mixed; font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #999999; right: -40px;` (or left). The text reads bottom-to-top.

## Asymmetric Stagger Grid

Items in a row that deliberately misalign vertically for visual interest.

Use CSS grid with identical columns, but apply padding-top values per item: 0px, 40px, 20px. Or use `transform: translateY(var(--offset))` with custom properties. This avoids the monotony of a perfectly aligned grid.

## Breath Reveal Animation

A slow, gentle entrance animation for elements appearing on scroll.

`opacity: 0; transform: translateY(20px); transition: opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1);`. When in viewport: `opacity: 1; transform: translateY(0);`. Use IntersectionObserver with threshold 0.2. Stagger children by 120ms using `transition-delay: calc(var(--index) * 120ms)`.
