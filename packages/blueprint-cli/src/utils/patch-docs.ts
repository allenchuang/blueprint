import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { FeatureSelections } from "../features/index.js";

interface DocLine {
  pattern: string;
  featureId: string;
}

const ARCHITECTURE_LINES: DocLine[] = [
  { pattern: "admin/", featureId: "admin" },
  { pattern: "docs/", featureId: "docs" },
  { pattern: "react-native/", featureId: "mobile" },
  { pattern: "remotion/", featureId: "remotion" },
  { pattern: "prompts/", featureId: "remotion" },
];

const COMMAND_LINES: DocLine[] = [
  { pattern: "dev:admin", featureId: "admin" },
  { pattern: "dev:docs", featureId: "docs" },
  { pattern: "dev:remotion", featureId: "remotion" },
];

const DB_COMMAND_PATTERNS = [
  "db:generate",
  "db:migrate",
  "db:push",
  "db:studio",
];

export function cleanDocFiles(
  targetDir: string,
  selections: FeatureSelections,
): void {
  const allSelected = new Set([
    ...selections.apps,
    ...selections.integrations,
    ...selections.webFeatures,
  ]);

  const docFiles = [
    "README.md",
    "AGENTS.md",
    ".cursor/rules/000-project-overview.mdc",
    ".agents/rules/000-project-overview.mdc",
    ".claude/rules/000-project-overview.mdc",
  ];

  for (const docFile of docFiles) {
    const fullPath = `${targetDir}/${docFile}`;
    if (!existsSync(fullPath)) continue;

    let content = readFileSync(fullPath, "utf-8");
    const lines = content.split("\n");
    const result: string[] = [];

    for (const line of lines) {
      let shouldRemove = false;

      // Remove architecture tree lines for deselected apps
      for (const archLine of ARCHITECTURE_LINES) {
        if (line.includes(archLine.pattern) && !allSelected.has(archLine.featureId)) {
          shouldRemove = true;
          break;
        }
      }

      // Remove command lines for deselected apps
      for (const cmdLine of COMMAND_LINES) {
        if (line.includes(cmdLine.pattern) && !allSelected.has(cmdLine.featureId)) {
          shouldRemove = true;
          break;
        }
      }

      // Remove DB command lines if no database
      if (selections.database === "none") {
        for (const dbPattern of DB_COMMAND_PATTERNS) {
          if (line.includes(dbPattern)) {
            shouldRemove = true;
            break;
          }
        }

        if (line.includes("db/") && line.includes("→")) {
          shouldRemove = true;
        }
      }

      if (!shouldRemove) {
        result.push(line);
      }
    }

    content = result.join("\n");

    // Update DB reference in architecture tree if provider changed
    if (selections.database === "supabase") {
      content = content.replace(
        /Neon PostgreSQL/g,
        "Supabase PostgreSQL",
      );
      content = content.replace(
        /Drizzle \+ Neon/g,
        "Drizzle + Supabase",
      );
      content = content.replace(
        /Drizzle ORM \+ Neon PostgreSQL/g,
        "Drizzle ORM + Supabase PostgreSQL",
      );
    } else if (selections.database === "pg") {
      content = content.replace(
        /Neon PostgreSQL/g,
        "PostgreSQL",
      );
      content = content.replace(
        /Drizzle \+ Neon/g,
        "Drizzle + PostgreSQL",
      );
      content = content.replace(
        /Drizzle ORM \+ Neon PostgreSQL/g,
        "Drizzle ORM + PostgreSQL",
      );
    }

    writeFileSync(fullPath, content);
  }
}
