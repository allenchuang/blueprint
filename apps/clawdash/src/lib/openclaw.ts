import { readdir, readFile, stat, writeFile, copyFile } from "fs/promises";
import { join, resolve, relative } from "path";
import { homedir } from "os";
import { existsSync } from "fs";

function expandHome(p: string): string {
  if (p.startsWith("~")) return join(homedir(), p.slice(1));
  return p;
}

export function getOpenClawDir(): string {
  return expandHome(process.env.OPENCLAW_DIR || "~/.openclaw");
}

export function getWorkspaceDir(): string {
  return expandHome(
    process.env.OPENCLAW_WORKSPACE || "~/.openclaw/workspace"
  );
}

export function getAgentId(): string {
  return process.env.OPENCLAW_AGENT || "main";
}

export function getGatewayUrl(): string {
  return process.env.OPENCLAW_GATEWAY_URL || "ws://127.0.0.1:18789";
}

function isWithinDir(target: string, parent: string): boolean {
  const rel = relative(parent, target);
  return !rel.startsWith("..") && !rel.startsWith("/");
}

export interface SessionInfo {
  id: string;
  model: string;
  status: "active" | "idle" | "closed";
  tokensIn: number;
  tokensOut: number;
  costCents: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  channel?: string;
}

export async function listSessions(): Promise<SessionInfo[]> {
  const sessionsDir = join(
    getOpenClawDir(),
    "agents",
    getAgentId(),
    "sessions"
  );
  if (!existsSync(sessionsDir)) return [];

  const entries = await readdir(sessionsDir, { withFileTypes: true });
  const sessions: SessionInfo[] = [];

  for (const entry of entries) {
    // OpenClaw stores sessions as flat .jsonl files (not subdirectories)
    if (!entry.isFile() || !entry.name.endsWith(".jsonl")) continue;
    const filePath = join(sessionsDir, entry.name);
    try {
      const raw = await readFile(filePath, "utf-8");
      const lines = raw.trim().split("\n").filter(Boolean);

      let sessionId = entry.name.replace(".jsonl", "");
      let model = "unknown";
      let createdAt = new Date().toISOString();
      let updatedAt = new Date().toISOString();
      let channel: string | undefined;
      let tokensIn = 0;
      let tokensOut = 0;
      let costDollars = 0;
      let messageCount = 0;

      for (const line of lines) {
        try {
          const record = JSON.parse(line);
          // First line is session header
          if (record.type === "session") {
            sessionId = record.id || sessionId;
            createdAt = record.timestamp || createdAt;
          }
          // Message lines contain usage data
          if (record.type === "message" && record.message?.usage) {
            const usage = record.message.usage;
            tokensIn += (usage.input || 0) + (usage.cacheRead || 0) + (usage.cacheWrite || 0);
            tokensOut += usage.output || 0;
            costDollars += usage.cost?.total || 0;
            messageCount++;
            updatedAt = record.timestamp || updatedAt;
            if (!model || model === "unknown") {
              model = record.message.model || model;
            }
            channel = channel || record.message.channel;
          }
        } catch {
          // skip malformed lines
        }
      }

      sessions.push({
        id: sessionId,
        model,
        status: "idle",
        tokensIn,
        tokensOut,
        costCents: Math.round(costDollars * 100),
        messageCount,
        createdAt,
        updatedAt,
        channel,
      });
    } catch {
      // skip unreadable files
    }
  }

  return sessions.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export interface CostSummary {
  totalCents: number;
  byModel: Record<string, number>;
  byDay: Record<string, number>;
  bySession: { id: string; model: string; costCents: number }[];
}

export async function getCosts(): Promise<CostSummary> {
  const sessions = await listSessions();
  const byModel: Record<string, number> = {};
  const byDay: Record<string, number> = {};
  const bySession: CostSummary["bySession"] = [];
  let totalCents = 0;

  for (const s of sessions) {
    totalCents += s.costCents;
    byModel[s.model] = (byModel[s.model] || 0) + s.costCents;
    const day = s.createdAt.split("T")[0] || "unknown";
    byDay[day] = (byDay[day] || 0) + s.costCents;
    bySession.push({ id: s.id, model: s.model, costCents: s.costCents });
  }

  return { totalCents, byModel, byDay, bySession };
}

export interface UsageInfo {
  model: string;
  tokensUsed: number;
  tokenLimit: number;
  windowMinutes: number;
}

const MODEL_LIMITS: Record<string, { tokens: number; windowMin: number }> = {
  "anthropic/claude-opus-4-6": { tokens: 200_000, windowMin: 300 },
  "anthropic/claude-sonnet-4": { tokens: 400_000, windowMin: 300 },
  "openai/gpt-4o": { tokens: 500_000, windowMin: 60 },
  "google/gemini-2.5-pro": { tokens: 1_000_000, windowMin: 60 },
};

export async function getUsage(): Promise<UsageInfo[]> {
  const sessions = await listSessions();
  const now = Date.now();
  const modelUsage: Record<string, number> = {};

  for (const s of sessions) {
    const limits = MODEL_LIMITS[s.model];
    const windowMs = (limits?.windowMin || 300) * 60 * 1000;
    if (now - new Date(s.updatedAt).getTime() < windowMs) {
      modelUsage[s.model] =
        (modelUsage[s.model] || 0) + s.tokensIn + s.tokensOut;
    }
  }

  return Object.entries(MODEL_LIMITS).map(([model, limits]) => ({
    model,
    tokensUsed: modelUsage[model] || 0,
    tokenLimit: limits.tokens,
    windowMinutes: limits.windowMin,
  }));
}

export interface MemoryFileInfo {
  name: string;
  path: string;
  size: number;
  modifiedAt: string;
}

export async function listMemoryFiles(): Promise<MemoryFileInfo[]> {
  const workspace = getWorkspaceDir();
  const files: MemoryFileInfo[] = [];

  const topLevel = ["MEMORY.md", "HEARTBEAT.md", "AGENTS.md"];
  for (const name of topLevel) {
    const fullPath = join(workspace, name);
    try {
      const s = await stat(fullPath);
      files.push({
        name,
        path: name,
        size: s.size,
        modifiedAt: s.mtime.toISOString(),
      });
    } catch {
      // file doesn't exist
    }
  }

  const memoryDir = join(workspace, "memory");
  if (existsSync(memoryDir)) {
    const entries = await readdir(memoryDir);
    for (const entry of entries) {
      if (!entry.endsWith(".md")) continue;
      const fullPath = join(memoryDir, entry);
      try {
        const s = await stat(fullPath);
        files.push({
          name: entry,
          path: `memory/${entry}`,
          size: s.size,
          modifiedAt: s.mtime.toISOString(),
        });
      } catch {
        // skip
      }
    }
  }

  return files;
}

export async function readMemoryFile(
  filePath: string
): Promise<string | null> {
  const workspace = getWorkspaceDir();
  const fullPath = resolve(workspace, filePath);
  if (!isWithinDir(fullPath, workspace)) return null;
  try {
    return await readFile(fullPath, "utf-8");
  } catch {
    return null;
  }
}

export interface KeyFileInfo {
  name: string;
  path: string;
  type: "skill" | "config" | "file";
}

export async function listKeyFiles(): Promise<KeyFileInfo[]> {
  const workspace = getWorkspaceDir();
  const files: KeyFileInfo[] = [];

  const skillsDir = join(workspace, "skills");
  if (existsSync(skillsDir)) {
    const entries = await readdir(skillsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillPath = join("skills", entry.name, "SKILL.md");
      if (existsSync(join(workspace, skillPath))) {
        files.push({ name: entry.name, path: skillPath, type: "skill" });
      }
    }
  }

  const configFiles = ["AGENTS.md", "SOUL.md", "TOOLS.md", "USER.md"];
  for (const name of configFiles) {
    if (existsSync(join(workspace, name))) {
      files.push({ name, path: name, type: "config" });
    }
  }

  return files;
}

export async function readKeyFile(filePath: string): Promise<string | null> {
  const workspace = getWorkspaceDir();
  const fullPath = resolve(workspace, filePath);
  if (!isWithinDir(fullPath, workspace)) return null;
  try {
    return await readFile(fullPath, "utf-8");
  } catch {
    return null;
  }
}

export async function writeKeyFile(
  filePath: string,
  content: string
): Promise<boolean> {
  const workspace = getWorkspaceDir();
  const fullPath = resolve(workspace, filePath);
  if (!isWithinDir(fullPath, workspace)) return false;
  try {
    if (existsSync(fullPath)) {
      await copyFile(fullPath, `${fullPath}.bak`);
    }
    await writeFile(fullPath, content, "utf-8");
    return true;
  } catch {
    return false;
  }
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  lastRun?: string;
  command?: string;
}

export async function listCronJobs(): Promise<CronJob[]> {
  const cronPath = join(getOpenClawDir(), "cron", "jobs.json");
  try {
    const raw = await readFile(cronPath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data.jobs || [];
  } catch {
    return [];
  }
}

export async function readOpenClawConfig(): Promise<Record<string, unknown> | null> {
  const configPath = join(getOpenClawDir(), "openclaw.json");
  try {
    const raw = await readFile(configPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeOpenClawConfig(
  config: Record<string, unknown>
): Promise<boolean> {
  const configPath = join(getOpenClawDir(), "openclaw.json");
  try {
    if (existsSync(configPath)) {
      await copyFile(configPath, `${configPath}.bak`);
    }
    await writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export function isOpenClawInstalled(): boolean {
  return existsSync(getOpenClawDir());
}
