"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MobileTopNav } from "@/components/layout/mobile-top-nav";
import { MobileFooter, type MobileFooterItem } from "@/components/layout/mobile-footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { gentleSpring, pageTransition } from "@/lib/mobile-animations";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileLayoutProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  rightSlot?: React.ReactNode;
  footerItems?: MobileFooterItem[];
  menuContent?: React.ReactNode;
  children: React.ReactNode;
}

export function MobileLayout({
  title,
  showBack = false,
  onBack,
  showMenu = true,
  rightSlot,
  footerItems = [],
  menuContent,
  children,
}: MobileLayoutProps) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <MobileTopNav
        title={title}
        showBack={showBack}
        onBack={onBack}
        showMenu={showMenu}
        onMenuToggle={() => setMenuOpen(true)}
        rightSlot={rightSlot}
      />

      {/* Main content area with safe-area offsets */}
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={gentleSpring}
        className="flex-1 pt-12 pb-14"
        style={{
          paddingTop: "calc(3rem + env(safe-area-inset-top, 0px))",
          paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </motion.main>

      {footerItems.length > 0 && <MobileFooter items={footerItems} />}

      {/* Slide-in navigation menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border/50 p-4">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            {menuContent}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
