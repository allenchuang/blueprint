"use client";

import { MarketingSidebar, MobileTabBar } from "@/components/marketing/sidebar";
import { OnboardingWizard, useOnboarding } from "@/components/marketing/onboarding-wizard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showOnboarding, completeOnboarding, checked } = useOnboarding();

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#1c1c1e" }}
    >
      {/* Onboarding wizard — shown to first-time users */}
      {checked && showOnboarding && (
        <OnboardingWizard onComplete={completeOnboarding} />
      )}

      {/* Sidebar — desktop only */}
      <MarketingSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div
          className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8"
          /* pb-24 on mobile to clear bottom tab bar */
        >
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <MobileTabBar />
    </div>
  );
}
