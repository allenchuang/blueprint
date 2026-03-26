"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MetricCard } from "@/components/marketing/metric-card";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import {
  Users,
  TrendingUp,
  Eye,
  Zap,
  FileText,
  Heart,
  MessageSquare,
  Repeat2,
  Twitter,
} from "lucide-react";
import type { TwitterProfile } from "@/app/api/twitter/route";
import type { TwitterTweet } from "@/app/api/twitter/tweets/route";
import type { TwitterAnalytics } from "@/app/api/twitter/analytics/route";

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
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

function SkeletonCard() {
  return (
    <div
      className="mac-card p-4 space-y-2 animate-pulse"
      style={{ background: "#2c2c2e" }}
    >
      <div className="h-3 w-20 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="h-6 w-16 rounded" style={{ background: "rgba(255,255,255,0.12)" }} />
      <div className="h-3 w-12 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="mac-card p-5 animate-pulse" style={{ background: "#2c2c2e" }}>
      <div className="h-3 w-32 rounded mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />
      <div className="h-[200px] rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-[200px] rounded-lg"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}
    >
      <Twitter className="w-6 h-6 mb-2 opacity-20" />
      <p className="text-[13px]" style={{ color: "#48484a" }}>
        {message}
      </p>
    </div>
  );
}

function TweetRow({ tweet }: { tweet: TwitterTweet }) {
  const date = tweet.createdAt
    ? new Date(tweet.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";
  const { likeCount, retweetCount, replyCount, impressionCount } = tweet.publicMetrics;
  const engagements = likeCount + retweetCount + replyCount;
  const er =
    impressionCount > 0
      ? Math.round((engagements / impressionCount) * 10_000) / 100
      : 0;

  return (
    <div
      className="flex items-start gap-4 py-3.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <PlatformBadge platform="twitter" size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: "#e5e5ea" }}>
          {tweet.text}
        </p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="text-[11px]" style={{ color: "#636366" }}>{date}</span>
          <div className="flex items-center gap-3">
            {[
              { Icon: Heart, val: likeCount },
              { Icon: MessageSquare, val: replyCount },
              { Icon: Repeat2, val: retweetCount },
              { Icon: Eye, val: impressionCount },
            ].map(({ Icon, val }, i) => (
              <div key={i} className="flex items-center gap-1 text-[11px]" style={{ color: "#636366" }}>
                <Icon className="w-3 h-3" />
                {formatNumber(val)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-[13px] font-semibold" style={{ color: "#0a84ff" }}>
          {er}%
        </p>
        <p className="text-[11px]" style={{ color: "#636366" }}>eng.</p>
      </div>
    </div>
  );
}

const CHART_STYLE = {
  contentStyle: {
    background: "#3a3a3c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#f5f5f7",
  },
  axisStyle: { fontSize: 10, fill: "#636366" },
  gridStyle: "rgba(255,255,255,0.05)",
};

export default function MarketingOverviewPage() {
  const [profile, setProfile] = useState<TwitterProfile | null>(null);
  const [tweets, setTweets] = useState<TwitterTweet[] | null>(null);
  const [analytics, setAnalytics] = useState<TwitterAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [profileRes, tweetsRes, analyticsRes] = await Promise.all([
          fetch("/api/twitter"),
          fetch("/api/twitter/tweets"),
          fetch("/api/twitter/analytics?period=7d"),
        ]);
        type ProfileResponse = TwitterProfile & { fallback?: boolean; error?: string };
        type TweetsResponse = { tweets?: TwitterTweet[]; fallback?: boolean; error?: string };
        type AnalyticsResponse = TwitterAnalytics & { fallback?: boolean; error?: string };

        const [profileData, tweetsData, analyticsData] = await Promise.all([
          profileRes.json() as Promise<ProfileResponse>,
          tweetsRes.json() as Promise<TweetsResponse>,
          analyticsRes.json() as Promise<AnalyticsResponse>,
        ]);

        if (!profileData.fallback && !profileData.error) setProfile(profileData);
        if (!tweetsData.fallback && tweetsData.tweets) setTweets(tweetsData.tweets);
        if (!analyticsData.fallback && !analyticsData.error) setAnalytics(analyticsData);
      } catch {
        // API unavailable — show empty states
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Compute recent engagement (last 7 tweets)
  const recentEngagement = tweets
    ? tweets
        .slice(0, 7)
        .reduce(
          (sum, t) =>
            sum + t.publicMetrics.likeCount + t.publicMetrics.retweetCount + t.publicMetrics.replyCount,
          0
        )
    : null;

  // Chart data: daily impressions from analytics
  const hasChartData =
    analytics?.dailyBreakdown &&
    analytics.dailyBreakdown.some((d) => d.impressions > 0 || d.likes > 0);

  const dailyChart = hasChartData
    ? analytics!.dailyBreakdown.map((d) => ({
        date: d.date.slice(5), // "MM-DD"
        impressions: d.impressions,
        engagements: d.likes + d.retweets + d.replies,
      }))
    : [];

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
          Twitter / X · Real-time data
        </p>
      </div>

      {/* Key Metrics */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Followers"
            value={profile ? formatNumber(profile.publicMetrics.followersCount) : "—"}
            icon={<Users className="w-4 h-4" />}
            color="blue"
          />
          <MetricCard
            label="Following"
            value={profile ? formatNumber(profile.publicMetrics.followingCount) : "—"}
            icon={<Users className="w-4 h-4" />}
            color="purple"
          />
          <MetricCard
            label="Total Tweets"
            value={profile ? formatNumber(profile.publicMetrics.tweetCount) : "—"}
            icon={<FileText className="w-4 h-4" />}
            color="amber"
          />
          <MetricCard
            label="Recent Engagement"
            value={recentEngagement !== null ? formatNumber(recentEngagement) : "—"}
            icon={<Zap className="w-4 h-4" />}
            color="emerald"
          />
        </div>
      )}

      {/* Charts Row */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="mac-card p-5" style={{ background: "#2c2c2e" }}>
            <SectionHeader
              title="Daily Impressions"
              subtitle="Twitter / X · last 7 days"
            />
            <div className="mt-4">
              {dailyChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dailyChart} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0a84ff" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#0a84ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.gridStyle} />
                    <XAxis dataKey="date" tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
                    <Tooltip {...CHART_STYLE} formatter={(v: number) => [formatNumber(v), "Impressions"]} />
                    <Area type="monotone" dataKey="impressions" stroke="#0a84ff" strokeWidth={2} fill="url(#impGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="Connect your accounts to see analytics here" />
              )}
            </div>
          </div>
          <div className="mac-card p-5" style={{ background: "#2c2c2e" }}>
            <SectionHeader
              title="Daily Engagements"
              subtitle="Likes + retweets + replies · last 7 days"
            />
            <div className="mt-4">
              {dailyChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyChart} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.gridStyle} />
                    <XAxis dataKey="date" tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip {...CHART_STYLE} formatter={(v: number) => [formatNumber(v), "Engagements"]} />
                    <Bar dataKey="engagements" fill="#30d158" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="Connect your accounts to see analytics here" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Platform status */}
      {!loading && (
        <div className="space-y-3">
          <SectionHeader title="Platform Status" />
          <div className="space-y-2">
            {(["twitter", "instagram", "tiktok"] as const).map((platform) => {
              const isTwitter = platform === "twitter";
              const connected = isTwitter && !!profile;
              return (
                <div
                  key={platform}
                  className="mac-card px-4 py-3.5 flex items-center justify-between"
                  style={{ background: "#2c2c2e" }}
                >
                  <div className="flex items-center gap-3">
                    <PlatformBadge platform={platform} size="md" />
                    <div>
                      <p className="text-[13px] font-medium capitalize" style={{ color: "#f5f5f7" }}>
                        {platform === "twitter" ? "Twitter / X" : platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </p>
                      <p className="text-[11px]" style={{ color: "#636366" }}>
                        {isTwitter && profile
                          ? `@${profile.username} · ${formatNumber(profile.publicMetrics.followersCount)} followers`
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={
                        connected
                          ? { background: "rgba(48,209,88,0.12)", color: "#30d158" }
                          : { background: "rgba(255,255,255,0.06)", color: "#636366" }
                      }
                    >
                      {connected ? "Connected" : "Not connected"}
                    </span>
                    {isTwitter && analytics && (
                      <span className="text-[12px] font-semibold" style={{ color: "#f5f5f7" }}>
                        {analytics.avgEngagementRate}% avg eng.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Tweets */}
      {!loading && (
        <div className="space-y-3">
          <SectionHeader title="Recent Tweets" subtitle="Last 7 original tweets" />
          <div className="mac-card p-5" style={{ background: "#2c2c2e" }}>
            {tweets && tweets.length > 0 ? (
              tweets.slice(0, 7).map((tweet) => (
                <TweetRow key={tweet.id} tweet={tweet} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Twitter className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-[15px] font-semibold mb-1" style={{ color: "#f5f5f7" }}>
                  No tweets yet
                </p>
                <p className="text-[13px]" style={{ color: "#636366" }}>
                  {profile ? "No recent tweets found" : "Connect Twitter to see your recent posts"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Summary — only show if real analytics data */}
      {!loading && analytics && (
        <div className="space-y-3">
          <SectionHeader title="7-Day Summary" subtitle="Twitter / X performance" />
          <div
            className="mac-card p-5 space-y-4"
            style={{ background: "#2c2c2e" }}
          >
            <div className="space-y-3">
              {[
                {
                  icon: <FileText className="w-4 h-4" />,
                  label: "Tweets published",
                  value: analytics.totalTweets,
                  valueColor: "#f5f5f7",
                },
                {
                  icon: <Eye className="w-4 h-4" />,
                  label: "Total impressions",
                  value: formatNumber(analytics.totalImpressions),
                  valueColor: "#f5f5f7",
                },
                {
                  icon: <Zap className="w-4 h-4" />,
                  label: "Total engagements",
                  value: formatNumber(analytics.totalLikes + analytics.totalRetweets + analytics.totalReplies),
                  valueColor: "#f5f5f7",
                },
                {
                  icon: <TrendingUp className="w-4 h-4" />,
                  label: "Avg engagement rate",
                  value: `${analytics.avgEngagementRate}%`,
                  valueColor: "#30d158",
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px]" style={{ color: "#8e8e93" }}>
                    {row.icon}
                    {row.label}
                  </div>
                  <span className="text-[13px] font-semibold" style={{ color: row.valueColor }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
