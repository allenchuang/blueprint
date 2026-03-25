#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Command } from "commander";
import kleur from "kleur";
import prompts from "prompts";
import { newCommand } from "./commands/new.js";
import type { NewCommandOptions } from "./commands/new.js";
import { runCommand, listProxyCommands } from "./commands/run.js";
import { printLogo } from "./utils/logo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf-8"),
);
const CLI_VERSION: string = pkg.version;

const program = new Command();

program
  .name("blueprint-stack")
  .description("Scaffold and manage a Blueprint monorepo")
  .version(CLI_VERSION);

program
  .command("new [project-name]")
  .description("Scaffold a new Blueprint monorepo project")
  .option("--with-admin", "Include Admin Panel")
  .option("--with-mobile", "Include React Native app")
  .option("--with-docs", "Include Mintlify docs")
  .option("--with-remotion", "Include Remotion video generation")
  .option("--with-dynamic", "Include Dynamic Auth")
  .option("--with-privy", "Include Privy Auth")
  .option("--with-stripe", "Include Stripe Payments")
  .option("--with-elevenlabs", "Include ElevenLabs Voice Agent")
  .option("--with-minikit", "Include World MiniKit")
  .option("--with-analytics", "Include Google Analytics")
  .option("--with-i18n", "Include internationalization")
  .option("--with-pwa", "Include Mobile Web / PWA patterns")
  .option("--db <provider>", "Database: neon | supabase | pg | none", "neon")
  .option("--all", "Include all optional features")
  .option("--minimal", "Minimal scaffold (web + server only, no integrations)")
  .action(async (projectName: string | undefined, opts: NewCommandOptions) => {
    printLogo(CLI_VERSION);

    if (!projectName) {
      const { name } = await prompts({
        type: "text",
        name: "name",
        message: "What is the name of your app?",
        initial: "my-app",
        validate: (v: string) => (v.trim() ? true : "Name cannot be empty"),
      });

      if (!name) {
        console.log(kleur.dim("\n  Cancelled.\n"));
        process.exit(0);
      }
      projectName = name;
    }

    await newCommand(projectName!, opts);
  });

const proxyCommands = listProxyCommands();

for (const cmdName of proxyCommands) {
  program
    .command(cmdName)
    .description(`Run ${kleur.bold(cmdName)} in the monorepo root`)
    .allowUnknownOption()
    .action(async () => {
      await runCommand(cmdName);
    });
}

// When run with no arguments, show logo and prompt
if (process.argv.length <= 2) {
  printLogo(CLI_VERSION);

  (async () => {
    const { name } = await prompts({
      type: "text",
      name: "name",
      message: "What is the name of your app?",
      initial: "my-app",
      validate: (v: string) => (v.trim() ? true : "Name cannot be empty"),
    });

    if (!name) {
      console.log(kleur.dim("\n  Cancelled.\n"));
      process.exit(0);
    }

    await newCommand(name);
  })();
} else {
  program.parse(process.argv);
}
