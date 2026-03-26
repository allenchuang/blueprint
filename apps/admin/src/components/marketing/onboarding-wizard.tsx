"use client";

import { useState, useEffect } from "react";
import { Twitter, User, CheckCircle2, ChevronRight, X, Sparkles, ArrowRight } from "lucide-react";

const ONBOARDING_KEY = "blueprint_marketing_onboarded";

type Step = "welcome" | "connect-twitter" | "profile" | "done";

interface OnboardingWizardProps {
  onComplete: () => void;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            background: i <= current ? "#0a84ff" : "rgba(255,255,255,0.12)",
          }}
        />
      ))}
    </div>
  );
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [twitterConnecting, setTwitterConnecting] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);

  const steps: Step[] = ["welcome", "connect-twitter", "profile", "done"];
  const stepIndex = steps.indexOf(step);

  function handleSkip() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    onComplete();
  }

  function handleNext() {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  }

  function handleConnectTwitter() {
    setTwitterConnecting(true);
    // Simulate connection — in production, redirect to OAuth
    setTimeout(() => {
      setTwitterConnecting(false);
      setTwitterConnected(true);
      setTimeout(() => {
        setStep("profile");
      }, 800);
    }, 1500);
  }

  function handleFinish() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    onComplete();
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "#1c1c1e",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: "#0a84ff" }} />
            <span className="text-[13px] font-semibold" style={{ color: "#8e8e93" }}>
              Blueprint Marketing Setup
            </span>
          </div>
          <div className="flex items-center gap-4">
            {step !== "done" && (
              <StepIndicator current={stepIndex} total={steps.length - 1} />
            )}
            <button
              onClick={handleSkip}
              className="text-[12px] transition-colors"
              style={{ color: "#48484a" }}
              title="Skip setup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-10">
          {/* ── Welcome ── */}
          {step === "welcome" && (
            <div className="text-center space-y-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(10,132,255,0.15)", border: "1px solid rgba(10,132,255,0.3)" }}
              >
                <Sparkles className="w-8 h-8" style={{ color: "#0a84ff" }} />
              </div>
              <div>
                <h1 className="text-[26px] font-bold mb-3" style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}>
                  Welcome to Blueprint Marketing
                </h1>
                <p className="text-[15px] leading-relaxed" style={{ color: "#8e8e93" }}>
                  Your AI-powered marketing command center. Connect your social accounts, track analytics, compose content, and let Skylar handle your daily brief.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-3 text-left">
                {[
                  { emoji: "📊", title: "Real-time Analytics", desc: "Track followers, engagement, and impressions" },
                  { emoji: "✍️", title: "AI Content Composer", desc: "Write & post tweets powered by GPT" },
                  { emoji: "🔥", title: "Hot Trends", desc: "See what's trending from Hacker News & Reddit" },
                  { emoji: "☀️", title: "Skylar's Daily Brief", desc: "Wake up to a personalized marketing briefing" },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <span className="text-[20px] leading-none mt-0.5">{feat.emoji}</span>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>{feat.title}</p>
                      <p className="text-[12px]" style={{ color: "#636366" }}>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-semibold transition-all duration-150 active:scale-[0.98]"
                style={{ background: "#0a84ff", color: "#fff" }}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleSkip}
                className="w-full text-[13px] transition-colors"
                style={{ color: "#48484a" }}
              >
                Skip setup, explore on my own
              </button>
            </div>
          )}

          {/* ── Connect Twitter ── */}
          {step === "connect-twitter" && (
            <div className="space-y-6">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(29,161,242,0.12)", border: "1px solid rgba(29,161,242,0.25)" }}
                >
                  <Twitter className="w-8 h-8" style={{ color: "#1da1f2" }} />
                </div>
                <h2 className="text-[22px] font-bold mb-2" style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}>
                  Connect Twitter / X
                </h2>
                <p className="text-[14px]" style={{ color: "#8e8e93" }}>
                  Unlock analytics, post directly, and let Skylar track your growth.
                </p>
              </div>

              {/* What you get */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "rgba(29,161,242,0.06)", border: "1px solid rgba(29,161,242,0.12)" }}
              >
                <p className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#1da1f2" }}>
                  What you&apos;ll unlock
                </p>
                {[
                  "Follower count, growth & engagement rate",
                  "Tweet performance & impressions",
                  "Post directly from the Compose page",
                  "AI-generated content suggestions",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[13px]" style={{ color: "#c7c7cc" }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#1da1f2" }} />
                    {item}
                  </div>
                ))}
              </div>

              {/* How to connect */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#636366" }}>
                  How to connect
                </p>
                <p className="text-[13px]" style={{ color: "#8e8e93" }}>
                  Add your Twitter API credentials to your{" "}
                  <code
                    className="px-1.5 py-0.5 rounded text-[12px]"
                    style={{ background: "rgba(255,255,255,0.08)", color: "#f5f5f7" }}
                  >
                    .env
                  </code>{" "}
                  file:
                </p>
                <pre
                  className="text-[11px] mt-2 p-3 rounded-lg overflow-x-auto"
                  style={{
                    background: "#0d0d0f",
                    color: "#30d158",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: "monospace",
                  }}
                >{`TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret`}</pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={twitterConnected ? undefined : handleConnectTwitter}
                  disabled={twitterConnecting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 active:scale-[0.98]"
                  style={
                    twitterConnected
                      ? { background: "rgba(48,209,88,0.15)", color: "#30d158", border: "1px solid rgba(48,209,88,0.3)" }
                      : twitterConnecting
                      ? { background: "rgba(10,132,255,0.3)", color: "#0a84ff", cursor: "wait" }
                      : { background: "#0a84ff", color: "#fff" }
                  }
                >
                  {twitterConnected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Connected!
                    </>
                  ) : twitterConnecting ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full border-2 animate-spin"
                        style={{ borderColor: "rgba(10,132,255,0.3)", borderTopColor: "#0a84ff" }}
                      />
                      Connecting…
                    </>
                  ) : (
                    <>
                      <Twitter className="w-4 h-4" />
                      Connect Twitter
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleNext}
                className="w-full text-[13px] flex items-center justify-center gap-1 transition-colors"
                style={{ color: "#48484a" }}
              >
                Skip for now
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ── Profile ── */}
          {step === "profile" && (
            <div className="space-y-6">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(191,90,242,0.12)", border: "1px solid rgba(191,90,242,0.25)" }}
                >
                  <User className="w-8 h-8" style={{ color: "#bf5af2" }} />
                </div>
                <h2 className="text-[22px] font-bold mb-2" style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}>
                  You&apos;re almost set
                </h2>
                <p className="text-[14px]" style={{ color: "#8e8e93" }}>
                  Blueprint Marketing is ready to use. Here&apos;s a quick tour of what&apos;s available.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    icon: "📊",
                    label: "Overview",
                    desc: "Your main analytics dashboard — metrics, charts, recent tweets",
                    href: "/",
                  },
                  {
                    icon: "🌐",
                    label: "Social Channels",
                    desc: "Deep-dive per-platform analytics and posting",
                    href: "/socials",
                  },
                  {
                    icon: "✍️",
                    label: "Compose",
                    desc: "AI-powered tweet composer with trend suggestions",
                    href: "/compose",
                  },
                  {
                    icon: "🔥",
                    label: "Hot Trends",
                    desc: "Real-time topics from Hacker News & Reddit",
                    href: "/trends",
                  },
                ].map((page) => (
                  <a
                    key={page.label}
                    href={page.href}
                    className="flex items-center gap-3 p-3 rounded-xl group transition-all duration-150"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(10,132,255,0.2)";
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(10,132,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                    }}
                  >
                    <span className="text-[20px]">{page.icon}</span>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>{page.label}</p>
                      <p className="text-[12px]" style={{ color: "#636366" }}>{page.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#0a84ff" }} />
                  </a>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-semibold transition-all duration-150 active:scale-[0.98]"
                style={{ background: "#0a84ff", color: "#fff" }}
              >
                Explore Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Done ── */}
          {step === "done" && (
            <div className="text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(48,209,88,0.15)", border: "2px solid rgba(48,209,88,0.4)" }}
                >
                  <CheckCircle2 className="w-10 h-10" style={{ color: "#30d158" }} />
                </div>
              </div>
              <div>
                <h2 className="text-[26px] font-bold mb-3" style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}>
                  You&apos;re all set! 🎉
                </h2>
                <p className="text-[15px]" style={{ color: "#8e8e93" }}>
                  Blueprint Marketing is ready. Start exploring your dashboard, or connect Twitter to unlock real-time analytics.
                </p>
              </div>
              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-xl text-[15px] font-semibold transition-all duration-150 active:scale-[0.98]"
                style={{ background: "#30d158", color: "#000" }}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only runs on client
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) {
      setShowOnboarding(true);
    }
    setChecked(true);
  }, []);

  function completeOnboarding() {
    setShowOnboarding(false);
  }

  return { showOnboarding, completeOnboarding, checked };
}
