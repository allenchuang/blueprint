# Blueprint CRM

A lightweight CRM built specifically for Blueprint OS. Track contacts, manage deals, and log activity — all inside your desktop environment.

## Features

- **Contacts** — store names, emails, companies, and notes
- **Deals** — kanban-style pipeline (Lead → Qualified → Proposal → Won/Lost)
- **Activity feed** — log calls, meetings, and follow-up reminders
- **Search** — instant full-text search across contacts and deals
- **Mobile-first** — works on any screen size

## Install

```bash
blueprint install crm
```

Requires `DATABASE_URL` (Neon PostgreSQL). Blueprint CLI runs `pnpm db:push` automatically.

## After installing

1. Restart Blueprint OS: `pm2 restart all`
2. Open the CRM window at port **3006**
3. Create your first contact

## Configuration

No additional configuration required beyond `DATABASE_URL`. All settings are in-app.

## Requirements

- Blueprint OS ≥ 0.1.0
- Node.js ≥ 23
- PostgreSQL database (Neon recommended)
