import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { platform } from "os";

const execAsync = promisify(exec);

const ALLOWED_SERVICES = ["openclaw", "agent-dashboard", "node"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "openclaw";
  const lines = Math.min(parseInt(searchParams.get("lines") || "100"), 500);

  if (!ALLOWED_SERVICES.includes(service)) {
    return NextResponse.json({ error: "Service not allowed" }, { status: 400 });
  }

  try {
    let cmd: string;
    if (platform() === "darwin") {
      cmd = `log show --predicate 'process == "${service}"' --last 1h --style compact 2>/dev/null | tail -n ${lines}`;
    } else {
      cmd = `journalctl -u ${service} -n ${lines} --no-pager 2>/dev/null || echo "No logs available"`;
    }

    const { stdout } = await execAsync(cmd, { timeout: 10_000 });
    return NextResponse.json({
      service,
      lines: stdout.trim().split("\n").filter(Boolean),
      platform: platform(),
    });
  } catch {
    return NextResponse.json({
      service,
      lines: ["No logs available. OpenClaw service may not be running."],
      platform: platform(),
    });
  }
}
