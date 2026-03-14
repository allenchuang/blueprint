# Summary

A vibrant, energetic design system powered by colorful mesh gradients, floating card surfaces, and playful typography. Inspired by modern creative tools (Figma, Notion, Linear) and Gen-Z aesthetics, this system feels alive and dynamic — gradients shift, cards float with depth, and rainbow borders catch the eye. Ideal for creative SaaS products, productivity tools, developer platforms, and brands that want to feel cutting-edge and fun.

# Style

Color is applied boldly and generously through mesh gradients — multi-point color fields that blend organically across backgrounds. Surfaces are clean white cards that float over these gradients, creating clear content hierarchy. Borders get the gradient treatment too: rainbow outlines on key elements. Typography is rounded and contemporary (Plus Jakarta Sans or Outfit) with generous weight. The overall vibe is optimistic, modern, and designed for screens.

## Spec

- **Palette**: Page background: #FFFFFF (white) or #F8F9FB (cool gray). Card surface: #FFFFFF. Gradient set: electric blue #2563EB, violet #7C3AED, rose #E11D48, amber #F59E0B, emerald #10B981. Text: #18181B (near-black). Muted: #71717A. Subtle border: rgba(0,0,0,0.06).
- **Typography**: Headlines in 'Plus Jakarta Sans' (extrabold, weight 800), tracking -0.03em, leading 1.1. Body in 'Plus Jakarta Sans' (regular, weight 400), line-height 1.7, 16px. Labels: medium weight 500, 12px, tracking 0.04em, #71717A.
- **Mesh Gradient**: Background sections use layered CSS gradients: `background: radial-gradient(ellipse at 20% 0%, rgba(37,99,235,0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(225,29,72,0.15) 0%, transparent 50%);` — adjust positions for each section.
- **Rainbow Border**: Use a pseudo-element: `background: conic-gradient(from 180deg, #2563EB, #7C3AED, #E11D48, #F59E0B, #10B981, #2563EB); padding: 2px;` with inner div masking the fill. Or use `border-image: conic-gradient(...) 1`.
- **Card Depth**: `box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.06); border-radius: 16px;`.
- **Micro-interactions**: 400ms cubic-bezier(0.34, 1.56, 0.64, 1) (spring) for hover states. Cards: translateY(-6px) + shadow expansion on hover. Buttons: scale(1.03) + gradient-position shift. Gradient backgrounds animate slowly (15s infinite) shifting color positions.

# Layout & Structure

Clean, centered layouts with generous whitespace. Mesh gradients define section moods. Cards and content blocks float on white surfaces above the gradients. The page feels like a well-designed product landing page — tight, focused, and visually rewarding.

## Navigation

Floating pill: height 56px, border-radius 9999px, max-width 800px, centered with 16px top margin. Background: rgba(255,255,255,0.85), backdrop-blur(12px), border: 1px solid rgba(0,0,0,0.06), soft shadow. Logo: Plus Jakarta Sans extrabold, 18px, with a small gradient circle (12px) before the text. Links: 14px, #71717A → #18181B, 200ms. CTA: small pill button with gradient background (blue to violet), white text, glow shadow on hover.

## Hero Section

Min-height 90vh. Background: mesh gradient (blue top-left, violet center-right, pink bottom). Centered text: large headline (56px to 72px) in #18181B, with one phrase highlighted using gradient text (background-clip: text, blue-to-violet). Subtext: 20px, #71717A, max-width 540px. Two buttons: primary (gradient fill, white text, rounded-full) and secondary (white fill, border, dark text). Below: a floating product screenshot in a white card frame with rainbow border, tilted perspective (transform: perspective(1200px) rotateX(4deg)), with substantial shadow.

## Logo Cloud

Light section. "Trusted by" label centered, 12px uppercase, #71717A. Below: row of grayscale logos (40px height, opacity 0.4, grayscale(1)) that transition to full color and opacity on hover. Optionally auto-scrolling marquee on mobile.

## Feature Bento Grid

A 4-column, 2-row grid (bento box style) with mixed cell sizes. Column spans: 2+2, 1+1+2, 3+1, etc. Each cell: white card, 16px border-radius, 24px padding. Cell content varies: some have small product screenshots, some have icon + text, some have gradient fill backgrounds with white text. On hover: card lifts, shadow grows. One premium cell gets a rainbow border.

## Testimonial Carousel

White section. Centered headline (32px). Horizontally scrollable card row with scroll-snap. Each card: white surface, 16px radius, soft shadow. 20px quote text, author row (avatar circle 40px, name bold, role muted). Active card: subtle gradient top border (3px). Dots navigation below.

## Pricing Section

Background: mesh gradient (lighter version, 40% intensity). Three price cards: white, 16px radius. Columns: Free, Pro (gradient border + "Popular" badge), Enterprise. Each: plan name, price (48px bold), feature list with checkmarks (accent colored), CTA button. Pro card: slightly scaled (1.02x) with deeper shadow and the rainbow border.

## CTA Banner

Inset section with a full gradient background (blue → violet → rose), 24px border-radius. White text. Headline (40px), body (18px), white pill button. Optionally: floating 3D shapes (spheres, toruses) rendered as decorative SVGs or CSS gradients.

## Footer

Background: #18181B. Text: #FAFAFA at 70% opacity. 4-column grid. Brand column: gradient wordmark or logo. Links: 14px, #71717A → #FAFAFA on hover. Bottom: thin gradient top border (1px, blue → violet → rose at 20% opacity), copyright centered.

# Special Components

## Mesh Gradient Background

A multi-point color field using layered radial gradients.

Combine 3-4 radial-gradients on a single element: `background: radial-gradient(ellipse at 20% 0%, rgba(37,99,235,0.3), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.25), transparent 50%), radial-gradient(ellipse at 40% 100%, rgba(225,29,72,0.2), transparent 50%);`. Animate with a 15s infinite keyframe that shifts the `background-position` of each layer.

## Rainbow Border Card

A card element framed by a spinning gradient border.

Outer wrapper: `background: conic-gradient(from var(--angle), #2563EB, #7C3AED, #E11D48, #F59E0B, #10B981, #2563EB); padding: 2px; border-radius: 18px;`. Inner div: `background: #FFFFFF; border-radius: 16px; padding: 24px;`. Animate `--angle` with `@property` and a 4s infinite rotation for a spinning border effect.

## Floating Product Frame

A product screenshot that appears to float above the page.

Container: `transform: perspective(1200px) rotateX(4deg); transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);`. On hover: `transform: perspective(1200px) rotateX(0deg);`. Inner image wrapped in a white card with 16px radius, 2px gradient border, and deep shadow: `box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);`.
