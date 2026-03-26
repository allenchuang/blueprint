import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile, stat } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const execAsync = promisify(exec);

const ALLOWED_SERVICES = ["openclaw", "web", "server", "admin", "os", "clawdash", "docs", "remotion"];

function getPm2LogPath(service: string, type: "out" | "error"): string {
  return join(homedir(), ".pm2", "logs", `${service}-${type}.log`);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "openclaw";
  const lines = Math.min(parseInt(searchParams.get("lines") || "100"), 500);

  if (!ALLOWED_SERVICES.includes(service)) {
    return NextResponse.json({ error: "Service not allowed" }, { status: 400 });
  }

  try {
    // For openclaw gateway, use PM2 log if available, else openclaw.log
    let logLines: string[] = [];

    if (service === "openclaw") {
      // Try openclaw gateway PM2 log, then fallback to openclaw's own log
      const gatewayLog = join(homedir(), ".pm2", "pm2.log");
      const openclawLog = join(homedir(), ".openclaw", "logs", "openclaw.log");

      const logPath = existsSync(openclawLog) ? openclawLog : existsSync(gatewayLog) ? gatewayLog : null;
      if (logPath) {
        const { stdout } = await execAsync(`tail -n ${lines} "${logPath}" 2>/dev/null || echo "No logs"`);
        logLines = stdout.trim().split("\n").filter(Boolean);
      } else {
        // Try pm2 logs via CLI
        const { stdout } = await execAsync(`pm2 logs --nostream --lines ${lines} 2>/dev/null | tail -n ${lines}`);
        logLines = stdout.trim().split("\n").filter(Boolean);
      }
    } else {
      // Read PM2 out + error logs for this service
      const outPath = getPm2LogPath(service, "out");
      const errPath = getPm2LogPath(service, "error");
      const half = Math.floor(lines / 2);

      const combined: string[] = [];

      if (existsSync(outPath)) {
        try {
          const { stdout } = await execAsync(`tail -n ${half} "${outPath}" 2>/dev/null`);
          const outLines = stdout.trim().split("\n").filter(Boolean).map(l => `[out] ${l}`);
          combined.push(...outLines);
        } catch { /* skip */ }
      }

      if (existsSync(errPath)) {
        try {
          const fileStat = await stat(errPath);
          if (fileStat.size > 0) {
            const { stdout } = await execAsync(`tail -n ${half} "${errPath}" 2>/dev/null`);
            const errLines = stdout.trim().split("\n").filter(Boolean).map(l => `[err] ${l}`);
            combined.push(...errLines);
          }
        } catch { /* skip */ }
      }

      logLines = combined.length > 0 ? combined : [`No logs found for ${service}`];
    }

    return NextResponse.json({
      service,
      lines: logLines,
    });
  } catch (e) {
    return NextResponse.json({
      service,
      lines: [`Error reading logs: ${e instanceof Error ? e.message : String(e)}`],
    });
  }
}
