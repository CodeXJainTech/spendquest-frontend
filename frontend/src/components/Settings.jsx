import React, { useState } from "react";
import { toast } from "./Toast";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition";
const labelCls =
  "block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider";

const Eye = ({ show }) =>
  show ? (
    <svg
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export default function Settings({ userInfo, authAxios, onLogout }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoad] = useState(false);
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoad(true);
    try {
      await authAxios.post("/user/changeps", form);
      toast.success("Password updated successfully");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update password");
    } finally {
      setLoad(false);
    }
  };

  const initial = userInfo.name ? userInfo.name[0].toUpperCase() : "?";

  return (
    <div className="max-w-[560px] flex flex-col gap-5 animate-fade-up">
      <div className="flex items-start justify-between">
        <div className="font-bold text-2xl text-[#0F1117] tracking-tight">
          Settings
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-[0.85rem] font-semibold border-[1.5px] border-red-200 cursor-pointer transition"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-[1.3rem] shrink-0 shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
          {initial}
        </div>
        <div>
          <div className="font-bold text-[1.1rem] text-[#0F1117]">
            {userInfo.name}
          </div>
          <div className="text-[0.8rem] text-gray-400 mt-0.5">
            {userInfo.email}
          </div>
        </div>
        <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold bg-indigo-50 text-indigo-700">
          Active
        </span>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="mb-5">
          <div className="font-bold text-[1rem] text-[#0F1117]">
            Change Password
          </div>
          <div className="text-[0.8rem] text-gray-400 mt-1">
            Must be at least 6 characters long
          </div>
        </div>
        <form onSubmit={save} className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <div className="relative">
              <input
                type={showCur ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, currentPassword: e.target.value }))
                }
                className={`${inputCls} pr-11`}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCur((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 flex p-0.5 transition"
              >
                <Eye show={showCur} />
              </button>
            </div>
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={(e) =>
                  setForm((p) => ({ ...p, newPassword: e.target.value }))
                }
                className={`${inputCls} pr-11`}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 flex p-0.5 transition"
              >
                <Eye show={showNew} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.875rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none border-none cursor-pointer transition"
          >
            {loading ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="animate-spin"
                >
                  <circle cx="12" cy="12" r="9" strokeDasharray="28 56" />
                </svg>{" "}
                Saving…
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}