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
    <div className="min-h-screen bg-[#0D1117] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Topbar */}
      <nav className="flex items-center justify-between px-10 py-[18px] border-b border-white/[0.06]">
        <div className="font-extrabold text-[1.25rem] text-white tracking-tight">
          Spend<span className="text-indigo-400">Quest</span>
        </div>
        <div className="flex gap-2.5">
          <Link
            to="/signin"
            className="px-5 py-2 rounded-[10px] text-white/60 text-[0.875rem] font-medium border border-white/10 hover:border-white/20 hover:text-white/80 transition no-underline"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-[10px] bg-indigo-600 text-white text-[0.875rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:bg-indigo-700 transition no-underline"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative text-center px-6 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(79,70,229,0.2)_0%,transparent_65%)] pointer-events-none" />
        <div className="relative max-w-[700px] mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-600/30 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-[0.8rem] text-indigo-400 font-semibold">
              Personal Finance, Redesigned
            </span>
          </div>
          <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold text-white leading-[1.1] tracking-[-0.04em] mb-5">
            Take control of
            <br />
            every rupee
          </h1>
          <p className="text-white/45 text-[1.05rem] leading-relaxed max-w-[480px] mx-auto mb-10">
            AI-powered expense tracking, smart budgets, and savings goals — all
            in a clean, fast interface built for real people.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-[0.95rem] shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:bg-indigo-700 hover:-translate-y-px transition no-underline"
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
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.07] text-white/75 font-semibold text-[0.95rem] border border-white/[0.12] hover:bg-white/10 transition no-underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-[980px] mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <div className="font-extrabold text-[1.6rem] text-white tracking-tight mb-2">
            Everything you need
          </div>
          <div className="text-white/40 text-[0.9rem]">
            All your finance tools in one beautiful app
          </div>
        </div>
        <div
          className="grid gap-[18px]"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-400/30 transition-colors"
            >
              <div className="text-[1.8rem] mb-3.5">{f.icon}</div>
              <div className="font-bold text-white mb-2 text-[1rem]">
                {f.title}
              </div>
              <div className="text-white/40 text-[0.85rem] leading-[1.65]">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
