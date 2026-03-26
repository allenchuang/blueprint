import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export interface TwitterAnalytics {
  period: "7d" | "30d";
  totalTweets: number;
  totalImpressions: number;
  totalLikes: number;
  totalRetweets: number;
  totalReplies: number;
  totalBookmarks: number;
  avgEngagementRate: number;
  topTweet: {
    id: string;
    text: string;
    likes: number;
    retweets: number;
    impressions: number;
    engagementRate: number;
  } | null;
  dailyBreakdown: Array<{
    date: string;
    impressions: number;
    likes: number;
    retweets: number;
    replies: number;
  }>;
}

export async function GET(req: NextRequest) {
  try {
    const consumerKey = process.env.TWITTER_CONSUMER_KEY;
    const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    const username = process.env.TWITTER_USERNAME ?? "blueprint_os";

    if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
      return NextResponse.json(
        { error: "Twitter API not configured", fallback: true },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const periodParam = searchParams.get("period") ?? "7d";
    const period: "7d" | "30d" = periodParam === "30d" ? "30d" : "7d";
    const days = period === "30d" ? 30 : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startTime = startDate.toISOString();

    const client = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken,
      accessSecret: accessTokenSecret,
    });

    // Get user
    const user = await client.v2.userByUsername(username, {
      "user.fields": ["id"],
    });

    if (!user.data) {
      return NextResponse.json(
        { error: "User not found", fallback: true },
        { status: 404 }
      );
    }

    // Fetch tweets in time range (max 100)
    const timeline = await client.v2.userTimeline(user.data.id, {
      max_results: 100,
      start_time: startTime,
      "tweet.fields": ["created_at", "public_metrics"],
      exclude: ["retweets", "replies"],
    });

    const tweets = timeline.data.data ?? [];

    // Aggregate stats
    let totalImpressions = 0;
    let totalLikes = 0;
    let totalRetweets = 0;
    let totalReplies = 0;
    let totalBookmarks = 0;
    let topTweet: TwitterAnalytics["topTweet"] = null;
    let topEngagement = 0;

    // Build daily breakdown map
    const dailyMap: Record<string, {
      impressions: number;
      likes: number;
      retweets: number;
      replies: number;
    }> = {};

    for (const tweet of tweets) {
      const metrics = tweet.public_metrics;
      if (!metrics) continue;

      const imp = metrics.impression_count ?? 0;
      const likes = metrics.like_count ?? 0;
      const rt = metrics.retweet_count ?? 0;
      const replies = metrics.reply_count ?? 0;
      const bookmarks = metrics.bookmark_count ?? 0;

      totalImpressions += imp;
      totalLikes += likes;
      totalRetweets += rt;
      totalReplies += replies;
      totalBookmarks += bookmarks;

      const engagements = likes + rt + replies + bookmarks;
      const er = imp > 0 ? (engagements / imp) * 100 : 0;

      if (er > topEngagement) {
        topEngagement = er;
        topTweet = {
          id: tweet.id,
          text: tweet.text,
          likes,
          retweets: rt,
          impressions: imp,
          engagementRate: Math.round(er * 100) / 100,
        };
      }

      // Group by day
      const day = (tweet.created_at ?? "").slice(0, 10);
      if (day) {
        if (!dailyMap[day]) {
          dailyMap[day] = { impressions: 0, likes: 0, retweets: 0, replies: 0 };
        }
        dailyMap[day].impressions += imp;
        dailyMap[day].likes += likes;
        dailyMap[day].retweets += rt;
        dailyMap[day].replies += replies;
      }
    }

    // Fill in missing days
    const dailyBreakdown = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      dailyBreakdown.push({
        date: dateStr,
        ...(dailyMap[dateStr] ?? { impressions: 0, likes: 0, retweets: 0, replies: 0 }),
      });
    }

    const totalEngagements =
      totalLikes + totalRetweets + totalReplies + totalBookmarks;
    const avgEngagementRate =
      totalImpressions > 0
        ? Math.round((totalEngagements / totalImpressions) * 10000) / 100
        : 0;

    const analytics: TwitterAnalytics = {
      period,
      totalTweets: tweets.length,
      totalImpressions,
      totalLikes,
      totalRetweets,
      totalReplies,
      totalBookmarks,
      avgEngagementRate,
      topTweet,
      dailyBreakdown,
    };

    return NextResponse.json(analytics);
  } catch (err: unknown) {
    const error = err as { code?: number; status?: number; data?: { title?: string } };

    if (
      error.code === 403 ||
      error.status === 403 ||
      error.data?.title === "CreditsDepleted"
    ) {
      return NextResponse.json(
        { error: "API credits depleted", fallback: true },
        { status: 403 }
      );
    }

    console.error("[twitter/analytics] Error:", error.code ?? error.status);
    return NextResponse.json(
      { error: "Failed to fetch analytics", fallback: true },
      { status: 500 }
    );
  }
}
