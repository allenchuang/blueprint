import { NextRequest, NextResponse } from "next/server";
import { listCronJobs } from "@/lib/openclaw";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobs = await listCronJobs();
    const job = jobs.find((j) => j.id === id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    // Fire a run-now via openclaw gateway if available
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL ?? "http://127.0.0.1:18789";
    const httpBase = gatewayUrl.replace(/^ws/, "http");
    try {
      const res = await fetch(`${httpBase}/api/cron/${id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        return NextResponse.json({ success: true, queued: true });
      }
    } catch {
      // Gateway not available or endpoint not found — return a best-effort response
    }
    return NextResponse.json({ success: true, queued: false, note: "Gateway unavailable; job not triggered live" });
  } catch {
    return NextResponse.json({ error: "Failed to run cron job" }, { status: 500 });
  }
}
