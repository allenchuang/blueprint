"use client";

import { OnboardingWizard } from "@/components/marketing/onboarding-wizard";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-5 h-5" style={{ color: "#8e8e93" }} />
          <h1
            className="text-[22px] font-bold tracking-tight"
            style={{ color: "#f5f5f7" }}
          >
            Settings
          </h1>
        </div>
        <p className="text-[14px]" style={{ color: "#636366" }}>
          Manage your connected accounts and configuration.
        </p>
      </div>

      {/* Twitter accounts section */}
      <section className="space-y-3">
        <h2
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "#636366", letterSpacing: "0.08em" }}
        >
          Twitter / X Accounts
        </h2>
        <div className="max-w-2xl">
          <OnboardingWizard />
        </div>
      </section>
    </div>
  );
}
