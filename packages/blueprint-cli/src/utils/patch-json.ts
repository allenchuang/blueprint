import { readFileSync, writeFileSync, existsSync } from "node:fs";

export function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export function writeJson(filePath: string, data: Record<string, unknown>): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

export function removeDeps(
  packageJsonPath: string,
  depsToRemove: string[],
): void {
  if (!existsSync(packageJsonPath)) return;
  const pkg = readJson(packageJsonPath);

  for (const field of ["dependencies", "devDependencies"] as const) {
    const deps = pkg[field] as Record<string, string> | undefined;
    if (!deps) continue;
    for (const dep of depsToRemove) {
      delete deps[dep];
    }
  }

  writeJson(packageJsonPath, pkg);
}

export function removeScripts(
  packageJsonPath: string,
  scriptNames: string[],
): void {
  if (!existsSync(packageJsonPath)) return;
  const pkg = readJson(packageJsonPath);
  const scripts = pkg.scripts as Record<string, string> | undefined;
  if (!scripts) return;

  for (const name of scriptNames) {
    delete scripts[name];
  }

  writeJson(packageJsonPath, pkg);
}

export function removeTurboTasks(
  turboJsonPath: string,
  taskNames: string[],
): void {
  if (!existsSync(turboJsonPath)) return;
  const turbo = readJson(turboJsonPath);
  const tasks = turbo.tasks as Record<string, unknown> | undefined;
  if (!tasks) return;

  for (const name of taskNames) {
    delete tasks[name];
  }

  writeJson(turboJsonPath, turbo);
}
