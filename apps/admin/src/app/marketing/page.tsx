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
  Twitter,
  Instagram,
  Music2,
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

export default function MarketingOverviewPage() {
  const { totalFollowers, avgEngagementRate, totalWeeklyReach, weeklySummary } =
    overviewMetrics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Marketing Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Week of Mar 20–26, 2026 · All platforms
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Followers"
          value={formatNumber(totalFollowers)}
          change={+18.2}
          icon={<Users className="w-4 h-4" />}
          color="blue"
        />
        <MetricCard
          label="Avg Engagement Rate"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Engagement Rate Over Time
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            % engagement by platform, last 30 days
          </p>
          <EngagementChart data={engagementOverTime} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Follower Growth
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Total followers by platform, last 30 days
          </p>
          <FollowerChart data={followerGrowth} />
        </div>
      </div>

      {/* Platform Breakdown + Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Cards */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            Platform Breakdown
          </h2>
          <div className="space-y-3">
            {platformStats.map((p) => (
              <div
                key={p.platform}
                className="rounded-xl border border-border bg-card px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform={p.platform} size="md" />
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {p.platform === "twitter" ? "Twitter / X" : p.platform}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(p.followers)} followers
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <p className="text-sm font-semibold">
                      {p.avgEngagementRate}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Weekly Impr.</p>
                    <p className="text-sm font-semibold">
                      {formatNumber(p.weeklyImpressions)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Growth</p>
                    <p className="text-sm font-semibold text-emerald-500">
                      +{p.followersGrowth}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            Weekly Summary
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                Posts published
              </div>
              <span className="text-sm font-semibold">
                {weeklySummary.postsPublished}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                Total engagements
              </div>
              <span className="text-sm font-semibold">
                {formatNumber(weeklySummary.totalEngagements)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                New followers
              </div>
              <span className="text-sm font-semibold text-emerald-500">
                +{weeklySummary.newFollowers}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                Top platform
              </div>
              <span className="text-sm font-semibold capitalize">
                {weeklySummary.topPlatform}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Top Posts This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
