#!/usr/bin/env -S npx tsx
/**
 * generate-prd.ts
 *
 * Two-step PRD generator using the Claude API:
 *   Step 1 — Expand the raw idea into a 2-3 paragraph app description
 *   Step 2 — Feed that description into Claude to produce a full structured PRD
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/generate-prd.ts
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/generate-prd.ts "Your raw app idea here"
 *   echo "Your idea" | ANTHROPIC_API_KEY=sk-... npx tsx scripts/generate-prd.ts
 *
 * The PRD is written to:
 *   ./prd-output/<app-slug>-prd.md
 *
 * Compatible with: Node 22+, no extra dependencies (uses native fetch).
 */

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-4-6";
const BASE_URL = "https://api.anthropic.com/v1/messages";
const OUTPUT_DIR = path.join(process.cwd(), "prd-output");

if (!API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is required.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  return data.content[0]?.text ?? "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

async function readStdin(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin });
  const lines: string[] = [];
  for await (const line of rl) lines.push(line);
  return lines.join("\n").trim();
}

function writeOutput(slug: string, content: string): string {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const filename = `${slug}-prd.md`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, content, "utf8");
  return filepath;
}

function log(msg: string) {
  process.stderr.write(msg + "\n");
}

// ---------------------------------------------------------------------------
// Step 1: Describe the app (2-3 paragraphs)
// ---------------------------------------------------------------------------

const DESCRIBE_SYSTEM = `You are a senior product strategist. Given a raw app idea — which may be a quick note,
a sentence, or a rough paragraph — expand it into a clear, concise 2-3 paragraph product description.

The description should cover:
1. What the app does and who it's for (the core value proposition)
2. The key user journey and primary features (how the user experiences it)
3. The business model, differentiation, and long-term vision (why it matters)

Keep it grounded and honest — no hype, no buzzwords. Write in plain, confident prose.
Do NOT include headers or bullets. Just 2-3 flowing paragraphs.`;

// ---------------------------------------------------------------------------
// Step 2: Generate the PRD
// ---------------------------------------------------------------------------

const PRD_SYSTEM = `You are an expert product manager and technical architect.
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
Flag any integrations that are explicitly called out in the description.

---

## Open Questions
Bullet list of ambiguities or decisions that still need to be made before building.

---

Rules for generating the PRD:
- Be specific. Avoid vague language like "good UX" — say exactly what is needed.
- Use [P0] / [P1] / [P2] tags on every section heading.
- Mobile-first by default unless the description specifies otherwise.
- If the description mentions a design style, color palette, or motion system, include a dedicated "Design System" section.
- Do NOT include placeholder Lorem Ipsum text. Use real copy suggestions.
- Suggest creative marketing copy where relevant.
- The PRD should be detailed enough that a dev team can start building from it without clarifying questions.`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Read raw idea from CLI arg, stdin, or interactive prompt
  let rawIdea = process.argv[2]?.trim() ?? "";

  if (!rawIdea && !process.stdin.isTTY) {
    rawIdea = await readStdin();
  }

  if (!rawIdea) {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rawIdea = await new Promise<string>((resolve) => {
      log("=".repeat(60));
      log("  PRD Generator");
      log("=".repeat(60));
      log("\nDescribe your app idea (press Enter twice when done):\n");
      const lines: string[] = [];
      let emptyCount = 0;
      rl.on("line", (line) => {
        if (line === "") {
          emptyCount++;
          if (emptyCount >= 1 && lines.length > 0) {
            rl.close();
            resolve(lines.join("\n").trim());
          }
        } else {
          emptyCount = 0;
          lines.push(line);
        }
      });
    });
  }

  if (!rawIdea) {
    console.error("No app idea provided. Exiting.");
    process.exit(1);
  }

  log("\n" + "=".repeat(60));
  log(`\n📝  Raw idea captured (${rawIdea.length} chars)`);

  log("\n🔍  Step 1: Generating app description...");
  const appDescription = await callClaude(DESCRIBE_SYSTEM, rawIdea);
  log("✅  App description generated.\n");
  log("-".repeat(40));
  log(appDescription);
  log("-".repeat(40));

  log("\n📋  Step 2: Generating full PRD...");
  const prd = await callClaude(
    PRD_SYSTEM,
    `Here is the app description:\n\n${appDescription}\n\nOriginal idea for reference:\n${rawIdea}`
  );
  log("✅  PRD generated.\n");

  const timestamp = new Date().toISOString().split("T")[0];
  const output = [
    `> Generated on ${timestamp} by generate-prd.ts`,
    `> Model: ${MODEL}`,
    "",
    "## App Description",
    "",
    appDescription,
    "",
    "---",
    "",
    prd,
  ].join("\n");

  const firstLine = prd.split("\n").find((l) => l.startsWith("# ")) ?? "";
  const appName = firstLine.replace(/^#\s*/, "").replace(/\s*—.*/, "").trim();
  const slug = slugify(appName || rawIdea.slice(0, 40));

  const filepath = writeOutput(slug, output);

  log(`\n🚀  PRD saved to: ${filepath}`);
  log("=".repeat(60) + "\n");

  process.stdout.write(output);
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
