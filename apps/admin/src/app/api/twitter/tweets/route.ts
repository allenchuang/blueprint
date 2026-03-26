import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export interface TwitterTweet {
  id: string;
  text: string;
  createdAt: string;
  publicMetrics: {
    likeCount: number;
    retweetCount: number;
    replyCount: number;
    quoteCount: number;
    impressionCount: number;
    bookmarkCount: number;
  };
  editHistoryTweetIds?: string[];
}

export interface TwitterTweetsResponse {
  tweets: TwitterTweet[];
  meta: {
    resultCount: number;
    newestId?: string;
    oldestId?: string;
  };
}

export async function GET() {
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

    const client = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken,
      accessSecret: accessTokenSecret,
    });

    // First get the user ID
    const user = await client.v2.userByUsername(username, {
      "user.fields": ["id"],
    });

    if (!user.data) {
      return NextResponse.json(
        { error: "User not found", fallback: true },
        { status: 404 }
      );
    }

    const timeline = await client.v2.userTimeline(user.data.id, {
      max_results: 20,
      "tweet.fields": ["created_at", "public_metrics", "edit_history_tweet_ids"],
      exclude: ["retweets", "replies"],
    });

    const tweets: TwitterTweet[] = (timeline.data.data ?? []).map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.created_at ?? "",
      publicMetrics: {
        likeCount: tweet.public_metrics?.like_count ?? 0,
        retweetCount: tweet.public_metrics?.retweet_count ?? 0,
        replyCount: tweet.public_metrics?.reply_count ?? 0,
        quoteCount: tweet.public_metrics?.quote_count ?? 0,
        impressionCount: tweet.public_metrics?.impression_count ?? 0,
        bookmarkCount: tweet.public_metrics?.bookmark_count ?? 0,
      },
      editHistoryTweetIds: tweet.edit_history_tweet_ids,
    }));

    const response: TwitterTweetsResponse = {
      tweets,
      meta: {
        resultCount: timeline.data.meta?.result_count ?? tweets.length,
        newestId: timeline.data.meta?.newest_id,
        oldestId: timeline.data.meta?.oldest_id,
      },
    };

    return NextResponse.json(response);
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

    console.error("[twitter/tweets] Error:", error.code ?? error.status);
    return NextResponse.json(
      { error: "Failed to fetch tweets", fallback: true },
      { status: 500 }
    );
  }
}
