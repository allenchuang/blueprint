# Summary

Four navigation patterns covering the most common web app layouts: a minimal sticky header, a mega-menu for content-rich sites, a mobile drawer with gesture support, and a command palette for power users. Each is fully specified with dimensions, timing, and interaction states.

# Variants

---

## 1. Minimal Sticky Header

A clean, persistent top bar that adapts as the user scrolls.

### Spec

- Height: 64px fixed. Position: sticky, top: 0, z-index: 50.
- Background: `rgba(255,255,255,0.85)` with `backdrop-filter: blur(12px)`.
- Border-bottom: 1px solid rgba(0,0,0,0.06) — only appears after scrolling past 50px (toggle class via IntersectionObserver on a sentinel element).
- Layout: flex, justify-between, align-center. Padding: 0 24px (mobile), 0 48px (desktop).
- Left: logo (height 28px). Center (desktop): nav links, 14px medium, 32px gap, muted → dark on hover (200ms). Active link: accent color or underline (2px solid, offset 8px below text). Right: CTA button (pill or rectangle, filled) + optional avatar/menu trigger.
- **Scroll behavior**: On scroll down > 200px, header slides up (translateY: -100%) with 300ms ease. On scroll up, it slides back down. Track with scroll direction detection (compare current vs. previous scrollY in rAF).
- Mobile: hide center nav links. Add a hamburger icon (3 bars, 20px wide, 2px lines, 6px gap) that triggers the mobile drawer.

---

## 2. Mega-Menu

A rich dropdown panel for sites with complex information architecture (e-commerce, SaaS with many products, documentation).

### Spec

- Trigger: desktop nav link hover (with 150ms hover intent delay to prevent accidental triggers). Add `onMouseEnter` with a timeout, clear on `onMouseLeave`.
- Panel: position absolute, left 0, right 0, top: 100% of header. Background: #FFFFFF. Border-top: 1px solid rgba(0,0,0,0.06). Box-shadow: 0 12px 40px rgba(0,0,0,0.08). Max-height: 480px.
- Entrance animation: opacity 0 + translateY(-8px) → opacity 1 + translateY(0) over 250ms ease-out. Exit: 200ms.
- Internal layout: max-width container (1200px), centered. 4-column grid (or 3 + sidebar).
  - Each column: category heading (13px bold uppercase, muted), then a list of links (15px, regular weight, 12px vertical gap). Links: icon (20px, muted) + label + optional description line (13px, muted). Hover: accent color on icon and label.
  - Sidebar column (optional): featured card with image, title, and "Learn more →" link. Background: subtle tint.
- Backdrop: a full-screen semi-transparent overlay (rgba(0,0,0,0.05)) behind the panel, clicking it closes the menu.
- Mobile fallback: mega-menu content becomes accordion sections inside the mobile drawer.

---

## 3. Mobile Drawer

A full-screen or slide-in navigation panel for touch devices.

### Spec

- Trigger: hamburger icon tap.
- **Slide-in variant**: Panel slides from right. Width: 85vw (max 380px). Height: 100vh. Background: #FFFFFF. Box-shadow: -8px 0 30px rgba(0,0,0,0.1). Z-index: 100.
- **Full-screen variant**: Expands to cover 100vw x 100vh. Background: dark (#0F0F0F) with white text for dramatic contrast.
- Entrance: translateX(100%) → translateX(0), 350ms cubic-bezier(0.32, 0.72, 0, 1). Backdrop: rgba(0,0,0,0) → rgba(0,0,0,0.4), 300ms.
- Hamburger → X animation: the three bars morph. Top bar: rotates 45deg, translates down. Bottom bar: rotates -45deg, translates up. Middle bar: opacity 0, scale(0). Transition: 300ms ease.
- Content: padding 32px. Logo at top. Nav links stacked vertically: 24px font, bold, 20px vertical gap. Each link staggers in (translateX 20px → 0, opacity 0 → 1) with 50ms delay per item.
- Secondary links (smaller, muted) at bottom: Settings, Help, Sign out.
- CTA button: full-width, filled, bottom of panel.
- **Gesture**: track touch start/move on the panel. If user swipes right > 100px and velocity > 0.5, dismiss the drawer. Visual: panel follows the finger position in real-time during the swipe.
- Body scroll lock: add `overflow: hidden` to body when drawer is open.

---

## 4. Command Palette

A keyboard-triggered search/action modal (Cmd+K / Ctrl+K) for power users. Inspired by Spotlight, VS Code, and Linear.

### Spec

- Trigger: keyboard shortcut (Cmd+K on Mac, Ctrl+K on Windows). Also accessible via a search icon or "/" shortcut hint in the nav.
- Backdrop: `rgba(0,0,0,0.5)` with `backdrop-filter: blur(4px)`. Click to close. Escape to close.
- Panel: centered, max-width 560px, max-height 420px. Background: #FFFFFF. Border-radius: 16px. Box-shadow: 0 16px 70px rgba(0,0,0,0.15). Overflow hidden.
- Search input: top of panel. Height 52px. No visible border (borderless). Padding 16px. Placeholder: "Type a command or search..." with a search icon (20px, muted) on the left and the keyboard shortcut hint ("Esc" pill, 12px) on the right. Font: 16px, regular.
- Results list: below input. Max-height scrollable (overflow-y: auto). Each result item: 44px height, padding 8px 16px, flex row. Left: icon (20px). Center: label (14px) + optional description (12px, muted). Right: keyboard shortcut hint (12px, muted, pill bg). Hover: background #F5F5F5. Keyboard navigation: arrow keys move a "selected" highlight (accent tint bg), Enter activates.
- Result groups: "Recent", "Pages", "Actions" — separated by small group headers (11px bold uppercase, muted, padding 8px 16px).
- Actions list (when no search query): Show recent pages, quick actions like "Create new project", "Go to settings", "Toggle dark mode".
- Entrance: panel scales from 0.95 → 1.0 + opacity 0 → 1, 200ms ease-out. Results stagger in as user types (fade + slide from bottom, 50ms per item).
- Empty state: "No results found" centered text with muted icon.
