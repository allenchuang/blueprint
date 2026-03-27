import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export interface TwitterProfile {
  id: string;
  name: string;
  username: string;
  description: string;
  profileImageUrl: string | null;
  publicMetrics: {
    followersCount: number;
    followingCount: number;
    tweetCount: number;
    listedCount: number;
  };
  verified: boolean;
  createdAt: string;
}

export async function GET() {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    const username = process.env.TWITTER_USERNAME ?? "blueprint_os";

    if (!bearerToken) {
      return NextResponse.json(
        { error: "Twitter API not configured", fallback: true },
        { status: 500 }
      );
    }

    const client = new TwitterApi(bearerToken);

    const user = await client.v2.userByUsername(username, {
      "user.fields": [
        "description",
        "public_metrics",
        "profile_image_url",
        "verified",
        "created_at",
      ],
    });

    if (!user.data) {
      return NextResponse.json(
        { error: "User not found", fallback: true },
        { status: 404 }
      );
    }

    const profile: TwitterProfile = {
      id: user.data.id,
      name: user.data.name,
      username: user.data.username,
      description: user.data.description ?? "",
      profileImageUrl: user.data.profile_image_url ?? null,
      publicMetrics: {
        followersCount: user.data.public_metrics?.followers_count ?? 0,
        followingCount: user.data.public_metrics?.following_count ?? 0,
        tweetCount: user.data.public_metrics?.tweet_count ?? 0,
        listedCount: user.data.public_metrics?.listed_count ?? 0,
      },
      verified: user.data.verified ?? false,
      createdAt: user.data.created_at ?? "",
    };

    return NextResponse.json(profile);
  } catch (err: unknown) {
    const error = err as { code?: number; status?: number; data?: { title?: string } };

    // Handle credits depleted / access denied
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

    console.error("[twitter/profile] Error:", error.code ?? error.status);
    return NextResponse.json(
      { error: "Failed to fetch Twitter profile", fallback: true },
      { status: 500 }
    );
  }
}
