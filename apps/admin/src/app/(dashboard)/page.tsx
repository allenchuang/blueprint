import {
  overviewMetrics,
  platformStats,
  engagementOverTime,
  recentPosts,
  followerGrowth,
} from "@/lib/mock-data";
import { MetricCard } from "@/components/marketing/metric-card";
import { EngagementChart } from "@/components/marketing/engagement-chart";
import { FollowerChart } from "@/components/marketing/follower-chart";
import { TopPostCard } from "@/components/marketing/top-post-card";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import {
  Users,
  TrendingUp,
  Eye,
  Zap,
  FileText,
  MessageSquare,
  Repeat2,
  Heart,
} from "lucide-react";

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2
        className="text-[13px] font-semibold uppercase tracking-wider"
        style={{ color: "#8e8e93", letterSpacing: "0.06em" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-[12px] mt-0.5" style={{ color: "#636366" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function MarketingOverviewPage() {
  const { totalFollowers, avgEngagementRate, totalWeeklyReach, weeklySummary } =
    overviewMetrics;

  return (
    <div className="space-y-7">
      {/* Page header */}
      <div>
        <h1
          className="text-[22px] font-semibold"
          style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}
        >
          Overview
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: "#636366" }}>
          Week of Mar 20–26, 2026 · All platforms
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Total Followers"
          value={formatNumber(totalFollowers)}
          change={+18.2}
          icon={<Users className="w-4 h-4" />}
          color="blue"
        />
        <MetricCard
          label="Avg Engagement"
          value={`${avgEngagementRate}%`}
          change={+1.4}
          icon={<Zap className="w-4 h-4" />}
          color="amber"
        />
        <MetricCard
          label="Weekly Reach"
          value={formatNumber(totalWeeklyReach)}
          change={+24.1}
          icon={<Eye className="w-4 h-4" />}
          color="purple"
        />
        <MetricCard
          label="New Followers"
          value={`+${weeklySummary.newFollowers}`}
          change={+12.4}
          icon={<TrendingUp className="w-4 h-4" />}
          color="emerald"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="mac-card p-5"
          style={{ background: "#2c2c2e" }}
        >
          <SectionHeader
            title="Engagement Rate"
            subtitle="% engagement by platform, last 30 days"
          />
          <div className="mt-4">
            <EngagementChart data={engagementOverTime} />
          </div>
        </div>
        <div
          className="mac-card p-5"
          style={{ background: "#2c2c2e" }}
        >
          <SectionHeader
            title="Follower Growth"
            subtitle="Total followers by platform, last 30 days"
          />
          <div className="mt-4">
            <FollowerChart data={followerGrowth} />
          </div>
        </div>
      </div>

      {/* Platform Breakdown + Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Platform Cards */}
        <div className="lg:col-span-2 space-y-3">
          <SectionHeader title="Platform Breakdown" />
          <div className="space-y-2">
            {platformStats.map((p) => (
              <div
                key={p.platform}
                className="mac-card px-4 py-3.5 flex items-center justify-between"
                style={{ background: "#2c2c2e" }}
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform={p.platform} size="md" />
                  <div>
                    <p className="text-[13px] font-medium capitalize" style={{ color: "#f5f5f7" }}>
                      {p.platform === "twitter" ? "Twitter / X" : p.platform}
                    </p>
                    <p className="text-[11px]" style={{ color: "#636366" }}>
                      {formatNumber(p.followers)} followers
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5 md:gap-8">
                  <div className="text-right">
                    <p className="text-[11px]" style={{ color: "#636366" }}>Engagement</p>
                    <p className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
                      {p.avgEngagementRate}%
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px]" style={{ color: "#636366" }}>Weekly Impr.</p>
                    <p className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
                      {formatNumber(p.weeklyImpressions)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px]" style={{ color: "#636366" }}>Growth</p>
                    <p className="text-[13px] font-semibold" style={{ color: "#30d158" }}>
                      +{p.followersGrowth}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div
          className="mac-card p-5 space-y-4"
          style={{ background: "#2c2c2e" }}
        >
          <SectionHeader title="Weekly Summary" />
          <div className="space-y-3 mt-1">
            {[
              {
                icon: <FileText className="w-4 h-4" />,
                label: "Posts published",
                value: weeklySummary.postsPublished,
                valueColor: "#f5f5f7",
              },
              {
                icon: <Zap className="w-4 h-4" />,
                label: "Total engagements",
                value: formatNumber(weeklySummary.totalEngagements),
                valueColor: "#f5f5f7",
              },
              {
                icon: <Users className="w-4 h-4" />,
                label: "New followers",
                value: `+${weeklySummary.newFollowers}`,
                valueColor: "#30d158",
              },
              {
                icon: <TrendingUp className="w-4 h-4" />,
                label: "Top platform",
                value: weeklySummary.topPlatform,
                valueColor: "#0a84ff",
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px]" style={{ color: "#8e8e93" }}>
                  {row.icon}
                  {row.label}
                </div>
                <span className="text-[13px] font-semibold capitalize" style={{ color: row.valueColor }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="space-y-3">
        <SectionHeader title="Top Posts This Week" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentPosts
            .sort((a, b) => b.engagementRate - a.engagementRate)
            .slice(0, 3)
            .map((post) => (
              <TopPostCard key={post.id} post={post} />
            ))}
        </div>
      </div>
    </div>
  );
}
