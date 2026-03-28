import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import kleur from "kleur";
import { findMonorepoRoot } from "../utils/detect-root.js";

const REGISTRY_REMOTE_URL =
  "https://raw.githubusercontent.com/allenchuang/blueprint/allen/os/registry/index.json";

interface RegistryPackage {
  id: string;
  name: string;
  description: string;
  type: string;
  version: string;
  author: string;
  tags: string[];
  port: number;
  icon: string;
  color: string;
}

interface Registry {
  version: string;
  updatedAt: string;
  packages: RegistryPackage[];
}

async function loadRegistry(monorepoRoot: string | null): Promise<Registry> {
  if (monorepoRoot) {
    const localPath = join(monorepoRoot, "registry", "index.json");
    if (existsSync(localPath)) {
      const raw = readFileSync(localPath, "utf-8");
      return JSON.parse(raw) as Registry;
    }
  }

  // Fall back to remote
  const res = await fetch(REGISTRY_REMOTE_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch remote registry: HTTP ${res.status}`);
  }
  return (await res.json()) as Registry;
}

export async function listCommand(): Promise<void> {
  const root = findMonorepoRoot();

  let registry: Registry;

  try {
    registry = await loadRegistry(root);
  } catch (err) {
    console.error(kleur.red("✖ Failed to load registry."));
    console.error(
      kleur.dim(`  ${err instanceof Error ? err.message : String(err)}`),
    );
    process.exit(1);
  }

  const source = root && existsSync(join(root, "registry", "index.json"))
    ? kleur.dim("(local registry)")
    : kleur.dim("(remote registry)");

  console.log(
    `\n${kleur.cyan("Blueprint App Store")} ${source}\n`,
  );

  console.log(
    `${kleur.bold(String(registry.packages.length))} package${registry.packages.length === 1 ? "" : "s"} available:\n`,
  );

  for (const pkg of registry.packages) {
    const tags = pkg.tags.map((t) => kleur.dim(`#${t}`)).join(" ");
    console.log(
      `  ${kleur.green(kleur.bold(pkg.id.padEnd(12)))} ${kleur.white(pkg.name)} ${kleur.dim(`v${pkg.version}`)}`,
    );
    console.log(`  ${kleur.dim(" ".repeat(12))} ${pkg.description}`);
    console.log(`  ${kleur.dim(" ".repeat(12))} ${tags}`);
    console.log();
  }

  console.log(
    `${kleur.dim("Run")} ${kleur.cyan("blueprint install <id>")} ${kleur.dim("to install a package.")}\n`,
  );
}
