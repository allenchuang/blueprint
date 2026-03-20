# API Server - Agent Instructions

Fastify 5 REST API server with auto-generated Swagger documentation.

## Key Directories

- `src/routes/` — Route modules (each exports an async plugin function)
- `src/plugins/` — Fastify plugins (auth, rate limiting, etc.)
- `src/schemas/` — Shared Zod/JSON schemas
- `src/app.ts` — App builder (register plugins and routes here)
- `src/index.ts` — Entry point

## Rules

- Every endpoint MUST have a `schema` object for Swagger generation
- Register all routes in `src/app.ts` with prefix `/api`
- Use `@repo/db` for database queries (import `createDb` and schema)
- Schema tags group endpoints in Swagger UI
- When adding/changing endpoints, update `apps/docs/api-reference/`
- Use `app.authenticate` preHandler on protected routes (verifies Dynamic JWT)
- Authenticated user is available via `request.dynamicUser` (`sub`, `email`, `scope`)
- Proxy external infra requests through `INFRA_API_URL` — clients should never call infra directly

## Swagger

Available at `http://localhost:3001/docs` when the server is running.

## Commands

```bash
pnpm --filter server dev     # Dev server with hot reload on port 3001
pnpm --filter server build   # Production build
```
