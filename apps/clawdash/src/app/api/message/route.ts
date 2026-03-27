import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SERVER_BASE =
  process.env.OPENCLAW_SERVER_URL ?? "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { message: string; agentId?: string; sessionKey?: string };
    const res = await fetch(`${SERVER_BASE}/api/openclaw/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
