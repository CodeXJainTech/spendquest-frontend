import React, { useState } from "react";
import { toast } from "./Toast";

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

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
      className="animate-fade-up"
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div className="page-title">Budgets</div>
          <div style={{ fontSize: "0.8rem", color: "var(--t4)", marginTop: 3 }}>
            Category spending limits • match transaction category names
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary">
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

      {budgets.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              label: "Total Budget",
              value: `₹${totalLimit.toLocaleString("en-IN")}`,
              color: "var(--brand)",
            },
            {
              label: "Total Spent",
              value: `₹${totalSpent.toLocaleString("en-IN")}`,
              color: totalSpent > totalLimit ? "var(--red)" : "var(--t1)",
            },
            {
              label: "Remaining",
              value: `₹${Math.max(0, totalLimit - totalSpent).toLocaleString("en-IN")}`,
              color: "var(--green)",
            },
            { label: "Categories", value: budgets.length, color: "var(--t2)" },
          ].map((s) => (
            <div
              key={s.label}
              className="card"
              style={{ padding: "16px 20px" }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--t4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  color: s.color,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {budgets.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "64px 24px" }}
        >
          <div className="empty-icon" style={{ margin: "0 auto 16px" }}>
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="section-title" style={{ marginBottom: 6 }}>
            No budgets yet
          </div>
          <div style={{ color: "var(--t4)", fontSize: "0.875rem" }}>
            Create a budget to track spending by category
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {budgets.map((b) => {
            const pct = Math.min(100, ((b.spent || 0) / b.limit) * 100);
            const over = (b.spent || 0) > b.limit;
            const warn = !over && pct > 80;
            const barColor = over
              ? "var(--red)"
              : warn
                ? "var(--amber)"
                : "var(--green)";
            const isDeleting = deletingId === b._id;

            return (
              <div
                key={b._id}
                className="card card-p"
                style={{
                  opacity: isDeleting ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "var(--t1)",
                      }}
                    >
                      {b.category}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--t4)",
                        marginTop: 3,
                      }}
                    >
                      Limit: ₹{Number(b.limit).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {over && (
                      <span className="badge badge-red">Over budget</span>
                    )}
                    {warn && !over && (
                      <span className="badge badge-amber">80%+</span>
                    )}
                    <button
                      disabled={isDeleting}
                      onClick={() => del(b._id, b.category)}
                      className="btn btn-icon btn-danger"
                    >
                      {isDeleting ? (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="spin"
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

                <div className="progress-track" style={{ marginBottom: 10 }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--t2)" }}>
                    <strong
                      style={{
                        color: "var(--t1)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      ₹{(b.spent || 0).toLocaleString("en-IN")}
                    </strong>{" "}
                    spent
                  </span>
                  <span
                    className={`badge ${over ? "badge-red" : warn ? "badge-amber" : "badge-green"}`}
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

      {showAdd && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="modal">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                New Budget
              </div>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--t4)",
                  padding: 4,
                  display: "flex",
                }}
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
            <form
              onSubmit={add}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div>
                <label className="label">Category Name</label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="input"
                  placeholder="e.g. Food, Travel, Entertainment"
                  required
                />
              </div>
              <div>
                <label className="label">Monthly Limit (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={form.limit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, limit: e.target.value }))
                  }
                  className="input"
                  placeholder="0"
                  required
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={adding}
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
