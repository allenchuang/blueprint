import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getOpenClawDir, getAgentId } from "@/lib/openclaw";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

interface JournalEntry {
  type: string;
  id?: string;
  timestamp?: string;
  message?: {
    role?: string;
    content?: string | Array<{ type: string; text?: string }>;
    timestamp?: number;
  };
}

export interface SessionMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: string;
}

function extractText(
  content: string | Array<{ type: string; text?: string }>
): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("\n")
      .trim();
  }
  return "";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const agentId = searchParams.get("agentId") ?? getAgentId();
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const sessionsDir = join(getOpenClawDir(), "agents", agentId, "sessions");
  const filePath = join(sessionsDir, `${sessionId}.jsonl`);

  if (!existsSync(filePath)) {
    return NextResponse.json({ messages: [] });
  }

  try {
    const raw = await readFile(filePath, "utf-8");
    const lines = raw.trim().split("\n").filter(Boolean);

    const messages: SessionMessage[] = [];

    for (const line of lines) {
      try {
        const entry = JSON.parse(line) as JournalEntry;
        if (entry.type !== "message" || !entry.message) continue;

        const role = entry.message.role;
        if (role !== "user" && role !== "assistant") continue;

        const content = extractText(entry.message.content ?? "");
        if (!content.trim()) continue;

        messages.push({
          id: entry.id ?? String(messages.length),
          role: role as "user" | "assistant",
          content,
          timestamp:
            entry.timestamp ??
            (entry.message.timestamp
              ? new Date(entry.message.timestamp).toISOString()
              : new Date().toISOString()),
        });
      } catch {
        // skip malformed lines
      }
    }

    // Return last N messages
    return NextResponse.json({ messages: messages.slice(-limit) });
  } catch {
    return NextResponse.json(
      { error: "Failed to read session" },
      { status: 500 }
    );
  }
}
