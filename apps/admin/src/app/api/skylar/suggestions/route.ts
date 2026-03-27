import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

import type { PostSuggestion } from "@/lib/types";

const SUGGESTIONS_PATH =
  "/home/deploy/.openclaw/workspace-skylar/post-suggestions.json";

export async function GET() {
  try {
    if (!fs.existsSync(SUGGESTIONS_PATH)) {
      return NextResponse.json([]);
    }
    const raw = fs.readFileSync(SUGGESTIONS_PATH, "utf-8");
    const suggestions = JSON.parse(raw) as PostSuggestion[];
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json(
      { error: "Failed to read post suggestions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      id: string;
      status: "approved" | "rejected" | "posted";
    };

    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 },
      );
    }

    if (!["approved", "rejected", "posted"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be approved, rejected, or posted" },
        { status: 400 },
      );
    }

    if (!fs.existsSync(SUGGESTIONS_PATH)) {
      return NextResponse.json(
        { error: "Suggestions file not found" },
        { status: 404 },
      );
    }

    const raw = fs.readFileSync(SUGGESTIONS_PATH, "utf-8");
    const suggestions = JSON.parse(raw) as PostSuggestion[];

    const index = suggestions.findIndex((s) => s.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Suggestion not found" },
        { status: 404 },
      );
    }

    suggestions[index]!.status = body.status;
    fs.writeFileSync(SUGGESTIONS_PATH, JSON.stringify(suggestions, null, 2));

    return NextResponse.json({ success: true, suggestion: suggestions[index] });
  } catch {
    return NextResponse.json(
      { error: "Failed to update suggestion" },
      { status: 500 },
    );
  }
}
