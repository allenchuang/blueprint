import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

export interface PackageManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  type: "app" | "agent" | "skill";
  author?: string;
  icon?: string;
  color?: string;
  tags?: string[];
  installCommand?: string;
  downloads?: number;
  updatedAt?: string;
  repository?: string;
}

export interface RegistryIndex {
  packages: PackageManifest[];
}

const FALLBACK_PACKAGES: PackageManifest[] = [
  {
    id: "crm",
    name: "Blueprint CRM",
    version: "1.2.0",
    description: "Customer relationship management built for small teams. Track contacts, deals, and follow-ups.",
    type: "app",
    author: "blueprint-team",
    icon: "👥",
    color: "#38BDF8",
    tags: ["crm", "sales", "productivity"],
    installCommand: "blueprint install crm",
    downloads: 1842,
    updatedAt: "2026-03-15",
  },
  {
    id: "codex",
    name: "Codex Agent",
    version: "0.9.1",
    description: "AI coding agent that writes, reviews, and refactors code directly in your Blueprint OS workspace.",
    type: "agent",
    author: "blueprint-labs",
    icon: "🤖",
    color: "#818CF8",
    tags: ["ai", "coding", "automation"],
    installCommand: "blueprint install codex",
    downloads: 3201,
    updatedAt: "2026-03-20",
  },
  {
    id: "weather",
    name: "Weather Skill",
    version: "1.0.3",
    description: "Get current weather and forecasts via wttr.in. No API key needed.",
    type: "skill",
    author: "ash",
    icon: "🌤️",
    color: "#34D399",
    tags: ["weather", "utility"],
    installCommand: "blueprint install weather",
    downloads: 987,
    updatedAt: "2026-03-10",
  },
  {
    id: "analytics",
    name: "Analytics Dashboard",
    version: "2.0.0",
    description: "Beautiful metrics and growth charts for your Blueprint apps. Plug-and-play with the API server.",
    type: "app",
    author: "blueprint-team",
    icon: "📊",
    color: "#F59E0B",
    tags: ["analytics", "metrics", "dashboard"],
    installCommand: "blueprint install analytics",
    downloads: 2560,
    updatedAt: "2026-03-22",
  },
  {
    id: "email-agent",
    name: "Email Agent",
    version: "1.1.0",
    description: "Reads, summarizes, and drafts replies to your emails. Integrates with Gmail and IMAP.",
    type: "agent",
    author: "blueprint-labs",
    icon: "📧",
    color: "#F472B6",
    tags: ["email", "ai", "productivity"],
    installCommand: "blueprint install email-agent",
    downloads: 1123,
    updatedAt: "2026-03-18",
  },
  {
    id: "git-skill",
    name: "Git Skill",
    version: "1.0.0",
    description: "Smart git operations — commit, branch, PR creation, and conflict resolution guidance.",
    type: "skill",
    author: "ocean",
    icon: "🌿",
    color: "#4ADE80",
    tags: ["git", "developer", "utility"],
    installCommand: "blueprint install git-skill",
    downloads: 745,
    updatedAt: "2026-03-05",
  },
  {
    id: "notes",
    name: "Notes",
    version: "0.8.2",
    description: "Markdown-first note taking with tag support, search, and sync across Blueprint OS windows.",
    type: "app",
    author: "coral",
    icon: "📝",
    color: "#FBBF24",
    tags: ["notes", "markdown", "productivity"],
    installCommand: "blueprint install notes",
    downloads: 642,
    updatedAt: "2026-02-28",
  },
  {
    id: "deploy-agent",
    name: "Deploy Agent",
    version: "1.3.0",
    description: "Monitors PM2 processes, triggers builds, and keeps your Blueprint stack healthy 24/7.",
    type: "agent",
    author: "blueprint-labs",
    icon: "🚀",
    color: "#F97316",
    tags: ["devops", "deployment", "monitoring"],
    installCommand: "blueprint install deploy-agent",
    downloads: 1890,
    updatedAt: "2026-03-25",
  },
];

export function loadRegistry(): RegistryIndex {
  // Try the repo-root registry/index.json first
  const registryPath = path.join(process.cwd(), "../../registry/index.json");
  if (existsSync(registryPath)) {
    try {
      const raw = readFileSync(registryPath, "utf-8");
      return JSON.parse(raw) as RegistryIndex;
    } catch {
      // Fall through to fallback
    }
  }

  return { packages: FALLBACK_PACKAGES };
}
