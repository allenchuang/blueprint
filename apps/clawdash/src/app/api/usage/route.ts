import { NextResponse } from "next/server";
import { getUsage } from "@/lib/openclaw";

export async function GET() {
  try {
    const usage = await getUsage();
    return NextResponse.json({ usage });
  } catch {
    return NextResponse.json({ usage: [], error: "Failed to read usage" }, { status: 500 });
  }
}
