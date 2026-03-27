import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

import type { PostSuggestion } from "@/lib/types";

const SUGGESTIONS_PATH =
  "/home/deploy/.openclaw/workspace-skylar/post-suggestions.json";

// ─── Legacy batched format (array of {batch, theme, posts}) ──────────────────

interface LegacyBatchedPost {
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

interface LegacySuggestionBatch {
  batch: number;
  theme: string;
  posts: LegacyBatchedPost[];
}

// ─── New wrapped format from Skylar (object with generated/batches keys) ─────

interface SkylarPost {
  account?: string;
  auto_post?: boolean;
  requires_approval?: boolean;
  text?: string;
  hook?: string;
  format?: string;
  notes?: string;
  type?: string;
  priority?: string;
  timing?: string;
  tags?: string[];
  thread?: string[];
  replyTo?: string;
  quoteOf?: string;
  status?: PostSuggestion["status"];
}

interface SkylarBatch {
  batch: number;
  theme: string;
  signal?: string;
  posts: SkylarPost[];
}

interface SkylarSuggestionsFile {
  generated?: string;
  brief_date?: string;
  note?: string;
  batches: SkylarBatch[];
}

/**
 * Detect whether data is in the wrapped Skylar format {generated, batches:[...]}
 */
function isSkylarWrappedFormat(data: unknown): data is SkylarSuggestionsFile {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "batches" in data &&
    Array.isArray((data as SkylarSuggestionsFile).batches)
  );
}

/**
 * Detect whether data is in the legacy batched format (array of {batch, theme, posts})
 */
function isLegacyBatchedFormat(data: unknown): data is LegacySuggestionBatch[] {
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
 * Normalize a Skylar-format post to a PostSuggestion.
 * Skylar uses `text` as the primary body, `hook` as alias.
 * Maps `format: "tweet" | "thread"` to PostSuggestion type.
 */
function normalizeSkylarPost(post: SkylarPost, batchIdx: number, postIdx: number): PostSuggestion {
  const id = `skylar-b${batchIdx}-p${postIdx}`;
  const rawType = post.format ?? post.type ?? "single";
  const type: PostSuggestion["type"] =
    rawType === "thread" ? "thread" : rawType === "quote-tweet" ? "quote-tweet" : "single";
  const priority: PostSuggestion["priority"] =
    (post.priority as PostSuggestion["priority"]) ?? "medium";
  const hook = post.hook ?? post.text ?? "";
  const account =
    post.account === "blueprintIntern" ? "blueprintIntern" :
    post.account === "blueprint_os" ? "blueprint_os" : undefined;

  return {
    id,
    type,
    priority,
    hook,
    thread: post.thread,
    timing: post.timing ?? "Anytime",
    tags: post.tags ?? [],
    replyTo: post.replyTo,
    quoteOf: post.quoteOf,
    status: post.status ?? "pending",
    account: account as PostSuggestion["account"],
  };
}

/**
 * Flatten legacy batched suggestions into a flat PostSuggestion[] array.
 */
function flattenLegacyBatches(batches: LegacySuggestionBatch[]): PostSuggestion[] {
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
 * Flatten Skylar wrapped suggestions into a flat PostSuggestion[] array.
 */
function flattenSkylarBatches(file: SkylarSuggestionsFile): PostSuggestion[] {
  return file.batches.flatMap((batch, batchIdx) =>
    batch.posts.map((post, postIdx) => normalizeSkylarPost(post, batchIdx, postIdx))
  );
}

/**
 * Read and parse the suggestions file, handling all known formats.
 */
function readSuggestions(): PostSuggestion[] {
  if (!fs.existsSync(SUGGESTIONS_PATH)) return [];
  const raw = fs.readFileSync(SUGGESTIONS_PATH, "utf-8");
  const data: unknown = JSON.parse(raw);

  if (isSkylarWrappedFormat(data)) {
    return flattenSkylarBatches(data);
  }

  if (isLegacyBatchedFormat(data)) {
    return flattenLegacyBatches(data);
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

    // For Skylar wrapped format: status is stored in-memory only (file uses positional IDs)
    // Patch the file by finding post by generated ID pattern (skylar-bX-pY)
    if (isSkylarWrappedFormat(data)) {
      const idMatch = body.id.match(/^skylar-b(\d+)-p(\d+)$/);
      if (!idMatch) {
        return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
      }
      const batchIdx = parseInt(idMatch[1]!);
      const postIdx = parseInt(idMatch[2]!);
      const batch = data.batches[batchIdx];
      const post = batch?.posts[postIdx];
      if (!post) {
        return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
      }
      post.status = body.status;
      fs.writeFileSync(SUGGESTIONS_PATH, JSON.stringify(data, null, 2));
      const normalized = normalizeSkylarPost(post, batchIdx, postIdx);
      return NextResponse.json({ success: true, suggestion: normalized });
    }

    if (isLegacyBatchedFormat(data)) {
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
