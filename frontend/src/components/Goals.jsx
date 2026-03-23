import React, { useState } from "react";
import { toast } from "./Toast";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition";
const labelCls =
  "block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider";

export default function Goals({
  authAxios,
  goals,
  setGoals,
  refreshDashboard,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", target: "" });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDel] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await authAxios.post("account/goals", {
        title: form.title,
        target: Number(form.target),
      });
      setGoals((p) => [...p, res.data]);
      setShowAdd(false);
      setForm({ title: "", target: "" });
      toast.success(`Goal "${form.title}" created`);
      refreshDashboard();
    } catch {
      toast.error("Failed to create goal");
    } finally {
      setAdding(false);
    }
  };
  const del = async (id, title) => {
    setDel(id);
    try {
      await authAxios.delete(`account/goals/${id}`);
      setGoals((p) => p.filter((g) => g._id !== id));
      toast.info(`"${title}" deleted`);
      refreshDashboard();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDel(null);
    }
  };

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + (g.progress || 0), 0);
  const doneCount = goals.filter((g) => (g.progress || 0) >= g.target).length;

  const summaryCards = [
    {
      label: "Total Target",
      value: `₹${totalTarget.toLocaleString("en-IN")}`,
      color: "text-indigo-600",
    },
    {
      label: "Total Saved",
      value: `₹${totalSaved.toLocaleString("en-IN")}`,
      color: "text-emerald-600",
    },
    {
      label: "Goals Achieved",
      value: doneCount,
      color: doneCount > 0 ? "text-emerald-600" : "text-gray-700",
    },
    {
      label: "In Progress",
      value: goals.length - doneCount,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="font-bold text-2xl text-[#0F1117] tracking-tight">
            Goals
          </div>
          <div className="text-[0.8rem] text-gray-400 mt-0.5">
            Savings targets • match transaction category names to track
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.875rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-px transition border-none cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Goal
        </button>
      </div>

      {/* Summary row */}
      {goals.length > 0 && (
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {summaryCards.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4"
            >
              <div className="text-[0.72rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                {s.label}
              </div>
              <div
                className={`font-extrabold text-[1.4rem] tracking-tight ${s.color}`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm text-center px-6 py-16">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="font-bold text-[1rem] text-[#0F1117] mb-1.5">
            No goals yet
          </div>
          <div className="text-gray-400 text-[0.875rem]">
            Create a savings goal and track your progress
          </div>
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {goals.map((g) => {
            const progress = g.progress || 0;
            const pct = Math.min(100, (progress / g.target) * 100);
            const done = progress >= g.target;
            const isDeleting = deletingId === g._id;

            return (
              <div
                key={g._id}
                className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-opacity ${isDeleting ? "opacity-50" : "opacity-100"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="font-bold text-[1rem] text-[#0F1117]">
                        {g.title}
                      </div>
                      {done && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold bg-emerald-50 text-emerald-700">
                          ✓ Achieved!
                        </span>
                      )}
                    </div>
                    <div className="text-[0.75rem] text-gray-400">
                      Target: ₹{Number(g.target).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <button
                    disabled={isDeleting}
                    onClick={() => del(g._id, g.title)}
                    className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 border-[1.5px] border-red-200 disabled:opacity-55 cursor-pointer transition"
                  >
                    {isDeleting ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-spin"
                      >
                        <circle cx="12" cy="12" r="9" strokeDasharray="28 56" />
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="h-2 rounded-full bg-gray-100 border border-gray-200 overflow-hidden mb-2.5">
                  <div
                    className="h-full rounded-full transition-[width_0.6s_cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      width: `${pct}%`,
                      background: done ? "#10B981" : "#4F46E5",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[0.8rem] text-gray-600">
                    <strong className="font-[Bricolage_Grotesque] text-[#0F1117]">
                      ₹{progress.toLocaleString("en-IN")}
                    </strong>{" "}
                    saved
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold bg-indigo-50 text-indigo-700">
                    {pct.toFixed(0)}% complete
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="bg-white rounded-3xl shadow-[0_20px_25px_rgba(0,0,0,0.09)] w-full max-w-[440px] p-7 modal-animate">
            <div className="flex items-center justify-between mb-5">
              <div className="font-bold text-[1.1rem] text-[#0F1117]">
                New Goal
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 p-1 flex transition"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={add} className="flex flex-col gap-3.5">
              <div>
                <label className={labelCls}>Goal Name</label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="e.g. New Laptop, Emergency Fund"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Target Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={form.target}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, target: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-[#F4F6FB] hover:bg-white text-gray-700 text-[0.875rem] font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.875rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] disabled:opacity-55 disabled:cursor-not-allowed border-none cursor-pointer transition"
                >
                  {adding ? "Creating…" : "Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
