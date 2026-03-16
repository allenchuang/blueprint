import { NextResponse } from "next/server";
import { listKeyFiles } from "@/lib/openclaw";

export async function GET() {
  try {
    const files = await listKeyFiles();
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [], error: "Failed to list files" }, { status: 500 });
  }
}
