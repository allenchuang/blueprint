// Marketing Analytics Mock Data

export type Platform = "twitter" | "instagram" | "tiktok";

export interface Post {
  id: string;
  platform: Platform;
  content: string;
  publishedAt: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  mediaType: "text" | "image" | "video" | "reel";
  url: string;
}

export interface PlatformStats {
  platform: Platform;
  followers: number;
  followersGrowth: number; // % last 30d
  following: number;
  totalPosts: number;
  avgEngagementRate: number;
  totalReach: number;
  weeklyImpressions: number;
}

export interface Lead {
  id: string;
  handle: string;
  displayName: string;
  platform: Platform;
  followers: number;
  engagementCount: number;
  lastEngaged: string;
  influenceScore: number; // 0-100
  engagementScore: number; // 0-100
  totalScore: number;
  interactions: Array<{
    type: "like" | "comment" | "share" | "mention";
    postId: string;
    date: string;
  }>;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  timeframe: string;
  tactics: string[];
  platform?: Platform | "all";
  category: "content" | "growth" | "engagement" | "partnerships" | "paid";
  status: "active" | "planned" | "completed";
}

export interface EngagementDataPoint {
  date: string;
  twitter: number;
  instagram: number;
  tiktok: number;
  total: number;
}

// ── Platform Stats ──────────────────────────────────────────────────────────

export const platformStats: PlatformStats[] = [
  {
    platform: "twitter",
    followers: 4820,
    followersGrowth: 8.4,
    following: 312,
    totalPosts: 284,
    avgEngagementRate: 3.2,
    totalReach: 142000,
    weeklyImpressions: 28400,
  },
  {
    platform: "instagram",
    followers: 2140,
    followersGrowth: 15.7,
    following: 187,
    totalPosts: 96,
    avgEngagementRate: 5.8,
    totalReach: 68000,
    weeklyImpressions: 14200,
  },
  {
    platform: "tiktok",
    followers: 1350,
    followersGrowth: 42.3,
    following: 54,
    totalPosts: 38,
    avgEngagementRate: 9.1,
    totalReach: 96000,
    weeklyImpressions: 31500,
  },
];

// ── Posts ────────────────────────────────────────────────────────────────────

export const recentPosts: Post[] = [
  {
    id: "p1",
    platform: "twitter",
    content:
      "We just shipped Blueprint OS v2 — AI-native workspace that actually thinks with you. Not just copilot, your co-founder. 🔥\n\nThread on what we built and why it matters ↓",
    publishedAt: "2026-03-24T14:30:00Z",
    likes: 284,
    comments: 47,
    shares: 91,
    reach: 18400,
    impressions: 32100,
    engagementRate: 6.7,
    mediaType: "text",
    url: "https://x.com/blueprintos/status/1",
  },
  {
    id: "p2",
    platform: "twitter",
    content:
      "Most productivity apps make you switch context constantly. Blueprint OS keeps everything in one place — your tasks, docs, AI, and team. Here's how we designed for flow state.",
    publishedAt: "2026-03-22T11:00:00Z",
    likes: 156,
    comments: 28,
    shares: 44,
    reach: 9200,
    impressions: 14800,
    engagementRate: 4.1,
    mediaType: "image",
    url: "https://x.com/blueprintos/status/2",
  },
  {
    id: "p3",
    platform: "instagram",
    content:
      "The future of work isn't about working harder — it's about thinking clearer. Blueprint OS is built around that idea. ✨ #ProductivityOS #AIWorkspace #BuildInPublic",
    publishedAt: "2026-03-23T16:00:00Z",
    likes: 421,
    comments: 63,
    shares: 18,
    reach: 7800,
    impressions: 12400,
    engagementRate: 7.2,
    mediaType: "image",
    url: "https://instagram.com/p/1",
  },
  {
    id: "p4",
    platform: "instagram",
    content:
      "Day in the life building an AI OS from scratch 👀 The highs, the bugs, the breakthroughs. Swipe to see our actual setup. #StartupLife #AIFounder",
    publishedAt: "2026-03-20T09:00:00Z",
    likes: 318,
    comments: 44,
    shares: 12,
    reach: 5600,
    impressions: 8900,
    engagementRate: 6.9,
    mediaType: "image",
    url: "https://instagram.com/p/2",
  },
  {
    id: "p5",
    platform: "tiktok",
    content:
      "POV: your AI assistant actually understands your workflow 🤯 Watch what Blueprint OS does when you drop in a random task #AIProductivity #TechStartup #ProductivityHack",
    publishedAt: "2026-03-25T18:00:00Z",
    likes: 1840,
    comments: 212,
    shares: 438,
    reach: 42000,
    impressions: 67000,
    engagementRate: 12.4,
    mediaType: "video",
    url: "https://tiktok.com/@blueprintos/1",
  },
  {
    id: "p6",
    platform: "tiktok",
    content:
      "We built an OS in public. Here's what nobody tells you about shipping AI products in 2026 👀 Part 1 #BuildInPublic #AIStartup #Founder",
    publishedAt: "2026-03-21T20:00:00Z",
    likes: 2100,
    comments: 318,
    shares: 521,
    reach: 51000,
    impressions: 84000,
    engagementRate: 14.2,
    mediaType: "video",
    url: "https://tiktok.com/@blueprintos/2",
  },
  {
    id: "p7",
    platform: "twitter",
    content:
      "Hot take: \"AI productivity tools\" mostly just add more noise. Blueprint OS is different because it reduces decisions, not adds them. Here's the design philosophy behind it 🧵",
    publishedAt: "2026-03-19T10:00:00Z",
    likes: 203,
    comments: 56,
    shares: 72,
    reach: 12000,
    impressions: 19400,
    engagementRate: 5.4,
    mediaType: "text",
    url: "https://x.com/blueprintos/status/3",
  },
  {
    id: "p8",
    platform: "instagram",
    content:
      "Before/after: managing a team with traditional tools vs Blueprint OS. The difference is insane. #TeamProductivity #AIWorkspace #Founders",
    publishedAt: "2026-03-18T13:00:00Z",
    likes: 289,
    comments: 38,
    shares: 9,
    reach: 4800,
    impressions: 7600,
    engagementRate: 6.4,
    mediaType: "image",
    url: "https://instagram.com/p/3",
  },
];

// ── Engagement Over Time ─────────────────────────────────────────────────────

export const engagementOverTime: EngagementDataPoint[] = [
  { date: "Mar 1", twitter: 2.1, instagram: 4.2, tiktok: 7.8, total: 3.9 },
  { date: "Mar 5", twitter: 2.8, instagram: 4.8, tiktok: 8.4, total: 4.6 },
  { date: "Mar 9", twitter: 2.4, instagram: 5.1, tiktok: 9.2, total: 4.8 },
  { date: "Mar 13", twitter: 3.1, instagram: 5.6, tiktok: 10.1, total: 5.4 },
  { date: "Mar 17", twitter: 3.4, instagram: 6.0, tiktok: 11.8, total: 6.1 },
  { date: "Mar 21", twitter: 3.2, instagram: 5.8, tiktok: 14.2, total: 6.4 },
  { date: "Mar 25", twitter: 3.6, instagram: 6.2, tiktok: 12.4, total: 6.8 },
];

export const followerGrowth = [
  { date: "Mar 1", twitter: 4100, instagram: 1680, tiktok: 620 },
  { date: "Mar 8", twitter: 4280, instagram: 1780, tiktok: 780 },
  { date: "Mar 15", twitter: 4520, instagram: 1920, tiktok: 1020 },
  { date: "Mar 22", twitter: 4720, instagram: 2060, tiktok: 1240 },
  { date: "Mar 26", twitter: 4820, instagram: 2140, tiktok: 1350 },
];

// ── Leads ────────────────────────────────────────────────────────────────────

export const leads: Lead[] = [
  {
    id: "l1",
    handle: "@levelsio",
    displayName: "Pieter Levels",
    platform: "twitter",
    followers: 542000,
    engagementCount: 7,
    lastEngaged: "2026-03-24T14:45:00Z",
    influenceScore: 94,
    engagementScore: 71,
    totalScore: 85,
    interactions: [
      { type: "like", postId: "p1", date: "2026-03-24T14:45:00Z" },
      { type: "share", postId: "p1", date: "2026-03-24T15:10:00Z" },
      { type: "comment", postId: "p7", date: "2026-03-19T11:00:00Z" },
    ],
  },
  {
    id: "l2",
    handle: "@swyx",
    displayName: "swyx",
    platform: "twitter",
    followers: 87000,
    engagementCount: 5,
    lastEngaged: "2026-03-23T10:20:00Z",
    influenceScore: 82,
    engagementScore: 64,
    totalScore: 75,
    interactions: [
      { type: "comment", postId: "p1", date: "2026-03-24T16:00:00Z" },
      { type: "like", postId: "p7", date: "2026-03-19T10:30:00Z" },
    ],
  },
  {
    id: "l3",
    handle: "@techproductgal",
    displayName: "Maya Rodriguez",
    platform: "instagram",
    followers: 28400,
    engagementCount: 12,
    lastEngaged: "2026-03-25T09:00:00Z",
    influenceScore: 61,
    engagementScore: 88,
    totalScore: 73,
    interactions: [
      { type: "comment", postId: "p3", date: "2026-03-23T16:30:00Z" },
      { type: "like", postId: "p4", date: "2026-03-20T09:15:00Z" },
      { type: "share", postId: "p3", date: "2026-03-23T17:00:00Z" },
    ],
  },
  {
    id: "l4",
    handle: "@aijordanlee",
    displayName: "Jordan Lee AI",
    platform: "tiktok",
    followers: 91000,
    engagementCount: 9,
    lastEngaged: "2026-03-25T21:00:00Z",
    influenceScore: 78,
    engagementScore: 82,
    totalScore: 80,
    interactions: [
      { type: "comment", postId: "p5", date: "2026-03-25T18:30:00Z" },
      { type: "share", postId: "p6", date: "2026-03-21T21:00:00Z" },
    ],
  },
  {
    id: "l5",
    handle: "@buildspace",
    displayName: "buildspace",
    platform: "twitter",
    followers: 184000,
    engagementCount: 4,
    lastEngaged: "2026-03-22T14:00:00Z",
    influenceScore: 88,
    engagementScore: 52,
    totalScore: 72,
    interactions: [
      { type: "like", postId: "p1", date: "2026-03-24T14:35:00Z" },
      { type: "mention", postId: "p1", date: "2026-03-22T14:00:00Z" },
    ],
  },
  {
    id: "l6",
    handle: "@priyankasarun",
    displayName: "Priyanka Sarun",
    platform: "instagram",
    followers: 14200,
    engagementCount: 18,
    lastEngaged: "2026-03-25T11:00:00Z",
    influenceScore: 48,
    engagementScore: 95,
    totalScore: 68,
    interactions: [
      { type: "comment", postId: "p3", date: "2026-03-23T16:45:00Z" },
      { type: "like", postId: "p4", date: "2026-03-20T09:20:00Z" },
      { type: "comment", postId: "p8", date: "2026-03-18T13:30:00Z" },
    ],
  },
];

// ── Strategies ───────────────────────────────────────────────────────────────

export const strategies: Strategy[] = [
  {
    id: "s1",
    title: "Build-in-Public Thread Series",
    description:
      "Weekly Twitter/X threads documenting real product decisions, bugs, revenue milestones, and growth. This compounds over time — transparency builds trust with developers and founders.",
    impact: "high",
    effort: "medium",
    timeframe: "Ongoing, weekly",
    tactics: [
      "Every Monday: share 1 real metric (users, ARR, churn)",
      "Every Wednesday: technical decision thread with pros/cons",
      "Every Friday: week recap with honest reflection",
      "Cross-post top threads as Instagram carousels",
    ],
    platform: "twitter",
    category: "content",
    status: "active",
  },
  {
    id: "s2",
    title: "TikTok Viral Hook Strategy",
    description:
      'TikTok\'s algorithm heavily rewards early retention. Blueprint OS demos are inherently visual and surprising — perfect for "POV: your AI actually does X" format videos.',
    impact: "high",
    effort: "medium",
    timeframe: "3-4 videos/week",
    tactics: [
      'Use "POV" and "Watch what happens when..." hooks in first 2 seconds',
      "Demo one specific feature per video — no overloading",
      "End every video with a CTA to waitlist/signup link in bio",
      "Respond to every comment in first hour (algo boost)",
      "Post between 6-9 PM local time for max reach",
    ],
    platform: "tiktok",
    category: "content",
    status: "active",
  },
  {
    id: "s3",
    title: "Influencer Co-creation Program",
    description:
      "Partner with 5-10 micro-influencers (10K-100K followers) in the productivity/indie-hacker/founder space. Give them early access and let them document their experience authentically.",
    impact: "high",
    effort: "high",
    timeframe: "1-2 months to set up",
    tactics: [
      "Identify top 20 target accounts from Lead Tracker",
      "Send personalized DMs with lifetime free access offer",
      'Ask for honest \"I tried this for a week\" content — no scripts',
      "Provide a referral link for each partner with revenue share",
      "Weekly check-ins to help them get the most from the product",
    ],
    platform: "all",
    category: "partnerships",
    status: "planned",
  },
  {
    id: "s4",
    title: "Instagram Carousel Authority Content",
    description:
      "Instagram carousels get 3x more reach than single images. Educational carousels about AI productivity, workflow design, and startup ops position Blueprint OS as a thought leader.",
    impact: "medium",
    effort: "medium",
    timeframe: "2-3 carousels/week",
    tactics: [
      "Topics: \"5 signs your productivity stack is broken\", \"How top founders use AI\"",
      "Always start slide 1 with a bold controversial statement",
      "Slide 2-8: evidence, examples, screenshots",
      "Last slide: CTA + save prompt",
      "Repurpose from long-form blog content for efficiency",
    ],
    platform: "instagram",
    category: "content",
    status: "active",
  },
  {
    id: "s5",
    title: "Twitter/X Reply Guy Strategy",
    description:
      "Being visible in conversations started by larger accounts in your niche is free distribution. Thoughtful replies to @levelsio, @swyx, @naval, etc. get seen by their audiences.",
    impact: "medium",
    effort: "low",
    timeframe: "Daily, 15-30 min",
    tactics: [
      "Follow 50 accounts in your target audience's orbit",
      "Enable notifications for their tweets",
      "Reply within first 10 minutes of their posts for visibility",
      "Add genuine value — never promotional",
      'Aim for "pinned reply" worthy comments that get engagement',
    ],
    platform: "twitter",
    category: "engagement",
    status: "active",
  },
  {
    id: "s6",
    title: "ProductHunt & Hacker News Launches",
    description:
      "Timed launches on PH and HN drive massive spikes in signups and social proof. Blueprint OS has a compelling story — AI OS built by a solo founder in public.",
    impact: "high",
    effort: "high",
    timeframe: "One-time + quarterly hunts",
    tactics: [
      "Build a \"coming soon\" PH page and collect upvote pledges",
      "Schedule launch for Tuesday at 12:01 AM PST",
      "Prep 10 early supporters to comment in first hour",
      "Write a detailed \"Show HN\" post for Hacker News same day",
      "Document the launch in a Twitter thread in real-time",
    ],
    platform: "all",
    category: "growth",
    status: "planned",
  },
  {
    id: "s7",
    title: "User Story Content Series",
    description:
      'Real user testimonials converted into short-form content. "How [user] went from X to Y using Blueprint OS" stories perform extremely well across all platforms.',
    impact: "medium",
    effort: "low",
    timeframe: "Weekly",
    tactics: [
      "Interview power users every 2 weeks via short Loom/async",
      "Turn stories into Twitter threads + IG carousels + TikTok voiceovers",
      'Get explicit approval and tag users — they share to their audience',
      "Create a featured users highlight on Instagram",
    ],
    platform: "all",
    category: "content",
    status: "planned",
  },
  {
    id: "s8",
    title: "Paid Twitter/X Ads — Amplify Top Posts",
    description:
      'Don\'t create new ad creative — amplify your organic posts that already have traction. This is the "double down on what works" approach that keeps CAC low.',
    impact: "medium",
    effort: "low",
    timeframe: "Ongoing, $500-1K/mo budget",
    tactics: [
      "Wait for organic posts to hit 4%+ engagement before boosting",
      "Target: founders, engineers, PM personas on Twitter/X",
      "Use conversation-style ads, not traditional banners",
      "A/B test 2-3 variations of top posts",
      "Cap spend at $50/day per post boost",
    ],
    platform: "twitter",
    category: "paid",
    status: "planned",
  },
];

// ── Overview Metrics ─────────────────────────────────────────────────────────

export const overviewMetrics = {
  totalFollowers: platformStats.reduce((sum, p) => sum + p.followers, 0),
  totalFollowersGrowth: 18.2,
  avgEngagementRate: 6.2,
  avgEngagementRateGrowth: 1.4,
  totalWeeklyReach: platformStats.reduce(
    (sum, p) => sum + p.weeklyImpressions,
    0
  ),
  weeklyReachGrowth: 24.1,
  topPost: recentPosts.find((p) => p.id === "p6")!,
  weeklySummary: {
    postsPublished: 7,
    totalEngagements: 6890,
    newFollowers: 284,
    topPlatform: "tiktok" as Platform,
  },
};

// ── Scheduled Posts ──────────────────────────────────────────────────────────

export const scheduledPosts = [
  {
    id: "sp1",
    content:
      "Blueprint OS just hit 500 paying users 🎉 Here's every growth channel that worked (and what flopped) — full breakdown thread ↓",
    platforms: ["twitter"] as Platform[],
    scheduledAt: "2026-03-27T14:00:00Z",
    status: "scheduled",
  },
  {
    id: "sp2",
    content:
      "We redesigned our onboarding from scratch based on 200 user interviews. The insight that changed everything: people don't want features, they want outcomes. Here's what we built.",
    platforms: ["twitter", "instagram"] as Platform[],
    scheduledAt: "2026-03-28T10:00:00Z",
    status: "scheduled",
  },
];
