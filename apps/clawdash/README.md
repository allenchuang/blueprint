# ClawDash — OpenClaw Agent Dashboard

Real-time diagnostics dashboard for [OpenClaw](https://github.com/openclaw/openclaw) AI agents. Monitor sessions, track costs, browse memory, manage cron jobs, and stream live messages — all in a macOS-native UI.

## Prerequisites

- **Node.js** >= 23 (`nvm use`)
- **pnpm** 10
- **OpenClaw** installed globally:
  ```bash
  npm install -g openclaw@latest
  ```
- **OpenClaw gateway** running (daemon or manual):
  ```bash
  openclaw onboard --install-daemon
  # or manually:
  openclaw gateway --port 18789
  ```

## Quick Start

```bash
# 1. Copy env config
cp apps/clawdash/.env.example apps/clawdash/.env.local

# 2. Start the dashboard (port 7778)
pnpm dev:clawdash

# 3. Or start all apps (includes clawdash)
pnpm dev
```

Open [http://localhost:7778](http://localhost:7778) in your browser, or use the ClawDash icon inside `apps/os` desktop.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `OPENCLAW_DIR` | Path to OpenClaw config directory | `~/.openclaw` |
| `OPENCLAW_WORKSPACE` | Path to OpenClaw workspace | `~/.openclaw/workspace` |
| `OPENCLAW_AGENT` | Agent ID to monitor | `main` |
| `OPENCLAW_GATEWAY_URL` | Gateway WebSocket URL | `ws://127.0.0.1:18789` |
| `DASHBOARD_PASSWORD` | Optional password for remote access | _(none)_ |

## How It Works

ClawDash reads OpenClaw data from three sources:

1. **Filesystem** — session metadata, config, cron jobs, memory files, and workspace files are read directly from `~/.openclaw/` and the workspace directory via Next.js API routes (server-side only).

2. **Gateway WebSocket** — the Live Feed page connects to the OpenClaw gateway via a server-side SSE proxy, streaming real-time agent messages to the browser.

3. **System metrics** — CPU, memory, and disk usage are read via Node.js `os` module (no OpenClaw dependency).

```
OpenClaw Gateway (ws://127.0.0.1:18789)
    │
    ├── ~/.openclaw/                (filesystem)
    │   ├── openclaw.json           (config)
    │   ├── agents/{id}/sessions/   (session data)
    │   ├── cron/jobs.json          (cron jobs)
    │   └── credentials/            (channel creds)
    │
    └── ~/.openclaw/workspace/      (workspace)
        ├── MEMORY.md
        ├── HEARTBEAT.md
        ├── AGENTS.md
        ├── memory/*.md             (daily notes)
        └── skills/*/SKILL.md
```

## Features

| Feature | Description |
|---|---|
| **Overview** | Summary cards, system health gauges, recent sessions |
| **Sessions** | Searchable table with status, model, tokens, cost, timestamps |
| **Costs** | Spending breakdown by model, day, and session |
| **Rate Limits** | Token usage progress bars against rolling windows |
| **Memory** | Markdown viewer for MEMORY.md, HEARTBEAT.md, daily notes |
| **Files** | Workspace file browser with inline editor and backup-on-save |
| **Live Feed** | Real-time SSE message stream with pause/resume |
| **Logs** | System log viewer for OpenClaw services |
| **Cron** | Cron job list with enable/disable toggles |
| **Config** | JSON editor for openclaw.json with validation |

## Connecting Channels

To see real data in ClawDash, connect OpenClaw to messaging channels:

- **WhatsApp**: `openclaw channels login` ([docs](https://docs.openclaw.ai/channels/whatsapp))
- **Telegram**: Set `TELEGRAM_BOT_TOKEN` ([docs](https://docs.openclaw.ai/channels/telegram))
- **Slack**: Set `SLACK_BOT_TOKEN` + `SLACK_APP_TOKEN` ([docs](https://docs.openclaw.ai/channels/slack))
- **Discord**: Set `DISCORD_BOT_TOKEN` ([docs](https://docs.openclaw.ai/channels/discord))

## Troubleshooting

**No sessions found**
OpenClaw is not running or `OPENCLAW_DIR` is misconfigured. Verify with `ls ~/.openclaw/agents/main/sessions/`.

**Gateway connection failed**
The gateway is not started. Run `openclaw gateway --port 18789 --verbose` and check the output.

**Permission denied**
Check filesystem permissions on `~/.openclaw/`. The dashboard reads files as the current Node.js process user.

**Empty dashboard**
Create at least one agent session: `openclaw agent --message "hello"`.

**Logs show "No logs available"**
On macOS, logs use `log show`; on Linux, `journalctl`. The OpenClaw service must be registered for logs to appear.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/sessions` | List all agent sessions |
| GET | `/api/system` | System health (CPU, RAM, disk) |
| GET | `/api/costs` | Cost breakdown by model/day/session |
| GET | `/api/usage` | Rate limit usage per model |
| GET | `/api/memory-files` | List memory files |
| GET | `/api/memory-file?path=...` | Read a memory file |
| GET | `/api/key-files` | List workspace files |
| GET | `/api/key-file?path=...` | Read a workspace file |
| POST | `/api/key-file` | Write a workspace file (with backup) |
| GET | `/api/crons` | List cron jobs |
| GET | `/api/logs?service=...&lines=...` | Fetch service logs |
| GET | `/api/openclaw-config` | Read OpenClaw config |
| PUT | `/api/openclaw-config` | Write OpenClaw config (with backup) |
| GET | `/api/live` | SSE stream from gateway WebSocket |

## Tech Stack

- Next.js 15 (App Router)
- shadcn/ui + Tailwind CSS v4
- React Query (TanStack Query)
- Recharts (cost visualization)
- React Markdown (memory viewer)
