# Blueprint OS — Shared Storage

Runtime data files used by agents and the server. **Not committed to git.**

## Structure

- `skylar/post-suggestions.json` — Skylar's queued post suggestions
- `skylar/growth-activity.json` — growth activity log (Reddit, X, etc.)
- `skylar/industry-brief.md` — daily industry research brief (markdown)

## Usage

Server routes and agents read/write these files directly via the filesystem.
The path can be overridden with the `BLUEPRINT_STORAGE_PATH` env var (defaults
to `/home/deploy/repos/blueprint/storage`).

## Setup

On a fresh deployment, create the directories and seed empty data files:

```bash
mkdir -p storage/skylar
echo '[]' > storage/skylar/post-suggestions.json
echo '[]' > storage/skylar/growth-activity.json
```
