# Blueprint Support

**Port:** 3007 | **Color:** Amber | **Icon:** message-circle

AI-first customer support inbox. Agents handle tier-1 questions automatically by referencing your docs — and escalate to you only when they need a human decision. Never lose a support ticket again.

## Features

- **AI triage** — Agents classify, prioritize, and route incoming tickets
- **Auto-responses** — Tier-1 questions answered instantly from your docs
- **Smart escalation** — Unclear or high-stakes issues surface to your queue
- **Docs sync** — Ingests your Mintlify docs as agent knowledge base
- **Shared inbox** — Unified view across email, chat, and web form

## Install

```bash
blueprint install support
```

## Configuration

| Variable                   | Description                                |
|----------------------------|--------------------------------------------|
| `SUPPORT_OPENAI_KEY`       | OpenAI API key for agent responses         |
| `SUPPORT_INBOX_EMAIL`      | Inbound email address for the support inbox|
| `SUPPORT_DOCS_URL`         | URL to your Mintlify docs (for AI context) |

## Running

```bash
pnpm dev:support
```

App available at `http://localhost:3007`.

## Status

🚧 **Coming Soon** — This app is scaffolded and registered. Full implementation arriving in Phase 2.
