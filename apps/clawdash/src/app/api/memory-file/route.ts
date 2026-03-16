import { NextResponse } from "next/server";
import { readMemoryFile } from "@/lib/openclaw";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  try {
    const content = await readMemoryFile(path);
    if (content === null) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 });
    }
    return NextResponse.json({ path, content });
  } catch {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
