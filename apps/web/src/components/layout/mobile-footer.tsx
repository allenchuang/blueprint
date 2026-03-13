"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { snappySpring } from "@/lib/mobile-animations";

export interface MobileFooterItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

interface MobileFooterProps {
  items: MobileFooterItem[];
  className?: string;
}

export function MobileFooter({ items, className }: MobileFooterProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-lg",
        "pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      <div className="flex h-14 items-center justify-around">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={snappySpring}
                className="flex flex-col items-center gap-0.5"
              >
                <div className="relative">
                  <item.icon
                    className={cn(
                      "size-5 transition-colors duration-200",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-footer-indicator"
                      className="absolute -bottom-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary"
                      transition={snappySpring}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] leading-tight transition-colors duration-200",
                    isActive
                      ? "font-medium text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
