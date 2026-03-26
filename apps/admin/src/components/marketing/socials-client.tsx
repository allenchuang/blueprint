"use client";

import { useState, useEffect, useCallback } from "react";
import {
  recentPosts,
  platformStats,
} from "@/lib/mock-data";
import type { Platform, Post } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { PlatformBadge } from "./platform-badge";
import { PostComposer } from "./post-composer";
import { LeadTracker } from "./lead-tracker";
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
  Users,
  FlaskConical,
  WifiOff,
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

function DemoBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{
        background: "rgba(255,159,10,0.1)",
        border: "1px solid rgba(255,159,10,0.2)",
        color: "#ff9f0a",
      }}
    >
      <FlaskConical className="w-2.5 h-2.5" />
      Demo data
    </span>
  );
}

function StatBox({
  label,
  value,
  sub,
  subColor = "#30d158",
}: {
  label: string;
  value: string | number;
  sub: string;
  subColor?: string;
}) {
  return (
    <div
      className="mac-card px-4 py-3"
      style={{ background: "#2c2c2e" }}
    >
      <p className="text-[12px]" style={{ color: "#8e8e93" }}>
        {label}
      </p>
      <p
        className="text-[20px] font-bold mt-0.5"
        style={{ color: "#f5f5f7", letterSpacing: "-0.01em" }}
      >
        {value}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: subColor }}>
        {sub}
      </p>
    </div>
  );
}

function PostRow({ post }: { post: Post }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="flex items-start gap-4 py-3.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <PlatformBadge platform={post.platform} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: "#e5e5ea" }}>
          {post.content}
        </p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="text-[11px]" style={{ color: "#636366" }}>
            {date}
          </span>
          <div className="flex items-center gap-3">
            {[
              { icon: Heart, val: post.likes },
              { icon: MessageSquare, val: post.comments },
              { icon: Repeat2, val: post.shares },
              { icon: Eye, val: post.reach },
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
        <p className="text-[13px] font-semibold" style={{ color: "#0a84ff" }}>
          {post.engagementRate}%
        </p>
        <p className="text-[11px]" style={{ color: "#636366" }}>
          engagement
        </p>
      </div>
    </div>
  );
}

function TweetRow({ tweet }: { tweet: TwitterTweet }) {
  const date = tweet.createdAt
    ? new Date(tweet.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  const { likeCount, retweetCount, replyCount, impressionCount } =
    tweet.publicMetrics;
  const engagements = likeCount + retweetCount + replyCount;
  const er =
    impressionCount > 0
      ? Math.round((engagements / impressionCount) * 10000) / 100
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
          <span className="text-[11px]" style={{ color: "#636366" }}>
            {date}
          </span>
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
        <p className="text-[13px] font-semibold" style={{ color: "#0a84ff" }}>
          {er}%
        </p>
        <p className="text-[11px]" style={{ color: "#636366" }}>
          engagement
        </p>
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
  usingFallback: boolean;
  loading: boolean;
}

function TwitterPanel({
  profile,
  tweets,
  analytics,
  usingFallback,
  loading,
}: TwitterPanelProps) {
  const mockStats = platformStats.find((p) => p.platform === "twitter")!;

  const followers = profile?.publicMetrics.followersCount ?? mockStats.followers;
  const tweetCount = profile?.publicMetrics.tweetCount ?? mockStats.totalPosts;
  const avgEr = analytics?.avgEngagementRate ?? mockStats.avgEngagementRate;
  const weeklyImpressions = analytics?.totalImpressions ?? mockStats.weeklyImpressions;

  const topPostData = (tweets ?? []).slice(0, 4).map((t) => {
    const imp = t.publicMetrics.impressionCount;
    const eng = t.publicMetrics.likeCount + t.publicMetrics.retweetCount + t.publicMetrics.replyCount;
    return {
      name: t.text.slice(0, 18) + "…",
      engagement: imp > 0 ? Math.round((eng / imp) * 10000) / 100 : 0,
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[13px]" style={{ color: "#636366" }}>Loading Twitter data…</p>
      </div>
    );
  }

  if (usingFallback && !profile && !tweets) {
    return (
      <div className="mac-card p-8 text-center" style={{ background: "#2c2c2e" }}>
        <WifiOff className="w-10 h-10 mx-auto mb-3" style={{ color: "#636366" }} />
        <p className="text-[15px] font-semibold mb-1" style={{ color: "#f5f5f7" }}>Twitter API unavailable</p>
        <p className="text-[13px]" style={{ color: "#8e8e93" }}>
          Could not connect to the Twitter API. Check your credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {usingFallback && (
        <div className="flex items-center gap-2">
          <DemoBadge />
          <span className="text-[12px]" style={{ color: "#636366" }}>
            Real Twitter data unavailable — showing partial data
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Followers" value={formatNumber(followers)} sub={`+${mockStats.followersGrowth}% this month`} />
        <StatBox label="Avg Engagement" value={`${avgEr}%`} sub="per tweet" subColor="#0a84ff" />
        <StatBox label="Weekly Impressions" value={formatNumber(weeklyImpressions)} sub="last 7 days" subColor="#ff9f0a" />
        <StatBox label="Total Tweets" value={tweetCount} sub="all time" subColor="#8e8e93" />
      </div>

      {topPostData.length > 0 && (
        <div className="mac-card p-5" style={{ background: "#2c2c2e" }}>
          <p className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: "#636366", letterSpacing: "0.06em" }}>
            Top Tweets by Engagement
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topPostData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.gridStyle} />
              <XAxis dataKey="name" tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip {...CHART_STYLE} formatter={(v: number) => [`${v}%`, "Engagement"]} />
              <Bar dataKey="engagement" fill="#0a84ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mac-card p-5" style={{ background: "#2c2c2e" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#636366", letterSpacing: "0.06em" }}>
            Recent Tweets
          </p>
        </div>
        {tweets && tweets.length > 0
          ? tweets.map((t) => <TweetRow key={t.id} tweet={t} />)
          : (
            <p className="text-[13px] py-4 text-center" style={{ color: "#636366" }}>
              No tweets to display
            </p>
          )
        }
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
        <path d="M14 5.5c0 0 1 .5 2.5.5S19 5 19 5v3s-1 .5-2.5.5S14 8 14 8V5.5z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round" />
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
        Connect your account to start tracking analytics and posting
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

function AggregateView() {
  const twitterPosts = recentPosts.filter((p) => p.platform === "twitter");
  const twitterStats = platformStats.find((p) => p.platform === "twitter")!;

  const platformCompare = [
    {
      name: "Twitter/X",
      engagement: twitterStats.avgEngagementRate,
      growth: twitterStats.followersGrowth,
    },
    { name: "Instagram", engagement: 0, growth: 0 },
    { name: "TikTok", engagement: 0, growth: 0 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <DemoBadge />
        <span className="text-[12px]" style={{ color: "#636366" }}>
          Aggregate view — switch to Twitter/X for live data
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { title: "Platform Engagement Comparison", dataKey: "engagement", color: "#bf5af2", formatter: (v: number) => `${v}%` },
          { title: "Follower Growth Rate", dataKey: "growth", color: "#30d158", formatter: (v: number) => `${v}%` },
        ].map((chart) => (
          <div key={chart.title} className="mac-card p-5" style={{ background: "#2c2c2e" }}>
            <p className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: "#636366", letterSpacing: "0.06em" }}>
              {chart.title}
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={platformCompare} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.gridStyle} />
                <XAxis dataKey="name" tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_STYLE.axisStyle} axisLine={false} tickLine={false} tickFormatter={chart.formatter} />
                <Tooltip {...CHART_STYLE} formatter={(v: number) => [chart.formatter(v), ""]} />
                <Bar dataKey={chart.dataKey} fill={chart.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      <div className="mac-card p-5" style={{ background: "#2c2c2e" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#636366", letterSpacing: "0.06em" }}>
            Recent Twitter Posts
          </p>
          <DemoBadge />
        </div>
        {twitterPosts.map((post) => <PostRow key={post.id} post={post} />)}
      </div>
    </div>
  );
}

export function SocialsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("aggregate");
  const [showComposer, setShowComposer] = useState(false);
  const [showLeads, setShowLeads] = useState(false);

  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const [twitterTweets, setTwitterTweets] = useState<TwitterTweet[] | null>(null);
  const [twitterAnalytics, setTwitterAnalytics] = useState<TwitterAnalytics | null>(null);
  const [twitterFallback, setTwitterFallback] = useState(false);
  const [twitterLoading, setTwitterLoading] = useState(false);

  const fetchTwitterData = useCallback(async () => {
    setTwitterLoading(true);
    try {
      const [profileRes, tweetsRes, analyticsRes] = await Promise.all([
        fetch("/api/twitter"),
        fetch("/api/twitter/tweets"),
        fetch("/api/twitter/analytics?period=7d"),
      ]);
      const [profile, tweetsData, analyticsData] = await Promise.all([
        profileRes.json() as Promise<TwitterProfile & { fallback?: boolean; error?: string }>,
        tweetsRes.json() as Promise<{ tweets?: TwitterTweet[]; fallback?: boolean; error?: string }>,
        analyticsRes.json() as Promise<TwitterAnalytics & { fallback?: boolean; error?: string }>,
      ]);
      const anyFallback = profile.fallback || tweetsData.fallback || analyticsData.fallback;
      setTwitterFallback(!!anyFallback);
      if (!profile.fallback && !profile.error) setTwitterProfile(profile);
      if (!tweetsData.fallback && tweetsData.tweets) setTwitterTweets(tweetsData.tweets);
      if (!analyticsData.fallback && !analyticsData.error) setTwitterAnalytics(analyticsData);
    } catch {
      setTwitterFallback(true);
    } finally {
      setTwitterLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "twitter" && !twitterProfile && !twitterLoading) {
      void fetchTwitterData();
    }
  }, [activeTab, twitterProfile, twitterLoading, fetchTwitterData]);

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
            onClick={() => { setShowLeads(!showLeads); if (!showLeads) setShowComposer(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 min-h-[36px]"
            style={
              showLeads
                ? { background: "#0a84ff", color: "#fff" }
                : { background: "rgba(255,255,255,0.07)", color: "#c7c7cc", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Leads</span>
          </button>
          <button
            onClick={() => { setShowComposer(!showComposer); if (!showComposer) setShowLeads(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 min-h-[36px]"
            style={
              showComposer
                ? { background: "#0a84ff", color: "#fff" }
                : { background: "rgba(255,255,255,0.07)", color: "#c7c7cc", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            <PenSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Compose</span>
          </button>
        </div>
      </div>

      {showComposer && <PostComposer onClose={() => setShowComposer(false)} />}
      {showLeads && <LeadTracker onClose={() => setShowLeads(false)} />}

      {/* Platform tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 min-h-[32px]",
              )}
              style={
                isActive
                  ? { background: "#2c2c2e", color: "#f5f5f7", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }
                  : { color: "#636366" }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "aggregate" && <AggregateView />}
      {activeTab === "twitter" && (
        <TwitterPanel
          profile={twitterProfile}
          tweets={twitterTweets}
          analytics={twitterAnalytics}
          usingFallback={twitterFallback}
          loading={twitterLoading}
        />
      )}
      {activeTab === "instagram" && <NotConnectedPanel platform="instagram" />}
      {activeTab === "tiktok" && <NotConnectedPanel platform="tiktok" />}
    </div>
  );
}
