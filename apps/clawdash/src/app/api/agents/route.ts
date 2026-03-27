import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const KNOWN_AGENTS = [
  { id: "main", name: "Ash", emoji: "🔥" },
  { id: "ocean", name: "Ocean", emoji: "🌊" },
  { id: "skylar", name: "Skylar", emoji: "⚡" },
  { id: "coral", name: "Coral", emoji: "🪸" },
  { id: "arctic", name: "Arctic", emoji: "🧊" },
];

export async function GET() {
  return NextResponse.json({ agents: KNOWN_AGENTS });
}
