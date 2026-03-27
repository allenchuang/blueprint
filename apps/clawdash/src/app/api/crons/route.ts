import { NextResponse } from "next/server";
import { listCronJobs } from "@/lib/openclaw";

export async function GET() {
  try {
    const jobs = await listCronJobs();
    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json({ jobs: [], error: "Failed to list cron jobs" }, { status: 500 });
  }
}
