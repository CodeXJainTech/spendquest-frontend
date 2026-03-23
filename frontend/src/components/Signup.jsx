import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
    s_balance: "",
  });
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        { ...form, s_balance: Number(form.s_balance) },
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } catch (e) {
      setError(
        e.response?.data?.message || "Sign up failed. Please try again.",
      );
      setLoad(false);
    }
  };

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition";
  const labelCls =
    "block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB] px-6 py-10">
      <div className="w-full max-w-[460px]">
        <div className="text-center mb-8">
          <div className="font-extrabold text-[1.9rem] text-[#0F1117] tracking-tight mb-2">
            Spend<span className="text-indigo-600">Quest</span>
          </div>
          <div className="font-bold text-[1.3rem] text-[#0F1117]">
            Create your account
          </div>
          <div className="text-gray-400 mt-1.5 text-[0.875rem]">
            Start taking control of your finances today
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={submit} className="flex flex-col gap-3.5">
            <div>
              <label className={labelCls}>Email Address</label>
              <input
                name="userName"
                type="email"
                value={form.userName}
                onChange={(e) => {
                  setForm((p) => ({ ...p, userName: e.target.value }));
                  setError("");
                }}
                className={inputCls}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="Raj"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="Sharma"
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                className={inputCls}
                placeholder="Min. 6 characters"
                required
              />
            </div>

            <div>
              <label className={labelCls}>Starting Balance (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                  ₹
                </span>
                <input
                  name="s_balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.s_balance}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, s_balance: e.target.value }))
                  }
                  className={`${inputCls} pl-7`}
                  placeholder="0.00"
                  required
                />
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
              className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.95rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none transition"
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
                  Creating account…
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-[0.875rem] text-gray-400 pt-5 border-t border-gray-100">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
