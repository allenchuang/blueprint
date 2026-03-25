> Generated on 2026-03-24 by generate-prd.ts
> Model: claude-opus-4-6

## App Description

**Product Description**

This app is a personal organizational strategy tool built for professionals who want to think more clearly about workplace dynamics, relationships, and career navigation. It lets users map out their company's org structure on an interactive canvas powered by @xyflow/react, where each node represents a real person in their organization — complete with their name, role, personality profile (including MBTI type, working style, communication preferences, and general disposition), and their relationship to others. Users define directional links between nodes to capture reporting lines, alliances, tensions, and informal influence channels. During setup, users mark one node as themselves, anchoring the entire map around their own perspective and goals. This isn't an HR tool or a corporate directory — it's a private, honest map of how power and influence actually flow within an organization.

The core experience centers on a fullscreen interactive canvas where users can pan, zoom, drag, and restructure their org chart freely. Clicking any node opens a right-side detail panel that presents a rich profile view of that person — their personality breakdown, working style notes, known allegiances, and any context the user has added. This panel also collapses into a chat interface where the user can converse with an AI assistant (powered by Anthropic's Claude API, accessed via the user's own API key) that has full context of the org map, every persona, and every relationship. Users can ask pointed strategic questions: how to pitch an idea given their skip-level manager's personality, how to navigate a conflict between two peers, how to build rapport with a key decision-maker, or how to position themselves for a promotion given the current political landscape. The AI reasons over the entire graph of people and relationships to offer thoughtful, specific advice rather than generic career platitudes.

The app occupies a unique space — part org-chart tool, part political simulator, part AI-powered career strategist. It acknowledges what most professional tools refuse to: that organizations run on interpersonal dynamics, informal power structures, and strategic positioning as much as they do on formal hierarchies. The business model is lean by design — users bring their own Anthropic API key, so there's no backend cost to absorb, and the app can launch as a free or low-cost client-side tool. Over time, the vision could expand to include scenario modeling (what happens if this person leaves, or if a reorg occurs), relationship strength scoring, and playbook generation for specific career objectives. The long-term play is to become the private strategic layer that ambitious professionals use to understand and navigate the human side of their organizations with the same rigor they'd apply to any other complex system.

---

# OrgGraph — Product Requirements Document

## Overview

OrgGraph is a private, client-side organizational strategy tool that lets professionals map workplace power dynamics on an interactive canvas and consult an AI strategist that reasons over the entire social graph to deliver specific, actionable career navigation advice.

---

## Priorities

- **[P0]** = Must-have for MVP launch
- **[P1]** = Important but can follow MVP
- **[P2]** = Nice-to-have / future phase

---

## User Personas

### 1. The Ambitious Mid-Level Professional

A senior IC or junior manager (3–8 years experience) at a mid-to-large company (200+ employees) who is politically aware and wants to be more intentional about navigating promotions, cross-functional influence, and stakeholder management. They already think about these dynamics but lack a structured tool to reason through them.

### 2. The New Leader

Someone who recently joined a company or was promoted into a leadership role and needs to rapidly map out the informal power structures — who actually makes decisions, who has the CEO's ear, where the landmines are. They want to accelerate their political learning curve from months to weeks.

### 3. The Strategic Operator

A chief of staff, senior director, or anyone in a highly cross-functional role who regularly needs to orchestrate outcomes across multiple stakeholders with competing interests. They think about organizational dynamics as a system and want a tool that matches that mental model.

---

## Core User Flows

1. **First-Time Setup** — User lands on the app, enters their Anthropic API key, and begins building their first org map from scratch.
2. **Map Building** — User adds nodes (people), fills in persona details, marks themselves, and draws directional relationships between nodes.
3. **Map Exploration** — User navigates the interactive canvas, clicking nodes to inspect detailed profiles in the side panel.
4. **Strategic AI Consultation** — User opens the chat interface from the side panel and asks the AI context-aware questions about workplace strategy.
5. **Returning User** — User reopens the app, sees their saved map, makes updates (new hire, changed relationship, new context), and continues consulting the AI.
6. **Map Restructuring** — User drags nodes, reorganizes clusters, adds/removes relationships to reflect organizational changes.

---

## Feature Sections

---

### [P0] Landing / Marketing Page

**Purpose:** Communicate the app's unique value proposition and get users into the product in under 60 seconds.

**Key requirements:**

- Hero section with headline: _"Map the politics. Plan your moves. Navigate your career with precision."_
- Subheadline: _"OrgGraph is your private strategy canvas for understanding workplace power dynamics — powered by AI that reasons over your entire org."_
- Animated or static illustration showing an org chart canvas with relationship lines of different types (solid for reporting, dashed for alliances, red for tensions)
- Clear CTA button: "Start Mapping — It's Free"
- Brief 3-column value prop section:
  - 🗺️ _"Map Real Dynamics"_ — Go beyond the official org chart. Capture alliances, tensions, informal influence, and communication styles.
  - 🤖 _"AI That Knows Your Org"_ — Ask strategic questions and get advice tailored to the specific people and relationships in your map.
  - 🔒 _"100% Private"_ — Everything stays in your browser. No accounts. No servers. Your map never leaves your device.
- "How It Works" section: 3-step visual (Add People → Draw Relationships → Ask the AI)
- FAQ section addressing: privacy/data storage, API key usage, cost, who this is for
- Footer with link to GitHub (if open source) or contact

**UX notes:**

- Single-page scroll layout, no navigation menu needed for MVP
- Dark theme by default to signal "power tool" energy — think Bloomberg terminal meets Figma
- The CTA should persist as a sticky button on mobile scroll
- Page should load in under 2 seconds; no heavy frameworks for the landing page

**Out of scope for now:**

- User testimonials or social proof (no users yet)
- Pricing page (free at launch)
- Blog or content marketing section

---

### [P0] API Key Configuration

**Purpose:** Collect the user's Anthropic API key so the AI chat feature can function, while clearly explaining why and building trust.

**Key requirements:**

- Modal or dedicated step that appears on first use (before or after first map creation — see Open Questions)
- Clear explanation text: _"OrgGraph uses Claude by Anthropic to power its AI strategist. You provide your own API key — we never see, store, or transmit it to any server. It stays in your browser's local storage."_
- Link to Anthropic's API key creation page (https://console.anthropic.com/)
- Input field for the API key with a "Validate" button that makes a lightweight API call (e.g., a simple messages request) to confirm the key works
- Success state: green checkmark, "Key validated — you're ready to strategize."
- Error state: red text explaining common issues (invalid key, expired key, insufficient credits)
- Option to skip this step and use the mapping tool without AI (chat panel shows a prompt to add key)
- Option to update or remove the key later from Settings
- API key stored exclusively in `localStorage` — never sent to any backend

**UX notes:**

- This should feel low-friction. Don't gate the entire app behind key entry — let users build their map first and encounter the key prompt when they first try to use chat
- Show a small persistent indicator somewhere (e.g., bottom-right of canvas) showing AI status: "AI Ready ✓" or "Add API Key to enable AI"

**Out of scope for now:**

- Support for other LLM providers (OpenAI, etc.)
- Server-side API key management or proxy
- Usage tracking or cost estimation for API calls

---

### [P0] Onboarding Flow

**Purpose:** Guide first-time users through creating their initial org map with enough structure that they don't face a blank canvas, but enough freedom that power users aren't annoyed.

**Key requirements:**

- Triggered on first visit (no saved map in localStorage)
- Step 1: Welcome screen — _"Let's map your organization. Start with yourself."_
  - User creates their own node first (name, role, brief personality notes)
  - This node is automatically marked as "You" with a distinct visual indicator
- Step 2: Prompt to add their direct manager — _"Who do you report to?"_
  - Creates a second node and a "reports to" relationship automatically
- Step 3: Prompt to add 1-2 more people — _"Add a few key players — peers, skip-level, or anyone important to your goals."_
- Step 4: Brief tooltip tour of the canvas (pan, zoom, click to inspect, drag to rearrange)
- Step 5: Nudge toward AI — _"Click any person, then open the chat to start strategizing."_
- "Skip onboarding" option available at every step for users who want to dive in raw

**UX notes:**

- Each step should feel like a conversation, not a form wizard
- Use subtle animations when nodes appear on the canvas during onboarding (fade in + slight scale)
- The onboarding should result in a canvas that already has 3-4 nodes and 2-3 relationships, so the user immediately sees the product's value
- Progress indicator (dots or steps) should be visible but unobtrusive

**Out of scope for now:**

- Template org structures (e.g., "typical engineering org")
- Import from LinkedIn, Google Contacts, or HR systems
- Multi-org support

---

### [P0] Interactive Canvas (Primary Screen)

**Purpose:** The main workspace where users visualize, build, and restructure their organizational map.

**Key requirements:**

- Fullscreen canvas powered by `@xyflow/react` (React Flow)
- Canvas controls:
  - Pan (click + drag on empty space, or two-finger drag on mobile)
  - Zoom (scroll wheel, pinch-to-zoom, or +/- buttons)
  - Fit-to-view button (centers and scales to show all nodes)
  - Minimap in bottom-left corner showing the full graph with viewport indicator
- Node rendering:
  - Each node displays: person's name (primary), role title (secondary), and a small avatar placeholder (initials-based, color-coded)
  - The "You" node has a distinct border (e.g., glowing blue ring) and is labeled with a small "YOU" badge
  - Nodes are color-coded by a user-assignable category or default to a neutral palette
  - Nodes show a small MBTI badge if the type has been set (e.g., "INTJ" in a tiny pill)
- Edge (relationship) rendering:
  - Edges are directional (arrows)
  - Edge types are visually distinct:
    - **Reports To** — solid line, neutral color
    - **Alliance / Trusted** — solid line, green
    - **Tension / Conflict** — dashed line, red/orange
    - **Informal Influence** — dotted line, purple
    - **Mentorship** — solid line, blue
  - Edge labels are optional (user can add a short label like "former allies" or "competing for same role")
  - Clicking an edge selects it and shows a small popover to edit type, label, or delete
- Adding nodes:
  - Double-click on empty canvas space opens the "Add Person" modal
  - Or use a persistent "+" floating action button in the bottom-right
- Adding edges:
  - Click a source node's connection handle, drag to target node
  - On release, a popover asks for relationship type and optional label
  - Alternatively, from the node detail panel, user can "Add Relationship" and pick a target from a dropdown
- Canvas toolbar (top-left or top-bar):
  - Undo / Redo
  - Auto-layout button (triggers a dagre or elk layout algorithm to organize nodes hierarchically)
  - Toggle minimap
  - Toggle edge labels
  - Settings gear icon
- All canvas state (node positions, zoom level, viewport) persists to localStorage on every change (debounced save, 500ms)

**UX notes:**

- Default to a dark canvas background (#0a0a0f or similar) with subtle grid dots for spatial orientation
- Nodes should have a subtle drop shadow and hover state (slight lift + brighter border)
- Dragging a node should feel responsive with no perceptible lag — React Flow handles this natively but ensure no expensive re-renders on drag
- When a node is selected (clicked), it should get a highlight ring and the side panel should open/update
- Canvas should support 50+ nodes without performance degradation
- On mobile/tablet: nodes should be tap-targets of at least 44x44px; consider a slightly different interaction model where tap selects and long-press opens context menu
- Auto-layout should animate the transition (nodes slide to new positions over 300ms)

**Out of scope for now:**

- Collaborative/multiplayer editing
- Canvas background customization
- Grouping nodes into visual clusters/departments (P1)
- Export to image or PDF (P1)
- Keyboard shortcuts beyond undo/redo (P1)

---

### [P0] Add / Edit Person Modal

**Purpose:** Capture detailed information about each person in the org map through a structured but flexible form.

**Key requirements:**

- Triggered by: double-click on canvas, "+" button, or "Edit" button in the detail panel
- Fields:
  - **Name** (required) — text input, max 100 chars
  - **Role / Title** (required) — text input, max 150 chars
  - **Department** (optional) — text input or dropdown with common values + custom entry
  - **Is This You?** — toggle switch. Only one node can be "You" at a time; toggling this on for a new node removes it from the previous one (with confirmation)
  - **MBTI Type** (optional) — dropdown with all 16 types, or "Unknown"
  - **Working Style** (optional) — multi-select chips: "Detail-oriented", "Big-picture thinker", "Process-driven", "Improvisational", "Data-driven", "Intuition-driven", "Collaborative", "Independent", "Fast-paced", "Methodical" — plus a custom chip option
  - **Communication Preferences** (optional) — multi-select chips: "Prefers email", "Prefers Slack/chat", "Prefers face-to-face", "Prefers formal presentations", "Direct communicator", "Indirect communicator", "Wants data first", "Wants context/story first"
  - **General Disposition** (optional) — free-text textarea, max 500 chars. Placeholder: _"How would you describe this person's personality, motivations, and behavior? Be honest — only you will see this."_
  - **Political Notes** (optional) — free-text textarea, max 500 chars. Placeholder: _"Any political dynamics to note? Allegiances, rivalries, ambitions, insecurities, pet peeves?"_
  - **Influence Level** (optional) — slider or segmented control: Low / Medium / High / Very High. Represents informal influence, not just title seniority.
  - **Your Relationship with Them** (optional, only shown if this node is NOT "You") — free-text textarea, max 300 chars. Placeholder: _"How is your current relationship with this person? What do they think of you?"_
- Save button creates/updates the node and returns to the canvas
- Delete button with confirmation dialog: _"Remove [Name] from your org map? This will also remove all their relationships."_
- Form should be scrollable if it exceeds viewport height

**UX notes:**

- Modal should slide in from the right or center-overlay, dimming the canvas behind it
- Use progressive disclosure: show Name, Role, and "Is This You?" first, then an "Add More Details" expander for personality fields — reduces initial intimidation
- Auto-save drafts to prevent data loss if modal is accidentally closed
- MBTI dropdown should show the type name and a one-line description (e.g., "INTJ — The Architect: Strategic, independent, analytical")
- Chip selectors should allow custom entries typed by the user
- The tone throughout should be candid and slightly irreverent — this isn't an HR form

**Out of scope for now:**

- Profile photo upload
- LinkedIn profile import
- AI-assisted persona generation ("Describe this person in a few sentences and we'll extract traits") — this is a strong P1 feature
- Personality assessment quiz for the user's own node

---

### [P0] Node Detail Panel (Right Side Panel)

**Purpose:** Display a rich, readable profile of a selected person and serve as the gateway to the AI chat interface.

**Key requirements:**

- Opens when a user clicks/taps any node on the canvas
- Panel slides in from the right, occupying ~400px on desktop (or full-width overlay on mobile)
- Panel has two tabs/modes:
  - **Profile** (default) — shows the person's full details
  - **Chat** — AI strategy chat contextual to this person (see Chat section)
- Profile tab content:
  - Header: Name (large), Role (medium), Department (small), "YOU" badge if applicable
  - Avatar: Large initials-based circle with color derived from name hash
  - **Personality Snapshot** section:
    - MBTI type displayed as a prominent badge with the type's archetype name
    - Working style chips
    - Communication preference chips
  - **Disposition** section: rendered as a readable paragraph from the free-text field
  - **Political Notes** section: rendered with a slightly different background/border to visually distinguish it as "sensitive intel"
  - **Influence Level**: displayed as a horizontal bar or icon rating
  - **Your Relationship**: displayed in a callout box (only for non-"You" nodes)
  - **Connections** section: list of all relationships involving this person, showing:
    - Connected person's name + role
    - Relationship type (with colored indicator matching edge colors)
    - Optional label
    - Each connection is clickable (navigates to that person's node on canvas + updates panel)
  - **Edit** button at bottom of profile — opens the Add/Edit Person modal pre-filled
  - **Delete** button (subtle, perhaps in a "..." overflow menu)
- Panel has a close button (X) and can also be closed by clicking empty canvas space
- Panel updates instantly when a different node is clicked (no close + reopen animation — just content swap with a subtle crossfade)

**UX notes:**

- Panel should have a semi-transparent backdrop on the canvas side so the map remains partially visible and contextual
- Scrollable if content exceeds viewport height
- On mobile: panel becomes a bottom sheet that can be swiped up to full-screen or down to dismiss
- Tab switching between Profile and Chat should preserve chat history (don't reset conversation when switching back to Profile)
- The panel should feel like reading a strategic dossier, not a database record. Use clear typographic hierarchy and generous whitespace.

**Out of scope for now:**

- Activity log or change history per node
- Comparison view (two profiles side-by-side)
- Relationship strength scoring visualization

---

### [P0] AI Strategy Chat

**Purpose:** Enable users to have strategic conversations with an AI that has full context of their org map, using the Anthropic Claude API.

**Key requirements:**

- Accessible from the "Chat" tab in the right-side detail panel
- When opened from a specific person's node, the chat is pre-contextualized: _"You're viewing [Name]'s profile. Ask me anything about navigating your relationship with them, or any broader org strategy question."_
- Chat interface:
  - Message list (scrollable, newest at bottom)
  - Text input at bottom with send button and Enter-to-send (Shift+Enter for newline)
  - Messages styled as bubbles: user messages right-aligned, AI messages left-aligned
  - AI messages render Markdown (bold, italic, bullet lists, headers) for structured advice
  - Typing indicator while waiting for API response
- System prompt construction (critical):
  - On every message, the app constructs a system prompt that includes:
    - The full org map serialized as structured text/JSON: every person's name, role, MBTI, working style, communication preferences, disposition, political notes, influence level
    - All relationships: source, target, type, label
    - Which node is "You" — and the user's own profile details
    - The currently selected node's full profile (for contextual questions)
  - System prompt framing: _"You are a strategic career advisor and organizational dynamics analyst. The user has mapped their workplace org structure below. You have access to every person's profile and every relationship. Provide specific, actionable advice grounded in the actual people and dynamics described. Never give generic career advice. Reference specific people by name. Consider personality types, communication styles, influence levels, and political dynamics. Be direct and honest — the user is using this tool privately to navigate real workplace situations."_
- Conversation management:
  - Each chat session is tied to the currently selected node but the AI always has full org context
  - Chat history persists in localStorage per node (so returning to a person's chat shows prior messages)
  - "New Conversation" button to clear history and start fresh
  - A "Global Chat" option (not tied to any specific node) accessible from a floating chat icon on the canvas — for broad strategic questions
- Error handling:
  - If no API key is set: show inline prompt to add one with a button that opens the API key modal
  - If API call fails (rate limit, invalid key, network error): show error message inline with retry button
  - If the org map is empty (no nodes): show message _"Add some people to your org map first, then come back to strategize."_
- Suggested prompts (shown when chat is empty):
  - "How should I approach [Name] about [topic] given their personality?"
  - "What's my best path to promotion given the current org dynamics?"
  - "Who are my most important allies, and how can I strengthen those relationships?"
  - "How should I handle the tension between [Person A] and [Person B]?"
  - "If I want to pitch [idea] to leadership, what's my best strategy?"

**UX notes:**

- Chat should feel fast and premium. Stream the response token-by-token using the Anthropic streaming API for perceived speed.
- Suggested prompts should auto-fill with actual names from the org map where possible (e.g., dynamically populate "[Name]" with the selected person's name)
- Chat panel should be at minimum 350px wide to allow comfortable reading
- On mobile: chat becomes full-screen overlay when active
- AI responses should be well-formatted — encourage the model to use headers, bullet points, and bold for key names/actions
- Include a "Copy" button on AI responses for easy pasting into notes

**Out of scope for now:**

- Voice input
- Chat export/download
- Multi-turn memory beyond current session (P1 — using conversation summarization)
- Image generation (e.g., strategy diagrams)
- Alternate AI models

---

### [P0] Data Persistence (Local Storage)

**Purpose:** Ensure all user data persists across sessions without requiring any backend or user accounts.

**Key requirements:**

- All data stored in browser `localStorage`:
  - Org map nodes (people and all their attributes)
  - Org map edges (relationships)
  - Node positions on canvas
  - Canvas viewport state (zoom level, pan position)
  - Anthropic API key (stored separately, potentially with basic obfuscation — not encryption, since client-side encryption without a password is theater, but at least not plain text in a JSON blob)
  - Chat history per node + global chat
  - User preferences (theme, onboarding completion flag)
- Auto-save: every change to nodes, edges, or positions triggers a debounced save (500ms)
- Data format: single JSON object with versioned schema (include a `schemaVersion` field for future migrations)
- Export: user can export their entire org map as a JSON file from Settings
- Import: user can import a previously exported JSON file from Settings, with validation and confirmation (_"This will replace your current org map. Are you sure?"_)

**UX notes:**

- Show a subtle "Saved" indicator near the top of the canvas after each auto-save (fades in, lingers 1s, fades out)
- Warn users about localStorage limits (~5-10MB depending on browser) if their data approaches the limit
- On app load, if saved data exists, go directly to the canvas. If no data, start onboarding.

**Out of scope for now:**

- Cloud sync / user accounts
- Multi-device support
- Backup reminders
- Data encryption at rest (P1 — would require user to set a password)

---

### [P1] Settings Panel

**Purpose:** Allow users to manage their API key, data, and preferences.

**Key requirements:**

- Accessible from a gear icon on the canvas toolbar
- Sections:
  - **API Key Management**: view masked key (last 4 chars visible), update key, validate key, remove key
  - **Data Management**: Export org map (JSON download), Import org map (JSON file upload), Clear all data (with double-confirmation: _"This will permanently delete your org map and all chat history. Type 'DELETE' to confirm."_)
  - **Canvas Preferences**: Toggle minimap, toggle edge labels, toggle grid background, auto-layout direction (top-down vs. left-right)
  - **About**: App version, link to GitHub/website, attribution for React Flow and Anthropic

**UX notes:**

- Modal overlay or full-screen panel on mobile
- Settings should be minimal and functional — this isn't a settings-heavy app
- Group sections with clear headers and dividers

**Out of scope for now:**

- Theme customization (light/dark toggle — consider for P1)
- Notification preferences (no notifications in MVP)
- Account/login settings (no accounts in MVP)

---

### [P1] Department / Group Clustering

**Purpose:** Allow users to visually group nodes by department or team for better spatial organization.

**Key requirements:**

- Users can create named groups (e.g., "Engineering", "Sales", "C-Suite")
- Nodes assigned to a group are visually enclosed in a subtle background region on the canvas
- Groups can be color-coded
- Dragging the group header moves all contained nodes together
- Groups are optional — users can ignore them entirely

**UX notes:**

- Use React Flow's built-in group/parent-node functionality
- Group backgrounds should be very subtle (low-opacity fill + thin border) so they don't distract from the relationship lines

**Out of scope for now:**

- Nested groups (sub-teams within departments)
- Auto-assignment of groups based on role titles

---

### [P1] Export & Sharing

**Purpose:** Allow users to capture and share their org map as an image or structured document.

**Key requirements:**

- Export canvas as PNG or SVG (using html-to-image or similar)
- Export org data as formatted markdown/PDF report (all profiles + relationships)
- Optional: redaction mode that anonymizes names before export (e.g., "Person A", "Person B")

**UX notes:**

- Export button in canvas toolbar with dropdown for format selection
- PNG export should capture the full canvas at high resolution, not just the visible viewport

**Out of scope for now:**

- Shareable links
- Collaborative viewing
- Presentation mode / slideshow

---

### [P1] Scenario Modeling

**Purpose:** Let users explore "what if" scenarios to prepare for organizational changes.

**Key requirements:**

- User can create a named scenario (e.g., "If VP of Eng leaves", "Post-reorg")
- Scenario is a fork/copy of the current org map that can be modified independently
- User can add/remove nodes and edges in the scenario without affecting the base map
- AI chat within a scenario has context of both the base map and the changes
- User can compare base map vs. scenario side-by-side

**UX notes:**

- Scenario selector as a tab bar or dropdown at the top of the canvas
- Visual indicator (colored border or banner) when viewing a scenario vs. the base map
- Limit to 3 scenarios in P1 to keep complexity manageable

**Out of scope for now:**

- Automated scenario generation by AI
- Probability scoring on scenarios
- Timeline/sequencing of changes

---

### [P2] Relationship Strength Scoring

**Purpose:** Quantify and visualize the strength of relationships for more nuanced strategic analysis.

**Key requirements:**

- Each relationship gets a strength score (1-10) set by the user
- Edge thickness on canvas reflects strength score
- AI uses strength scores to provide more nuanced advice
- Dashboard view showing strongest/weakest relationships

**Out of scope for now:**

- Auto-scoring based on interaction frequency
- Sentiment analysis

---

### [P2] Career Playbook Generation

**Purpose:** AI generates a structured, multi-step strategic plan for a specific career objective.

**Key requirements:**

- User defines an objective (e.g., "Get promoted to Senior Director within 12 months")
- AI analyzes the full org map and generates a step-by-step playbook:
  - Key stakeholders to influence
  - Relationships to build or repair
  - Specific actions with timelines
  - Risks and mitigation strategies
- Playbook saved as a document within the app
- Progress tracking: user can check off completed steps

**Out of scope for now:**

- Automated progress monitoring
- Integration with calendar or task management tools

---

### [P0] Design System / Experience Rules

**Purpose:** Define the visual language and interaction patterns that make OrgGraph feel cohesive, premium, and trustworthy.

**Key requirements:**

**Color Palette:**

- **Background (canvas):** #0B0D11 (near-black with blue undertone)
- **Background (panels):** #13151A (slightly lighter, for right panel and modals)
- **Surface:** #1C1E26 (cards, input fields, node backgrounds)
- **Border:** #2A2D37 (subtle dividers and outlines)
- **Text primary:** #E8E9ED (off-white, high readability)
- **Text secondary:** #8B8D97 (muted gray for labels and metadata)
- **Accent primary:** #6C8EEF (calm blue — used for "You" node, primary buttons, active states)
- **Accent success:** #4ADE80 (green — alliance edges, positive indicators)
- **Accent danger:** #F87171 (red — tension edges, delete actions, warnings)
- **Accent influence:** #A78BFA (purple — informal influence edges)
- **Accent mentorship:** #38BDF8 (light blue — mentorship edges)

**Typography:**

- Primary font: Inter (clean, professional, excellent at small sizes)
- Monospace for MBTI badges and technical labels: JetBrains Mono
- Font sizes: 12px (labels/badges), 14px (body/inputs), 16px (section headers), 20px (panel name), 28px (landing page subhead), 40px (landing page hero)

**Node Design:**

- Rounded rectangles (border-radius: 12px)
- Background: #1C1E26 with 1px border #2A2D37
- Hover: border brightens to #6C8EEF, subtle translateY(-1px) + shadow increase
- Selected: border becomes 2px #6C8EEF with a faint glow (box-shadow: 0 0 12px rgba(108,142,239,0.3))
- "You" node: persistent 2px #6C8EEF border + small "YOU" badge (background #6C8EEF, white text, border-radius: 4px, font-size: 10px, positioned top-right of node)
- Node content: initials avatar (left), name + role (right), MBTI pill below role

**Edge Design:**

- Default edge path: smoothstep (React Flow built-in, gives clean curved lines)
- Arrow markers on target end
- Edge colors and styles per relationship type (as defined in Canvas section)
- Selected edge: thicker (3px) + brighter color

**Motion:**

- Panel open/close: slide from right, 250ms ease-out
- Modal appear: fade in + scale from 0.95 to 1.0, 200ms ease-out
- Node add to canvas: fade in + scale from 0.8 to 1.0, 300ms spring
- Auto-layout transition: nodes animate to new positions, 400ms ease-in-out
- Chat message appear: fade in + translateY(8px → 0), 150ms
- Save indicator: fade in 150ms, hold 1.5s, fade out 300ms
- All transitions use `prefers-reduced-motion` media query — disable animations if user has this OS setting

**Interaction Patterns:**

- Destructive actions always require confirmation (delete person, clear all data)
- Inputs have visible focus rings (2px #6C8EEF outline)
- Buttons have hover and active states (darken by 10% on hover, 15% on active)
- Empty states always include an action CTA (never leave the user staring at nothing)
- Error messages are inline, not toasts — placed directly next to the element that errored
- Loading states use subtle pulsing skeletons, not spinners

**Responsive Breakpoints:**

- Mobile: < 768px (single-column, panels become overlays/bottom sheets)
- Tablet: 768px–1024px (canvas full-width, panel overlays canvas)
- Desktop: > 1024px (canvas + side panel side-by-side)

---

## MVP Scope Summary

### In Scope

- Landing page with clear value proposition
- Interactive fullscreen canvas with @xyflow/react (pan, zoom, drag, minimap)
- Add/edit/delete person nodes with full persona fields (name, role, MBTI, working style, communication preferences, disposition, political notes, influence level, relationship notes)
- Mark one node as "You"
- Create directional relationships between nodes with type classification (reports to, alliance, tension, informal influence, mentorship) and optional labels
- Right-side detail panel with profile view and chat tab
- AI strategy chat powered by Anthropic Claude API (user provides own key)
- Full org context injected into every AI conversation
- Streaming AI responses
- Suggested prompts auto-populated with real names from the map
- Chat history persistence per node + global chat
- Auto-save all data to localStorage
- Export/import org map as JSON
- Onboarding flow for first-time users
- Auto-layout algorithm for automatic node arrangement
- Responsive design (desktop-first, functional on tablet/mobile)
- Dark theme design system

### Out of Scope for Now

- User accounts, authentication, or cloud storage
- Collaborative/multiplayer features
- Department/group clustering visuals (P1)
- Image/PDF export of canvas (P1)
- Scenario modeling / "what if" forks (P1)
- Relationship strength scoring (P2)
- Career playbook generation (P2)
- AI-assisted persona generation from natural language (P1)
- Support for non-Anthropic AI providers
- Mobile native app
- Keyboard shortcuts beyond undo/redo
- Template org structures
- Import from LinkedIn, HRIS, or other data sources

---

## Suggested User Flow

1. User lands on the marketing page, reads the value proposition, clicks "Start Mapping."
2. App loads. Since no saved data exists, the onboarding flow begins.
3. User creates their own node (name, role, brief personality). It appears on the canvas with a "YOU" badge.
4. User is prompted to add their manager. A second node appears with a "Reports To" relationship line.
5. User adds 1-2 more key people (a peer, a skip-level). The canvas now has 3-4 nodes.
6. Brief tooltip tour highlights: drag to rearrange, scroll to zoom, click to inspect, connect nodes to add relationships.
7. User clicks their manager's node. The right-side detail panel opens showing the manager's profile.
8. User adds more detail to the manager's profile — MBTI, working style, political notes.
9. User switches to the Chat tab in the panel. A prompt appears to enter their Anthropic API key.
10. User enters and
