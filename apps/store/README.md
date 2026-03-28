# BlueMart — Blueprint App Store

**BlueMart** is the visual storefront for Blueprint OS. Browse, discover, and install apps, agents, and skills directly into your Blueprint OS environment with a single command.

> Running locally at **http://localhost:3008** · Production: `store.yourdomain.com`

---

## What is BlueMart?

Blueprint OS is a full-stack developer environment. BlueMart is its package registry UI — the place where:

- **Apps** — full Next.js applications (CRM, analytics, notes, etc.) are listed and installed
- **Agents** — AI agents (coding assistants, email agents, deploy monitors) are distributed
- **Skills** — reusable capability modules for OpenClaw agents (weather, git, web search, etc.) are shared

Think of it as **npm meets the App Store**, but everything installs directly into your running Blueprint OS instance.

---

## Installing a Package

### 1. List available packages

```bash
blueprint list
```

This fetches the registry index and prints all available packages with their IDs, types, and descriptions.

### 2. Install a package

```bash
blueprint install <package-id>
```

**Example:**

```bash
blueprint install crm
```

The CLI will:
1. Scaffold the app/agent/skill into the correct directory
2. Register it in `packages/app-config/src/apps-registry.ts`
3. Add the PM2 process entry to `ecosystem.config.cjs`
4. Run `pnpm install` and `pnpm db:push` (if the package has DB schema)
5. Print the port and next steps

### 3. Restart Blueprint OS

After installing an app:

```bash
pm2 restart all
```

Or restart just the new app:

```bash
pm2 restart <app-id>
```

### 4. Open the app

Apps are available in the Blueprint OS desktop at their assigned port. The CLI prints the URL after installation.

---

## Adding Your Package to the Registry

Anyone can submit a package to BlueMart. The registry lives in the Blueprint repo at `registry/`.

### Step-by-step

#### 1. Fork and clone the repo

```bash
git clone https://github.com/allenchuang/blueprint.git
cd blueprint
git checkout allen/os
git checkout -b feat/registry-your-package-id
```

#### 2. Create your package directory

```bash
mkdir -p registry/packages/<your-id>
```

Package IDs must be **lowercase kebab-case** (e.g., `my-crm`, `git-agent`, `weather-skill`). No spaces, no uppercase.

#### 3. Write `manifest.json`

```bash
touch registry/packages/<your-id>/manifest.json
```

Full example:

```json
{
  "id": "my-crm",
  "name": "My CRM",
  "version": "1.0.0",
  "description": "A lightweight CRM for tracking contacts and deals inside Blueprint OS.",
  "type": "app",
  "author": "your-github-username",
  "icon": "👥",
  "color": "#38BDF8",
  "tags": ["crm", "sales", "productivity"],
  "port": 3010,
  "repository": "https://github.com/your-username/blueprint-crm",
  "license": "MIT",
  "installCommand": "blueprint install my-crm",
  "blueprint": {
    "minVersion": "0.1.0",
    "files": [
      "apps/my-crm/"
    ],
    "envVars": [
      "DATABASE_URL"
    ],
    "dependencies": [],
    "dbSchema": true
  }
}
```

See the [Manifest Schema](#manifest-schema) section below for every field.

#### 4. Write `README.md` for your package

```bash
touch registry/packages/<your-id>/README.md
```

Your package README should cover:
- What the package does
- Screenshots or GIFs (link to external URLs)
- Configuration options
- Known limitations

#### 5. Update `registry/index.json`

Add your package entry to the registry index:

```bash
# registry/index.json
{
  "packages": [
    ...existing entries...,
    {
      "id": "my-crm",
      "name": "My CRM",
      "version": "1.0.0",
      "description": "A lightweight CRM for tracking contacts and deals.",
      "type": "app",
      "author": "your-github-username",
      "icon": "👥",
      "color": "#38BDF8",
      "tags": ["crm", "sales"],
      "port": 3010,
      "installCommand": "blueprint install my-crm",
      "downloads": 0
    }
  ]
}
```

#### 6. Open a PR

```bash
git add registry/packages/<your-id>/ registry/index.json
git commit -m "feat(registry): add my-crm package"
git push origin feat/registry-your-package-id
```

Open a PR on GitHub targeting **`allenchuang/blueprint`** → **`allen/os`** branch.

PR title format: `feat(registry): add <package-name>`

#### 7. Once merged → live in BlueMart

After your PR is merged to `allen/os`, your package will appear in BlueMart on the next deploy. No further action needed.

---

## Manifest Schema

Every package must have a `manifest.json` in its registry directory. Here is the full schema:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Unique package identifier. Lowercase kebab-case. Used in `blueprint install <id>`. |
| `name` | `string` | ✅ | Human-readable display name shown in BlueMart. |
| `version` | `string` | ✅ | Semantic version (`major.minor.patch`). |
| `description` | `string` | ✅ | One or two sentence description shown on the card and detail page. |
| `type` | `"app" \| "agent" \| "skill" \| "stack"` | ✅ | Package type. See [Package Types](#package-types) below. |
| `author` | `string` | ✅ | Your GitHub username or org name. |
| `icon` | `string` | optional | Emoji used as the package icon in BlueMart (e.g., `"👥"`). |
| `color` | `string` | optional | Hex color used to tint the icon background (e.g., `"#38BDF8"`). |
| `tags` | `string[]` | optional | Array of lowercase tags used for filtering and search. |
| `port` | `number` | optional | Port the app runs on. Required for `type: "app"`. See [Port Assignment](#port-assignment). |
| `repository` | `string` | optional | URL to the package's source code repo. |
| `license` | `string` | optional | License identifier (e.g., `"MIT"`, `"Apache-2.0"`). Defaults to `"MIT"`. |
| `installCommand` | `string` | optional | Overrides the default `blueprint install <id>` command shown in the UI. |
| `downloads` | `number` | optional | Install count shown in BlueMart (maintained by registry maintainers). |
| `updatedAt` | `string` | optional | ISO date of last update (`"2026-03-15"`). |
| `blueprint.minVersion` | `string` | optional | Minimum Blueprint OS version required. |
| `blueprint.files` | `string[]` | optional | List of paths scaffolded by the installer (for documentation purposes). |
| `blueprint.envVars` | `string[]` | optional | Environment variables the package requires. |
| `blueprint.dependencies` | `string[]` | optional | Other Blueprint package IDs this package depends on. |
| `blueprint.dbSchema` | `boolean` | optional | If `true`, the installer runs `pnpm db:push` after scaffolding. |

---

## Package Types

| Type | What it is | Example |
|---|---|---|
| `app` | A full Next.js application that runs as a window in Blueprint OS. Has its own port, PM2 process, and Caddy route. | CRM, Notes, Analytics Dashboard |
| `agent` | An AI agent that runs inside OpenClaw. Responds to messages, heartbeats, and can control other tools. | Codex Agent, Email Agent, Deploy Monitor |
| `skill` | A reusable capability module for OpenClaw agents. A `SKILL.md` file that agents read to acquire a new ability. | Weather, Git operations, Web search |
| `stack` | A bundle of multiple packages installed together. | `blueprint install saas-starter` installs web + server + auth |

**Choosing the right type:**

- Building a UI that lives in the OS desktop? → `app`
- Building an autonomous AI that does work? → `agent`
- Adding a capability to an existing agent? → `skill`
- Bundling several things together? → `stack`

---

## Port Assignment

Every `app` package needs a unique port. Blueprint OS has reserved ports for its core apps:

| Port | App |
|---|---|
| 3000 | `web` — Main web app |
| 3001 | `server` — API server (Fastify) |
| 3002 | `admin` — Admin panel |
| 3003 | `docs` — Mintlify documentation |
| 3004 | `remotion` — Video generation |
| 3005 | _(reserved)_ |
| 3006–3099 | **Available for community packages** |
| 3100 | `paperclip` — Task management |
| 7777 | `os` — Blueprint OS desktop |
| 7778 | `clawdash` — OpenClaw diagnostics |
| 3008 | `store` — BlueMart (this app) |

**Rules for picking a port:**
1. Pick any port in the **3006–3099** range that isn't listed above
2. Check `packages/app-config/src/apps-registry.ts` to confirm the port isn't taken
3. Include the port in your `manifest.json` under `"port"`
4. If your preferred port is taken, increment by 1 until you find a free one
5. Do not use ports below 3000 or above 9999

---

## Naming Conventions

### Package ID (`id` field)

- **Format:** lowercase kebab-case only
- **Length:** 2–40 characters
- **Pattern:** `[a-z][a-z0-9-]*[a-z0-9]`
- ✅ Good: `my-crm`, `git-agent`, `weather-skill`, `deploy-monitor`
- ❌ Bad: `MyCRM`, `my_crm`, `my crm`, `-crm`, `crm-`

### Package Name (`name` field)

- Title case, human-readable
- Max 40 characters
- ✅ Good: `"My CRM"`, `"Git Agent"`, `"Weather Skill"`
- ❌ Bad: `"my-crm"`, `"MY CRM"`, `"a crm app for blueprint os that does sales"`

### File naming (inside your package)

Follow Blueprint OS conventions:
- **Files:** kebab-case (`user-profile.tsx`, `get-users.ts`)
- **Components:** PascalCase (`UserProfile`, `DataTable`)
- **Hooks:** camelCase with `use` prefix (`useGetUsers`)

---

## Development

To run BlueMart locally:

```bash
# From the repo root
pnpm dev:store

# Or directly
cd apps/store
pnpm dev
```

Open [http://localhost:3008](http://localhost:3008).

### Adding BlueMart to PM2

In `ecosystem.config.cjs`, add:

```js
{
  name: "store",
  script: "node_modules/.bin/next",
  args: "start",
  cwd: "./apps/store",
  env: { PORT: "3008", NODE_ENV: "production" },
}
```

---

## Architecture

```
apps/store/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — fonts, ThemeProvider
│   │   ├── page.tsx                # Main store page (hero + package grid)
│   │   ├── globals.css             # Global styles + CSS variable overrides
│   │   ├── theme.css               # Generated by pnpm sync-config (do not edit)
│   │   └── packages/[id]/
│   │       └── page.tsx            # Package detail page
│   ├── components/
│   │   ├── theme-provider.tsx      # next-themes wrapper
│   │   ├── theme-toggle.tsx        # Sun/moon toggle button
│   │   ├── store-nav.tsx           # Sticky nav with brand + theme toggle
│   │   ├── store-footer.tsx        # Footer with links
│   │   ├── store-browser.tsx       # Search + filter + grid (client)
│   │   ├── package-card.tsx        # Individual package card (client)
│   │   ├── install-button.tsx      # Big copy-to-clipboard install button
│   │   └── copy-inline.tsx         # Inline copy button for code blocks
│   └── lib/
│       ├── utils.ts                # cn() helper
│       └── registry.ts             # Registry loader (reads index.json or fallback)
└── registry/                       # Symlink or relative path to repo-root registry/
```

Registry data is read from `registry/index.json` at the repo root. If that file doesn't exist, BlueMart falls back to a set of demo packages so the UI always has something to show.
