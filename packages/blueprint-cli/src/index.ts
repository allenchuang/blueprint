#!/usr/bin/env node
import { Command } from "commander";
import kleur from "kleur";
import prompts from "prompts";
import { newCommand } from "./commands/new.js";
import { runCommand, listProxyCommands } from "./commands/run.js";
import { printLogo } from "./utils/logo.js";

const program = new Command();

program
  .name("blueprint-stack")
  .description("Scaffold and manage a Blueprint monorepo")
  .version("0.1.0");

program
  .command("new [project-name]")
  .description("Scaffold a new Blueprint monorepo project")
  .action(async (projectName?: string) => {
    printLogo();

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

    await newCommand(projectName!);
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
  printLogo();

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
