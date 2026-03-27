import { NextResponse } from "next/server";
import { readOpenClawConfig, writeOpenClawConfig } from "@/lib/openclaw";

export async function GET() {
  try {
    const config = await readOpenClawConfig();
    if (!config) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }
    return NextResponse.json({ config });
  } catch {
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { config } = body as { config: Record<string, unknown> };

    if (!config || typeof config !== "object") {
      return NextResponse.json({ error: "Invalid config" }, { status: 400 });
    }

    const success = await writeOpenClawConfig(config);
    if (!success) {
      return NextResponse.json({ error: "Failed to write config" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
