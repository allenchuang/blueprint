"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyInlineProps {
  text: string;
  className?: string;
}

/** Small inline copy button — used in code blocks on the detail page */
export function CopyInline({ text, className }: CopyInlineProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy"
      className={cn(
        "rounded p-1 transition-colors",
        copied
          ? "text-emerald-500"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
