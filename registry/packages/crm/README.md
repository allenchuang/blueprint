# Blueprint CRM

**Port:** 3005 | **Color:** Teal | **Icon:** users

Lightweight customer relationship management built for indie hackers and small teams. Track leads through your pipeline, manage trials, and convert to paid — with AI agents handling follow-ups automatically.

## Features

- **Pipeline view** — Kanban board for leads → trials → paid
- **Agent follow-ups** — AI automatically drafts and schedules outreach
- **Customer profiles** — Full history, notes, and activity timeline
- **MRR tracking** — See revenue impact as deals move through stages

## Install

```bash
blueprint install crm
```

## Configuration

No env vars required to get started. Optional integrations:

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `CRM_SMTP_HOST`       | SMTP server for agent email sending  |
| `CRM_SMTP_USER`       | SMTP username                        |
| `CRM_SMTP_PASS`       | SMTP password                        |

## Running

```bash
pnpm dev:crm
```

App available at `http://localhost:3005`.

## Status

🚧 **Coming Soon** — This app is scaffolded and registered. Full implementation arriving in Phase 2.
