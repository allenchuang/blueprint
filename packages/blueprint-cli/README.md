# blueprint-stack

CLI to scaffold and manage [Blueprint](https://github.com/allenchuang/blueprint) monorepo projects.

```bash
npx blueprint-stack
```

## Prerequisites

- **Node.js** >= 23 — Blueprint projects require Node.js v23+
- **nvm** (recommended) — [install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node versions
- **pnpm** >= 10 — [install pnpm](https://pnpm.io/installation) (`corepack enable && corepack prepare pnpm@latest --activate`)

> **Note:** The CLI itself runs on Node >= 18, but the scaffolded project requires Node >= 23. If your current version is too old, the CLI will detect this and help you install the right version via nvm.

### Quick Node setup

```bash
# Install nvm (if you don't have it)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Install Node 23+
nvm install 23
nvm use 23
```

## Install

No installation required — use `npx` to run directly. Or install globally:

```bash
npm i -g blueprint-stack
```

## Commands

### `blueprint-stack new <project-name>`

Scaffolds a new Blueprint monorepo project:

1. Clones the [Blueprint repo](https://github.com/allenchuang/blueprint) into `./<project-name>`
2. Removes git history (clean start)
3. **Prompts for app config** — prefills `packages/app-config/src/config.ts` with your branding
4. Prompts for `DATABASE_URL` and writes `.env`
5. Runs `pnpm install`
6. Initializes a fresh git repo with an initial commit

```bash
npx blueprint-stack new my-saas
```

#### App Config Setup

During `blueprint-stack new`, the CLI prompts for the following branding fields and writes them directly to `packages/app-config/src/config.ts`:

| Prompt              | Field               | Example                                |
| ------------------- | ------------------- | -------------------------------------- |
| App name            | `name`              | `"Acme"`                               |
| App slug            | `slug`              | `"acme"`                               |
| Short description   | `description`       | `"Build your next big thing"`          |
| Tagline / slogan    | `slogan`            | `"Ship ideas at the speed of thought"` |
| Primary brand color | `colors.primary`    | `"#0D9373"`                            |
| Website URL         | `urls.website`      | `"https://acme.com"`                   |
| Support email       | `urls.supportEmail` | `"support@acme.com"`                   |
| GitHub URL          | `socials.github`    | `"https://github.com/acme"`            |

The resulting `config.ts` structure:

```ts
export const appConfig = {
  name: "Acme",
  slug: "acme",
  description: "Build your next big thing",
  slogan: "Ship ideas at the speed of thought",
  version: "0.1.0",

  colors: {
    primary: "#0D9373",
  },

  urls: {
    website: "https://acme.com",
    api: "http://localhost:3001",
    docs: "https://docs.acme.com",
    supportEmail: "support@acme.com",
  },

  mobile: {
    bundleId: "com.acme.app",
    scheme: "acme",
  },

  socials: {
    github: "https://github.com/acme",
  },
};
```

After scaffolding (or any time you edit the config), run:

```bash
pnpm sync-config
```

This propagates branding everywhere: generates Tailwind theme CSS, patches `app.json` for React Native, updates `mint.json` for docs, and copies logo/icon assets to all apps.

### Workspace Commands

When inside an existing Blueprint project, the CLI proxies to root-level pnpm scripts. It auto-detects the monorepo root by walking up directories looking for `pnpm-workspace.yaml` + `turbo.json`.

| Command                        | Proxies to          |
| ------------------------------ | ------------------- |
| `blueprint-stack dev`          | `pnpm dev`          |
| `blueprint-stack dev:web`      | `pnpm dev:web`      |
| `blueprint-stack dev:admin`    | `pnpm dev:admin`    |
| `blueprint-stack dev:server`   | `pnpm dev:server`   |
| `blueprint-stack dev:docs`     | `pnpm dev:docs`     |
| `blueprint-stack dev:remotion` | `pnpm dev:remotion` |
| `blueprint-stack build`        | `pnpm build`        |
| `blueprint-stack lint`         | `pnpm lint`         |
| `blueprint-stack check-types`  | `pnpm check-types`  |
| `blueprint-stack sync-config`  | `pnpm sync-config`  |
| `blueprint-stack db:generate`  | `pnpm db:generate`  |
| `blueprint-stack db:migrate`   | `pnpm db:migrate`   |
| `blueprint-stack db:push`      | `pnpm db:push`      |
| `blueprint-stack db:studio`    | `pnpm db:studio`    |

## Development

### Project structure

```
packages/blueprint-cli/
├── src/
│   ├── index.ts              CLI entry point (commander setup)
│   ├── commands/
│   │   ├── new.ts            Scaffold a new project
│   │   └── run.ts            Proxy workspace commands
│   └── utils/
│       └── detect-root.ts    Find monorepo root from cwd
├── dist/                     Compiled output (gitignored)
├── release.sh                Release script (creates tarball + publishes)
├── .npmrc                    npm auth token (gitignored)
├── .npmignore                Files excluded from published package
├── .gitignore
├── tsconfig.json
└── package.json
```

### Building

```bash
pnpm build       # compile TypeScript to dist/
pnpm dev         # watch mode
```

### Publishing a new version

From the repo root:

| Command                     | Version bump | Example              |
| --------------------------- | ------------ | -------------------- |
| `npm run release:cli`       | Patch        | `0.1.12` -> `0.1.13` |
| `npm run release:cli:minor` | Minor        | `0.1.13` -> `0.2.0`  |
| `npm run release:cli:major` | Major        | `0.2.0` -> `1.0.0`   |

Or from `packages/blueprint-cli` directly:

```bash
npm run release
```

Each command:

1. Bumps the version in `package.json`
2. Compiles TypeScript with `tsc`
3. Creates a tarball with `tar` (see note below)
4. Publishes the tarball to npm

### npm auth setup

The release script reads the npm auth token from `.npmrc` (gitignored). To set it up:

1. Create a granular access token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
   - Permissions: Read and write
   - Packages: `blueprint-stack`
2. Create `packages/blueprint-cli/.npmrc`:

```
//registry.npmjs.org/:_authToken=npm_YOUR_TOKEN_HERE
```

### Why `release.sh` uses `tar` instead of `npm pack`

There is a known bug where `npm pack` corrupts directory names (e.g. `dist/` becomes `ist/`) when run inside a pnpm workspace. The pnpm workspace resolver injects `file:` protocol resolution into npm's tarball creation, stripping the first character from directory paths. This happens regardless of npm version or working directory.

The workaround in `release.sh` bypasses `npm pack` entirely by creating the tarball manually with `tar`, then passing the pre-built `.tgz` file to `npm publish`. This is reliable across all npm versions and pnpm workspace configurations.
