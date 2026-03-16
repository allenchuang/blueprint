import { NextResponse } from "next/server";
import { readKeyFile, writeKeyFile } from "@/lib/openclaw";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  try {
    const content = await readKeyFile(path);
    if (content === null) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 });
    }
    return NextResponse.json({ path, content });
  } catch {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, content } = body as { path: string; content: string };

    if (!path || typeof content !== "string") {
      return NextResponse.json({ error: "Missing path or content" }, { status: 400 });
    }

    const success = await writeKeyFile(path, content);
    if (!success) {
      return NextResponse.json({ error: "Failed to write file" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to write file" }, { status: 500 });
  }
}
