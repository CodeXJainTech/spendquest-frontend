import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "📊",
    title: "Live Dashboard",
    desc: "Balance hero card, monthly stats, area chart, and category spending pie — everything at a glance.",
  },
  {
    icon: "📷",
    title: "AI Receipt Scan",
    desc: "Photograph any receipt. AI extracts amount, date, category instantly — no manual entry needed.",
  },
  {
    icon: "💰",
    title: "Budget Tracking",
    desc: "Set monthly limits per category. Color-coded progress bars warn you before you overspend.",
  },
  {
    icon: "🎯",
    title: "Savings Goals",
    desc: "Name a goal, set a target, watch your progress bar fill as you save toward it.",
  },
  {
    icon: "📤",
    title: "Instant Transfers",
    desc: "Send money to contacts in seconds. Pre-filled from your contacts list.",
  },
  {
    icon: "📋",
    title: "CSV Export",
    desc: "One-click export of any filtered transaction view for accounting or tax purposes.",
  },
];

export default function FakeDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D1117",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {/* Topbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontWeight: 800,
            fontSize: "1.25rem",
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Spend<span style={{ color: "#818CF8" }}>Quest</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            to="/signin"
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.15s",
            }}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              background: "#4F46E5",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          padding: "96px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.2) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 99,
              background: "rgba(79,70,229,0.15)",
              border: "1px solid rgba(79,70,229,0.3)",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#818CF8",
              }}
            />
            <span
              style={{ fontSize: "0.8rem", color: "#818CF8", fontWeight: 600 }}
            >
              Personal Finance, Redesigned
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: "clamp(2.4rem,6vw,4.2rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              marginBottom: 20,
            }}
          >
            Take control of
            <br />
            every rupee
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 480,
              margin: "0 auto 40px",
            }}
          >
            AI-powered expense tracking, smart budgets, and savings goals — all
            in a clean, fast interface built for real people.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/signup"
              style={{
                padding: "13px 32px",
                borderRadius: 12,
                background: "#4F46E5",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Create Free Account
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              to="/signin"
              style={{
                padding: "13px 32px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div
        style={{ maxWidth: 980, margin: "0 auto", padding: "20px 24px 100px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 800,
              fontSize: "1.6rem",
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Everything you need
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
            All your finance tools in one beautiful app
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "24px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(129,140,248,0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
              }
            >
              <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>
                {f.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 8,
                  fontSize: "1rem",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.85rem",
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
