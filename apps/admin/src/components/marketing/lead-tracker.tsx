"use client";

import { X, Users } from "lucide-react";

interface LeadTrackerProps {
  onClose: () => void;
}

export function LeadTracker({ onClose }: LeadTrackerProps) {
  return (
    <div className="mac-card overflow-hidden" style={{ background: "#2c2c2e" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <h3 className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
            Lead Tracker
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: "#636366" }}>
            Accounts repeatedly engaging with your content
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ color: "#636366" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f5f7")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#636366")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-16 text-center px-8">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <Users className="w-5 h-5" style={{ color: "#48484a" }} />
        </div>
        <p className="text-[15px] font-semibold mb-2" style={{ color: "#f5f5f7" }}>
          No leads yet
        </p>
        <p className="text-[13px] max-w-xs" style={{ color: "#8e8e93" }}>
          As your Twitter audience grows and engages, leads will appear here automatically.
        </p>
      </div>
    </div>
  );
}
