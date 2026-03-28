# Blueprint App Store — Registry

This directory is the **source of truth** for all Blueprint apps available via `blueprint install`.

## Structure

```
registry/
├── index.json           ← Master package list (auto-read by CLI)
├── README.md            ← This file
└── packages/
    ├── crm/
    │   ├── manifest.json
    │   └── README.md
    ├── pulse/
    │   ├── manifest.json
    │   └── README.md
    └── support/
        ├── manifest.json
        └── README.md
```

## Installing a Package

```bash
blueprint install crm
blueprint install pulse
blueprint install support
```

To see all available packages:

```bash
blueprint list
```

## How to Contribute a Package

1. **Fork** the Blueprint repo and create a branch: `registry/your-package-name`

2. **Create the package directory:**

   ```
   registry/packages/your-package/
   ├── manifest.json
   └── README.md
   ```

3. **Write `manifest.json`** following this schema:

   ```json
   {
     "id": "your-package",
     "name": "Your Package Name",
     "version": "0.1.0",
     "type": "app",
     "description": "What it does in one sentence.",
     "port": 3010,
     "appType": "nextjs",
     "icon": "icon-name",
     "color": "teal",
     "subdomain": "your-package",
     "envVars": ["REQUIRED_ENV_VAR"],
     "dependencies": [],
     "postInstall": "pnpm install"
   }
   ```

   **Port guidelines:** Use 3005–3099 for community apps (3005–3007 are first-party).

4. **Add your entry to `registry/index.json`** in the `packages` array.

5. **Write a clear `README.md`** explaining what the app does, how to configure it, and any env vars needed.

6. **Open a PR** targeting `allen/os` with the title: `registry(your-package): add <Package Name>`.

## Package Manifest Fields

| Field          | Required | Description                                      |
|----------------|----------|--------------------------------------------------|
| `id`           | ✅       | Unique kebab-case identifier                     |
| `name`         | ✅       | Human-readable name                              |
| `version`      | ✅       | SemVer string                                    |
| `type`         | ✅       | Always `"app"` for now                           |
| `description`  | ✅       | One-line description                             |
| `port`         | ✅       | Local dev port (must be unique)                  |
| `appType`      | ✅       | `nextjs` \| `fastify` \| `standalone`            |
| `icon`         | ✅       | Lucide icon name                                 |
| `color`        | ✅       | Tailwind color name                              |
| `subdomain`    | ✅       | Caddy subdomain for production                   |
| `envVars`      |          | Required env variable names (array of strings)   |
| `dependencies` |          | Other package IDs this depends on                |
| `postInstall`  |          | Shell command to run after scaffolding           |

## First-Party Packages

| Package           | Port | Description                                  |
|-------------------|------|----------------------------------------------|
| `blueprint-crm`   | 3005 | Customer pipeline with agent-powered follow-ups |
| `blueprint-pulse` | 3006 | CEO-view KPI dashboard                       |
| `blueprint-support`| 3007 | AI-first support inbox                      |
