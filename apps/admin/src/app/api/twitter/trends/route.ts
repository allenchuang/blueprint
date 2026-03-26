import { NextResponse } from "next/server";

// Mock fallback — realistic dev Twitter trends
const MOCK_TRENDS = [
  { name: "#ReactJS", tweet_volume: 45200 },
  { name: "#BuildInPublic", tweet_volume: 28100 },
  { name: "#AITools", tweet_volume: 156000 },
  { name: "#NextJS", tweet_volume: 31400 },
  { name: "#TypeScript", tweet_volume: 22800 },
  { name: "#OpenSource", tweet_volume: 89300 },
  { name: "#IndieHackers", tweet_volume: 18900 },
  { name: "#WebDev", tweet_volume: 67400 },
  { name: "#StartupLife", tweet_volume: 44100 },
  { name: "#SideProject", tweet_volume: 15600 },
];

export async function GET() {
  const consumerKey = process.env.TWITTER_CONSUMER_KEY;
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  const fetchedAt = new Date().toISOString();

  // If credentials are missing, return mock data immediately
  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    return NextResponse.json({ trends: MOCK_TRENDS, fetchedAt, mock: true });
  }

  try {
    // OAuth 1.0a manual signing for v1.1 endpoint
    // Twitter API v1.1: GET https://api.twitter.com/1.1/trends/place.json?id=1
    const url = "https://api.twitter.com/1.1/trends/place.json";
    const params: Record<string, string> = { id: "1" };

    const oauthHeader = buildOAuthHeader("GET", url, params, {
      consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret,
    });

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${queryString}`, {
      headers: { Authorization: oauthHeader },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn(`[twitter/trends] API returned ${response.status}, using mock data`);
      return NextResponse.json({ trends: MOCK_TRENDS, fetchedAt, mock: true });
    }

    // Twitter returns an array: [{ trends: [...], ... }]
    const data = (await response.json()) as Array<{
      trends: Array<{ name: string; tweet_volume: number | null }>;
    }>;

    const rawTrends = data?.[0]?.trends ?? [];
    const trends = rawTrends
      .slice(0, 10)
      .map((t) => ({ name: t.name, tweet_volume: t.tweet_volume ?? 0 }));

    return NextResponse.json({ trends: trends.length > 0 ? trends : MOCK_TRENDS, fetchedAt, mock: false });
  } catch (err) {
    console.error("[twitter/trends] Error:", err);
    return NextResponse.json({ trends: MOCK_TRENDS, fetchedAt, mock: true });
  }
}

// ─── OAuth 1.0a helper ────────────────────────────────────────────────────────

function buildOAuthHeader(
  method: string,
  baseUrl: string,
  queryParams: Record<string, string>,
  creds: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  }
) {
  const oauthNonce = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const oauthTimestamp = Math.floor(Date.now() / 1000).toString();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: creds.consumerKey,
    oauth_nonce: oauthNonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: oauthTimestamp,
    oauth_token: creds.accessToken,
    oauth_version: "1.0",
  };

  // Combine query params + oauth params for signature base
  const allParams = { ...queryParams, ...oauthParams };
  const sortedParams = Object.keys(allParams)
    .sort()
    .map((k) => `${pct(k)}=${pct(allParams[k]!)}`)
    .join("&");

  const signatureBase = [method.toUpperCase(), pct(baseUrl), pct(sortedParams)].join("&");
  const signingKey = `${pct(creds.consumerSecret)}&${pct(creds.accessTokenSecret)}`;

  // HMAC-SHA1 using Node.js crypto
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto") as typeof import("crypto");
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  oauthParams["oauth_signature"] = signature;

  const headerValue =
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${pct(k)}="${pct(oauthParams[k]!)}"`)
      .join(", ");

  return headerValue;
}

function pct(str: string) {
  return encodeURIComponent(str);
}
