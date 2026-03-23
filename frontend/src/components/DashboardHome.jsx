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
    className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4 animate-fade-up ${delay}`}
  >
    <div className="flex items-center justify-between">
      <span className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-widest">
        {label}
      </span>
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[1.1rem]"
        style={{ background: accent + "18", color: accent }}
      >
        {icon}
      </div>
    </div>
    <div>
      <div
        className="font-extrabold text-[1.6rem] tracking-[-0.03em] leading-none"
        style={{ color: accent !== "#4F46E5" ? accent : "#0F1117" }}
      >
        {value}
      </div>
      {sub && <div className="text-[0.75rem] text-gray-400 mt-1">{sub}</div>}
    </div>
  </div>
);

const TxTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[10px] px-3.5 py-2.5 text-[0.8rem] shadow-lg"
      style={{ background: "#0F1117", color: "#fff" }}
    >
      <div className="text-white/55 text-[0.7rem] mb-0.5">Txn #{label}</div>
      <div className="font-bold text-[1rem]">{fmt(payload[0].value)}</div>
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
    <div className="flex flex-col gap-5">
      {/* Hero balance card */}
      <div
        className="animate-fade-up relative overflow-hidden rounded-3xl px-8 pt-8 pb-7 text-white"
        style={{
          background:
            "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)",
        }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/[0.04] pointer-events-none" />
        <div className="absolute -bottom-14 left-14 w-40 h-40 rounded-full bg-indigo-400/10 pointer-events-none" />
        <div className="relative z-10">
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-indigo-200/70 mb-2.5">
            Total Balance
          </div>
          <div className="text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.04em] leading-none mb-1.5">
            ₹
            {balance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-[0.8rem] text-indigo-200/60 mb-6">
            Available funds
          </div>
          <button
            onClick={() => {
              window.location.hash = "Transactions";
              setActivePage("Transactions");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.12] hover:bg-white/20 border border-white/20 text-white text-[0.8rem] font-semibold cursor-pointer transition backdrop-blur-sm"
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
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        <StatCard
          label="Income"
          value={fmt(income)}
          sub="This month"
          accent="#10B981"
          icon="↑"
          delay="stagger-1"
        />
        <StatCard
          label="Expenses"
          value={fmt(expense)}
          sub="This month"
          accent="#EF4444"
          icon="↓"
          delay="stagger-2"
        />
        <StatCard
          label="Savings Rate"
          value={`${savings.toFixed(0)}%`}
          sub="Of income saved"
          accent="#4F46E5"
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
        className="grid gap-4"
        style={{
          gridTemplateColumns: categoryData.length > 0 ? "1fr 340px" : "1fr",
        }}
      >
        {/* Balance trend */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-fade-up stagger-1">
          <div className="flex items-center justify-between mb-5">
            <div className="font-bold text-[1rem] text-[#0F1117]">
              Balance Trend
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold bg-indigo-50 text-indigo-700">
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
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="txn"
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
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
              <div className="h-full flex items-center justify-center text-gray-400 text-[0.875rem]">
                Not enough data yet
              </div>
            )}
          </div>
        </div>

        {/* Category pie */}
        {categoryData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-fade-up stagger-2">
            <div className="font-bold text-[1rem] text-[#0F1117] mb-4">
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
                      <span className="text-[0.72rem] text-gray-600">{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-up stagger-2">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="font-bold text-[1rem] text-[#0F1117]">
            Recent Transactions
          </div>
          <button
            onClick={() => {
              window.location.hash = "Transactions";
              setActivePage("Transactions");
            }}
            className="bg-transparent border-none cursor-pointer text-[0.8rem] text-indigo-600 font-semibold hover:underline"
          >
            View all →
          </button>
        </div>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-gray-400 text-[0.875rem]">
              No transactions yet
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-4 py-2.5 text-left text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-4 py-2.5 text-right text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 7).map((txn) => (
                  <tr
                    key={txn._id || txn.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${txn.isReceived ? "bg-emerald-50" : "bg-red-50"}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            fill="none"
                            stroke={txn.isReceived ? "#10B981" : "#EF4444"}
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
                        <span className="font-medium text-[#0F1117] text-[0.875rem]">
                          {txn.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-[0.875rem]">
                      {new Date(txn.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      {txn.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold bg-indigo-50 text-indigo-700">
                          {txn.category}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`font-bold text-[0.95rem] ${txn.isReceived ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {txn.isReceived ? "+" : "−"}₹
                        {Number(txn.amount).toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
