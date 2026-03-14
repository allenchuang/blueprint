import { NextResponse } from "next/server";
import { listSessions } from "@/lib/openclaw";

export async function GET() {
  try {
    const sessions = await listSessions();
    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ sessions: [], error: "Failed to read sessions" }, { status: 500 });
  }
}
