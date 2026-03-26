import { NextResponse } from "next/server";
import fs from "fs";

const SUGGESTIONS_PATH = "/home/deploy/.openclaw/workspace-skylar/post-suggestions.json";

export async function GET() {
  try {
    const raw = fs.readFileSync(SUGGESTIONS_PATH, "utf-8");
    const batches = JSON.parse(raw) as unknown[];
    return NextResponse.json(batches);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read post suggestions" },
      { status: 500 }
    );
  }
}
