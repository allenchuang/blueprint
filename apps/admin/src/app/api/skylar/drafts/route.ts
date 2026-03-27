import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Drafts remain in Skylar's workspace since they are markdown files authored by Skylar,
// not structured data shared with the server.
const DRAFTS_DIR = "/home/deploy/.openclaw/workspace-skylar";

interface Draft {
  id: string;
  filename: string;
  title: string;
  tweets: string[];
  notes: string;
  createdAt: string;
}

function cleanTitle(filename: string): string {
  return filename
    .replace(/\.md$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parseDraftFile(filepath: string, filename: string): Draft | null {
  try {
    const content = fs.readFileSync(filepath, "utf-8");

    // Must contain at least one "## Tweet N" section to be a thread draft
    if (!/^## Tweet \d+/m.test(content)) return null;

    // Extract tweets — split on "## Tweet N" headers, grab content between them
    const tweets: string[] = [];
    const sections = content.split(/^## Tweet \d+[^\n]*/m);
    for (let i = 1; i < sections.length; i++) {
      // Stop at --- or ## Notes
      const section = sections[i]!.split(/^(?:---|## Notes)/m)[0]!.trim();
      if (section) tweets.push(section);
    }

    if (tweets.length === 0) return null;

    // Extract notes section
    const notesMatch = /^## Notes\s*\n([\s\S]*)$/m.exec(content);
    const notes = notesMatch ? notesMatch[1]!.trim() : "";

    // File title from H1 or filename
    const titleMatch = /^# (.+)$/m.exec(content);
    const title = titleMatch ? titleMatch[1]!.replace(/["]/g, "") : cleanTitle(filename);

    const stats = fs.statSync(filepath);

    return {
      id: filename.replace(/\.md$/, ""),
      filename,
      title,
      tweets,
      notes,
      createdAt: stats.mtime.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(DRAFTS_DIR)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".md"));
    const drafts: Draft[] = [];

    for (const filename of files) {
      const filepath = path.join(DRAFTS_DIR, filename);
      const draft = parseDraftFile(filepath, filename);
      if (draft) drafts.push(draft);
    }

    // Sort by most recently modified
    drafts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(drafts);
  } catch (err) {
    console.error("Failed to read drafts:", err);
    return NextResponse.json({ error: "Failed to read drafts" }, { status: 500 });
  }
}
