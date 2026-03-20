# API Server

Lightweight REST API server for Blueprint built with Fastify. Includes auto-generated Swagger/OpenAPI documentation.

## Tech Stack

- **Fastify 5** for HTTP handling
- **@fastify/swagger** + **@fastify/swagger-ui** for OpenAPI docs
- **@fastify/cors** for cross-origin requests
- **Zod** for runtime validation
- **`@repo/db`** for database access (Drizzle + Neon)
- **tsx** for development (watch mode)
- **tsup** for production builds

## Development

```bash
# From monorepo root
pnpm dev:server

# Or directly
pnpm --filter server dev
```

Runs on **http://localhost:3001**.

Swagger UI available at **http://localhost:3001/docs**.

## Directory Structure

```
apps/server/
├── src/
│   ├── index.ts        → Server entry point
│   ├── app.ts          → Fastify app builder (plugins, routes)
│   ├── routes/
│   │   ├── health.ts   → Health check endpoint
│   │   └── example.ts  → Example CRUD endpoints
│   ├── plugins/        → Fastify plugins (auth, rate limiting, etc.)
│   └── schemas/        → Shared Zod/JSON schemas
└── .env.example
```

## Patterns

- **Route modules** — each file in `routes/` exports an async function that registers routes on the Fastify instance
- **Schema-first** — every endpoint defines its request/response schema for Swagger generation
- **Plugin architecture** — use `plugins/` for cross-cutting concerns (auth, rate limiting)
- **Zod validation** — use Zod schemas in `schemas/` for runtime type checking

## Adding a New Route

1. Create a new file in `src/routes/` (e.g., `src/routes/users.ts`)
2. Define the route with schemas:

```typescript
import type { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
  app.get("/users", {
    schema: {
      description: "List all users",
      tags: ["users"],
      response: { 200: { type: "array", items: { /* ... */ } } },
    },
  }, async () => {
    // handler
  });
}
```

3. Register in `src/app.ts`:
```typescript
await app.register(userRoutes, { prefix: "/api" });
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `PORT` | Server port (default: 3001) |

## Build

```bash
pnpm --filter server build
```
