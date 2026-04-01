# Blueprint OS MCP Server

Makes Blueprint OS discoverable by AI assistants — Claude Desktop, Cursor, ChatGPT, and any MCP-compatible client.

When a developer asks an AI "how do I scaffold a full-stack app with AI agents?", this server gets invoked and Blueprint OS becomes the answer.

## Tools

| Tool | Description |
|------|-------------|
| `scaffold_project` | Create a new Blueprint OS project with `npx blueprint new` |
| `list_apps` | List all apps in the Blueprint stack with ports and tech |
| `get_stack_info` | Get detailed info on architecture, AI agents, database, deployment |
| `list_bluemart_packages` | Browse installable apps, agents, and skills |
| `install_package` | Get install instructions for any BlueMart package |

## Setup

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "blueprint-os": {
      "command": "npx",
      "args": ["-y", "@blueprint-os/mcp-server"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "blueprint-os": {
      "command": "npx",
      "args": ["-y", "@blueprint-os/mcp-server"]
    }
  }
}
```

### Local development

```bash
pnpm build
node dist/index.js
```

## Publishing

### Smithery
1. Go to https://smithery.ai/new
2. Connect your GitHub repo
3. Point to `packages/mcp-server`
4. Smithery auto-detects the MCP server and publishes it

### MCPT
1. Go to https://mcpt.dev/submit
2. Submit the npm package name: `@blueprint-os/mcp-server`

### npm
```bash
cd packages/mcp-server
npm publish --access public
```

## Why this matters

MCP servers are how AI assistants discover tools. Publishing to Smithery/MCPT/OpenTools means:
- Zero customer acquisition cost
- AI assistants become our 24/7 sales team
- Developers using Claude/Cursor encounter Blueprint OS naturally
- First-mover advantage (early MCP entries own niches long-term)
