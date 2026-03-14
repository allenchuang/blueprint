# Documentation - Agent Instructions

Mintlify-powered documentation site.

## Key Files

- `mint.json` — Navigation structure, theme, and config
- `*.mdx` pages — Documentation content
- `api-reference/` — API endpoint documentation

## Rules

- Update docs when user-facing features or API endpoints change
- Keep content concise — no filler paragraphs or unnecessary introductions
- Update `mint.json` navigation when adding new pages
- API docs should reference Swagger UI at `http://localhost:3001/docs`
- Use Mintlify components: `<Card>`, `<Steps>`, `<Tabs>`, `<CardGroup>`

## Commands

```bash
pnpm --filter docs dev   # Dev server on port 3003
```
