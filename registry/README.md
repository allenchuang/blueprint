# Blueprint Package Registry

This directory is the source of truth for all packages available in **BlueMart** — the Blueprint OS app store.

When a package is added here and merged to `allen/os`, it automatically appears in BlueMart and becomes installable via the Blueprint CLI.

```
registry/
├── index.json              # Master package list (BlueMart reads this)
└── packages/
    └── <package-id>/
        ├── manifest.json   # Package metadata (required)
        └── README.md       # Package docs (required)
```

---

## How to Contribute a Package

Anyone can submit a package to BlueMart. Here's the full process from start to PR.

### 1. Fork and clone

```bash
git clone https://github.com/allenchuang/blueprint.git
cd blueprint
git checkout allen/os
git checkout -b feat/registry-<your-package-id>
```

Replace `<your-package-id>` with your package's ID (lowercase kebab-case, e.g., `my-crm`).

### 2. Create your package directory

```bash
mkdir -p registry/packages/<your-id>
```

**ID rules:** lowercase, kebab-case, starts with a letter, 2–40 chars.
- ✅ `my-crm`, `git-agent`, `deploy-monitor`
- ❌ `MyCRM`, `my_crm`, `1-tool`

### 3. Write `manifest.json`

This is the required metadata file. Every field is documented in the table below.

```bash
touch registry/packages/<your-id>/manifest.json
```

Minimal example:

```json
{
  "id": "my-crm",
  "name": "My CRM",
  "version": "1.0.0",
  "description": "Track contacts and deals inside Blueprint OS.",
  "type": "app",
  "author": "your-github-username",
  "icon": "👥",
  "color": "#38BDF8",
  "tags": ["crm", "productivity"],
  "port": 3010,
  "license": "MIT",
  "installCommand": "blueprint install my-crm"
}
```

Full example with all optional fields:

```json
{
  "id": "my-crm",
  "name": "My CRM",
  "version": "1.0.0",
  "description": "Track contacts and deals inside Blueprint OS.",
  "type": "app",
  "author": "your-github-username",
  "icon": "👥",
  "color": "#38BDF8",
  "tags": ["crm", "sales", "productivity"],
  "port": 3010,
  "repository": "https://github.com/you/blueprint-crm",
  "license": "MIT",
  "installCommand": "blueprint install my-crm",
  "downloads": 0,
  "updatedAt": "2026-03-28",
  "blueprint": {
    "minVersion": "0.1.0",
    "files": ["apps/my-crm/"],
    "envVars": ["DATABASE_URL"],
    "dependencies": [],
    "dbSchema": true
  }
}
```

#### Manifest field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Unique identifier. Lowercase kebab-case. Used in `blueprint install <id>`. |
| `name` | `string` | ✅ | Display name shown in BlueMart (Title Case, max 40 chars). |
| `version` | `string` | ✅ | Semantic version string: `"1.0.0"`. |
| `description` | `string` | ✅ | 1–2 sentences shown on the card and detail page. |
| `type` | `"app" \| "agent" \| "skill" \| "stack"` | ✅ | Package type — see [Package Types](#package-types) below. |
| `author` | `string` | ✅ | Your GitHub username or org. |
| `icon` | `string` | optional | Emoji for the package icon (e.g., `"👥"`). Falls back to `"📦"`. |
| `color` | `string` | optional | Hex color to tint the icon background (e.g., `"#38BDF8"`). |
| `tags` | `string[]` | optional | Lowercase tags for filtering and search in BlueMart. |
| `port` | `number` | optional | Port the app listens on. **Required for `type: "app"`**. See [Port Assignment](#port-assignment). |
| `repository` | `string` | optional | Source code URL. |
| `license` | `string` | optional | SPDX license identifier (default: `"MIT"`). |
| `installCommand` | `string` | optional | Custom install command shown in UI. Defaults to `blueprint install <id>`. |
| `downloads` | `number` | optional | Install count (maintained by registry maintainers post-merge). |
| `updatedAt` | `string` | optional | ISO date of last significant update (`"2026-03-28"`). |
| `blueprint.minVersion` | `string` | optional | Minimum Blueprint OS version required to install. |
| `blueprint.files` | `string[]` | optional | Paths scaffolded by the installer (informational, shown on detail page). |
| `blueprint.envVars` | `string[]` | optional | Env vars the package needs (shown as warnings in BlueMart). |
| `blueprint.dependencies` | `string[]` | optional | Other Blueprint package IDs this package depends on. |
| `blueprint.dbSchema` | `boolean` | optional | If `true`, installer runs `pnpm db:push` after scaffolding. |

### 4. Write `README.md` for your package

```bash
touch registry/packages/<your-id>/README.md
```

Your package README should include:
- What the package does (2–3 sentences)
- Screenshots or GIFs (link to external URLs — don't commit large files)
- How to configure it after installing
- Any known limitations or caveats

### 5. Add your entry to `registry/index.json`

Open `registry/index.json` and add your package to the `packages` array:

```json
{
  "packages": [
    {
      "id": "my-crm",
      "name": "My CRM",
      "version": "1.0.0",
      "description": "Track contacts and deals inside Blueprint OS.",
      "type": "app",
      "author": "your-github-username",
      "icon": "👥",
      "color": "#38BDF8",
      "tags": ["crm", "productivity"],
      "port": 3010,
      "installCommand": "blueprint install my-crm",
      "downloads": 0,
      "updatedAt": "2026-03-28"
    }
  ]
}
```

Keep the array alphabetically sorted by `id` if possible.

### 6. Commit and open a PR

```bash
git add registry/packages/<your-id>/ registry/index.json
git commit -m "feat(registry): add <your-package-name>"
git push origin feat/registry-<your-id>
```

Open a PR on GitHub:
- **Target:** `allenchuang/blueprint` → `allen/os`
- **Title:** `feat(registry): add <package-name>`
- **Description:** Brief explanation of what the package does and a link to its source repo

### 7. Review and merge

A maintainer will review your PR. Common reasons for changes:
- ID is not unique or doesn't follow naming conventions
- Port conflicts with a reserved port
- Missing required manifest fields
- `index.json` entry is missing or malformed

Once approved and merged to `allen/os`, your package is live in BlueMart on the next deploy.

---

## Package Types

| Type | When to use | What it installs |
|---|---|---|
| `app` | You have a full UI that should appear as a window in Blueprint OS | A Next.js app with its own port, PM2 process, and Caddy route |
| `agent` | You're building an AI agent that runs inside OpenClaw | An OpenClaw agent config + SOUL.md + tool definitions |
| `skill` | You're adding a reusable capability to existing agents | A `SKILL.md` file and optional scripts in `~/.openclaw/workspace/skills/` |
| `stack` | You want to bundle multiple packages together | A meta-package that triggers installing multiple other packages |

---

## Port Assignment

Apps must declare a unique port. Reserved ports:

| Port | Reserved for |
|---|---|
| 3000 | `web` |
| 3001 | `server` |
| 3002 | `admin` |
| 3003 | `docs` |
| 3004 | `remotion` |
| 3008 | `store` (BlueMart) |
| 3100 | `paperclip` |
| 7777 | `os` |
| 7778 | `clawdash` |

**Available range for community packages: 3006–3099, 3101–3999**

Check `packages/app-config/src/apps-registry.ts` to confirm a port isn't already taken before submitting.

---

## Naming Conventions

### Package ID

- Lowercase kebab-case: `[a-z][a-z0-9-]*[a-z0-9]`
- 2–40 characters
- Must be globally unique in the registry
- ✅ `crm`, `git-agent`, `deploy-monitor-v2`
- ❌ `CRM`, `git_agent`, `-crm`, `crm-`

### Package Name

- Title Case, human-readable
- Max 40 characters
- ✅ `"Blueprint CRM"`, `"Git Agent"`, `"Deploy Monitor"`
- ❌ `"blueprint-crm"`, `"THE CRM APP"`, `"a crm"`

---

## Updating an Existing Package

To release a new version of your package:

1. Update `version` in your `manifest.json`
2. Update `updatedAt` to today's date
3. Update the matching entry in `registry/index.json`
4. Update your package `README.md` if needed
5. Open a PR: `chore(registry): bump <package-id> to vX.Y.Z`

---

## Questions?

Open an issue on [GitHub](https://github.com/allenchuang/blueprint) or reach out via the Blueprint OS community channels.
