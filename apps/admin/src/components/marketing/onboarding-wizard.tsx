"use client";

import { useState, useCallback, useEffect } from "react";
import { CheckCircle2, Plus, Copy, Check, RefreshCw, Twitter, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TwitterAccountInfo {
  id: string;
  username: string;
  displayName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {label && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[11px] font-medium" style={{ color: "#636366" }}>{label}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-medium transition-colors"
            style={{ color: copied ? "#30d158" : "#636366" }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre
        className="px-4 py-3 text-[12px] leading-relaxed overflow-x-auto"
        style={{ background: "rgba(0,0,0,0.4)", color: "#e5e5ea", margin: 0, fontFamily: "ui-monospace, 'Cascadia Code', monospace" }}
      >
        {code}
      </pre>
      {!label && (
        <div className="flex justify-end px-3 py-1.5" style={{ background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-medium transition-colors"
            style={{ color: copied ? "#30d158" : "#636366" }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Additional Account Setup ─────────────────────────────────────────────────

function AddAccountStep({
  accountNumber,
  onVerify,
}: {
  accountNumber: number;
  onVerify: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const envBlock = `TWITTER_ACCOUNT_${accountNumber}_USERNAME=your_username
TWITTER_ACCOUNT_${accountNumber}_DISPLAY_NAME=Your Display Name
TWITTER_ACCOUNT_${accountNumber}_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCOUNT_${accountNumber}_ACCESS_TOKEN_SECRET=your_access_token_secret_here`;

  const handleVerify = useCallback(async () => {
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/twitter/accounts");
      const accounts = await res.json() as TwitterAccountInfo[];
      const found = Array.isArray(accounts) && accounts.some(
        (a) => a.id === `account_${accountNumber}`
      );
      if (found) {
        setVerified(true);
        setTimeout(() => onVerify(), 800);
      } else {
        setError(`Account ${accountNumber} not detected. Make sure you've added the env vars and restarted the server.`);
      }
    } catch {
      setError("Failed to check accounts. Is the server running?");
    } finally {
      setVerifying(false);
    }
  }, [accountNumber, onVerify]);

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ background: "rgba(29,155,240,0.2)", color: "#1d9bf0" }}
        >
          {accountNumber}
        </div>
        <p className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
          Additional Account #{accountNumber}
        </p>
      </div>

      <p className="text-[12px] leading-relaxed" style={{ color: "#8e8e93" }}>
        Add these environment variables to your <code style={{ color: "#5ac8fa" }}>.env.local</code> file, then restart the server.
      </p>

      <CodeBlock code={envBlock} label=".env.local" />

      <div
        className="rounded-lg px-3 py-2.5 text-[12px]"
        style={{ background: "rgba(255,159,10,0.08)", border: "1px solid rgba(255,159,10,0.2)", color: "#ff9f0a" }}
      >
        💡 After adding the env vars, restart your server: <code>pm2 restart admin --update-env</code>
      </div>

      {!verified && (
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-[12px]" style={{ color: "#8e8e93" }}>
              I&apos;ve added the env vars and restarted the server
            </span>
          </label>
        </div>
      )}

      {error && (
        <p className="text-[12px]" style={{ color: "#ff453a" }}>{error}</p>
      )}

      {verified ? (
        <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: "#30d158" }}>
          <CheckCircle2 className="w-4 h-4" />
          Account detected! ✓
        </div>
      ) : (
        <button
          onClick={() => void handleVerify()}
          disabled={!confirmed || verifying}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "rgba(29,155,240,0.15)", border: "1px solid rgba(29,155,240,0.3)", color: "#1d9bf0" }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} />
          {verifying ? "Checking…" : "Verify Connection"}
        </button>
      )}
    </div>
  );
}

// ─── Connected Account Badge ──────────────────────────────────────────────────

function ConnectedAccountBadge({ account }: { account: TwitterAccountInfo }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
      style={{ background: "rgba(48,209,88,0.08)", border: "1px solid rgba(48,209,88,0.2)" }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
        style={{ background: "rgba(29,155,240,0.2)", color: "#1d9bf0" }}
      >
        {account.username.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate" style={{ color: "#f5f5f7" }}>
          {account.displayName}
        </p>
        <p className="text-[11px]" style={{ color: "#636366" }}>
          @{account.username}
        </p>
      </div>
      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#30d158" }} />
    </div>
  );
}

// ─── Main Onboarding Wizard ───────────────────────────────────────────────────

export function useOnboarding() {
  const [checked, setChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("blueprint-onboarding-complete");
    setShowOnboarding(!done);
    setChecked(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem("blueprint-onboarding-complete", "true");
    setShowOnboarding(false);
  }, []);

  return { showOnboarding, completeOnboarding, checked };
}

export function OnboardingWizard({ onComplete }: { onComplete?: () => void }) {
  const [accounts, setAccounts] = useState<TwitterAccountInfo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [additionalAccountCount, setAdditionalAccountCount] = useState(0);
  const [verifiedAdditional, setVerifiedAdditional] = useState<number[]>([]);

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/twitter/accounts");
      const data = await res.json() as TwitterAccountInfo[];
      if (Array.isArray(data)) {
        setAccounts(data);
        setLoaded(true);
      }
    } catch {
      setLoaded(true);
    }
  }, []);

  // Load on first expand
  const handleExpand = useCallback(() => {
    setCollapsed(false);
    if (!loaded) {
      void fetchAccounts();
    }
  }, [loaded, fetchAccounts]);

  const primaryAccount = accounts.find(a => a.id === 'blueprint_os') ?? accounts[0];
  const isPrimaryConnected = !!primaryAccount;

  const handleAdditionalVerified = useCallback((accountNumber: number) => {
    setVerifiedAdditional(prev => [...prev, accountNumber]);
    void fetchAccounts();
  }, [fetchAccounts]);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(28,28,30,0.82)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(29,155,240,0.2)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => (collapsed ? handleExpand() : setCollapsed(true))}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors"
        style={{ background: "transparent" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(29,155,240,0.15)", color: "#1d9bf0" }}
          >
            <Twitter className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[14px] font-semibold" style={{ color: "#f5f5f7" }}>
              Connect Accounts
            </p>
            <p className="text-[12px]" style={{ color: "#636366" }}>
              {accounts.length === 0
                ? "Set up your Twitter / X accounts"
                : `${accounts.length} account${accounts.length !== 1 ? "s" : ""} connected`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPrimaryConnected && (
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: "rgba(48,209,88,0.12)", color: "#30d158" }}
            >
              ✓ Active
            </span>
          )}
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{ color: "#636366", transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      {/* Content */}
      {!collapsed && (
        <div className="px-5 pb-5 space-y-4">
          {/* Step 1: Primary account */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={
                  isPrimaryConnected
                    ? { background: "rgba(48,209,88,0.2)", color: "#30d158" }
                    : { background: "rgba(255,255,255,0.08)", color: "#636366" }
                }
              >
                {isPrimaryConnected ? "✓" : "1"}
              </div>
              <p className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
                Primary Account
              </p>
            </div>

            {isPrimaryConnected ? (
              <ConnectedAccountBadge account={primaryAccount!} />
            ) : (
              <div className="space-y-3">
                <p className="text-[12px] leading-relaxed" style={{ color: "#8e8e93" }}>
                  Add your primary Twitter / X credentials to <code style={{ color: "#5ac8fa" }}>.env.local</code>:
                </p>
                <CodeBlock
                  code={`TWITTER_USERNAME=blueprint_os
TWITTER_CONSUMER_KEY=your_consumer_key
TWITTER_CONSUMER_SECRET=your_consumer_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
TWITTER_BEARER_TOKEN=your_bearer_token`}
                  label=".env.local"
                />
                <button
                  onClick={() => void fetchAccounts()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{ background: "rgba(29,155,240,0.1)", border: "1px solid rgba(29,155,240,0.25)", color: "#1d9bf0" }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Check connection
                </button>
              </div>
            )}
          </div>

          {/* Connected accounts list (shows all) */}
          {accounts.length > 1 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#636366", letterSpacing: "0.08em" }}>
                All Connected Accounts
              </p>
              <div className="space-y-2">
                {accounts.map((account) => (
                  <ConnectedAccountBadge key={account.id} account={account} />
                ))}
              </div>
            </div>
          )}

          {/* Additional accounts section */}
          {isPrimaryConnected && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#636366" }}
                >
                  2
                </div>
                <p className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
                  Additional Accounts <span style={{ color: "#636366", fontWeight: 400 }}>(optional)</span>
                </p>
              </div>

              {/* Render any additional account setup steps */}
              {Array.from({ length: additionalAccountCount }, (_, i) => i + 2).map((num) => (
                <div key={num} className="mb-3">
                  <AddAccountStep
                    accountNumber={num}
                    onVerify={() => handleAdditionalVerified(num)}
                  />
                </div>
              ))}

              <button
                onClick={() => setAdditionalAccountCount(c => c + 1)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px dashed rgba(255,255,255,0.15)",
                  color: "#8e8e93",
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add another account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
