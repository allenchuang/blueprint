import { existsSync, writeFileSync } from "node:fs";
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

  // Prompt for app config branding
  console.log();
  console.log(kleur.bold("  App Config"));
  console.log(
    kleur.dim("  These values populate packages/app-config/src/config.ts\n"),
  );

  const { configureAppConfig } = await prompts({
    type: "confirm",
    name: "configureAppConfig",
    message: "Configure app branding now? (you can edit config.ts later)",
    initial: true,
  });

  interface AppConfigAnswers {
    name?: string;
    slug?: string;
    description?: string;
    slogan?: string;
    primaryColor?: string;
    website?: string;
    supportEmail?: string;
    github?: string;
  }

  const appConfigAnswers: AppConfigAnswers = configureAppConfig
    ? await prompts([
        {
          type: "text",
          name: "name",
          message: "App name:",
          initial: "Mastermind",
        },
        {
          type: "text",
          name: "slug",
          message: "App slug (lowercase, no spaces):",
          initial: (prev: string) =>
            prev.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        {
          type: "text",
          name: "description",
          message: "Short description:",
          initial: "Build your next big thing",
        },
        {
          type: "text",
          name: "slogan",
          message: "Tagline / slogan:",
          initial: "Ship ideas at the speed of thought",
        },
        {
          type: "text",
          name: "primaryColor",
          message: "Primary brand color (hex):",
          initial: "#0D9373",
        },
        {
          type: "text",
          name: "website",
          message: "Website URL:",
          initial: "https://example.com",
        },
        {
          type: "text",
          name: "supportEmail",
          message: "Support email:",
          initial: "support@example.com",
        },
        {
          type: "text",
          name: "github",
          message: "GitHub URL (optional):",
          initial: "",
        },
      ])
    : {};

  if (configureAppConfig && appConfigAnswers.name) {
    const slug =
      appConfigAnswers.slug ||
      appConfigAnswers.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const configPath = join(
      targetDir,
      "packages/app-config/src/config.ts",
    );
    const configContent = `import type { AppConfig } from "./types";

export const appConfig = {
  name: ${JSON.stringify(appConfigAnswers.name)},
  slug: ${JSON.stringify(slug)},
  description: ${JSON.stringify(appConfigAnswers.description || "Build your next big thing")},
  slogan: ${JSON.stringify(appConfigAnswers.slogan || "Ship ideas at the speed of thought")},
  version: "0.1.0",

  colors: {
    primary: ${JSON.stringify(appConfigAnswers.primaryColor || "#0D9373")},
  },

  urls: {
    website: ${JSON.stringify(appConfigAnswers.website || "https://example.com")},
    api: "http://localhost:3001",
    docs: ${JSON.stringify(`https://docs.${(appConfigAnswers.website || "example.com").replace(/^https?:\/\//, "")}`)},
    supportEmail: ${JSON.stringify(appConfigAnswers.supportEmail || "support@example.com")},
  },

  mobile: {
    bundleId: ${JSON.stringify(`com.${slug}.app`)},
    scheme: ${JSON.stringify(slug)},
  },

  socials: {
    github: ${JSON.stringify(appConfigAnswers.github || "https://github.com")},
  },
} satisfies AppConfig;
`;
    writeFileSync(configPath, configContent);
    console.log(kleur.green("  ✔ App config written"));
  } else if (!configureAppConfig) {
    console.log(
      kleur.dim("  Skipped — edit ") +
        kleur.bold("packages/app-config/src/config.ts") +
        kleur.dim(" then run ") +
        kleur.bold("pnpm sync-config"),
    );
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

  // Done — cd into project and start dev server
  console.log();
  console.log(kleur.green().bold("  ✔ Project ready!"));
  console.log();
  console.log(
    kleur.dim("  To update branding, edit: ") +
      kleur.bold("packages/app-config/src/config.ts"),
  );
  console.log(
    kleur.dim("  Then run: ") +
      kleur.bold("pnpm sync-config") +
      kleur.dim(" to apply branding everywhere."),
  );
  console.log();

  console.log(kleur.cyan("  Starting dev server...\n"));
  await execa("pnpm", ["dev"], {
    cwd: targetDir,
    stdio: "inherit",
  });
}
