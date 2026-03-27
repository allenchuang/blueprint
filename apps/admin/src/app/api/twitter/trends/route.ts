import { NextResponse } from "next/server";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TechTrend {
  name: string;
  tweet_volume: number;
  url: string;
  source: "hackernews" | "reddit";
  subreddit?: string;
}

// ─── Hacker News ───────────────────────────────────────────────────────────────

interface HNItem {
  id: number;
  title: string;
  score: number;
  url?: string;
  by: string;
  time: number;
  descendants?: number;
}

async function fetchHackerNews(): Promise<TechTrend[]> {
  // Fetch top 20 story IDs (we'll filter down to those with score > 50)
  const idsRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    { signal: AbortSignal.timeout(8000) }
  );
  const ids = (await idsRes.json()) as number[];
  const top20 = ids.slice(0, 20);

  // Fetch each story in parallel
  const items = await Promise.allSettled(
    top20.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        signal: AbortSignal.timeout(5000),
      }).then((r) => r.json() as Promise<HNItem>)
    )
  );

  const stories: TechTrend[] = [];
  for (const result of items) {
    if (result.status !== "fulfilled") continue;
    const item = result.value;
    if (!item || !item.title || item.score < 50) continue;
    stories.push({
      name: item.title.slice(0, 60),
      tweet_volume: item.score,
      url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
      source: "hackernews",
    });
  }

  return stories;
}

// ─── Reddit ───────────────────────────────────────────────────────────────────

interface RedditPost {
  title: string;
  score: number;
  subreddit: string;
  url: string;
  num_comments: number;
  permalink: string;
}

interface RedditResponse {
  data: {
    children: Array<{ data: RedditPost }>;
  };
}

const REDDIT_SUBS = [
  { sub: "MachineLearning", limit: 5 },
  { sub: "artificial", limit: 5 },
  { sub: "programming", limit: 5 },
  { sub: "startups", limit: 3 },
];

async function fetchReddit(): Promise<TechTrend[]> {
  const results = await Promise.allSettled(
    REDDIT_SUBS.map(({ sub, limit }) =>
      fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=${limit}`, {
        headers: { "User-Agent": "BlueprintOS/1.0" },
        signal: AbortSignal.timeout(8000),
      }).then((r) => r.json() as Promise<RedditResponse>)
    )
  );

  const posts: TechTrend[] = [];
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const children = result.value?.data?.children ?? [];
    for (const child of children) {
      const post = child.data;
      if (!post || post.score < 100) continue;
      posts.push({
        name: post.title.slice(0, 60),
        tweet_volume: post.score,
        url: post.url?.startsWith("http")
          ? post.url
          : `https://reddit.com${post.permalink}`,
        source: "reddit",
        subreddit: post.subreddit,
      });
    }
  }

  return posts;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function GET() {
  const fetchedAt = new Date().toISOString();

  try {
    const [hnResult, redditResult] = await Promise.allSettled([
      fetchHackerNews(),
      fetchReddit(),
    ]);

    const hnTrends = hnResult.status === "fulfilled" ? hnResult.value : [];
    const redditTrends =
      redditResult.status === "fulfilled" ? redditResult.value : [];

    if (hnTrends.length === 0 && redditTrends.length === 0) {
      console.warn("[tech/trends] Both HN and Reddit failed");
      return NextResponse.json({ trends: [], fetchedAt });
    }

    // Combine, sort by score, take top 15
    const combined = [...hnTrends, ...redditTrends]
      .sort((a, b) => b.tweet_volume - a.tweet_volume)
      .slice(0, 15);

    return NextResponse.json({ trends: combined, fetchedAt });
  } catch (err) {
    console.error("[tech/trends] Unexpected error:", err);
    return NextResponse.json({ trends: [], fetchedAt });
  }
}
