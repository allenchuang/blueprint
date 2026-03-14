#!/usr/bin/env node
import { Command } from "commander";
import kleur from "kleur";
import { newCommand } from "./commands/new.js";
import { runCommand, listProxyCommands } from "./commands/run.js";

const program = new Command();

program
  .name("blueprint-stack")
  .description("Scaffold and manage a Blueprint monorepo")
  .version("0.1.0");

// blueprint new <project-name>
program
  .command("new <project-name>")
  .description("Scaffold a new Blueprint monorepo project")
  .action(async (projectName: string) => {
    await newCommand(projectName);
  });

// Proxy commands: dev, build, lint, check-types, sync-config, db:*
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

program.addHelpText(
  "after",
  `
${kleur.bold("Examples:")}
  ${kleur.cyan("npx blueprint-stack new")} my-app       Scaffold a new project
  ${kleur.cyan("blueprint-stack dev")}                  Start all apps
  ${kleur.cyan("blueprint-stack dev:web")}              Start the web app only
  ${kleur.cyan("blueprint-stack sync-config")}          Sync branding & theme to all apps
  ${kleur.cyan("blueprint-stack db:push")}              Push DB schema changes
`,
);

program.parse(process.argv);
