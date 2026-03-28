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

interface JournalEntry {
  type: string;
  id?: string;
  version?: number;
  timestamp?: string;
  provider?: string;
  modelId?: string;
  customType?: string;
  message?: {
    role?: string;
    content?: unknown;
    timestamp?: number;
  };
}

async function parseJsonlSession(
  sessionId: string,
  filePath: string,
  fileStat: { mtimeMs: number }
): Promise<SessionInfo | null> {
  try {
    const raw = await readFile(filePath, "utf-8");
    const lines = raw.trim().split("\n").filter(Boolean);

    let model = "unknown";
    let createdAt: string | null = null;
    let messageCount = 0;

    for (const line of lines) {
      try {
        const entry = JSON.parse(line) as JournalEntry;
        if (entry.type === "session" && entry.timestamp) {
          createdAt = entry.timestamp;
        }
        if (
          (entry.type === "model_change" ||
            entry.customType === "model-snapshot") &&
          entry.modelId
        ) {
          model = `${entry.provider ?? "anthropic"}/${entry.modelId}`;
        }
        if (
          entry.type === "message" &&
          entry.message?.role === "user"
        ) {
          messageCount++;
        }
      } catch {
        // skip malformed lines
      }
    }

    const updatedAt = new Date(fileStat.mtimeMs).toISOString();
    const ageMs = Date.now() - fileStat.mtimeMs;
    const status: SessionInfo["status"] =
      ageMs < 2 * 60 * 1000
        ? "active"
        : ageMs < 30 * 60 * 1000
          ? "idle"
          : "closed";

    return {
      id: sessionId,
      model,
      status,
      tokensIn: 0,
      tokensOut: 0,
      costCents: 0,
      messageCount,
      createdAt: createdAt ?? updatedAt,
      updatedAt,
    };
  } catch {
    return null;
  }
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
    // Support both JSONL files and subdirectory metadata.json
    if (entry.isFile() && entry.name.endsWith(".jsonl")) {
      const sessionId = entry.name.replace(/\.jsonl$/, "");
      // Skip reset files
      if (sessionId.includes(".reset.")) continue;
      const filePath = join(sessionsDir, entry.name);
      try {
        const fileStat = await stat(filePath);
        const session = await parseJsonlSession(sessionId, filePath, fileStat);
        if (session) sessions.push(session);
      } catch {
        // skip
      }
    } else if (entry.isDirectory()) {
      const metaPath = join(sessionsDir, entry.name, "metadata.json");
      try {
        const raw = await readFile(metaPath, "utf-8");
        const meta = JSON.parse(raw);
        sessions.push({
          id: entry.name,
          model: meta.model || "unknown",
          status: meta.status || "idle",
          tokensIn: meta.tokensIn || meta.inputTokens || 0,
          tokensOut: meta.tokensOut || meta.outputTokens || 0,
          costCents: meta.costCents || meta.cost || 0,
          messageCount: meta.messageCount || meta.messages?.length || 0,
          createdAt: meta.createdAt || meta.created || new Date().toISOString(),
          updatedAt:
            meta.updatedAt || meta.updated || new Date().toISOString(),
          channel: meta.channel,
        });
      } catch {
        // skip unreadable sessions
      }
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

export async function toggleCronJob(id: string, enabled: boolean): Promise<boolean> {
  const cronPath = join(getOpenClawDir(), "cron", "jobs.json");
  try {
    const raw = await readFile(cronPath, "utf-8");
    const data = JSON.parse(raw);
    const jobs: CronJob[] = Array.isArray(data) ? data : data.jobs || [];
    const job = jobs.find((j) => j.id === id);
    if (!job) return false;
    job.enabled = enabled;
    const updated = Array.isArray(data) ? jobs : { ...data, jobs };
    await writeFile(cronPath, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch {
    return false;
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
