# Summary

A multi-step onboarding wizard that guides new users from sign-up through initial setup. Clean progress indication, one task per screen, encouraging micro-copy, and smooth transitions between steps create a frictionless first experience. Designed to reduce drop-off and set users up for success.

# Layout & Structure

## Page Frame

Split layout: left panel (40%) is a persistent branding/illustration area; right panel (60%) holds the active step content. On mobile: the left panel collapses to a small top bar with progress indicator.

### Left Panel (Desktop)
- Background: subtle gradient or solid brand color.
- Centered vertically: brand logo (top, 40px), step-specific illustration or graphic (center, 200-280px), motivational micro-copy at bottom ("Almost there!", "You're doing great!") that changes per step.
- Fixed / sticky — does not scroll with right panel.

### Right Panel
- White background, vertically centered content, max-width 480px, centered horizontally with generous padding (48px sides).

## Progress Indicator

Persistent across all steps.

### Desktop (Left Panel Bottom)
- Horizontal step dots: 5-6 dots (10px circles), 16px gap. Completed: filled accent color. Current: filled accent with a pulsing ring animation (box-shadow pulse). Future: filled muted (#D0D0D0).
- Below dots: "Step 2 of 5" text, 13px, muted.

### Mobile (Top Bar)
- Thin progress bar spanning full width. Height: 3px. Background: #E0E0E0. Fill: accent color, width percentage = (currentStep / totalSteps) * 100%. Transition: width 400ms ease-out.

## Step 1: Welcome / Account Type

- Headline: "Welcome! Let's get started." (28px bold).
- Body: "First, tell us about yourself." (16px muted).
- Selection cards: 2-3 option cards in a column (or row on wide screens). Each: border 1px #E0E0E0, border-radius 12px, padding 20px. Left: 40px icon. Center: title (16px bold) + description (14px muted). Right: radio circle indicator. Selected state: accent border (2px), light accent background tint (4% opacity), filled radio.
- "Continue" button (full-width, filled, accent color, 48px height). Disabled until selection made (opacity 0.5, pointer-events none).

## Step 2: Profile Information

- Headline: "Set up your profile" (28px bold).
- Form fields in a vertical stack, 20px gap:
  - Name: text input, border 1px #E0E0E0, border-radius 10px, height 48px, padding 14px. Focus: accent border, subtle accent shadow.
  - Avatar upload: 72px circle, dashed 2px border (#D0D0D0), centered camera icon (24px, muted). On hover: border darkens. On click: file picker. Once uploaded: shows preview with a small X to remove.
  - Optional fields: job title, company name. Collapsible under "Add more details" text toggle.
- "Continue" button. "Skip for now" text link below (14px, muted, underline on hover).

## Step 3: Preferences / Workspace Setup

- Headline: "Customize your experience" (28px bold).
- Multi-select options: grid of small cards (2-column, 12px gap). Each: icon (32px) + label (14px bold), border 1px, border-radius 10px, padding 16px. Tap to toggle: selected gets accent border + check badge (top-right corner, accent circle with white check, 20px).
- Minimum selection prompt: "Pick at least 3" (14px, muted) with a live counter.
- "Continue" button enables when minimum reached.

## Step 4: Invite Team (Optional)

- Headline: "Invite your team" (28px bold).
- Email input with "Add" button on the right (inline). On add: email appears as a pill chip below the input (accent tint background, 14px, X to remove).
- Invited list: vertical stack of pills.
- Role selector (optional): small dropdown next to each pill ("Admin" / "Member").
- "Continue" button. "I'll do this later" skip link prominent.

## Step 5: Success / Ready Screen

- Centered layout. Large animated check mark or confetti burst (Lottie animation or CSS keyframe).
- Headline: "You're all set!" (32px bold).
- Body: "Your workspace is ready. Here are some things to try first:" (16px muted).
- Quick-start cards: 3 horizontal cards suggesting first actions ("Create your first project", "Explore templates", "Read the docs"). Each: icon + title + arrow. On hover: lifts slightly.
- Primary CTA: "Go to Dashboard →" (filled button, large).

## Transitions

Between steps, content transitions with a slide + fade:
- Outgoing: translateX(-20px) + opacity 0, 300ms ease-in.
- Incoming: starts at translateX(20px) + opacity 0, then animates to translateX(0) + opacity 1, 400ms ease-out, 100ms delay.
- Going backwards reverses the direction.
