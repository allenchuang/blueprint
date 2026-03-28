# Blueprint Pulse

**Port:** 3006 | **Color:** Violet | **Icon:** bar-chart

The CEO view. One dashboard to see everything that matters — MRR, active users, agent activity, and AI cost per run. Built for founders who need the full picture at a glance.

## Features

- **MRR & ARR** — Revenue trends with growth rate indicators
- **Active users** — DAU/MAU with retention cohort breakdowns
- **Agent activity** — Runs, success rate, errors, and cost per invocation
- **Cost per run** — Track AI spend across all your agents in real-time
- **Custom widgets** — Add your own KPIs via config

## Install

```bash
blueprint install pulse
```

## Configuration

No env vars required. Pulls from your Blueprint server API automatically.

| Variable               | Description                          |
|------------------------|--------------------------------------|
| `PULSE_ANALYTICS_KEY`  | Optional: third-party analytics sink |

## Running

```bash
pnpm dev:pulse
```

App available at `http://localhost:3006`.

## Status

🚧 **Coming Soon** — This app is scaffolded and registered. Full implementation arriving in Phase 2.
