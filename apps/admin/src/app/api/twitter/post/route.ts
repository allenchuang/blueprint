import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { getTwitterAccounts } from "@/lib/twitter-accounts";

interface PostTweetBody {
  text: string;
  replyToId?: string;
  accountId?: string;
  /** Public URL of an image to attach as media (e.g. a generated card) */
  imageUrl?: string;
}

interface PostTweetResponse {
  id: string;
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const consumerKey = process.env.TWITTER_CONSUMER_KEY;
    const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json(
        { error: "Twitter API not configured", fallback: true },
        { status: 500 }
      );
    }

    let body: PostTweetBody;
    try {
      body = (await req.json()) as PostTweetBody;
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { text, replyToId, accountId, imageUrl } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Tweet text is required" }, { status: 400 });
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: "Tweet exceeds 280 character limit" },
        { status: 400 }
      );
    }

    // Resolve credentials: use accountId if provided, otherwise fall back to primary env vars
    let accessToken: string | undefined;
    let accessTokenSecret: string | undefined;

    if (accountId) {
      const accounts = getTwitterAccounts();
      const account = accounts.find((a) => a.id === accountId);
      if (account) {
        accessToken = account.accessToken;
        accessTokenSecret = account.accessTokenSecret;
      }
    }

    // Fall back to default env vars
    if (!accessToken) {
      accessToken = process.env.TWITTER_ACCESS_TOKEN;
      accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    }

    if (!accessToken || !accessTokenSecret) {
      return NextResponse.json(
        { error: "Twitter credentials not configured", fallback: true },
        { status: 500 }
      );
    }

    const client = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken,
      accessSecret: accessTokenSecret,
    });

    // Upload image as media if imageUrl is provided
    let mediaId: string | undefined;
    if (imageUrl) {
      const imageRes = await fetch(imageUrl);
      if (!imageRes.ok) {
        return NextResponse.json(
          { error: "Failed to fetch imageUrl" },
          { status: 400 }
        );
      }
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
      const mimeType = imageRes.headers.get("content-type") ?? "image/png";
      mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType });
    }

    const tweetPayload: {
      text: string;
      reply?: { in_reply_to_tweet_id: string };
      media?: { media_ids: [string] };
    } = { text };

    if (replyToId) {
      tweetPayload.reply = { in_reply_to_tweet_id: replyToId };
    }

    if (mediaId) {
      tweetPayload.media = { media_ids: [mediaId] };
    }

    const posted = await client.v2.tweet(tweetPayload);

    const response: PostTweetResponse = {
      id: posted.data.id,
      text: posted.data.text,
    };

    return NextResponse.json(response, { status: 201 });
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

    console.error("[twitter/post] Error:", error.code ?? error.status);
    return NextResponse.json({ error: "Failed to post tweet" }, { status: 500 });
  }
}
