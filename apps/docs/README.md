# Documentation

Project documentation powered by [Mintlify](https://mintlify.com). Covers getting started guides, architecture decisions, and API reference.

## Development

```bash
# From monorepo root
pnpm dev:docs

# Or directly
cd apps/docs && npx mintlify dev --port 3003
```

Runs on **http://localhost:3003**.

## Directory Structure

```
apps/docs/
├── docs.json                    → Mintlify configuration and navigation
├── introduction.mdx             → Project overview
├── quickstart.mdx               → Getting started guide
├── architecture.mdx             → Architecture documentation
├── api-reference/
│   ├── introduction.mdx         → API overview
│   └── endpoint/
│       ├── get.mdx              → GET endpoint docs
│       └── create.mdx           → POST endpoint docs
├── logo/
│   ├── dark.svg                 → Dark mode logo
│   └── light.svg                → Light mode logo
└── favicon.svg                  → Browser favicon
```

## Patterns

- **Keep docs concise** — document what users need, avoid filler content
- **Update navigation** in `docs.json` when adding new pages
- **API docs** should reference the Swagger UI at `http://localhost:3001/docs` for interactive testing
- **MDX format** — all pages use `.mdx` with Mintlify components (`<Card>`, `<Steps>`, `<CardGroup>`)

## Adding a New Page

1. Create a new `.mdx` file in the appropriate directory
2. Add the page path to `docs.json` under the correct navigation tab or group
3. Preview with `pnpm dev:docs`

## Deployment

Mintlify handles deployment through their platform. Connect the repository and point to `apps/docs/`.
