import { NextResponse } from "next/server";
import fs from "fs";

const GROWTH_ACTIVITY_PATH =
  "/home/deploy/.openclaw/workspace-skylar/growth-activity.json";

export interface GrowthActivityEntry {
  id: string;
  type: "reddit" | "x_community" | "tweet" | "reply" | "thread";
  platform: "reddit" | "twitter";
  content: string;
  url: string;
  subreddit?: string;
  community?: string;
  postedAt: string;
  status: "posted" | "pending" | "failed";
  engagement: {
    upvotes: number;
    comments: number;
    likes: number;
    retweets: number;
  };
}

export async function GET() {
  try {
    const raw = fs.readFileSync(GROWTH_ACTIVITY_PATH, "utf-8");
    const entries = JSON.parse(raw) as GrowthActivityEntry[];

    // Sort by most recent first
    const sorted = [...entries].sort(
      (a, b) =>
        new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );

    return NextResponse.json({ entries: sorted, total: sorted.length });
  } catch {
    return NextResponse.json({ entries: [], total: 0 });
  }
}
