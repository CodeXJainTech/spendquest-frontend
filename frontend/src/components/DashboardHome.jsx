import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const fmt = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
      ? `₹${(n / 1000).toFixed(1)}k`
      : `₹${n.toFixed(0)}`;

const StatCard = ({ label, value, sub, accent, icon, delay = "" }) => (
  <div
    className={`card card-p animate-fade-up ${delay}`}
    style={{ display: "flex", flexDirection: "column", gap: 16 }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--t3)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: accent + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          fontSize: "1.1rem",
        }}
      >
        {icon}
      </div>
    </div>
    <div>
      <div
        className="stat-number"
        style={{ color: accent !== "var(--brand)" ? accent : "var(--t1)" }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "0.75rem", color: "var(--t4)", marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  </div>
);

const TxTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--t1)",
        color: "#fff",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "0.8rem",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "0.7rem",
          marginBottom: 3,
        }}
      >
        Txn #{label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1rem",
        }}
      >
        {fmt(payload[0].value)}
      </div>
    </div>
  );
};

const PIE_COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
];

export default function DashboardHome({
  balance,
  transactions = [],
  setActivePage,
}) {
  const now = new Date();

  const monthTxns = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }),
    [transactions],
  );

  const income = monthTxns
    .filter((t) => t.isReceived)
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = monthTxns
    .filter((t) => !t.isReceived)
    .reduce((s, t) => s + Number(t.amount), 0);
  const savings =
    income === 0 ? 0 : Math.max(0, ((income - expense) / income) * 100);

  // Balance trend
  const recentTxns = transactions.slice(-20);
  let startBal = balance;
  for (
    let i = transactions.length - 1;
    i >= transactions.length - recentTxns.length;
    i--
  ) {
    const t = transactions[i];
    if (!t) continue;
    startBal = t.isReceived
      ? startBal - Number(t.amount)
      : startBal + Number(t.amount);
  }
  let running = startBal;
  const graphData = [...recentTxns].reverse().map((t, i) => {
    running += t.isReceived ? Number(t.amount) : -Number(t.amount);
    return { txn: i + 1, balance: running };
  });

  // Category breakdown
  const categoryData = useMemo(() => {
    const map = {};
    monthTxns
      .filter((t) => !t.isReceived && t.category)
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [monthTxns]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero balance card */}
      <div
        className="animate-fade-up"
        style={{
          borderRadius: "var(--r-2xl)",
          padding: "32px 32px 28px",
          background:
            "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: 60,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(129,140,248,0.1)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(199,210,254,0.7)",
              marginBottom: 10,
            }}
          >
            Total Balance
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem,5vw,3rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            ₹
            {balance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "rgba(199,210,254,0.6)",
              marginBottom: 24,
            }}
          >
            Available funds
          </div>
          <button
            onClick={() => {
              window.location.hash = "Transactions";
              setActivePage("Transactions");
            }}
            className="btn"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              fontSize: "0.8rem",
              padding: "8px 18px",
            }}
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
            Add Transaction
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          label="Income"
          value={fmt(income)}
          sub="This month"
          accent="var(--green)"
          icon="↑"
          delay="stagger-1"
        />
        <StatCard
          label="Expenses"
          value={fmt(expense)}
          sub="This month"
          accent="var(--red)"
          icon="↓"
          delay="stagger-2"
        />
        <StatCard
          label="Savings Rate"
          value={`${savings.toFixed(0)}%`}
          sub="Of income saved"
          accent="var(--brand)"
          icon="◎"
          delay="stagger-3"
        />
        <StatCard
          label="Transactions"
          value={monthTxns.length}
          sub="This month"
          accent="#F59E0B"
          icon="⟳"
          delay="stagger-4"
        />
      </div>

      {/* Chart row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: categoryData.length > 0 ? "1fr 340px" : "1fr",
          gap: 16,
        }}
      >
        {/* Balance trend */}
        <div className="card card-p animate-fade-up stagger-1">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div className="section-title">Balance Trend</div>
            <span className="badge badge-brand">
              Last {graphData.length} txns
            </span>
          </div>
          <div style={{ height: 220 }}>
            {graphData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={graphData}
                  margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="txn"
                    tick={{ fontSize: 11, fill: "var(--t4)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--t4)" }}
                    axisLine={false}
                    tickLine={false}
                    width={56}
                    tickFormatter={fmt}
                  />
                  <Tooltip content={<TxTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#4F46E5",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--t4)",
                  fontSize: "0.875rem",
                }}
              >
                Not enough data yet
              </div>
            )}
          </div>
        </div>

        {/* Category pie */}
        {categoryData.length > 0 && (
          <div className="card card-p animate-fade-up stagger-2">
            <div className="section-title" style={{ marginBottom: 16 }}>
              Spending by Category
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`₹${v.toFixed(2)}`, "Spent"]} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => (
                      <span style={{ fontSize: "0.72rem", color: "var(--t2)" }}>
                        {v}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent transactions */}
      <div
        className="card animate-fade-up stagger-2"
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px 14px",
          }}
        >
          <div className="section-title">Recent Transactions</div>
          <button
            onClick={() => {
              window.location.hash = "Transactions";
              setActivePage("Transactions");
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8rem",
              color: "var(--brand)",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
            }}
          >
            View all →
          </button>
        </div>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div style={{ color: "var(--t4)", fontSize: "0.875rem" }}>
              No transactions yet
            </div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Date</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 7).map((txn) => (
                <tr key={txn._id || txn.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          background: txn.isReceived
                            ? "var(--green-bg)"
                            : "var(--red-bg)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke={
                            txn.isReceived ? "var(--green)" : "var(--red)"
                          }
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          {txn.isReceived ? (
                            <>
                              <line x1="12" y1="19" x2="12" y2="5" />
                              <polyline points="5 12 12 5 19 12" />
                            </>
                          ) : (
                            <>
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <polyline points="19 12 12 19 5 12" />
                            </>
                          )}
                        </svg>
                      </div>
                      <span style={{ fontWeight: 500, color: "var(--t1)" }}>
                        {txn.description}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: "var(--t3)" }}>
                    {new Date(txn.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td>
                    {txn.category ? (
                      <span className="badge badge-brand">{txn.category}</span>
                    ) : (
                      <span style={{ color: "var(--t4)" }}>—</span>
                    )}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 700,
                      fontFamily: "var(--font-display)",
                      color: txn.isReceived ? "var(--green)" : "var(--red)",
                    }}
                  >
                    {txn.isReceived ? "+" : "−"}₹
                    {Number(txn.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
