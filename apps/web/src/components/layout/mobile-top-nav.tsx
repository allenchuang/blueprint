"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ChevronLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { gentleSpring } from "@/lib/mobile-animations";

interface MobileTopNavProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuToggle?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

export function MobileTopNav({
  title,
  onBack,
  showBack = false,
  showMenu = false,
  onMenuToggle,
  rightSlot,
  className,
}: MobileTopNavProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={gentleSpring}
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-12 items-center border-b border-border/50 bg-background/80 backdrop-blur-lg",
        "pt-[env(safe-area-inset-top)]",
        className,
      )}
    >
      <div className="relative flex h-full w-full items-center px-2">
        {/* Left slot: back or menu */}
        <div className="flex w-12 shrink-0 items-center justify-start">
          {showBack && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={gentleSpring}
              onClick={handleBack}
              className="flex size-10 items-center justify-center rounded-full text-foreground active:bg-accent"
              aria-label="Go back"
            >
              <ChevronLeft className="size-6" />
            </motion.button>
          )}
          {showMenu && !showBack && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              transition={gentleSpring}
              onClick={onMenuToggle}
              className="flex size-10 items-center justify-center rounded-full text-foreground active:bg-accent"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </motion.button>
          )}
        </div>

        {/* Center: title */}
        <div className="absolute inset-x-14 flex items-center justify-center">
          {title && (
            <h1 className="truncate text-base font-semibold text-foreground">
              {title}
            </h1>
          )}
        </div>

        {/* Right slot */}
        <div className="ml-auto flex w-12 shrink-0 items-center justify-end">
          {rightSlot}
        </div>
      </div>
    </motion.header>
  );
}
