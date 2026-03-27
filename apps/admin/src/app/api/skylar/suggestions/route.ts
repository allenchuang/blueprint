import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

import type { PostSuggestion } from "@/lib/types";

const SUGGESTIONS_PATH = process.env.BLUEPRINT_STORAGE_PATH
  ? `${process.env.BLUEPRINT_STORAGE_PATH}/skylar/post-suggestions.json`
  : "/home/deploy/repos/blueprint/storage/skylar/post-suggestions.json";

// Batched format from Skylar's new suggestion generator
interface BatchedPost {
  id: string;
  account?: string;
  autoPost?: boolean;
  requiresApproval?: boolean;
  approver?: string;
  type: PostSuggestion["type"];
  priority: PostSuggestion["priority"];
  hook: string;
  thread?: string[];
  timing: string;
  tags: string[];
  replyTo?: string;
  quoteOf?: string;
  status?: PostSuggestion["status"];
}

interface SuggestionBatch {
  batch: number;
  theme: string;
  posts: BatchedPost[];
}

/**
 * Detect whether data is in the new batched format (array of {batch, theme, posts})
 * or the old flat format (array of PostSuggestion).
 */
function isBatchedFormat(data: unknown): data is SuggestionBatch[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object" &&
    data[0] !== null &&
    "batch" in data[0] &&
    "posts" in data[0]
  );
}

/**
 * Flatten batched suggestions into a flat PostSuggestion[] array.
 */
function flattenBatches(batches: SuggestionBatch[]): PostSuggestion[] {
  return batches.flatMap((batch) =>
    batch.posts.map((post) => ({
      id: post.id,
      type: post.type,
      priority: post.priority,
      hook: post.hook,
      thread: post.thread,
      timing: post.timing,
      tags: post.tags,
      replyTo: post.replyTo,
      quoteOf: post.quoteOf,
      status: post.status ?? "pending",
      account: (post.account as PostSuggestion["account"]) ?? undefined,
    })),
  );
}

/**
 * Read and parse the suggestions file, handling both formats.
 */
function readSuggestions(): PostSuggestion[] {
  if (!fs.existsSync(SUGGESTIONS_PATH)) return [];
  const raw = fs.readFileSync(SUGGESTIONS_PATH, "utf-8");
  const data: unknown = JSON.parse(raw);

  if (isBatchedFormat(data)) {
    return flattenBatches(data);
  }

  // Already flat format
  return data as PostSuggestion[];
}

export async function GET() {
  try {
    const suggestions = readSuggestions();
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
    const data: unknown = JSON.parse(raw);

    if (isBatchedFormat(data)) {
      // Update status within the batched structure and write back
      let found = false;
      let updatedPost: PostSuggestion | undefined;
      for (const batch of data) {
        const post = batch.posts.find((p) => p.id === body.id);
        if (post) {
          post.status = body.status;
          found = true;
          updatedPost = {
            id: post.id,
            type: post.type,
            priority: post.priority,
            hook: post.hook,
            thread: post.thread,
            timing: post.timing,
            tags: post.tags,
            status: post.status,
            account: (post.account as PostSuggestion["account"]) ?? undefined,
          };
          break;
        }
      }
      if (!found) {
        return NextResponse.json(
          { error: "Suggestion not found" },
          { status: 404 },
        );
      }
      fs.writeFileSync(SUGGESTIONS_PATH, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true, suggestion: updatedPost });
    }

    // Flat format
    const suggestions = data as PostSuggestion[];
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
