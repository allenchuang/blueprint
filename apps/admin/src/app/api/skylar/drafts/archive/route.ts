import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DRAFTS_DIR = "/home/deploy/.openclaw/workspace-skylar";
const ARCHIVE_DIR = "/home/deploy/.openclaw/workspace-skylar/archived";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { filename?: string };
    const { filename } = body;

    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ error: "filename is required" }, { status: 400 });
    }

    // Security: only allow .md files, no path traversal
    if (!filename.endsWith(".md") || filename.includes("/") || filename.includes("..")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const src = path.join(DRAFTS_DIR, filename);
    const dest = path.join(ARCHIVE_DIR, filename);

    if (!fs.existsSync(src)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Ensure archive dir exists
    if (!fs.existsSync(ARCHIVE_DIR)) {
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    }

    fs.renameSync(src, dest);

    return NextResponse.json({ success: true, archived: filename });
  } catch (err) {
    console.error("Failed to archive draft:", err);
    return NextResponse.json({ error: "Failed to archive draft" }, { status: 500 });
  }
}
