import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Signin() {
  const [form, setForm] = useState({ userName: "", password: "" });
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signin`,
        form,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      window.location.href = "/dashboard";
    } catch (e) {
      setError(
        e.response?.data?.message || "Sign in failed. Check your credentials.",
      );
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F4F6FB]">
      {/* Left panel */}
      <div
        className="hidden md:flex w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1E1B4B 0%, #312E81 55%, #4338CA 100%)",
        }}
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.04] pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-60 h-60 rounded-full bg-indigo-400/[0.12] pointer-events-none" />

        <div className="relative font-extrabold text-[1.4rem] text-white tracking-tight">
          Spend<span className="text-indigo-400">Quest</span>
        </div>

        <div className="relative">
          <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-white leading-tight tracking-tight mb-4">
            Every rupee tracked.
            <br />
            Every goal reached.
          </h2>
          <p className="text-indigo-200/65 text-[0.95rem] leading-relaxed">
            Your personal finance companion — budgets, goals, AI receipt
            scanning, and instant transfers.
          </p>
        </div>

        <div className="flex gap-7 relative">
          {["AI Scanning", "Budgets", "Goals"].map((f) => (
            <span
              key={f}
              className="text-[0.7rem] font-bold tracking-widest uppercase text-indigo-200/40"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[400px]">
          <div className="md:hidden font-extrabold text-[1.6rem] text-[#0F1117] mb-8 tracking-tight">
            Spend<span className="text-indigo-600">Quest</span>
          </div>

          <div className="mb-8">
            <h1 className="font-extrabold text-[1.75rem] text-[#0F1117] tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-400 mt-1.5 text-[0.9rem]">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                name="userName"
                type="email"
                value={form.userName}
                onChange={(e) => {
                  setForm((p) => ({ ...p, userName: e.target.value }));
                  setError("");
                }}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition"
              />
            </div>
            <div>
              <label className="block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, password: e.target.value }));
                    setError("");
                  }}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3.5 py-2.5 pr-11 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 transition flex"
                >
                  {showPw ? (
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[0.85rem] font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-[0.95rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              {loading ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-spin"
                  >
                    <circle cx="12" cy="12" r="9" strokeDasharray="28 56" />
                  </svg>{" "}
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[0.875rem] text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
