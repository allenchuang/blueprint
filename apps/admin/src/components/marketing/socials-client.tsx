"use client";

import { useState } from "react";
import {
  recentPosts,
  platformStats,
  leads,
  engagementOverTime,
} from "@/lib/mock-data";
import type { Platform, Post } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { TopPostCard } from "./top-post-card";
import { PlatformBadge, PlatformPill } from "./platform-badge";
import { PostComposer } from "./post-composer";
import { LeadTracker } from "./lead-tracker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Heart,
  MessageSquare,
  Repeat2,
  Eye,
  PenSquare,
  Users,
  TrendingUp,
  Globe2,
} from "lucide-react";

type Tab = "aggregate" | Platform;

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "aggregate", label: "All Platforms" },
  { id: "twitter", label: "Twitter / X" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
];

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function PostRow({ post }: { post: Post }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-start gap-4 py-4 border-b border-border last:border-0">
      <PlatformBadge platform={post.platform} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
          {post.content}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs text-muted-foreground">{date}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" />
              {formatNumber(post.likes)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="w-3 h-3" />
              {formatNumber(post.comments)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Repeat2 className="w-3 h-3" />
              {formatNumber(post.shares)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              {formatNumber(post.reach)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-semibold text-primary">
          {post.engagementRate}%
        </p>
        <p className="text-[11px] text-muted-foreground">engagement</p>
      </div>
    </div>
  );
}

function PlatformStatsPanel({ platform }: { platform: Platform }) {
  const stats = platformStats.find((p) => p.platform === platform)!;
  const posts = recentPosts.filter((p) => p.platform === platform);

  const topPostData = posts
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 4)
    .map((p) => ({
      name: p.content.slice(0, 20) + "…",
      engagement: p.engagementRate,
      likes: p.likes,
      shares: p.shares,
    }));

  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Followers",
            value: formatNumber(stats.followers),
            sub: `+${stats.followersGrowth}% this month`,
            positive: true,
          },
          {
            label: "Avg Engagement",
            value: `${stats.avgEngagementRate}%`,
            sub: "per post",
            positive: true,
          },
          {
            label: "Weekly Impressions",
            value: formatNumber(stats.weeklyImpressions),
            sub: "this week",
            positive: true,
          },
          {
            label: "Total Posts",
            value: stats.totalPosts,
            sub: "all time",
            positive: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {stat.value}
            </p>
            <p
              className={cn(
                "text-[11px] mt-0.5",
                stat.positive ? "text-emerald-500" : "text-muted-foreground"
              )}
            >
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Top Posts Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold mb-4">
          Top Posts by Engagement Rate
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={topPostData}
            margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "oklch(0.556 0 0)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "oklch(0.556 0 0)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.205 0 0)",
                border: "1px solid oklch(1 0 0 / 10%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(v: number) => [`${v}%`, "Engagement"]}
            />
            <Bar
              dataKey="engagement"
              fill={
                platform === "twitter"
                  ? "#38bdf8"
                  : platform === "instagram"
                    ? "#f472b6"
                    : "#f87171"
              }
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Post List */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold mb-3">Recent Posts</h3>
        <div>
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AggregateView() {
  const allPosts = [...recentPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const platformCompare = platformStats.map((p) => ({
    name: p.platform === "twitter" ? "Twitter/X" : p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
    engagement: p.avgEngagementRate,
    followers: p.followers,
    growth: p.followersGrowth,
  }));

  return (
    <div className="space-y-6">
      {/* Platform comparison chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-1">
            Platform Engagement Comparison
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Average engagement rate %
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={platformCompare}
              margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(1 0 0 / 8%)"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.205 0 0)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(v: number) => [`${v}%`, "Engagement"]}
              />
              <Bar
                dataKey="engagement"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-1">Follower Growth Rate</h3>
          <p className="text-xs text-muted-foreground mb-4">
            % growth last 30 days
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={platformCompare}
              margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(1 0 0 / 8%)"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.205 0 0)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(v: number) => [`${v}%`, "Growth"]}
              />
              <Bar
                dataKey="growth"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All recent posts */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold mb-3">All Recent Posts</h3>
        <div>
          {allPosts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SocialsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("aggregate");
  const [showComposer, setShowComposer] = useState(false);
  const [showLeads, setShowLeads] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social Channels</h1>
          <p className="text-muted-foreground mt-1">
            Post activity, engagement stats, and audience insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowLeads(!showLeads);
              if (!showLeads) setShowComposer(false);
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
              showLeads
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-accent"
            )}
          >
            <Users className="w-4 h-4" />
            Lead Tracker
          </button>
          <button
            onClick={() => {
              setShowComposer(!showComposer);
              if (!showComposer) setShowLeads(false);
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
              showComposer
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-accent"
            )}
          >
            <PenSquare className="w-4 h-4" />
            Compose
          </button>
        </div>
      </div>

      {/* Post Composer Panel */}
      {showComposer && (
        <PostComposer onClose={() => setShowComposer(false)} />
      )}

      {/* Lead Tracker Panel */}
      {showLeads && (
        <LeadTracker onClose={() => setShowLeads(false)} />
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "aggregate" && <AggregateView />}
      {activeTab === "twitter" && <PlatformStatsPanel platform="twitter" />}
      {activeTab === "instagram" && <PlatformStatsPanel platform="instagram" />}
      {activeTab === "tiktok" && <PlatformStatsPanel platform="tiktok" />}
    </div>
  );
}
