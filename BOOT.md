# Boot

On session start, run through this checklist:

1. Read `SOUL.md`, `USER.md`, `TOOLS.md`
2. Read today's memory file if it exists: `memory/YYYY-MM-DD.md`
3. Read yesterday's memory file if it exists
4. Check git status: `git status` (are there uncommitted changes?)
5. Check PM2 status: `pm2 status` (are all apps running?)
6. If any app is errored or stopped, investigate with `pm2 logs <app> --lines 20`
