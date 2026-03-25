import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import kleur from "kleur";
import prompts from "prompts";

// ---------------------------------------------------------------------------
// Provider definitions (matching openclaw provider IDs)
// ---------------------------------------------------------------------------

export interface AiProvider {
  id: string;
  name: string;
  envKey: string;
  modelEnvKey: string;
  models: Array<{ value: string; title: string; description?: string }>;
  isLocal?: boolean; // Ollama — no API key, just a URL
  isGateway?: boolean; // OpenRouter — free-text model entry
  urlEnvKey?: string; // Ollama base URL
}

export const AI_PROVIDERS: AiProvider[] = [
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    envKey: "ANTHROPIC_API_KEY",
    modelEnvKey: "ANTHROPIC_MODEL",
    models: [
      { value: "claude-opus-4-6", title: "claude-opus-4-6", description: "Most capable" },
      { value: "claude-sonnet-4-6", title: "claude-sonnet-4-6", description: "Balanced" },
      { value: "claude-haiku-4-5", title: "claude-haiku-4-5", description: "Fastest / cheapest" },
    ],
  },
  {
    id: "openai",
    name: "OpenAI (GPT)",
    envKey: "OPENAI_API_KEY",
    modelEnvKey: "OPENAI_MODEL",
    models: [
      { value: "gpt-5.4", title: "gpt-5.4", description: "Default flagship" },
      { value: "gpt-5.4-pro", title: "gpt-5.4-pro", description: "Maximum performance" },
      { value: "gpt-5.4-mini", title: "gpt-5.4-mini", description: "Fast & efficient" },
    ],
  },
  {
    id: "google",
    name: "Google Gemini",
    envKey: "GEMINI_API_KEY",
    modelEnvKey: "GEMINI_MODEL",
    models: [
      { value: "gemini-3.1-pro-preview", title: "gemini-3.1-pro-preview", description: "Latest & most capable" },
      { value: "gemini-3.1-flash-lite", title: "gemini-3.1-flash-lite", description: "Cost-efficient / low latency" },
      { value: "gemini-2.0-flash", title: "gemini-2.0-flash", description: "Legacy" },
    ],
  },
  {
    id: "mistral",
    name: "Mistral AI",
    envKey: "MISTRAL_API_KEY",
    modelEnvKey: "MISTRAL_MODEL",
    models: [
      { value: "mistral-large-latest", title: "mistral-large-latest", description: "Flagship" },
      { value: "mistral-large-3", title: "mistral-large-3", description: "Previous flagship" },
      { value: "mistral-small-4", title: "mistral-small-4", description: "Lightweight" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    envKey: "DEEPSEEK_API_KEY",
    modelEnvKey: "DEEPSEEK_MODEL",
    models: [
      { value: "deepseek-chat", title: "deepseek-chat", description: "DeepSeek V3.2 — general purpose" },
      { value: "deepseek-reasoner", title: "deepseek-reasoner", description: "Chain-of-thought reasoning" },
    ],
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    envKey: "XAI_API_KEY",
    modelEnvKey: "XAI_MODEL",
    models: [
      { value: "grok-4", title: "grok-4", description: "Latest flagship" },
      { value: "grok-4-0709", title: "grok-4-0709", description: "Stable dated release" },
      { value: "grok-4-fast-reasoning", title: "grok-4-fast-reasoning", description: "Fast reasoning" },
      { value: "grok-code-fast-1", title: "grok-code-fast-1", description: "Coding-optimized" },
    ],
  },
  {
    id: "groq",
    name: "Groq",
    envKey: "GROQ_API_KEY",
    modelEnvKey: "GROQ_MODEL",
    models: [
      { value: "llama-3.3-70b-versatile", title: "llama-3.3-70b-versatile", description: "Recommended default" },
      { value: "llama-3.1-8b-instant", title: "llama-3.1-8b-instant", description: "Ultra-fast" },
      { value: "gemma-2-9b", title: "gemma-2-9b", description: "Google Gemma on Groq" },
      { value: "mixtral-8x7b", title: "mixtral-8x7b", description: "Mixtral MoE" },
    ],
  },
  {
    id: "together",
    name: "Together AI",
    envKey: "TOGETHER_API_KEY",
    modelEnvKey: "TOGETHER_MODEL",
    models: [
      { value: "moonshotai/Kimi-K2.5", title: "Kimi-K2.5", description: "Default" },
      { value: "meta-llama/Llama-3.3-70B-Instruct-Turbo", title: "Llama-3.3-70B-Turbo", description: "Meta Llama" },
      { value: "meta-llama/Llama-4-Scout", title: "Llama-4-Scout", description: "Latest Llama 4" },
      { value: "deepseek-ai/DeepSeek-V3.1", title: "DeepSeek-V3.1", description: "Via Together" },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter (gateway)",
    envKey: "OPENROUTER_API_KEY",
    modelEnvKey: "OPENROUTER_MODEL",
    isGateway: true,
    models: [],
  },
  {
    id: "ollama",
    name: "Ollama (local)",
    envKey: "OLLAMA_API_KEY",
    modelEnvKey: "OLLAMA_MODEL",
    urlEnvKey: "OLLAMA_BASE_URL",
    isLocal: true,
    models: [
      { value: "llama3.3", title: "llama3.3", description: "Default local model" },
      { value: "glm-4.7-flash", title: "glm-4.7-flash", description: "GLM cloud/local" },
      { value: "kimi-k2.5:cloud", title: "kimi-k2.5:cloud", description: "Kimi via Ollama cloud" },
    ],
  },
];

// ---------------------------------------------------------------------------
// openclaw config detection
// ---------------------------------------------------------------------------

interface OpenclawDetected {
  /** Map of env var name → value extracted from openclaw config */
  keys: Record<string, string>;
  /** Default model string like "anthropic/claude-opus-4-6" */
  defaultModel?: string;
}

function stripJson5Comments(raw: string): string {
  // Remove /* ... */ block comments
  let result = raw.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove // line comments (not inside strings — simple heuristic)
  result = result.replace(/\/\/[^\n]*/g, "");
  // Remove trailing commas before } or ]
  result = result.replace(/,\s*([}\]])/g, "$1");
  return result;
}

function parseEnvFile(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key) out[key] = val;
  }
  return out;
}

export function detectOpenclaw(): OpenclawDetected {
  const home = homedir();
  const configPath = join(home, ".openclaw", "openclaw.json");
  const envPath = join(home, ".openclaw", ".env");
  const result: OpenclawDetected = { keys: {} };

  // Read .env first
  if (existsSync(envPath)) {
    try {
      const envVars = parseEnvFile(readFileSync(envPath, "utf8"));
      Object.assign(result.keys, envVars);
    } catch {
      // ignore
    }
  }

  // Read openclaw.json (JSON5) — env block takes precedence
  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, "utf8");
      const cleaned = stripJson5Comments(raw);
      const parsed = JSON.parse(cleaned) as {
        env?: Record<string, string>;
        agents?: {
          defaults?: {
            model?: { primary?: string };
          };
        };
      };
      if (parsed.env) {
        Object.assign(result.keys, parsed.env);
      }
      result.defaultModel = parsed.agents?.defaults?.model?.primary;
    } catch {
      // ignore parse errors — openclaw config may be in a format we can't handle
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// .env upsert helper
// ---------------------------------------------------------------------------

function upsertEnvFile(envPath: string, updates: Record<string, string>): void {
  let content = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";

  for (const [key, value] of Object.entries(updates)) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^${escapedKey}=.*$`, "m");
    const line = `${key}=${value}`;
    if (regex.test(content)) {
      content = content.replace(regex, line);
    } else {
      content = content ? `${content.trimEnd()}\n${line}\n` : `${line}\n`;
    }
  }

  writeFileSync(envPath, content);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function setupAiKeys(projectDir: string): Promise<void> {
  console.log();
  console.log(kleur.bold("  AI Provider Setup"));
  console.log(kleur.dim("  Configure API keys for AI-powered features and scripts\n"));

  // Detect openclaw
  const openclaw = detectOpenclaw();
  const hasOpenclaw = Object.keys(openclaw.keys).length > 0;
  if (hasOpenclaw) {
    console.log(kleur.dim("  openclaw config detected — existing keys will be copied.\n"));
  }

  // Build provider list: openclaw-detected ones first, pre-checked
  const openclawProviderIds = new Set(
    AI_PROVIDERS
      .filter((p) => !p.isLocal && p.envKey in openclaw.keys && openclaw.keys[p.envKey])
      .map((p) => p.id),
  );

  // Ollama is special — it uses a URL, not a key
  const hasOllamaUrl = openclaw.keys["OLLAMA_BASE_URL"];

  const sortedProviders = [
    ...AI_PROVIDERS.filter((p) => openclawProviderIds.has(p.id) || (p.isLocal && hasOllamaUrl)),
    ...AI_PROVIDERS.filter((p) => !openclawProviderIds.has(p.id) && !(p.isLocal && hasOllamaUrl)),
  ];

  const choices = sortedProviders.map((p) => {
    const fromOpenclaw = openclawProviderIds.has(p.id) || (p.isLocal && !!hasOllamaUrl);
    return {
      title: fromOpenclaw
        ? `${p.name}  ${kleur.dim("(detected in openclaw — key will be copied)")}`
        : p.name,
      value: p.id,
      selected: fromOpenclaw,
    };
  });

  const { selectedIds } = await prompts({
    type: "multiselect",
    name: "selectedIds",
    message: "Select AI providers to configure:",
    choices,
    instructions: false,
    hint: "- Space to toggle. Enter to confirm",
  });

  const selectedProviderIds = (selectedIds ?? []) as string[];
  if (selectedProviderIds.length === 0) {
    console.log(kleur.dim("  Skipped AI provider setup.\n"));
    return;
  }

  const envUpdates: Record<string, string> = {};

  // Determine which default provider to set
  let defaultProvider: string | undefined;

  // Detect openclaw's default provider from its model string
  if (openclaw.defaultModel) {
    const ocProviderId = openclaw.defaultModel.split("/")[0];
    const matched = AI_PROVIDERS.find((p) => p.id === ocProviderId);
    if (matched && selectedProviderIds.indexOf(matched.id) !== -1) {
      defaultProvider = matched.id;
    }
  }

  for (const providerId of selectedProviderIds) {
    const provider = AI_PROVIDERS.find((p) => p.id === providerId);
    if (!provider) continue;

    const fromOpenclaw = openclawProviderIds.has(providerId) || (provider.isLocal && !!hasOllamaUrl);

    console.log();
    console.log(kleur.bold(`  ${provider.name}`));

    // --- Key / URL step ---
    if (provider.isLocal) {
      // Ollama: prompt for base URL
      const existingUrl = openclaw.keys["OLLAMA_BASE_URL"] || "http://localhost:11434";
      if (fromOpenclaw) {
        console.log(kleur.green(`  ✔ Using existing Ollama URL from openclaw: ${existingUrl}`));
        envUpdates["OLLAMA_BASE_URL"] = existingUrl;
      } else {
        const { ollamaUrl } = await prompts({
          type: "text",
          name: "ollamaUrl",
          message: "Ollama base URL:",
          initial: existingUrl,
        });
        const ollamaUrlStr = ollamaUrl as string | undefined;
        if (ollamaUrlStr) envUpdates["OLLAMA_BASE_URL"] = ollamaUrlStr;
      }
    } else if (fromOpenclaw) {
      console.log(kleur.green(`  ✔ Using existing ${provider.name} key from openclaw`));
      envUpdates[provider.envKey] = openclaw.keys[provider.envKey] ?? "";
    } else {
      const { apiKey } = await prompts({
        type: "password",
        name: "apiKey",
        message: `${provider.envKey}:`,
      });
      const apiKeyStr = apiKey as string | undefined;
      if (apiKeyStr) envUpdates[provider.envKey] = apiKeyStr;
      else {
        console.log(kleur.dim(`  Skipped ${provider.name}.`));
        continue;
      }
    }

    // --- Model step ---
    if (provider.isGateway) {
      // OpenRouter: free-text provider/model
      const existingModel = openclaw.keys[provider.modelEnvKey] || "";
      const { openrouterModel } = await prompts({
        type: "text",
        name: "openrouterModel",
        message: 'Model (e.g. "anthropic/claude-sonnet-4-6"):',
        initial: existingModel || "anthropic/claude-sonnet-4-6",
      });
      const openrouterModelStr = openrouterModel as string | undefined;
      if (openrouterModelStr) envUpdates[provider.modelEnvKey] = openrouterModelStr;
    } else {
      // Determine if openclaw has a pre-selected model for this provider
      const openclawModel = (() => {
        if (openclaw.defaultModel?.startsWith(`${provider.id}/`)) {
          return openclaw.defaultModel.replace(`${provider.id}/`, "");
        }
        return openclaw.keys[provider.modelEnvKey] || "";
      })();

      const defaultIndex = openclawModel
        ? provider.models.findIndex((m) => m.value === openclawModel)
        : 0;

      const modelChoices = [
        ...provider.models.map((m) => ({
          title: m.title,
          value: m.value,
          description: m.description,
        })),
        { title: "Enter manually", value: "__manual__", description: "Type a custom model ID" },
      ];

      const { selectedModel } = await prompts({
        type: "select",
        name: "selectedModel",
        message: "Select model:",
        choices: modelChoices,
        initial: defaultIndex >= 0 ? defaultIndex : 0,
      });
      const selectedModelStr = selectedModel as string | undefined;

      if (selectedModelStr === "__manual__") {
        const { manualModel } = await prompts({
          type: "text",
          name: "manualModel",
          message: "Model ID:",
          initial: openclawModel || provider.models[0]?.value || "",
        });
        const manualModelStr = manualModel as string | undefined;
        if (manualModelStr) envUpdates[provider.modelEnvKey] = manualModelStr;
      } else if (selectedModelStr) {
        envUpdates[provider.modelEnvKey] = selectedModelStr;
      }
    }

    if (!defaultProvider) defaultProvider = providerId;
  }

  // Write AI_DEFAULT_PROVIDER
  if (defaultProvider) {
    envUpdates["AI_DEFAULT_PROVIDER"] = defaultProvider;
  }

  if (Object.keys(envUpdates).length > 0) {
    const envPath = join(projectDir, ".env");
    // Add a section comment if the file doesn't already have it
    let existingContent = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
    if (!existingContent.includes("# AI Providers")) {
      existingContent = existingContent
        ? `${existingContent.trimEnd()}\n\n# AI Providers\n`
        : "# AI Providers\n";
      writeFileSync(envPath, existingContent);
    }
    upsertEnvFile(envPath, envUpdates);
    console.log();
    console.log(kleur.green("  ✔ AI provider keys written to .env"));
  }
}
