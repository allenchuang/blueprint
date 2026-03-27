"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { appConfig } from "@repo/app-config";
import { Github, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const headingFont = "font-[family-name:var(--font-heading)]";

function PerspectiveGrid() {
  const cols = 20;
  const rows = 12;
  const cellSize = 120;
  const w = cols * cellSize;
  const h = rows * cellSize;

  const hLines = [];
  for (let i = 0; i <= rows; i++) {
    hLines.push(i * cellSize);
  }
  const vLines = [];
  for (let i = 0; i <= cols; i++) {
    vLines.push(i * cellSize);
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] overflow-hidden"
      style={{ perspective: "800px" }}
    >
      <div
        className="absolute inset-0 origin-bottom"
        style={{ transform: "rotateX(55deg)" }}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute -inset-x-[20%] bottom-0 h-full w-[140%]"
        >
          <defs>
            <linearGradient id="gridFadeV" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="35%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="gridMask">
              <rect width={w} height={h} fill="white" />
              <rect width={w} height={h} fill="url(#gridFadeV)" />
            </mask>
          </defs>
          <g mask="url(#gridMask)">
            {hLines.map((y, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={y}
                x2={w}
                y2={y}
                stroke="#3b82f6"
                strokeWidth="1.2"
                opacity={0.2}
              />
            ))}
            {vLines.map((x, i) => (
              <line
                key={`v-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={h}
                stroke="#3b82f6"
                strokeWidth="1.2"
                opacity={0.2}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-16 bg-linear-to-b from-blue-300 via-blue-50/50 to-white dark:from-blue-950 dark:via-gray-900/50 dark:to-gray-950">
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/blueprint_3d.png"
          alt="Blueprint 3D"
          width={420}
          height={420}
          priority
          className="drop-shadow-2xl"
        />
        <h1
          className={`mt-0 text-6xl md:text-8xl ${headingFont}`}
        >
          {t("appName")}
        </h1>
        <p
          className={`mt-4 text-2xl md:text-3xl text-gray-500 dark:text-gray-400 ${headingFont}`}
        >
          {appConfig.slogan}
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="https://github.com/allenchuang/blueprint"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </a>
          <a
            href="http://localhost:3003"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Docs
            </Button>
          </a>
        </div>
      </div>
      <PerspectiveGrid />
    </div>
  );
}
