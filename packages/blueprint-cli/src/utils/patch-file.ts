import { readFileSync, writeFileSync, existsSync } from "node:fs";
import type { LayoutPatch } from "../features/index.js";

export function patchFile(filePath: string, patches: LayoutPatch[]): void {
  if (!existsSync(filePath)) return;

  let content = readFileSync(filePath, "utf-8");

  for (const patch of patches) {
    switch (patch.type) {
      case "remove-import":
        content = removeImportLine(content, patch.match);
        break;
      case "remove-wrapper":
        content = removeJsxWrapper(content, patch.match);
        break;
      case "remove-block":
        content = removeBlock(content, patch.match);
        break;
      case "remove-line":
        content = removeLine(content, patch.match);
        break;
    }
  }

  writeFileSync(filePath, content);
}

function removeImportLine(content: string, match: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    if (line.includes(match) && (line.trimStart().startsWith("import") || line.trimStart().startsWith("const {"))) {
      // Skip multi-line imports
      if (!line.includes(";") && !line.includes("from")) {
        while (i < lines.length && !lines[i]!.includes(";") && !lines[i]!.includes("from")) {
          i++;
        }
      }
      i++;
      continue;
    }
    result.push(line);
    i++;
  }

  return result.join("\n");
}

function removeJsxWrapper(content: string, tagName: string): string {
  // Handle inline wrapper: <Tag>{children}</Tag> on the same line
  const inlineRegex = new RegExp(
    `(<${tagName}[^>]*>)([\\s\\S]*?)(</${tagName}>)`,
    "g",
  );
  content = content.replace(inlineRegex, "$2");

  // Handle multi-line: opening tag on its own line
  const openRegex = new RegExp(`^[ \t]*<${tagName}[^>]*>\\s*\\n?`, "gm");
  content = content.replace(openRegex, "");

  // Handle multi-line: closing tag on its own line
  const closeRegex = new RegExp(`^[ \t]*</${tagName}>\\s*\\n?`, "gm");
  content = content.replace(closeRegex, "");

  return content;
}

function removeBlock(content: string, match: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let skipping = false;
  let braceDepth = 0;

  for (const line of lines) {
    if (!skipping && line.includes(match)) {
      skipping = true;
      braceDepth = 0;
    }

    if (skipping) {
      for (const ch of line) {
        if (ch === "{" || ch === "(") braceDepth++;
        if (ch === "}" || ch === ")") braceDepth--;
      }
      if (braceDepth <= 0 && line.trim() !== "") {
        // Check if this is the last line of the block
        if (braceDepth <= 0) {
          skipping = false;
        }
      }
      continue;
    }

    result.push(line);
  }

  return result.join("\n");
}

function removeLine(content: string, match: string): string {
  const lines = content.split("\n");
  return lines.filter((line) => !line.includes(match)).join("\n");
}

export function removeEnvKeys(
  envFilePath: string,
  keysToRemove: string[],
): void {
  if (!existsSync(envFilePath)) return;

  const lines = readFileSync(envFilePath, "utf-8").split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const trimmed = line.trim();

    const isKeyLine = keysToRemove.some((key) => {
      if (trimmed.startsWith(`${key}=`)) return true;
      if (trimmed === key) return true;
      return false;
    });

    if (isKeyLine) {
      // Walk backwards to remove associated comment block
      while (result.length > 0 && result[result.length - 1]!.trim().startsWith("#")) {
        result.pop();
      }
      // Also remove a trailing blank line from the block above
      while (result.length > 0 && result[result.length - 1]!.trim() === "") {
        result.pop();
      }
      continue;
    }

    result.push(line);
  }

  // Clean up multiple consecutive blank lines
  const cleaned: string[] = [];
  for (const line of result) {
    if (line.trim() === "" && cleaned.length > 0 && cleaned[cleaned.length - 1]!.trim() === "") {
      continue;
    }
    cleaned.push(line);
  }

  writeFileSync(envFilePath, cleaned.join("\n"));
}

export function removeI18nKeys(
  localeFilePath: string,
  keysToRemove: string[],
): void {
  if (!existsSync(localeFilePath)) return;

  const data = JSON.parse(readFileSync(localeFilePath, "utf-8"));

  for (const key of keysToRemove) {
    delete data[key];
  }

  writeFileSync(localeFilePath, JSON.stringify(data, null, 2) + "\n");
}

const APP_CONFIG_KEYS: Record<string, string> = {
  appName: "appConfig.name",
  appDescription: "appConfig.description",
  appSlogan: "appConfig.slogan",
};

export function replaceI18nWithStrings(
  componentFilePath: string,
  translations: Record<string, string>,
): void {
  if (!existsSync(componentFilePath)) return;

  let content = readFileSync(componentFilePath, "utf-8");
  let needsAppConfigImport = false;

  // Remove useTranslation import and hook call
  content = removeImportLine(content, "useTranslation");
  content = removeLine(content, "const { t } = useTranslation()");

  // Replace t("key") in JSX children: {t("key")}
  content = content.replace(/\{t\("([^"]+)"\)\}/g, (_match, key: string) => {
    if (APP_CONFIG_KEYS[key]) {
      needsAppConfigImport = true;
      return `{${APP_CONFIG_KEYS[key]}}`;
    }
    return translations[key] ?? key;
  });

  // Replace t("key") in props: title={t("key")}
  content = content.replace(/t\("([^"]+)"\)/g, (_match, key: string) => {
    if (APP_CONFIG_KEYS[key]) {
      needsAppConfigImport = true;
      return APP_CONFIG_KEYS[key]!;
    }
    const value = translations[key] ?? key;
    return JSON.stringify(value);
  });

  // Add appConfig import if needed and not already present
  if (needsAppConfigImport && !content.includes("@repo/app-config")) {
    content = content.replace(
      /^("use client";\n?\n?)/,
      '$1import { appConfig } from "@repo/app-config";\n',
    );
  }

  writeFileSync(componentFilePath, content);
}
