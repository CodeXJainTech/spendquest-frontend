import React, { useState } from "react";
import { toast } from "./Toast";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition";
const labelCls =
  "block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider";

export default function Budgets({
  authAxios,
  budgets,
  setBudgets,
  refreshDashboard,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: "", limit: "" });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDel] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await authAxios.post("account/budgets", {
        category: form.category,
        limit: Number(form.limit),
      });
      setBudgets((p) => [...p, res.data]);
      setShowAdd(false);
      setForm({ category: "", limit: "" });
      toast.success(`Budget "${form.category}" created`);
      refreshDashboard();
    } catch {
      toast.error("Failed to create budget");
    } finally {
      setAdding(false);
    }
  };
  const del = async (id, cat) => {
    setDel(id);
    try {
      await authAxios.delete(`account/budgets/${id}`);
      setBudgets((p) => p.filter((b) => b._id !== id));
      toast.info(`"${cat}" budget deleted`);
      refreshDashboard();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDel(null);
    }
  };

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);

  const summaryCards = [
    {
      label: "Total Budget",
      value: `₹${totalLimit.toLocaleString("en-IN")}`,
      color: "text-indigo-600",
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      color: totalSpent > totalLimit ? "text-red-500" : "text-[#0F1117]",
    },
    {
      label: "Remaining",
      value: `₹${Math.max(0, totalLimit - totalSpent).toLocaleString("en-IN")}`,
      color: "text-emerald-600",
    },
    { label: "Categories", value: budgets.length, color: "text-gray-700" },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="font-bold text-2xl text-[#0F1117] tracking-tight">
            Budgets
          </div>
          <div className="text-[0.8rem] text-gray-400 mt-0.5">
            Category spending limits • match transaction category names
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
          Add Budget
        </button>
      </div>

      {/* Summary row */}
      {budgets.length > 0 && (
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
      {budgets.length === 0 ? (
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
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="font-bold text-[1rem] text-[#0F1117] mb-1.5">
            No budgets yet
          </div>
          <div className="text-gray-400 text-[0.875rem]">
            Create a budget to track spending by category
          </div>
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {budgets.map((b) => {
            const pct = Math.min(100, ((b.spent || 0) / b.limit) * 100);
            const over = (b.spent || 0) > b.limit;
            const warn = !over && pct > 80;
            const barColor = over ? "#EF4444" : warn ? "#F59E0B" : "#10B981";
            const isDeleting = deletingId === b._id;

            return (
              <div
                key={b._id}
                className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-opacity ${isDeleting ? "opacity-50" : "opacity-100"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-[1rem] text-[#0F1117]">
                      {b.category}
                    </div>
                    <div className="text-[0.75rem] text-gray-400 mt-0.5">
                      Limit: ₹{Number(b.limit).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {over && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold bg-red-50 text-red-700">
                        Over budget
                      </span>
                    )}
                    {warn && !over && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold bg-amber-50 text-amber-700">
                        80%+
                      </span>
                    )}
                    <button
                      disabled={isDeleting}
                      onClick={() => del(b._id, b.category)}
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
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            strokeDasharray="28 56"
                          />
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
                </div>

                <div className="h-2 rounded-full bg-gray-100 border border-gray-200 overflow-hidden mb-2.5">
                  <div
                    className="h-full rounded-full transition-[width_0.6s_cubic-bezier(0.4,0,0.2,1)]"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[0.8rem] text-gray-600">
                    <strong className="font-[Bricolage_Grotesque] text-[#0F1117]">
                      ₹{(b.spent || 0).toLocaleString("en-IN")}
                    </strong>{" "}
                    spent
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold ${over ? "bg-red-50 text-red-700" : warn ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                  >
                    {over
                      ? `₹${((b.spent || 0) - b.limit).toLocaleString("en-IN")} over`
                      : `₹${(b.limit - (b.spent || 0)).toLocaleString("en-IN")} left`}
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
                New Budget
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
                <label className={labelCls}>Category Name</label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="e.g. Food, Travel, Entertainment"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Monthly Limit (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={form.limit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, limit: e.target.value }))
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
                  {adding ? "Creating…" : "Create Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}