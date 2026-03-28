import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

async function loadRegistry(monorepoRoot: string): Promise<Registry> {
  const localPath = join(monorepoRoot, "registry", "index.json");

  if (existsSync(localPath)) {
    const raw = readFileSync(localPath, "utf-8");
    return JSON.parse(raw) as Registry;
  }

  // Fall back to remote
  const res = await fetch(REGISTRY_REMOTE_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch remote registry: HTTP ${res.status}`);
  }
  return (await res.json()) as Registry;
}

function addToAppsRegistry(
  monorepoRoot: string,
  pkg: RegistryPackage,
): void {
  const registryPath = join(
    monorepoRoot,
    "packages",
    "app-config",
    "src",
    "apps-registry.ts",
  );

  if (!existsSync(registryPath)) {
    console.log(kleur.yellow("  ⚠ Could not find apps-registry.ts — skipping registry update."));
    return;
  }

  const content = readFileSync(registryPath, "utf-8");

  // Check if already registered
  if (content.includes(`id: "${pkg.id}"`)) {
    console.log(kleur.dim(`  ↳ ${pkg.name} already in apps-registry.ts`));
    return;
  }

  const newEntry = `  {
    id: "${pkg.id}",
    name: "${pkg.name}",
    port: ${pkg.port},
    description: "${pkg.description}",
    icon: "${pkg.icon}",
    color: "${pkg.color}",
    subdomain: "${pkg.id}",
    openMaximized: true,
    access: "public",
    type: "nextjs",
  },`;

  // Insert before the closing bracket of the array
  const updated = content.replace(
    /^];$/m,
    `${newEntry}\n];`,
  );

  writeFileSync(registryPath, updated, "utf-8");
  console.log(kleur.dim(`  ↳ Added ${pkg.name} to apps-registry.ts`));
}

function scaffoldAppStub(monorepoRoot: string, pkg: RegistryPackage): void {
  const appDir = join(monorepoRoot, "apps", pkg.id);

  if (existsSync(appDir)) {
    console.log(kleur.dim(`  ↳ apps/${pkg.id}/ already exists — skipping scaffold`));
    return;
  }

  mkdirSync(appDir, { recursive: true });

  const packageJson = {
    name: `@repo/${pkg.id}`,
    version: "0.1.0",
    private: true,
    description: pkg.description,
    scripts: {
      dev: `next dev --port ${pkg.port}`,
      build: "next build",
      start: `next start --port ${pkg.port}`,
      lint: "next lint",
    },
    dependencies: {
      next: "15.3.1",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
    devDependencies: {
      "@repo/typescript-config": "workspace:*",
      "@repo/eslint-config": "workspace:*",
      "@types/node": "^22.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      typescript: "^5.8.0",
    },
  };

  writeFileSync(
    join(appDir, "package.json"),
    JSON.stringify(packageJson, null, 2) + "\n",
    "utf-8",
  );

  const readme = `# ${pkg.name}

> ${pkg.description}

**Status:** 🚧 Coming soon — ${pkg.name} will be available here.

This app was scaffolded via \`blueprint install ${pkg.id}\`.
Full implementation is on the roadmap for Phase 2.

## Running

\`\`\`bash
pnpm dev:${pkg.id}
\`\`\`

Available at \`http://localhost:${pkg.port}\`.
`;

  writeFileSync(join(appDir, "README.md"), readme, "utf-8");

  console.log(kleur.dim(`  ↳ Scaffolded apps/${pkg.id}/`));
}

export async function installCommand(packageId: string): Promise<void> {
  const root = findMonorepoRoot();

  if (!root) {
    console.error(kleur.red("✖ Could not find a Blueprint monorepo root."));
    console.error(
      kleur.dim("  Make sure you are inside a Blueprint project directory."),
    );
    process.exit(1);
  }

  let registry: Registry;

  try {
    registry = await loadRegistry(root);
  } catch (err) {
    console.error(kleur.red("✖ Failed to load registry."));
    console.error(kleur.dim(`  ${err instanceof Error ? err.message : String(err)}`));
    process.exit(1);
  }

  const pkg = registry.packages.find((p) => p.id === packageId);

  if (!pkg) {
    console.error(kleur.red(`✖ Package "${packageId}" not found in registry.`));
    console.error(
      kleur.dim(
        `  Available: ${registry.packages.map((p) => p.id).join(", ")}`,
      ),
    );
    console.error(kleur.dim("  Run `blueprint list` to see all packages."));
    process.exit(1);
  }

  console.log(
    `\n${kleur.cyan("blueprint")} ${kleur.bold("install")} ${kleur.green(pkg.id)}\n`,
  );
  console.log(`Installing ${kleur.bold(pkg.name)} (${pkg.version})...`);

  scaffoldAppStub(root, pkg);
  addToAppsRegistry(root, pkg);

  console.log(
    `\n✅ ${kleur.bold(pkg.name)} installed. Run ${kleur.cyan(`pnpm dev:${pkg.id}`)} to start it.\n`,
  );
}
