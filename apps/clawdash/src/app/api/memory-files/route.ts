import { NextResponse } from "next/server";
import { listMemoryFiles } from "@/lib/openclaw";

export async function GET() {
  try {
    const files = await listMemoryFiles();
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [], error: "Failed to list memory files" }, { status: 500 });
  }
}
