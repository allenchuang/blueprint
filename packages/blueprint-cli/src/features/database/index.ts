import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { DatabaseProvider } from "../index.js";
import { removeDeps, removeScripts, removeTurboTasks, readJson, writeJson } from "../../utils/patch-json.js";
import { removeEnvKeys } from "../../utils/patch-file.js";

const NEON_INDEX = `import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;

export * from "./schema";
export { schema };
`;

const SUPABASE_INDEX = `import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl, { prepare: false });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;

export * from "./schema";
export { schema };
`;

const PG_INDEX = `import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;

export * from "./schema";
export { schema };
`;

const ENV_PLACEHOLDERS: Record<string, string> = {
  neon: "postgresql://user:password@host/database?sslmode=require",
  supabase: "postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres",
  pg: "postgresql://user:password@localhost:5432/mydb",
};

export function applyDatabaseSelection(
  targetDir: string,
  provider: DatabaseProvider,
): void {
  if (provider === "none") {
    stripDatabase(targetDir);
    return;
  }

  if (provider === "neon") return;

  const dbIndexPath = join(targetDir, "packages/db/src/index.ts");
  const dbPkgPath = join(targetDir, "packages/db/package.json");

  if (provider === "supabase") {
    writeFileSync(dbIndexPath, SUPABASE_INDEX);
  } else if (provider === "pg") {
    writeFileSync(dbIndexPath, PG_INDEX);
  }

  // Swap dependency
  if (existsSync(dbPkgPath)) {
    const pkg = readJson(dbPkgPath) as Record<string, Record<string, string>>;
    if (pkg.dependencies) {
      delete pkg.dependencies["@neondatabase/serverless"];
      pkg.dependencies["postgres"] = "^3.4.0";
    }
    writeJson(dbPkgPath, pkg as Record<string, unknown>);
  }

  // Update env placeholder in all .env.example files
  const placeholder = ENV_PLACEHOLDERS[provider];
  if (placeholder) {
    const envFiles = [
      join(targetDir, ".env.example"),
      join(targetDir, "apps/server/.env.example"),
      join(targetDir, "packages/db/.env.example"),
    ];
    for (const envFile of envFiles) {
      if (!existsSync(envFile)) continue;
      let content = readFileSync(envFile, "utf-8");
      content = content.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL=${placeholder}`,
      );
      writeFileSync(envFile, content);
    }
  }
}

function stripDatabase(targetDir: string): void {
  const dbDir = join(targetDir, "packages/db");
  if (existsSync(dbDir)) {
    rmSync(dbDir, { recursive: true, force: true });
  }

  // Remove @repo/db from dependent apps
  const dependents = [
    join(targetDir, "apps/web/package.json"),
    join(targetDir, "apps/admin/package.json"),
    join(targetDir, "apps/server/package.json"),
  ];
  for (const pkgPath of dependents) {
    removeDeps(pkgPath, ["@repo/db"]);
  }

  // Remove db scripts from root
  removeScripts(join(targetDir, "package.json"), [
    "db:generate",
    "db:migrate",
    "db:push",
    "db:studio",
  ]);

  // Remove db tasks from turbo.json
  removeTurboTasks(join(targetDir, "turbo.json"), [
    "db:generate",
    "db:migrate",
    "db:push",
    "db:studio",
  ]);

  // Remove DATABASE_URL from env examples
  const envFiles = [
    join(targetDir, ".env.example"),
    join(targetDir, "apps/server/.env.example"),
  ];
  for (const envFile of envFiles) {
    removeEnvKeys(envFile, ["DATABASE_URL"]);
  }

  // Remove database rules
  const ruleDirs = [".cursor/rules", ".agents/rules", ".claude/rules"];
  for (const dir of ruleDirs) {
    const rulePath = join(targetDir, dir, "003-database-patterns.mdc");
    if (existsSync(rulePath)) {
      rmSync(rulePath);
    }
  }
}
