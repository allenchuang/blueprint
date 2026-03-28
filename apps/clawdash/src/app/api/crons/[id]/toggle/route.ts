import { NextRequest, NextResponse } from "next/server";
import { toggleCronJob } from "@/lib/openclaw";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json() as { enabled: boolean };
    const ok = await toggleCronJob(id, body.enabled);
    if (!ok) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to toggle cron job" }, { status: 500 });
  }
}
