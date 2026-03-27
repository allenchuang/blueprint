# Heartbeat

Periodic health check tasks. Run these on heartbeat:

1. `pm2 status` — verify all apps are online
2. `git status` — check for uncommitted changes or diverged branches
3. `df -h /` — check disk usage (warn if above 80%)
4. If any app is errored, attempt `pm2 restart <app>` and check logs
