import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BRIEF_PATH = process.env.BLUEPRINT_STORAGE_PATH
  ? `${process.env.BLUEPRINT_STORAGE_PATH}/skylar/industry-brief.md`
  : "/home/deploy/repos/blueprint/storage/skylar/industry-brief.md";

export async function GET() {
  try {
    const content = fs.readFileSync(BRIEF_PATH, "utf-8");
    const stat = fs.statSync(BRIEF_PATH);
    return NextResponse.json({
      content,
      updatedAt: stat.mtime.toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read industry brief", content: "", updatedAt: null },
      { status: 500 }
    );
  }
}
