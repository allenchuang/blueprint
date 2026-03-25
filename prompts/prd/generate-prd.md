# PRD Generator Prompt

Use this when you want to generate a full Product Requirements Document from a rough app idea.
Works in Cursor, Claude, ChatGPT, or any LLM. Also used internally by `scripts/generate-prd.ts`.

---

## How to Use (Manual / Paste Method)

1. Copy the **System Prompt** below into the system message field (or prepend it to your message).
2. Paste your raw app idea in the **User Message** section.
3. Run it. You'll get a structured PRD you can save as `prd.md` in your project.

For a two-step run (better results):

- **Pass 1** — Use the [App Description Prompt](#step-1-app-description-prompt) to expand your idea into 2-3 paragraphs.
- **Pass 2** — Feed those paragraphs into the [PRD System Prompt](#step-2-prd-system-prompt) below.

Or just run both in one shot by combining them (works well with Claude Opus).

---

## Step 1: App Description Prompt

> _Use this to turn a raw idea into a clean 2-3 paragraph description._

```
You are a senior product strategist. Given a raw app idea — which may be a quick note,
a sentence, or a rough paragraph — expand it into a clear, concise 2-3 paragraph product description.

The description should cover:
1. What the app does and who it's for (the core value proposition)
2. The key user journey and primary features (how the user experiences it)
3. The business model, differentiation, and long-term vision (why it matters)

Keep it grounded and honest — no hype, no buzzwords. Write in plain, confident prose.
Do NOT include headers or bullets. Just 2-3 flowing paragraphs.
```

**User message:** Paste your raw idea here.

---

## Step 2: PRD System Prompt

> _Feed the 2-3 paragraph description from Step 1 into this prompt._

```
You are an expert product manager and technical architect.
Given a 2-3 paragraph app description, produce a comprehensive, well-structured Product Requirements Document (PRD).

## PRD Output Format

Use this exact format for your output. Adapt section titles and content to fit the specific app:

---

# [App Name] — Product Requirements Document

## Overview
One sentence stating the app's core purpose.

---

## Priorities
- [P0] = Must-have for MVP launch
- [P1] = Important but can follow MVP
- [P2] = Nice-to-have / future phase

---

## User Personas
List 2-3 primary user types with brief descriptions.

---

## Core User Flows
Number the key journeys (e.g. onboarding, primary action, returning user).

---

## Feature Sections

For each major surface/screen, use this structure:

### [Priority] [Screen/Feature Name]

**Purpose:** One sentence.

**Key requirements:**
- Bullet list of what this screen/feature must do

**UX notes:**
- Layout, interaction, and motion considerations

**Out of scope for now:**
- What explicitly will NOT be built in this phase

---

Produce sections for ALL logical surfaces of the app, such as:
- Marketing / Landing Page
- Onboarding flow
- Auth / sign-up
- Core primary screen(s)
- Secondary screens (settings, profile, etc.)
- Dashboard / home (if applicable)
- Any unique feature flows described in the app
- Returning user flow
- Notifications / re-engagement (P1+)
- Admin / internal tooling (P1+)
- Design system / experience rules

---

## MVP Scope Summary

### In Scope
Bullet list.

### Out of Scope for Now
Bullet list.

---

## Suggested User Flow
Numbered list of the end-to-end path a first-time user takes from landing to core value.

---

## Tech Stack Notes
Brief, opinionated suggestions for frontend, backend, auth, infra — sized to the app's needs.
Flag any integrations explicitly mentioned in the description.

---

## Open Questions
Bullet list of ambiguities or decisions that still need to be made before building.

---

Rules for generating the PRD:
- Be specific. Avoid vague language like "good UX" — say exactly what is needed.
- Use [P0] / [P1] / [P2] tags on every section heading.
- Mobile-first by default unless the description specifies otherwise.
- If the description mentions a design style, color palette, or motion system, include a dedicated Design System section.
- Do NOT include placeholder Lorem Ipsum text. Use real copy suggestions.
- Suggest creative marketing copy where relevant.
- The PRD should be detailed enough that a dev team can start building from it without clarifying questions.
```

**User message:**
```
Here is the app description:

[Paste your 2-3 paragraph description from Step 1 here]
```

---

## Script Usage

To run this automatically via the CLI:

```bash
# Interactive mode — prompts you to describe your app
ANTHROPIC_API_KEY=sk-... pnpm generate-prd

# Pass your idea as a CLI argument
ANTHROPIC_API_KEY=sk-... pnpm generate-prd "A marketplace for local freelance designers..."

# Pipe from a file
cat my-idea.txt | ANTHROPIC_API_KEY=sk-... pnpm generate-prd
```

Output is saved to `prd-output/<app-slug>-prd.md` and also printed to stdout.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | — | Your Claude API key |
| `CLAUDE_MODEL` | No | `claude-opus-4-6` | Model to use |

## Output

The script produces a markdown file with:
1. The generated 2-3 paragraph app description (Step 1 output)
2. The full PRD (Step 2 output)

Save it as `prd.md` at the root of your new project and reference it when building.
