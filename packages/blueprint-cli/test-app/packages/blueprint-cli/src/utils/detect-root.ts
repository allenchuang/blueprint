import { existsSync } from "node:fs";
import { join, dirname } from "node:path";

/**
 * Walk up from cwd to find the monorepo root.
 * Identified by the presence of pnpm-workspace.yaml and turbo.json.
 */
export function findMonorepoRoot(startDir: string = process.cwd()): string | null {
  let current = startDir;

  while (true) {
    const hasWorkspace = existsSync(join(current, "pnpm-workspace.yaml"));
    const hasTurbo = existsSync(join(current, "turbo.json"));

    if (hasWorkspace && hasTurbo) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}
