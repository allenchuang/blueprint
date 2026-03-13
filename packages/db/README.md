# @repo/db

Shared database package providing Drizzle ORM schema definitions and a database client for Neon serverless PostgreSQL.

## Tech Stack

- **Drizzle ORM** for type-safe SQL
- **Neon** serverless PostgreSQL driver
- **Drizzle Kit** for migrations and studio

## Usage

```typescript
import { createDb } from "@repo/db";
import { users } from "@repo/db/schema";

const db = createDb(process.env.DATABASE_URL!);

// Query
const allUsers = await db.select().from(users);

// Insert
await db.insert(users).values({
  email: "user@example.com",
  name: "John Doe",
});
```

## Schema

Schema definitions live in `src/schema/`. Each table gets its own file:

```
src/schema/
├── index.ts    → Barrel export for all tables
└── users.ts    → Users table definition
```

## Commands

Run from the monorepo root:

```bash
pnpm db:generate   # Generate migration files from schema changes
pnpm db:migrate    # Apply pending migrations
pnpm db:push       # Push schema directly (for development)
pnpm db:studio     # Open Drizzle Studio GUI
```

## Adding a New Table

1. Create a new file in `src/schema/` (e.g., `src/schema/posts.ts`)
2. Define the table using Drizzle's `pgTable`:

```typescript
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  authorId: uuid("author_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
```

3. Export from `src/schema/index.ts`:
```typescript
export { posts } from "./posts";
```

4. Run `pnpm db:generate` to create migration files

## Environment

Requires `DATABASE_URL` environment variable. See `.env.example`.
