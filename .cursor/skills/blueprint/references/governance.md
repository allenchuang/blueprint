# Blueprint Agent Governance

> When working in a Blueprint repo, `CLAUDE.md` and `.claude/rules/*.mdc` are authoritative.
> This file provides governance context for agents working outside the repo.

## Hard Boundaries

1. **DO NOT** delete, rename, or restructure existing apps or packages
2. **DO NOT** modify `turbo.json`, `pnpm-workspace.yaml`, or root `package.json` without explicit approval
3. **DO NOT** modify `.env` files or commit secrets
4. **DO NOT** force-push to `main`
5. **DO NOT** run destructive commands (`rm -rf`, `drop table`) on production data

## What Agents CAN Do

- **Add apps**: New directory under `apps/`, add to `apps-registry.ts` and root `package.json`
- **Edit code**: Fix bugs, add features — always on feature branches
- **Run commands**: `pnpm install`, `pnpm build`, `pnpm dev:*`, `pnpm db:push`, `pnpm db:generate`
- **Git**: Create branches, commit (conventional), push feature branches, create PRs
- **Download assets**: Save to `storage/` (images/, videos/, documents/, temp/)
- **Rebuild**: `pnpm build --filter=<app>` then `pm2 restart <app>`

## Git Workflow

- Always work on feature branches — never commit to `main`
- Branch prefix by agent: `ocean/`, `arctic/`, `ash/`, `skylar/`
- Conventional commits: `feat(web):`, `fix(server):`, `chore(db):`
- One concern per PR
- Never merge without explicit approval from the project owner

## Deployment

```bash
pnpm install            # if deps changed
pnpm build              # or pnpm build --filter=<app>
pm2 restart <app> --update-env
```

## Production Infrastructure

- **Process manager**: PM2 (`ecosystem.config.cjs`)
- **Reverse proxy**: Caddy (auto-HTTPS via Let's Encrypt)
- **Private access**: Tailscale for admin, OS, and gateway
- **App registry**: `packages/app-config/src/apps-registry.ts`
