"use client";

import { SuggestedPosts } from "./suggested-posts";
import { Sparkles } from "lucide-react";

export function SuggestionsClient() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: "#bf5af2" }} />
          <h1
            className="text-[22px] font-semibold"
            style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}
          >
            Suggested Posts
          </h1>
        </div>
        <p className="text-[13px] mt-1" style={{ color: "#636366" }}>
          AI-generated post suggestions from Skylar. Review, approve, and post.
        </p>
      </div>

      {/* Suggestions list */}
      <SuggestedPosts />
    </div>
  );
}
