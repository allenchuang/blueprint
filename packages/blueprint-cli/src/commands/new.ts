import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execa } from "execa";
import kleur from "kleur";
import ora from "ora";
import prompts from "prompts";
import type { FeatureSelections, DatabaseProvider } from "../features/index.js";
import {
  APP_MANIFESTS,
  AUTH_MANIFESTS,
  INTEGRATION_MANIFESTS,
  WEB_FEATURE_MANIFESTS,
  LANGUAGE_OPTIONS,
} from "../features/index.js";
import { stripFeatures } from "../features/strip.js";

const REPO_URL = "https://github.com/allenchuang/blueprint.git";
const REQUIRED_NODE_MAJOR = 23;

const DATABASE_OPTIONS: { value: DatabaseProvider; title: string; description: string }[] = [
  { value: "neon", title: "Neon PostgreSQL", description: "Serverless (current default)" },
  { value: "supabase", title: "Supabase", description: "Supabase-hosted PostgreSQL" },
  { value: "pg", title: "Standard PostgreSQL", description: "postgres.js driver" },
  { value: "none", title: "None", description: "No database" },
];

const DB_REQUIRED_FEATURES = new Set(["stripe", "dynamic", "privy"]);

export interface NewCommandOptions {
  withAdmin?: boolean;
  withMobile?: boolean;
  withDocs?: boolean;
  withRemotion?: boolean;
  withDynamic?: boolean;
  withPrivy?: boolean;
  withStripe?: boolean;
  withElevenlabs?: boolean;
  withMinikit?: boolean;
  withAnalytics?: boolean;
  withI18n?: boolean;
  withPwa?: boolean;
  db?: string;
  all?: boolean;
  minimal?: boolean;
}

async function hasNvm(): Promise<boolean> {
  try {
    await execa("bash", ["-c", 'command -v nvm || [ -s "$NVM_DIR/nvm.sh" ]'], {
      stdio: "pipe",
      shell: true,
    });
    return true;
  } catch {
    return false;
  }
}

async function installNodeWithNvm(version: string): Promise<boolean> {
  const spinner = ora(`Installing Node.js ${version} via nvm...`).start();
  try {
    const nvmScript = `
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
      nvm install ${version} && nvm alias default ${version}
    `;
    await execa("bash", ["-c", nvmScript], { stdio: "pipe" });
    spinner.succeed(`Node.js ${version} installed`);
    return true;
  } catch {
    spinner.fail(`Could not install Node.js ${version} via nvm`);
    return false;
  }
}

async function getNvmNodePath(version: string): Promise<string | null> {
  try {
    const nvmScript = `
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
      nvm which ${version}
    `;
    const { stdout } = await execa("bash", ["-c", nvmScript], { stdio: "pipe" });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function reExecWithNode(nodePath: string, args: string[]): Promise<never> {
  const cliEntry = new URL("../index.js", import.meta.url).pathname;
  const { exitCode } = await execa(nodePath, [cliEntry, ...args], {
    stdio: "inherit",
    reject: false,
  });
  process.exit(exitCode ?? 0);
}

function checkNodeVersion(): { ok: boolean; current: string; required: number } {
  const current = process.version;
  const major = Number.parseInt(current.slice(1).split(".")[0]!, 10);
  return { ok: major >= REQUIRED_NODE_MAJOR, current, required: REQUIRED_NODE_MAJOR };
}

function resolveSelectionsFromFlags(opts: NewCommandOptions): FeatureSelections | null {
  const hasAnyFlag =
    opts.all ||
    opts.minimal ||
    opts.withAdmin ||
    opts.withMobile ||
    opts.withDocs ||
    opts.withRemotion ||
    opts.withDynamic ||
    opts.withPrivy ||
    opts.withStripe ||
    opts.withElevenlabs ||
    opts.withMinikit ||
    opts.withAnalytics ||
    opts.withI18n ||
    opts.withPwa ||
    opts.db;

  if (!hasAnyFlag) return null;

  if (opts.all) {
    return {
      apps: APP_MANIFESTS.map((m) => m.id),
      auth: "dynamic",
      integrations: INTEGRATION_MANIFESTS.map((m) => m.id),
      webFeatures: WEB_FEATURE_MANIFESTS.map((m) => m.id),
      database: (opts.db as DatabaseProvider) || "neon",
      languages: LANGUAGE_OPTIONS.slice(0, 3).map((l) => l.code),
    };
  }

  if (opts.minimal) {
    return {
      apps: [],
      auth: "none",
      integrations: [],
      webFeatures: [],
      database: (opts.db as DatabaseProvider) || "neon",
      languages: [],
    };
  }

  const apps: string[] = [];
  if (opts.withAdmin) apps.push("admin");
  if (opts.withMobile) apps.push("mobile");
  if (opts.withDocs) apps.push("docs");
  if (opts.withRemotion) apps.push("remotion");

  let auth = "none";
  if (opts.withDynamic) auth = "dynamic";
  if (opts.withPrivy) auth = "privy";

  const integrations: string[] = [];
  if (opts.withStripe) integrations.push("stripe");
  if (opts.withElevenlabs) integrations.push("elevenlabs");
  if (opts.withMinikit) integrations.push("minikit");
  if (opts.withAnalytics) integrations.push("analytics");

  const webFeatures: string[] = [];
  if (opts.withI18n) webFeatures.push("i18n");
  if (opts.withPwa) webFeatures.push("pwa");

  return {
    apps,
    auth,
    integrations,
    webFeatures,
    database: (opts.db as DatabaseProvider) || "neon",
    languages: webFeatures.includes("i18n") ? ["en"] : [],
  };
}

async function promptFeatureSelections(): Promise<FeatureSelections> {
  console.log();
  console.log(kleur.bold("  Feature Selection"));
  console.log(kleur.dim("  Choose which optional features to include\n"));

  const { apps } = await prompts({
    type: "multiselect",
    name: "apps",
    message: "Which apps to include? (Web + Server always included)",
    choices: APP_MANIFESTS.map((m) => ({
      title: m.name,
      value: m.id,
      description: m.description,
    })),
    instructions: false,
    hint: "- Space to toggle. Enter to skip (default: none)",
  });

  if (!apps) {
    console.log(kleur.dim("\n  Cancelled.\n"));
    process.exit(0);
  }

  const AUTH_OPTIONS = [
    { title: "None", value: "none", description: "No authentication" },
    ...AUTH_MANIFESTS.map((m) => ({
      title: m.name,
      value: m.id,
      description: m.description,
    })),
  ];

  const { auth } = await prompts({
    type: "select",
    name: "auth",
    message: "Auth provider:",
    choices: AUTH_OPTIONS,
    initial: 0,
  });

  if (auth === undefined) {
    console.log(kleur.dim("\n  Cancelled.\n"));
    process.exit(0);
  }

  const { integrations } = await prompts({
    type: "multiselect",
    name: "integrations",
    message: "Which integrations to include?",
    choices: INTEGRATION_MANIFESTS.map((m) => ({
      title: m.name,
      value: m.id,
      description: m.description,
    })),
    instructions: false,
    hint: "- Space to toggle. Enter to skip (default: none)",
  });

  if (!integrations) {
    console.log(kleur.dim("\n  Cancelled.\n"));
    process.exit(0);
  }

  const { webFeatures } = await prompts({
    type: "multiselect",
    name: "webFeatures",
    message: "Which web features to include?",
    choices: WEB_FEATURE_MANIFESTS.map((m) => ({
      title: m.name,
      value: m.id,
      description: m.description,
    })),
    instructions: false,
    hint: "- Space to toggle. Enter to skip (default: none)",
  });

  if (!webFeatures) {
    console.log(kleur.dim("\n  Cancelled.\n"));
    process.exit(0);
  }

  // If i18n selected, prompt for languages
  let languages: string[] = [];
  if ((webFeatures as string[]).includes("i18n")) {
    const { selectedLangs } = await prompts({
      type: "multiselect",
      name: "selectedLangs",
      message: "Which languages to support?",
      choices: LANGUAGE_OPTIONS.map((l) => ({
        title: `${l.name} (${l.nativeName})`,
        value: l.code,
        selected: l.code === "en",
      })),
      instructions: false,
      hint: "- Space to toggle. Enter to confirm (default: English only)",
    });

    if (!selectedLangs) {
      console.log(kleur.dim("\n  Cancelled.\n"));
      process.exit(0);
    }

    languages = selectedLangs as string[];
    if (!languages.includes("en")) {
      languages.unshift("en");
    }
  }

  const { database } = await prompts({
    type: "select",
    name: "database",
    message: "Database provider:",
    choices: DATABASE_OPTIONS.map((o) => ({
      title: o.title,
      value: o.value,
      description: o.description,
    })),
    initial: 0,
  });

  if (!database && database !== 0) {
    console.log(kleur.dim("\n  Cancelled.\n"));
    process.exit(0);
  }

  return { apps, auth, integrations, webFeatures, database, languages };
}

function validateSelections(selections: FeatureSelections): FeatureSelections {
  if (selections.database === "none") {
    const conflicting = selections.integrations.filter((id) => DB_REQUIRED_FEATURES.has(id));
    if (selections.auth !== "none" && DB_REQUIRED_FEATURES.has(selections.auth)) {
      conflicting.push(selections.auth);
    }
    if (conflicting.length > 0) {
      const names = conflicting.join(", ");
      console.log(
        kleur.yellow(`\n  ⚠ ${names} require a database — removing them since --db=none was selected.`),
      );
      selections.integrations = selections.integrations.filter(
        (id) => !DB_REQUIRED_FEATURES.has(id),
      );
      if (DB_REQUIRED_FEATURES.has(selections.auth)) {
        selections.auth = "none";
      }
    }
  }

  return selections;
}

export async function newCommand(
  projectName: string,
  opts: NewCommandOptions = {},
): Promise<void> {
  const targetDir = resolve(process.cwd(), projectName);

  if (existsSync(targetDir)) {
    console.error(
      kleur.red(`✖ Directory already exists: ${kleur.bold(projectName)}`),
    );
    process.exit(1);
  }

  // Check Node.js version early
  const nodeCheck = checkNodeVersion();
  if (!nodeCheck.ok) {
    console.log(
      kleur.yellow(
        `  ⚠ Node.js ${kleur.bold(nodeCheck.current)} detected — Blueprint requires ${kleur.bold(`v${nodeCheck.required}+`)}.`,
      ),
    );

    const nvmAvailable = await hasNvm();

    if (nvmAvailable) {
      const { installNode } = await prompts({
        type: "confirm",
        name: "installNode",
        message: `Install Node.js ${nodeCheck.required} via nvm now?`,
        initial: true,
      });

      if (installNode) {
        const installed = await installNodeWithNvm(String(nodeCheck.required));
        if (installed) {
          console.log(kleur.green(`  ✔ Node.js ${nodeCheck.required} is now active.\n`));
          const nodePath = await getNvmNodePath(String(nodeCheck.required));
          if (nodePath) {
            console.log(
              kleur.dim("  Restarting with Node.js ") +
                kleur.bold(`${nodeCheck.required}`) +
                kleur.dim("...\n"),
            );
            await reExecWithNode(nodePath, ["new", projectName]);
          }
          console.log(kleur.dim("  Could not auto-restart. Re-run manually:\n"));
          console.log(kleur.bold(`    npx blueprint-stack new ${projectName}\n`));
          process.exit(0);
        }
      }
    } else {
      console.log(
        kleur.dim("  nvm not found. Install it from ") +
          kleur.bold("https://github.com/nvm-sh/nvm") +
          kleur.dim(" then run:"),
      );
      console.log(kleur.bold(`    nvm install ${nodeCheck.required}`));
      console.log(kleur.bold(`    nvm use ${nodeCheck.required}\n`));
    }

    const { continueAnyway } = await prompts({
      type: "confirm",
      name: "continueAnyway",
      message: `Continue with Node.js ${nodeCheck.current}? (some apps may not work)`,
      initial: false,
    });

    if (!continueAnyway) {
      process.exit(0);
    }

    console.log();
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

  // Feature selection
  let selections = resolveSelectionsFromFlags(opts);
  if (!selections) {
    selections = await promptFeatureSelections();
  }
  selections = validateSelections(selections);

  // Strip deselected features
  const stripSpinner = ora("Customizing project...").start();
  try {
    stripFeatures(targetDir, selections);
    stripSpinner.succeed("Project customized");
  } catch (err) {
    stripSpinner.fail("Feature customization had issues");
    const message = err instanceof Error ? err.message : String(err);
    console.error(kleur.dim(message));
  }

  // Prompt for app config branding
  console.log();
  console.log(kleur.bold("  App Config"));
  console.log(kleur.dim("  These values populate packages/app-config/src/config.ts\n"));

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
          initial: "Blueprint",
        },
        {
          type: "text",
          name: "slug",
          message: "App slug (lowercase, no spaces):",
          initial: (prev: string) => prev.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
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
    const configPath = join(targetDir, "packages/app-config/src/config.ts");
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
    const envLines: string[] = [];

    if (selections.database !== "none") {
      const dbLabel =
        selections.database === "supabase"
          ? "DATABASE_URL (Supabase connection string):"
          : selections.database === "pg"
            ? "DATABASE_URL (PostgreSQL connection string):"
            : "DATABASE_URL (Neon PostgreSQL connection string):";

      const dbPlaceholder =
        selections.database === "supabase"
          ? "postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
          : selections.database === "pg"
            ? "postgresql://user:password@localhost:5432/mydb"
            : "postgresql://user:password@host/database?sslmode=require";

      const { databaseUrl } = await prompts({
        type: "text",
        name: "databaseUrl",
        message: dbLabel,
        initial: dbPlaceholder,
      });

      if (databaseUrl) {
        envLines.push(`DATABASE_URL=${databaseUrl}`);
      }
    }

    if (envLines.length > 0) {
      writeFileSync(join(targetDir, ".env"), envLines.join("\n") + "\n");
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

  // Read the .nvmrc from the scaffolded project
  let nvmrcVersion = String(REQUIRED_NODE_MAJOR);
  try {
    nvmrcVersion = readFileSync(join(targetDir, ".nvmrc"), "utf-8").trim();
  } catch {
    // fall back to REQUIRED_NODE_MAJOR
  }

  // Done
  console.log();
  console.log(kleur.green().bold("  ✔ Project ready!"));
  console.log();

  // Print summary
  const includedApps = ["Web", ...selections.apps.map((id) => {
    const m = APP_MANIFESTS.find((m) => m.id === id);
    return m?.name ?? id;
  })];
  console.log(
    kleur.dim("  Apps: ") + kleur.bold(includedApps.join(", ")),
  );
  if (selections.auth !== "none") {
    const authManifest = AUTH_MANIFESTS.find((m) => m.id === selections.auth);
    console.log(kleur.dim("  Auth: ") + kleur.bold(authManifest?.name ?? selections.auth));
  }
  if (selections.integrations.length > 0) {
    const names = selections.integrations.map((id) => {
      const m = INTEGRATION_MANIFESTS.find((m) => m.id === id);
      return m?.name ?? id;
    });
    console.log(kleur.dim("  Integrations: ") + kleur.bold(names.join(", ")));
  }
  if (selections.webFeatures.length > 0) {
    const names = selections.webFeatures.map((id) => {
      const m = WEB_FEATURE_MANIFESTS.find((m) => m.id === id);
      return m?.name ?? id;
    });
    console.log(kleur.dim("  Web features: ") + kleur.bold(names.join(", ")));
  }
  const dbOption = DATABASE_OPTIONS.find((o) => o.value === selections.database);
  console.log(kleur.dim("  Database: ") + kleur.bold(dbOption?.title ?? selections.database));
  console.log();

  if (!nodeCheck.ok) {
    console.log(
      kleur.yellow(`  ⚠ Remember: this project requires Node.js ${kleur.bold(`v${nvmrcVersion}+`)}.\n`),
    );
    console.log(kleur.dim("  Switch to the correct version before developing:\n"));
    console.log(kleur.bold(`    cd ${projectName}`));
    console.log(kleur.bold(`    nvm install ${nvmrcVersion}  ${kleur.dim("# first time only")}`));
    console.log(kleur.bold("    nvm use"));
    console.log();
  }

  console.log(
    kleur.dim("  To update branding, edit: ") + kleur.bold("packages/app-config/src/config.ts"),
  );
  console.log(
    kleur.dim("  Then run: ") +
      kleur.bold("pnpm sync-config") +
      kleur.dim(" to apply branding everywhere."),
  );
  console.log();

  const { startDev } = await prompts({
    type: "confirm",
    name: "startDev",
    message: "Start the dev server now?",
    initial: true,
  });

  if (startDev) {
    console.log(kleur.cyan("  Starting dev server...\n"));
    try {
      await execa("pnpm", ["dev"], {
        cwd: targetDir,
        stdio: "inherit",
      });
    } catch {
      console.log();
      console.log(
        kleur.yellow("  ⚠ Dev server exited with errors (some apps may require a newer Node.js version)."),
      );
      console.log(
        kleur.dim("  You can restart individual apps with: ") +
          kleur.bold("pnpm dev:web") +
          kleur.dim(", ") +
          kleur.bold("pnpm dev:server") +
          kleur.dim(", etc."),
      );
    }
  } else {
    console.log();
    console.log(kleur.dim("  To start developing, run:\n"));
    console.log(kleur.bold(`    cd ${projectName}`));
    if (!nodeCheck.ok) {
      console.log(kleur.bold("    nvm use"));
    }
    console.log(kleur.bold("    pnpm dev"));
  }

  console.log();
}
