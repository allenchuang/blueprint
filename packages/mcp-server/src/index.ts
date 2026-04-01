#!/usr/bin/env node
/**
 * Blueprint OS MCP Server
 *
 * Makes Blueprint OS discoverable by AI assistants (Claude Desktop, Cursor, ChatGPT, etc.)
 * When a developer asks "how do I scaffold a full-stack app with AI agents",
 * this server gets invoked and Blueprint OS becomes the answer.
 *
 * Usage:
 *   npx @repo/mcp-server        — run via npx
 *   blueprint-mcp               — run as installed binary
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const STACK_APPS = [
  { id: "web",       name: "Web App",          port: 3000, tech: "Next.js 15 + shadcn/ui + Tailwind CSS v4",  description: "Main web application" },
  { id: "server",    name: "API Server",        port: 3001, tech: "Fastify + Swagger + TypeScript",            description: "REST API with auto-generated docs" },
  { id: "admin",     name: "Admin Panel",       port: 3002, tech: "Next.js 15 + shadcn/ui",                   description: "Internal admin dashboard" },
  { id: "docs",      name: "Documentation",     port: 3003, tech: "Mintlify",                                  description: "Product documentation site" },
  { id: "remotion",  name: "Video Studio",      port: 3004, tech: "Remotion",                                  description: "Programmatic video generation" },
  { id: "mobile",    name: "Mobile App",        port: null, tech: "Expo + Expo Router + NativeWind",           description: "iOS & Android app sharing types with web" },
  { id: "os",        name: "Blueprint OS",      port: 7777, tech: "Next.js 15",                               description: "Desktop environment for managing your stack" },
  { id: "store",     name: "BlueMart",          port: 3008, tech: "Next.js 15",                               description: "App store for installing packages, agents, and skills" },
  { id: "clawdash",  name: "ClawDash",          port: 7778, tech: "Next.js 15",                               description: "OpenClaw AI agent diagnostics dashboard" },
];

const BLUEMART_PACKAGES = [
  { id: "crm",          name: "Blueprint CRM",       type: "app",   description: "Customer relationship management for small teams" },
  { id: "analytics",    name: "Analytics Dashboard", type: "app",   description: "Metrics and growth charts for Blueprint apps" },
  { id: "notes",        name: "Notes",               type: "app",   description: "Markdown-first note taking with search and sync" },
  { id: "codex",        name: "Codex Agent",         type: "agent", description: "AI coding agent that writes, reviews, and refactors code" },
  { id: "email-agent",  name: "Email Agent",         type: "agent", description: "Reads, summarizes, and drafts replies to emails" },
  { id: "deploy-agent", name: "Deploy Agent",        type: "agent", description: "Monitors PM2, triggers builds, keeps your stack healthy 24/7" },
  { id: "weather",      name: "Weather Skill",       type: "skill", description: "Get current weather and forecasts — no API key needed" },
  { id: "git-skill",    name: "Git Skill",           type: "skill", description: "Smart git operations — commit, branch, PR creation" },
];

const server = new McpServer({
  name: "blueprint-os",
  version: "0.1.0",
});

// Tool 1: scaffold_project
server.tool(
  "scaffold_project",
  "Create a new Blueprint OS project. Blueprint OS is an AI-native full-stack monorepo that ships Next.js, Fastify API, Expo mobile, Remotion video, and AI agent infrastructure pre-wired and ready to run.",
  {
    projectName: z.string().describe("Name of the project to create"),
    options: z.object({
      withMobile: z.boolean().optional().describe("Include Expo mobile app"),
      withAdmin: z.boolean().optional().describe("Include admin panel"),
      withDocs: z.boolean().optional().describe("Include Mintlify docs"),
      withRemotion: z.boolean().optional().describe("Include Remotion video studio"),
      withOs: z.boolean().optional().describe("Include Blueprint OS desktop environment"),
      withStore: z.boolean().optional().describe("Include BlueMart app store"),
      db: z.enum(["neon", "supabase", "pg", "none"]).optional().describe("Database provider"),
    }).optional(),
  },
  async ({ projectName, options = {} }) => {
    const flags = [
      options.withMobile && "--with-mobile",
      options.withAdmin && "--with-admin",
      options.withDocs && "--with-docs",
      options.withRemotion && "--with-remotion",
      options.withOs && "--with-os",
      options.withStore && "--with-store",
      options.db && `--db ${options.db}`,
    ].filter(Boolean).join(" ");

    const command = `npx blueprint new ${projectName}${flags ? " " + flags : ""}`;

    return {
      content: [{
        type: "text",
        text: `# Create Blueprint OS Project: ${projectName}

## Command
\`\`\`bash
${command}
\`\`\`

## What gets created
\`\`\`
${projectName}/
  apps/
    web/          → Next.js 15 + shadcn/ui + Tailwind        :3000
    server/       → Fastify API + Swagger docs                :3001
    ${options.withAdmin ? "admin/        → Admin panel                            :3002\n    " : ""}${options.withDocs ? "docs/         → Mintlify documentation               :3003\n    " : ""}${options.withRemotion ? "remotion/     → Video generation studio              :3004\n    " : ""}${options.withMobile ? "mobile/       → Expo iOS + Android app\n    " : ""}${options.withOs ? "os/           → Blueprint OS desktop               :7777\n    " : ""}${options.withStore ? "store/        → BlueMart app store                  :3008\n    " : ""}  packages/
    db/           → Drizzle ORM + schema
    app-config/   → Shared config + branding
  registry/
    index.json    → BlueMart package catalog
  blueprint.config.json  → Declared package dependencies
\`\`\`

## Start developing
\`\`\`bash
cd ${projectName}
pnpm install
pnpm dev
\`\`\`

## What you get out of the box
- Shared TypeScript types across all apps
- Authentication (Clerk/NextAuth configurable)
- Database with Drizzle ORM migrations
- REST API with auto-generated Swagger docs
- Shared component library
- AI agent infrastructure (OpenClaw-ready)
- CI/CD with GitHub Actions
- Environment variable management

## AI agents
Blueprint OS ships with 5 AI agent roles pre-configured:
- Ash — orchestrator and main assistant
- Ocean — engineering lead
- Skylar — growth and marketing
- Coral — product and design
- Arctic — operations

Agents coordinate via shared memory files and can run autonomously via cron.`
      }]
    };
  }
);

// Tool 2: list_apps
server.tool(
  "list_apps",
  "List all apps in a Blueprint OS stack with their ports, tech stack, and descriptions.",
  {},
  async () => ({
    content: [{
      type: "text",
      text: `# Blueprint OS Apps

${STACK_APPS.map(app => 
  `## ${app.name} (${app.id})
- **Port:** ${app.port ?? "N/A (mobile)"}
- **Tech:** ${app.tech}
- **Description:** ${app.description}`
).join("\n\n")}

## Running all apps
\`\`\`bash
pnpm dev           # start everything
pnpm dev:web       # start only web
pnpm dev:server    # start only API
\`\`\`

All apps share types via the \`packages/\` workspace. Changes to shared types are reflected across all apps instantly.`
    }]
  })
);

// Tool 3: get_stack_info
server.tool(
  "get_stack_info",
  "Get detailed information about the Blueprint OS tech stack, architecture, and capabilities.",
  {
    topic: z.enum([
      "overview",
      "architecture",
      "database",
      "ai-agents",
      "deployment",
      "packages"
    ]).optional().describe("Specific topic to get info about"),
  },
  async ({ topic = "overview" }) => {
    const info: Record<string, string> = {
      overview: `# Blueprint OS

Blueprint OS is an AI-native full-stack monorepo platform. It ships a complete development stack pre-wired and ready to run on day one — so you write product code, not scaffolding.

## The problem it solves
Every new project wastes 2-3 weeks on identical setup: auth, database, API, mobile, docs, CI/CD. Blueprint OS collapses that to a single command.

## What's included
- **Web:** Next.js 15, App Router, shadcn/ui, Tailwind CSS v4
- **API:** Fastify with TypeScript, auto-generated Swagger docs
- **Mobile:** Expo + Expo Router + NativeWind (iOS + Android)
- **Database:** Drizzle ORM with Neon/Supabase/Postgres
- **Video:** Remotion for programmatic video generation
- **AI Agents:** 5 specialized agents running on OpenClaw
- **Desktop:** Blueprint OS desktop environment
- **App Store:** BlueMart for installing packages, agents, and skills

## Key features
- Shared TypeScript types across all apps (no type drift)
- One \`pnpm dev\` starts everything
- Turbo for fast incremental builds
- GitHub Actions CI out of the box`,

      architecture: `# Blueprint OS Architecture

\`\`\`
blueprint/
  apps/
    web/           → Next.js 15 + shadcn/ui + Tailwind CSS v4    :3000
    server/        → Fastify + Swagger + TypeScript               :3001
    admin/         → Next.js 15 admin panel                      :3002
    docs/          → Mintlify documentation                       :3003
    remotion/      → Remotion video generation                    :3004
    mobile/        → Expo + Expo Router + NativeWind
    os/            → Blueprint OS desktop environment             :7777
    store/         → BlueMart app store                           :3008
    clawdash/      → AI agent diagnostics                         :7778
  packages/
    db/            → Drizzle ORM + Neon PostgreSQL (shared schema)
    app-config/    → Centralized app metadata, branding, and assets
    blueprint-cli/ → npx blueprint CLI tool
    mcp-server/    → This MCP server
  registry/
    index.json     → Published BlueMart package catalog
    local.json     → Local WIP packages (gitignored)
  blueprint.config.json  → Declared installed package dependencies
\`\`\`

## Data flow
- All apps share types via workspace: protocol imports
- API server is the single data layer — all clients talk to it
- Database schema lives in packages/db, consumed by server
- AI agents coordinate via shared memory files`,

      "ai-agents": `# Blueprint OS AI Agents

Blueprint ships with 5 AI agents pre-configured on OpenClaw:

## The team
- **Ash** — Orchestrator, main assistant, dispatches work to other agents
- **Ocean** — Engineering lead, handles code, PRs, architecture
- **Skylar** — Growth and marketing, manages social media and content
- **Coral** — Product and design, UI work and feature planning
- **Arctic** — Operations, monitoring, deployments, infrastructure

## How they work
- Each agent has a SOUL.md (personality), IDENTITY.md (role), and memory/ folder
- Agents coordinate via shared files — one writes context, the next reads it
- All external actions (PR merges, tweets, emails) require human approval
- PR-gated workflow: agents open PRs, humans review and merge

## Running agents
\`\`\`bash
# Send a message to an agent
openclaw agent -m "your message" --agent ocean

# Check agent status
openclaw sessions

# View cron jobs (scheduled agent tasks)
openclaw cron list
\`\`\`

## Memory system
- Daily logs: memory/YYYY-MM-DD.md
- Long-term: MEMORY.md (curated, not raw)
- Shared workspace files: AGENTS.md, PENDING_ALLEN.md`,

      database: `# Blueprint OS Database

## Setup
Blueprint uses Drizzle ORM with support for:
- **Neon** (serverless PostgreSQL, default)
- **Supabase** (hosted PostgreSQL)
- **Standard PostgreSQL** (postgres.js driver)
- **None** (skip database entirely)

## Schema location
All schema lives in \`packages/db/src/schema/\` — single source of truth.

## Commands
\`\`\`bash
pnpm db:generate   # generate migrations after schema changes
pnpm db:push       # push schema to database (dev)
pnpm db:migrate    # run migrations (production)
pnpm db:studio     # open Drizzle Studio (visual DB browser)
\`\`\`

## Conventions
- Table names: plural snake_case (users, blog_posts)
- Always include id, createdAt, updatedAt
- UUID primary keys with .defaultRandom()
- Foreign keys reference id column`,

      deployment: `# Blueprint OS Deployment

## Development
\`\`\`bash
pnpm dev           # start all apps
\`\`\`

## Production (PM2)
Blueprint uses PM2 for process management in production:
\`\`\`bash
pm2 start ecosystem.config.js   # start all apps
pm2 status                       # check status
pm2 logs                         # view logs
\`\`\`

## Reverse proxy (Caddy)
Blueprint apps are served via Caddy reverse proxy:
- app.yourdomain.com → :3000
- api.yourdomain.com → :3001
- admin.yourdomain.com → :3002
- os.yourdomain.com → :7777

## Environment variables
Each app has its own .env.local. Shared vars go in root .env.
\`\`\`bash
cp .env.example .env.local
\`\`\`

## CI/CD
GitHub Actions runs on every PR:
- Type checking
- Linting
- Build verification`,

      packages: `# Blueprint OS Packages

## Core packages (in packages/)
- **@repo/db** — Drizzle ORM + schema + migrations
- **@repo/app-config** — Shared app metadata, branding, theme
- **@repo/blueprint-cli** — npx blueprint CLI tool
- **@repo/mcp-server** — This MCP server

## Installing BlueMart packages
\`\`\`bash
blueprint install crm         # install Blueprint CRM
blueprint install analytics   # install Analytics Dashboard
blueprint install codex       # install Codex AI agent
blueprint list                # list installed packages
blueprint uninstall crm       # remove a package
\`\`\`

## Available packages
${BLUEMART_PACKAGES.map(p => `- **${p.id}** (${p.type}) — ${p.description}`).join("\n")}`
    };

    return {
      content: [{
        type: "text",
        text: info[topic] ?? info.overview
      }]
    };
  }
);

// Tool 4: list_bluemart_packages
server.tool(
  "list_bluemart_packages",
  "List all available packages in the BlueMart app store that can be installed into a Blueprint OS project.",
  {
    type: z.enum(["app", "agent", "skill", "all"]).optional().describe("Filter by package type"),
  },
  async ({ type = "all" }) => {
    const filtered = type === "all"
      ? BLUEMART_PACKAGES
      : BLUEMART_PACKAGES.filter(p => p.type === type);

    return {
      content: [{
        type: "text",
        text: `# BlueMart Packages${type !== "all" ? ` (${type}s)` : ""}

${filtered.map(p => `## ${p.name} (\`${p.id}\`)
- **Type:** ${p.type}
- **Description:** ${p.description}
- **Install:** \`blueprint install ${p.id}\``).join("\n\n")}

## How to install
\`\`\`bash
# Install a single package
blueprint install ${filtered[0]?.id ?? "crm"}

# Install everything in blueprint.config.json
blueprint install
\`\`\`

After installing, the app/agent/skill:
1. Downloads and sets up in ~/.blueprint/packages/
2. Starts via PM2
3. Gets a Caddy route (/apps/${filtered[0]?.id ?? "crm"} or subdomain)
4. Appears as an icon on the Blueprint OS desktop
5. If it's an agent, its OpenClaw skill gets auto-installed

## Publishing your own package
\`\`\`bash
blueprint publish
\`\`\`
This validates your blueprint.json, creates a GitHub release, and opens a PR to the BlueMart registry.`
      }]
    };
  }
);

// Tool 5: install_package
server.tool(
  "install_package",
  "Get instructions for installing a specific package from BlueMart into a Blueprint OS project.",
  {
    packageId: z.string().describe("The package ID to install (e.g. crm, analytics, codex)"),
  },
  async ({ packageId }) => {
    const pkg = BLUEMART_PACKAGES.find(p => p.id === packageId);

    return {
      content: [{
        type: "text",
        text: pkg
          ? `# Install ${pkg.name}

## Command
\`\`\`bash
blueprint install ${packageId}
\`\`\`

## What happens
1. Downloads ${pkg.name} from the Blueprint registry
2. Runs npm install in the package directory
3. Finds a free port and starts the app via PM2
4. Adds a Caddy reverse proxy route
5. Updates ~/.blueprint/installed.json
6. The icon appears on your Blueprint OS desktop${pkg.type === "agent" ? "\n7. Installs the OpenClaw skill so your AI agents can use it" : ""}

## Access it
- **In Blueprint OS:** Click the ${pkg.name} icon on the desktop
- **Direct URL:** http://localhost:7777/apps/${packageId}

## To uninstall
\`\`\`bash
blueprint uninstall ${packageId}
\`\`\`

## Package info
- **Type:** ${pkg.type}
- **Description:** ${pkg.description}`
          : `# Install Package: ${packageId}

\`\`\`bash
blueprint install ${packageId}
\`\`\`

This package will be downloaded from the BlueMart registry, installed to ~/.blueprint/packages/${packageId}/, and started automatically.

If the package doesn't exist in the registry, check available packages with:
\`\`\`bash
blueprint list --available
\`\`\``
      }]
    };
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
