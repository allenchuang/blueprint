# Tools

## Available on VPS

- **Node.js**: v23+ (via nvm)
- **pnpm**: v10 (package manager for this monorepo)
- **PM2**: Process manager for production apps (`pm2 status`, `pm2 restart <app>`, `pm2 logs <app>`)
- **Caddy**: Reverse proxy with auto-HTTPS (`/etc/caddy/Caddyfile`, `sudo systemctl reload caddy`)
- **Tailscale**: Private mesh VPN for operator access
- **git**: Version control with SSH deploy key auth to GitHub

## Key Paths

- Monorepo: `/home/deploy/repos/blueprint`
- PM2 config: `/home/deploy/repos/blueprint/ecosystem.config.cjs`
- Caddy config: `/etc/caddy/Caddyfile`
- OpenClaw config: `~/.openclaw/openclaw.json`
- OpenClaw workspace: `~/.openclaw/workspace` (symlinked to the monorepo)
- Asset storage: `/home/deploy/repos/blueprint/storage/`

## Monorepo Commands

```bash
pnpm install              # Install dependencies
pnpm build                # Build all apps
pnpm build --filter=web   # Build one app
pnpm dev:web              # Dev mode for one app
pnpm db:push              # Push DB schema
pnpm db:generate          # Generate migrations
pnpm sync-config          # Sync branding/theme to all apps
```

## PM2 Commands

```bash
pm2 status                # Check all processes
pm2 restart all           # Restart everything
pm2 restart web           # Restart one app
pm2 logs web --lines 30   # View recent logs
pm2 save                  # Save current process list
```

## Deploy Workflow

After making code changes:
1. `pnpm build --filter=<app>` (or `pnpm build` for all)
2. `pm2 restart <app>` (or `pm2 restart all`)
