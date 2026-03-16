---
name: Update + Sync Workflow
overview: Document the full lifecycle of how Allen pushes updates, how scaffolded users receive them, how forked users sync, and how OpenClaw agents auto-update -- plus a new CLI `update` command to make it seamless.
todos:
  - id: cli-update-command
    content: Create packages/blueprint-cli/src/commands/update.ts -- fetches upstream, shows changes, merges with protected file exclusions
    status: pending
  - id: cli-new-keep-git
    content: Modify new.ts to keep .git and rename origin to blueprint-upstream instead of deleting git history
    status: pending
  - id: cli-register-update
    content: Register update command in index.ts
    status: pending
  - id: boot-heartbeat-update
    content: Update BOOT.md and HEARTBEAT.md with git fetch checks for upstream changes
    status: pending
  - id: docs-updates-page
    content: Create apps/docs/deployment/updates.mdx covering all 4 user types and add to mint.json
    status: pending
isProject: false
---

# Update and Sync Workflow

## The Problem

Currently `npx blueprint-stack` clones the repo and **deletes `.git`**. Users get a snapshot with no way to receive future updates. There are 4 distinct user types who need updates:

| User Type           | How They Got the Repo       | Current Update Path                       |
| ------------------- | --------------------------- | ----------------------------------------- |
| **You (Allen)**     | Origin owner                | Push to GitHub, pull on VPS               |
| **Scaffolded user** | `npx blueprint-stack`       | None -- `.git` is removed                 |
| **Forked user**     | GitHub fork                 | `git fetch upstream` + merge              |
| **OpenClaw agent**  | Workspace symlinked to repo | `git pull` + `pnpm build` + `pm2 restart` |

## Solution: Three Parts

### Part 1: New CLI Command `blueprint-stack update`

A new command that pulls upstream Blueprint changes into a scaffolded project.

**How it works:**

1. On first run, adds the Blueprint repo as a remote called `blueprint-upstream`
2. Fetches the latest from upstream
3. Shows the user what changed (new files, modified files)
4. Lets them cherry-pick which changes to apply (structural updates like new packages, new rules, etc.)
5. Skips files they've customized (app-config, .env, SOUL.md, USER.md)

**Implementation approach:**

The `new` command currently removes `.git`. We change it to:

- Keep `.git` (don't delete it)
- Remove the `origin` remote (so it's not pointing at Allen's repo)
- Add `blueprint-upstream` remote pointing at `https://github.com/allenchuang/blueprint.git`
- The user's first `git remote add origin` sets their own repo

Then `blueprint-stack update` does:

```
git fetch blueprint-upstream main
git log HEAD..blueprint-upstream/main --oneline    # show what's new
git merge blueprint-upstream/main --no-commit      # merge without auto-commit
# User resolves conflicts if any
```

For existing users who already scaffolded (no `.git`), the `update` command detects this and:

1. Initializes git if needed
2. Adds the upstream remote
3. Fetches and shows a diff
4. Offers to apply changes file-by-file

**File:** [packages/blueprint-cli/src/commands/update.ts](packages/blueprint-cli/src/commands/update.ts)

**Also modify:** [packages/blueprint-cli/src/commands/new.ts](packages/blueprint-cli/src/commands/new.ts) -- stop removing `.git`, rename remote instead

### Part 2: OpenClaw Agent Auto-Update

The agent (running on a VPS with the workspace symlinked to the repo) can pull updates automatically. This is defined in two places:

**BOOT.md** (already created) -- add a git pull check:

```
On session start:
1. git fetch origin main
2. If behind, notify user: "Blueprint has X new commits. Run /update to apply."
```

**HEARTBEAT.md** (already created) -- add periodic check:

```
On heartbeat:
1. git fetch origin main --dry-run
2. If new commits, notify user via messaging channel
```

**Cron job** (OpenClaw config) -- optional auto-pull + rebuild:

```json5
{
  cron: {
    enabled: true,
    jobs: [
      {
        id: "blueprint-update-check",
        schedule: "0 */6 * * *", // every 6 hours
        prompt: "Check if the Blueprint repo has new commits on main. If yes, notify me via Telegram.",
      },
    ],
  },
}
```

### Part 3: Documentation

New docs page: [apps/docs/deployment/updates.mdx](apps/docs/deployment/updates.mdx)

Sections:

- **For repo owners** -- push workflow, VPS auto-pull, how changes propagate to running apps
- **For scaffolded users** -- `blueprint-stack update` command usage, what gets updated vs what's preserved
- **For forked users** -- standard git upstream sync workflow
- **For OpenClaw agents** -- auto-update via BOOT.md/HEARTBEAT.md/cron, manual update via messaging
- **Version pinning** -- how to stay on a specific Blueprint version if you don't want auto-updates
- **What's safe to customize** -- files that won't be overwritten (app-config, .env, SOUL.md, USER.md, TOOLS.md)
- **What gets updated** -- structural changes (new packages, new rules, new scripts, dependency bumps)

Also update: [apps/docs/extending/adding-an-app.mdx](apps/docs/extending/adding-an-app.mdx) -- mention that new apps added upstream will appear automatically after `blueprint-stack update`

## Files to Create/Modify

| File                                            | Action | Purpose                                        |
| ----------------------------------------------- | ------ | ---------------------------------------------- |
| `packages/blueprint-cli/src/commands/update.ts` | Create | CLI update command with upstream merge         |
| `packages/blueprint-cli/src/commands/new.ts`    | Modify | Keep .git, rename remote to blueprint-upstream |
| `packages/blueprint-cli/src/index.ts`           | Modify | Register update command                        |
| `BOOT.md`                                       | Modify | Add git fetch check on session start           |
| `HEARTBEAT.md`                                  | Modify | Add periodic upstream check                    |
| `apps/docs/deployment/updates.mdx`              | Create | Full update workflow documentation             |
| `apps/docs/mint.json`                           | Modify | Add updates page to Deployment nav             |

## Protected Files (Never Overwritten by Update)

These files are user-specific and should be excluded from upstream merges:

- `packages/app-config/src/config.ts` (user's branding)
- `packages/app-config/assets/` (user's logos)
- `.env` / `.env.` (user's secrets)
- `SOUL.md` (agent personality)
- `USER.md` (user identity)
- `TOOLS.md` (local tool notes)
- `BOOT.md` (customized startup)
- `HEARTBEAT.md` (customized health checks)
- `ecosystem.config.cjs` (PM2 config with local paths)

The update command should use a `.blueprint-protected` file (or a section in package.json) to list these patterns and auto-skip them during merge.
