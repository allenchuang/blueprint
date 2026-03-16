import { NextResponse } from "next/server";
import { cpus, totalmem, freemem, uptime, hostname, platform } from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface DiskInfo {
  filesystem: string;
  size: string;
  used: string;
  available: string;
  usePercent: number;
  mount: string;
}

async function getDiskInfo(): Promise<DiskInfo[]> {
  try {
    const { stdout } = await execAsync("df -h / 2>/dev/null");
    const lines = stdout.trim().split("\n").slice(1);
    return lines.map((line) => {
      const parts = line.split(/\s+/);
      return {
        filesystem: parts[0] || "",
        size: parts[1] || "",
        used: parts[2] || "",
        available: parts[3] || "",
        usePercent: parseInt(parts[4] || "0"),
        mount: parts[5] || "/",
      };
    });
  } catch {
    return [];
  }
}

function getCpuUsage(): number {
  const cpuData = cpus();
  let totalIdle = 0;
  let totalTick = 0;
  for (const cpu of cpuData) {
    totalIdle += cpu.times.idle;
    totalTick += cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
  }
  return Math.round(((totalTick - totalIdle) / totalTick) * 100);
}

export async function GET() {
  try {
    const total = totalmem();
    const free = freemem();
    const used = total - free;
    const disk = await getDiskInfo();

    return NextResponse.json({
      cpu: {
        usage: getCpuUsage(),
        cores: cpus().length,
        model: cpus()[0]?.model || "Unknown",
      },
      memory: {
        total,
        used,
        free,
        usagePercent: Math.round((used / total) * 100),
      },
      disk,
      uptime: uptime(),
      hostname: hostname(),
      platform: platform(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to read system info" }, { status: 500 });
  }
}
