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
        daily_project_usage?: Array<{
          app_id?: string;
          usage?: Array<{
            usage_result_count?: number;
            request_type?: string;
          }>;
        }>;
      };
    };

    // Extract usage — the API returns daily usage per app
    // We sum up all tweet reads across apps for the current cycle
    const capResetDay: number = data.data?.cap_reset_day ?? 1;

    let projectUsage = 0;
    if (data.data?.daily_project_usage) {
      for (const appEntry of data.data.daily_project_usage) {
        if (appEntry.usage) {
          for (const usageEntry of appEntry.usage) {
            // Count tweet reads (search, timeline, lookup)
            if (
              usageEntry.request_type &&
              (usageEntry.request_type.includes("search") ||
                usageEntry.request_type.includes("timeline") ||
                usageEntry.request_type.includes("lookup") ||
                usageEntry.request_type.includes("read"))
            ) {
              projectUsage += usageEntry.usage_result_count ?? 0;
            }
          }
        }
      }
    }

    // Free tier cap: 1,500,000 tweet reads/month; Basic: 10,000; paid plans vary
    // Most common: 500,000 for Basic app-level reads, 2,000,000 project cap
    const projectCap = 2_000_000;
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
