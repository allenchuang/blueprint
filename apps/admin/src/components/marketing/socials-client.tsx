"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PlatformBadge } from "./platform-badge";
import { PostComposer } from "./post-composer";
import type { TwitterProfile } from "@/app/api/twitter/route";
import type { TwitterTweet } from "@/app/api/twitter/tweets/route";
import type { TwitterAnalytics } from "@/app/api/twitter/analytics/route";
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
  WifiOff,
} from "lucide-react";

type Tab = "aggregate" | "twitter" | "instagram" | "tiktok";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "aggregate", label: "All Platforms" },
  { id: "twitter", label: "Twitter / X" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
];

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function StatBox({
  label,
  value,
  sub,
  subColor = "#8e8e93",
}: {
  label: string;
  value: string | number;
  sub: string;
  subColor?: string;
}) {
  return (
    <div className="mac-card px-4 py-3" style={{ background: "#2c2c2e" }}>
      <p className="text-[12px]" style={{ color: "#8e8e93" }}>
        {label}
      </p>
      <p
        className="text-[20px] font-bold mt-0.5"
        style={{ color: value === "—" ? "#48484a" : "#f5f5f7", letterSpacing: "-0.01em" }}
      >
        {value}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: subColor }}>
        {sub}
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
              { icon: Heart, val: likeCount },
              { icon: MessageSquare, val: replyCount },
              { icon: Repeat2, val: retweetCount },
              { icon: Eye, val: impressionCount },
            ].map(({ icon: Icon, val }, i) => (
              <div key={i} className="flex items-center gap-1 text-[11px]" style={{ color: "#636366" }}>
                <Icon className="w-3 h-3" />
                {formatNumber(val)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-[13px] font-semibold" style={{ color: "#0a84ff" }}>{er}%</p>
        <p className="text-[11px]" style={{ color: "#636366" }}>engagement</p>
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

interface TwitterPanelProps {
  profile: TwitterProfile | null;
  tweets: TwitterTweet[] | null;
  analytics: TwitterAnalytics | null;
  apiUnavailable: boolean;
  loading: boolean;
}

function TwitterPanel({ profile, tweets, analytics, apiUnavailable, loading }: TwitterPanelProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="mac-card h-16 animate-pulse" style={{ background: "#2c2c2e" }} />
        ))}
      </div>
    );
  }

  if (apiUnavailable) {
    return (
      <div className="mac-card p-8 text-center" style={{ background: "#2c2c2e" }}>
        <WifiOff className="w-10 h-10 mx-auto mb-3" style={{ color: "#636366" }} />
        <p className="text-[15px] font-semibold mb-1" style={{ color: "#f5f5f7" }}>
          Twitter API unavailable
        </p>
        <p className="text-[13px]" style={{ color: "#8e8e93" }}>
          Could not connect to the Twitter API. Check your credentials.
        </p>
      </div>
    );
  }

  const followers = profile?.publicMetrics.followersCount;
  const tweetCount = profile?.publicMetrics.tweetCount;
  const avgEr = analytics?.avgEngagementRate;
  const totalImpressions = analytics?.totalImpressions;

  const topPostData = (tweets ?? []).slice(0, 4).map((t) => {
    const imp = t.publicMetrics.impressionCount;
    const eng = t.publicMetrics.likeCount + t.publicMetrics.retweetCount + t.publicMetrics.replyCount;
    return {
      name: t.text.slice(0, 18) + "…",
      engagement: imp > 0 ? Math.round((eng / imp) * 10_000) / 100 : 0,
    };
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox
          label="Followers"
          value={followers !== undefined ? formatNumber(followers) : "—"}
          sub="total"
        />
        <StatBox
          label="Avg Engagement"
          value={avgEr !== undefined ? `${avgEr}%` : "—"}
          sub="per tweet"
          subColor="#0a84ff"
        />
        <StatBox
          label="Weekly Impressions"
          value={totalImpressions !== undefined ? formatNumber(totalImpressions) : "—"}
          sub="last 7 days"
          subColor="#ff9f0a"
        />
        <StatBox
          label="Total Tweets"
          value={tweetCount !== undefined ? tweetCount : "—"}
          sub="all time"
        />
      </div>

      {topPostData.length > 0 && (
        <div className="mac-card p-5" style={{ background: "#2c2c2e" }}>
          <p
            className="text-[12px] font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#636366", letterSpacing: "0.06em" }}
          >
            Top Tweets by Engagement
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topPostData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.gridStyle} />
              <XAxis dataKey="name" tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} />
              <YAxis
                tick={CHART_STYLE.axisStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                {...CHART_STYLE}
                formatter={(v: number) => [`${v}%`, "Engagement"]}
              />
              <Bar dataKey="engagement" fill="#0a84ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mac-card p-5" style={{ background: "#2c2c2e" }}>
        <p
          className="text-[12px] font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#636366", letterSpacing: "0.06em" }}
        >
          Recent Tweets
        </p>
        {tweets && tweets.length > 0 ? (
          tweets.map((t) => <TweetRow key={t.id} tweet={t} />)
        ) : (
          <p className="text-[13px] py-4 text-center" style={{ color: "#636366" }}>
            No tweets to display
          </p>
        )}
      </div>
    </div>
  );
}

function NotConnectedPanel({ platform }: { platform: "instagram" | "tiktok" }) {
  const isInstagram = platform === "instagram";
  const name = isInstagram ? "Instagram" : "TikTok";

  const Icon = () =>
    isInstagram ? (
      <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.2)" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 8v8l7-4-7-4z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round" />
        <path
          d="M14 5.5c0 0 1 .5 2.5.5S19 5 19 5v3s-1 .5-2.5.5S14 8 14 8V5.5z"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );

  return (
    <div
      className="mac-card flex flex-col items-center justify-center py-20 text-center"
      style={{ background: "#2c2c2e", minHeight: 300 }}
    >
      <div className="mb-4 opacity-50">
        <Icon />
      </div>
      <p className="text-[17px] font-semibold mb-2" style={{ color: "#f5f5f7" }}>
        {name} not connected
      </p>
      <p className="text-[13px] mb-6 max-w-xs" style={{ color: "#8e8e93" }}>
        Connect your {name} account to start tracking analytics and posting
      </p>
      <button
        disabled
        className="px-4 py-2 rounded-lg text-[13px] font-medium cursor-not-allowed"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "#48484a",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Connect Account
      </button>
    </div>
  );
}

function AggregateView({
  profile,
  analytics,
  loading,
}: {
  profile: TwitterProfile | null;
  analytics: TwitterAnalytics | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mac-card h-16 animate-pulse" style={{ background: "#2c2c2e" }} />
        ))}
      </div>
    );
  }

  // Only show real data — Twitter only, since IG/TikTok not connected
  const twitterFollowers = profile?.publicMetrics.followersCount;
  const twitterEr = analytics?.avgEngagementRate;

  const platformCompare = [
    {
      name: "Twitter/X",
      engagement: twitterEr ?? 0,
      followers: twitterFollowers ?? 0,
    },
    { name: "Instagram", engagement: 0, followers: 0 },
    { name: "TikTok", engagement: 0, followers: 0 },
  ];

  return (
    <div className="space-y-5">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]"
        style={{
          background: "rgba(10,132,255,0.08)",
          border: "1px solid rgba(10,132,255,0.15)",
          color: "#0a84ff",
        }}
      >
        Only connected platforms are included. Instagram and TikTok are not yet connected.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          {
            title: "Platform Engagement Rate",
            dataKey: "engagement",
            color: "#bf5af2",
            formatter: (v: number) => `${v}%`,
          },
          {
            title: "Follower Count",
            dataKey: "followers",
            color: "#30d158",
            formatter: (v: number) => formatNumber(v),
          },
        ].map((chart) => (
          <div key={chart.title} className="mac-card p-5" style={{ background: "#2c2c2e" }}>
            <p
              className="text-[12px] font-semibold uppercase tracking-wider mb-4"
              style={{ color: "#636366", letterSpacing: "0.06em" }}
            >
              {chart.title}
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={platformCompare} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.gridStyle} />
                <XAxis dataKey="name" tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  tick={CHART_STYLE.axisStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={chart.formatter}
                />
                <Tooltip
                  {...CHART_STYLE}
                  formatter={(v: number) => [chart.formatter(v), ""]}
                />
                <Bar dataKey={chart.dataKey} fill={chart.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("aggregate");
  const [showComposer, setShowComposer] = useState(false);

  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [twitterTweets, setTwitterTweets] = useState<TwitterTweet[] | null>(null);
  const [twitterAnalytics, setTwitterAnalytics] = useState<TwitterAnalytics | null>(null);
  const [twitterApiDown, setTwitterApiDown] = useState(false);
  const [twitterLoading, setTwitterLoading] = useState(false);
  const [twitterFetched, setTwitterFetched] = useState(false);

  const fetchTwitterData = useCallback(async () => {
    setTwitterLoading(true);
    try {
      const [profileRes, tweetsRes, analyticsRes] = await Promise.all([
        fetch("/api/twitter"),
        fetch("/api/twitter/tweets"),
        fetch("/api/twitter/analytics?period=7d"),
      ]);

      type ProfileResponse = TwitterProfile & { fallback?: boolean; error?: string };
      type TweetsResponse = { tweets?: TwitterTweet[]; fallback?: boolean; error?: string };
      type AnalyticsResponse = TwitterAnalytics & { fallback?: boolean; error?: string };

      const [profile, tweetsData, analyticsData] = await Promise.all([
        profileRes.json() as Promise<ProfileResponse>,
        tweetsRes.json() as Promise<TweetsResponse>,
        analyticsRes.json() as Promise<AnalyticsResponse>,
      ]);

      const anyFallback = profile.fallback ?? tweetsData.fallback ?? analyticsData.fallback;

      if (!profile.fallback && !profile.error) setTwitterProfile(profile);
      if (!tweetsData.fallback && tweetsData.tweets) setTwitterTweets(tweetsData.tweets);
      if (!analyticsData.fallback && !analyticsData.error) setTwitterAnalytics(analyticsData);

      // Only mark as "down" if ALL three endpoints failed
      if (anyFallback && !profile.id && !tweetsData.tweets?.length) {
        setTwitterApiDown(true);
      }
    } catch {
      setTwitterApiDown(true);
    } finally {
      setTwitterLoading(false);
      setTwitterFetched(true);
    }
  }, []);

  useEffect(() => {
    if (!twitterFetched && !twitterLoading) {
      void fetchTwitterData();
    }
  }, [twitterFetched, twitterLoading, fetchTwitterData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[22px] font-semibold"
            style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}
          >
            Social Channels
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "#636366" }}>
            Post activity, engagement stats, and audience insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 min-h-[36px]"
            style={
              showComposer
                ? { background: "#0a84ff", color: "#fff" }
                : {
                    background: "rgba(255,255,255,0.07)",
                    color: "#c7c7cc",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
            }
          >
            <PenSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Compose</span>
          </button>
        </div>
      </div>

      {showComposer && <PostComposer onClose={() => setShowComposer(false)} />}

      {/* Platform tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 min-h-[32px]"
              )}
              style={
                isActive
                  ? {
                      background: "#2c2c2e",
                      color: "#f5f5f7",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                    }
                  : { color: "#636366" }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "aggregate" && (
        <AggregateView
          profile={twitterProfile}
          analytics={twitterAnalytics}
          loading={twitterLoading}
        />
      )}
      {activeTab === "twitter" && (
        <TwitterPanel
          profile={twitterProfile}
          tweets={twitterTweets}
          analytics={twitterAnalytics}
          apiUnavailable={twitterApiDown}
          loading={twitterLoading}
        />
      )}
      {activeTab === "instagram" && <NotConnectedPanel platform="instagram" />}
      {activeTab === "tiktok" && <NotConnectedPanel platform="tiktok" />}
    </div>
  );
}
