# @repo/db - Agent Instructions

Shared database package with Drizzle ORM schemas and Neon PostgreSQL client.

## Key Files

- `src/schema/*.ts` — Table definitions (one file per table)
- `src/schema/index.ts` — Barrel export for all tables
- `src/index.ts` — `createDb()` factory and re-exports
- `drizzle.config.ts` — Drizzle Kit configuration

## Rules

- ALL schema changes happen here — never raw SQL, never direct DB edits
- Every table must have `id` (uuid), `createdAt`, `updatedAt`
- Table names: plural snake_case (`users`, `blog_posts`)
- Column names: snake_case (`created_at`, `user_id`)
- After schema changes: run `pnpm db:generate` then `pnpm db:push`
- Export new tables from `src/schema/index.ts`

## Commands

```bash
pnpm db:generate   # Generate migrations
pnpm db:push       # Push to database
pnpm db:studio     # Open Drizzle Studio
```
