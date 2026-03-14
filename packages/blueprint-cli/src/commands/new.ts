import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execa } from "execa";
import kleur from "kleur";
import ora from "ora";
import prompts from "prompts";

const REPO_URL = "https://github.com/allenchuang/blueprint.git";

export async function newCommand(projectName: string): Promise<void> {
  const targetDir = resolve(process.cwd(), projectName);

  if (existsSync(targetDir)) {
    console.error(
      kleur.red(`✖ Directory already exists: ${kleur.bold(projectName)}`),
    );
    process.exit(1);
  }

  console.log(
    kleur.dim("  Scaffolding into ") + kleur.bold(projectName) + kleur.dim("..."),
  );
  console.log();

  // Clone the repo
  const cloneSpinner = ora("Cloning Blueprint repository...").start();
  try {
    await execa("git", ["clone", "--depth=1", REPO_URL, targetDir], {
      stdio: "pipe",
    });
    cloneSpinner.succeed("Repository cloned");
  } catch (err) {
    cloneSpinner.fail("Failed to clone repository");
    const message = err instanceof Error ? err.message : String(err);
    console.error(kleur.dim(message));
    process.exit(1);
  }

  // Remove .git to detach from the origin
  const gitSpinner = ora("Removing git history...").start();
  try {
    await execa("rm", ["-rf", join(targetDir, ".git")]);
    gitSpinner.succeed("Git history removed");
  } catch {
    gitSpinner.warn("Could not remove .git directory — remove it manually");
  }

  // Prompt for environment variables
  console.log();
  const { configureDotenv } = await prompts({
    type: "confirm",
    name: "configureDotenv",
    message: "Configure environment variables now?",
    initial: true,
  });

  if (configureDotenv) {
    const { databaseUrl } = await prompts({
      type: "text",
      name: "databaseUrl",
      message: "DATABASE_URL (Neon PostgreSQL connection string):",
      initial: "postgresql://user:password@host/database?sslmode=require",
    });

    if (databaseUrl) {
      const envContent = `DATABASE_URL=${databaseUrl}\n`;
      writeFileSync(join(targetDir, ".env"), envContent);
      console.log(kleur.green("  ✔ .env created"));
    }
  }

  // Install dependencies
  console.log();
  const installSpinner = ora("Installing dependencies with pnpm...").start();
  try {
    await execa("pnpm", ["install"], {
      cwd: targetDir,
      stdio: "pipe",
    });
    installSpinner.succeed("Dependencies installed");
  } catch (err) {
    installSpinner.fail("Dependency installation failed");
    const message = err instanceof Error ? err.message : String(err);
    console.error(kleur.dim(message));
    console.error(
      kleur.yellow(
        `  Run ${kleur.bold("pnpm install")} manually inside ${kleur.bold(projectName)}`,
      ),
    );
  }

  // Initialize a fresh git repo
  const gitInitSpinner = ora("Initializing new git repository...").start();
  try {
    await execa("git", ["init"], { cwd: targetDir, stdio: "pipe" });
    await execa("git", ["add", "-A"], { cwd: targetDir, stdio: "pipe" });
    await execa("git", ["commit", "-m", "chore: initial scaffold from blueprint"], {
      cwd: targetDir,
      stdio: "pipe",
    });
    gitInitSpinner.succeed("Git repository initialized");
  } catch {
    gitInitSpinner.warn("Could not initialize git — run git init manually");
  }

  // Done
  console.log();
  console.log(kleur.green().bold("  ✔ Project ready!"));
  console.log();
  console.log(kleur.dim("  Next steps:"));
  console.log();
  console.log(`    ${kleur.cyan("cd")} ${projectName}`);
  console.log(`    ${kleur.cyan("pnpm dev")}`);
  console.log();
  console.log(
    kleur.dim(
      `  Edit your app config: ${kleur.bold("packages/app-config/src/config.ts")}`,
    ),
  );
  console.log(
    kleur.dim(
      `  Then run: ${kleur.bold("pnpm sync-config")} to apply branding everywhere.`,
    ),
  );
  console.log();
}
