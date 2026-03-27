import { NextResponse } from "next/server";

export interface TwitterUsage {
  projectCap: number;
  projectUsage: number;
  capResetDay: number;
  percentUsed: number;
}

export async function GET() {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing TWITTER_BEARER_TOKEN" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.twitter.com/2/usage/tweets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      console.error("Twitter usage API error:", res.status, await res.text());
      return NextResponse.json({ error: "Failed to fetch usage" }, { status: res.status });
    }

    const data = await res.json() as {
      data?: {
        cap_reset_day?: number;
        project_cap?: string | number;
        project_usage?: string | number;
      };
    };

    const capResetDay: number = data.data?.cap_reset_day ?? 1;
    const projectCap = parseInt(String(data.data?.project_cap ?? 2_000_000), 10);
    const projectUsage = parseInt(String(data.data?.project_usage ?? 0), 10);
    const percentUsed = projectCap > 0 ? (projectUsage / projectCap) * 100 : 0;

    const usage: TwitterUsage = {
      projectCap,
      projectUsage,
      capResetDay,
      percentUsed,
    };

    return NextResponse.json(usage);
  } catch (err) {
    console.error("Twitter usage fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
