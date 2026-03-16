import { NextResponse } from "next/server";
import { getCosts } from "@/lib/openclaw";

export async function GET() {
  try {
    const costs = await getCosts();
    return NextResponse.json(costs);
  } catch {
    return NextResponse.json(
      { totalCents: 0, byModel: {}, byDay: {}, bySession: [], error: "Failed to read costs" },
      { status: 500 }
    );
  }
}
