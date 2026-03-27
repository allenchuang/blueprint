# Blueprint Patterns Reference

> When working in a Blueprint repo, the `.claude/rules/*.mdc` files are authoritative.
> This file provides quick-reference examples for use outside the repo context.

## API Pattern (Fastify + Swagger)

Routes live in `apps/server/src/routes/`, registered in `apps/server/src/app.ts`.

```typescript
// apps/server/src/routes/users.ts
export default async function usersRoutes(app: FastifyInstance) {
  app.get("/users/:id", {
    schema: {
      params: { type: "object", properties: { id: { type: "string", format: "uuid" } }, required: ["id"] },
      response: { 200: { type: "object", properties: { id: { type: "string" }, email: { type: "string" } } } }
    }
  }, async (request, reply) => { /* handler */ });
}
```

Every endpoint MUST include a Fastify schema for Swagger (`http://localhost:3001/docs`).

## React Query Hooks

One hook per file in `src/hooks/`. Naming: `useGet[Resource]`, `useList[Resources]`, `use[Verb][Resource]`.

```typescript
// src/hooks/use-get-user.ts
export function useGetUser(id: string) {
  return useQuery({ queryKey: ["user", id], queryFn: () => api.get(`/users/${id}`) });
}
```

## Database Schema

```typescript
// packages/db/src/schema/posts.ts
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

Conventions: plural snake_case tables, snake_case columns, always `id`/`createdAt`/`updatedAt`.

## Co-Development Component Mapping

| Web (shadcn/ui)     | React Native (NativeWind)                |
|---------------------|------------------------------------------|
| `<Button>`          | `<TouchableOpacity className="...">`     |
| `<Card>`            | `<View className="...">`                 |
| `<Input>`           | `<TextInput className="...">`            |
| `<Dialog>`          | `<Modal>`                                |
| Next.js `<Link>`    | Expo Router `<Link>`                     |

## Mobile Web Components

On viewports < 768px, `apps/web` uses: `MobileTopNav`, `MobileFooter`, `MobileLayout`, `BottomSheet` (vaul), `SlideInSheet`. Use `useIsMobile()` hook and `md:hidden`/`md:block`.
