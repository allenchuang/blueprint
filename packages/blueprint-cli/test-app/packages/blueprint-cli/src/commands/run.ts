import { execa } from "execa";
import kleur from "kleur";
import { findMonorepoRoot } from "../utils/detect-root.js";

const PROXY_COMMANDS: Record<string, string[]> = {
  dev: ["pnpm", "dev"],
  "dev:web": ["pnpm", "dev:web"],
  "dev:admin": ["pnpm", "dev:admin"],
  "dev:server": ["pnpm", "dev:server"],
  "dev:docs": ["pnpm", "dev:docs"],
  "dev:remotion": ["pnpm", "dev:remotion"],
  build: ["pnpm", "build"],
  lint: ["pnpm", "lint"],
  "check-types": ["pnpm", "check-types"],
  "sync-config": ["pnpm", "sync-config"],
  "db:generate": ["pnpm", "db:generate"],
  "db:migrate": ["pnpm", "db:migrate"],
  "db:push": ["pnpm", "db:push"],
  "db:studio": ["pnpm", "db:studio"],
};

export async function runCommand(commandName: string): Promise<void> {
  const root = findMonorepoRoot();

  if (!root) {
    console.error(
      kleur.red("✖ Could not find a Blueprint monorepo root."),
    );
    console.error(
      kleur.dim("  Make sure you are inside a Blueprint project directory."),
    );
    process.exit(1);
  }

  const cmd = PROXY_COMMANDS[commandName];

  if (!cmd) {
    console.error(kleur.red(`✖ Unknown command: ${kleur.bold(commandName)}`));
    console.error(
      kleur.dim(`  Available commands: ${Object.keys(PROXY_COMMANDS).join(", ")}`),
    );
    process.exit(1);
  }

  const [program, ...args] = cmd as [string, ...string[]];

  try {
    await execa(program, args, {
      cwd: root,
      stdio: "inherit",
    });
  } catch (err) {
    process.exit(1);
  }
}

export function listProxyCommands(): string[] {
  return Object.keys(PROXY_COMMANDS);
}
