"use client";

import { useState, useCallback } from "react";

type CardType = "announcement" | "feature" | "quote" | "stat";

interface CardForm {
  type: CardType;
  title: string;
  subtitle: string;
  stat: string;
  cta: string;
}

const CARD_TYPES: { value: CardType; label: string; description: string }[] = [
  {
    value: "announcement",
    label: "Announcement",
    description: "Large title, subtitle, CTA — launches, milestones",
  },
  {
    value: "feature",
    label: "Feature",
    description: "Feature name big, one-line description",
  },
  {
    value: "quote",
    label: "Quote",
    description: "Centered quote with attribution",
  },
  {
    value: "stat",
    label: "Stat",
    description: "Big number / stat with label",
  },
];

const DEFAULTS: Record<CardType, Partial<CardForm>> = {
  announcement: {
    title: "Blueprint OS is live",
    subtitle: "Ship ideas at the speed of thought",
    cta: "github.com/allenchuang/blueprint",
  },
  feature: {
    title: "Twitter Cards",
    subtitle: "Generate branded images for every post",
    cta: "blueprint.dev",
  },
  quote: {
    title: "Great software ships before it's ready.",
    subtitle: "— Allen Chuang",
  },
  stat: {
    title: "GitHub Stars",
    stat: "500+",
    cta: "Star us on GitHub",
  },
};

const inputClass =
  "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all border focus:ring-2";
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  borderColor: "rgba(255,255,255,0.1)",
};

export function CardPreviewClient() {
  const [form, setForm] = useState<CardForm>({
    type: "announcement",
    title: "Blueprint OS is live",
    subtitle: "Ship ideas at the speed of thought",
    stat: "",
    cta: "github.com/allenchuang/blueprint",
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = useCallback((type: CardType) => {
    const defaults = DEFAULTS[type];
    setForm((prev) => ({
      type,
      title: defaults.title ?? prev.title,
      subtitle: defaults.subtitle ?? "",
      stat: defaults.stat ?? "",
      cta: defaults.cta ?? "",
    }));
    setImageUrl(null);
    setError(null);
  }, []);

  const handleChange = useCallback(
    (field: keyof CardForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setImageUrl(null);
      setError(null);
    },
    []
  );

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const res = await fetch("/api/twitter/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          title: form.title,
          subtitle: form.subtitle || undefined,
          stat: form.stat || undefined,
          cta: form.cta || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [form]);

  const download = useCallback(() => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `twitter-card-${form.type}-${Date.now()}.png`;
    a.click();
  }, [imageUrl, form.type]);

  const labelStyle = { color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 6 };

  return (
    <div style={{ color: "#f5f5f7" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: 0,
          }}
        >
          Twitter Card Generator
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 6 }}>
          Generate branded 1200×630 images for posts. Fill in the form, preview, and download.
        </p>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Form */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Card Type */}
          <div>
            <p style={labelStyle}>Card Type</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CARD_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => handleTypeChange(ct.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1px solid ${form.type === ct.value ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.08)"}`,
                    background:
                      form.type === ct.value
                        ? "rgba(99,102,241,0.18)"
                        : "rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <p
                    style={{
                      color: form.type === ct.value ? "#a5b4fc" : "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {ct.label}
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 11,
                      margin: "3px 0 0",
                    }}
                  >
                    {ct.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <p style={labelStyle}>Title *</p>
            <input
              className={inputClass}
              style={{ ...inputStyle, borderRadius: 8 }}
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={form.type === "quote" ? "Your quote text" : "Main headline"}
            />
          </div>

          {/* Subtitle */}
          <div>
            <p style={labelStyle}>
              {form.type === "quote" ? "Attribution" : "Subtitle"}
              <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>(optional)</span>
            </p>
            <input
              className={inputClass}
              style={{ ...inputStyle, borderRadius: 8 }}
              value={form.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder={form.type === "quote" ? "— Author Name" : "Supporting text"}
            />
          </div>

          {/* Stat (stat type only) */}
          {form.type === "stat" && (
            <div>
              <p style={labelStyle}>
                Stat Value
                <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>(optional)</span>
              </p>
              <input
                className={inputClass}
                style={{ ...inputStyle, borderRadius: 8 }}
                value={form.stat}
                onChange={(e) => handleChange("stat", e.target.value)}
                placeholder="e.g. 500+ or $2M"
              />
            </div>
          )}

          {/* CTA */}
          <div>
            <p style={labelStyle}>
              CTA / Link
              <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>(optional)</span>
            </p>
            <input
              className={inputClass}
              style={{ ...inputStyle, borderRadius: 8 }}
              value={form.cta}
              onChange={(e) => handleChange("cta", e.target.value)}
              placeholder="github.com/allenchuang/blueprint"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading || !form.title.trim()}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background: loading || !form.title.trim() ? "rgba(99,102,241,0.4)" : "#6366f1",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading || !form.title.trim() ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Generating…
              </>
            ) : (
              "Generate Card"
            )}
          </button>

          {error && (
            <p
              style={{
                color: "#f87171",
                fontSize: 12,
                margin: 0,
                padding: "8px 12px",
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 8,
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Preview panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ ...labelStyle, marginBottom: 12 }}>Preview</p>
          <div
            style={{
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              overflow: "hidden",
              aspectRatio: "1200/630",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Generated Twitter card"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
                  {loading ? "Rendering…" : "Fill in the form and click Generate"}
                </p>
                <p style={{ color: "rgba(255,255,255,0.12)", fontSize: 12, marginTop: 4 }}>
                  1200 × 630px · PNG
                </p>
              </div>
            )}
          </div>

          {/* Download button */}
          {imageUrl && (
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <button
                onClick={download}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "1px solid rgba(99,102,241,0.4)",
                  background: "rgba(99,102,241,0.15)",
                  color: "#a5b4fc",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                ↓ Download PNG
              </button>
              <button
                onClick={generate}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Regenerate
              </button>
            </div>
          )}

          {/* Usage tip */}
          <div
            style={{
              marginTop: 24,
              padding: "14px 18px",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 12,
            }}
          >
            <p style={{ color: "#a5b4fc", fontSize: 12, fontWeight: 600, margin: 0 }}>
              Skylar tip
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: "4px 0 0" }}>
              To attach a card to a tweet via the API, pass{" "}
              <code
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "1px 5px",
                  borderRadius: 4,
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
              >
                imageUrl
              </code>{" "}
              to{" "}
              <code
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "1px 5px",
                  borderRadius: 4,
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
              >
                POST /api/twitter/post
              </code>
              . The server will upload the image as media and attach it to the tweet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
