"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { springConfig } from "@/lib/mobile-animations";

interface SlideInSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SlideInSheet({
  open,
  onClose,
  title,
  rightSlot,
  children,
  className,
}: SlideInSheetProps) {
  const handleBack = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={handleBack}
          />

          {/* Sheet panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={springConfig}
            className={cn(
              "fixed inset-y-0 right-0 z-50 w-full bg-background shadow-2xl sm:max-w-md",
              className,
            )}
          >
            {/* Header */}
            <div className="flex h-12 items-center border-b border-border/50 pt-[env(safe-area-inset-top)]">
              <div className="relative flex h-full w-full items-center px-2">
                <div className="flex w-12 shrink-0 items-center justify-start">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={handleBack}
                    className="flex size-10 items-center justify-center rounded-full text-foreground active:bg-accent"
                    aria-label="Close"
                  >
                    <ChevronLeft className="size-6" />
                  </motion.button>
                </div>

                <div className="absolute inset-x-14 flex items-center justify-center">
                  {title && (
                    <h2 className="truncate text-base font-semibold text-foreground">
                      {title}
                    </h2>
                  )}
                </div>

                <div className="ml-auto flex w-12 shrink-0 items-center justify-end">
                  {rightSlot}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
