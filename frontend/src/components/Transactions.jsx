import React, { useState, useMemo } from "react";
import { AIDataExtractor } from "../AIDataExtractor";
import { toast } from "./Toast";

const DATE_FILTERS = ["All time", "This month", "Last 3 months", "This year"];

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition";
const labelCls =
  "block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider";

export default function Transactions({
  transactions = [],
  refreshDashboard,
  authAxios,
}) {
  const [showModal, setShowModal] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    isReceived: true,
    category: "",
    date: "",
  });
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("All time");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const categories = useMemo(() => {
    const s = new Set();
    transactions.forEach((t) => t.category && s.add(t.category));
    return [...s];
  }, [transactions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 204800) {
      toast.error("File too large (max 200 KB)");
      return;
    }
    setIsScanning(true);
    setScanMsg(null);
    setReceiptPreview(URL.createObjectURL(file));
    try {
      const d = await AIDataExtractor.extractReceiptData(file);
      if (d) {
        setForm({
          amount: d.amount != null ? String(d.amount) : "",
          description: d.description || "",
          isReceived: d.type === "credit",
          category: d.category || "",
          date: d.date || "",
        });
        setScanMsg("success");
      } else setScanMsg("fail");
    } catch (e) {
      setScanMsg("fail");
    } finally {
      setIsScanning(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authAxios.post("/account/transactions", {
        ...form,
        amount: Number(form.amount),
      });
      toast.success("Transaction added");
      setShowModal(false);
      setForm({
        amount: "",
        description: "",
        isReceived: true,
        category: "",
        date: "",
      });
      setReceiptPreview(null);
      setScanMsg(null);
      refreshDashboard();
    } catch {
      toast.error("Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const exportCSV = () => {
    if (!filtered.length) {
      toast.info("No transactions to export");
      return;
    }
    const rows = [
      ["Date", "Description", "Amount", "Type", "Category"],
      ...filtered.map((t) => [
        new Date(t.date).toLocaleString(),
        `"${(t.description || "").replace(/"/g, '""')}"`,
        t.amount,
        t.isReceived ? "Credit" : "Debit",
        t.category || "",
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("CSV exported");
  };

  const filtered = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      if (
        search &&
        !`${t.description} ${t.userName || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      if (catFilter && t.category !== catFilter) return false;
      if (dateFilter !== "All time") {
        const d = new Date(t.date);
        if (
          dateFilter === "This month" &&
          (d.getMonth() !== now.getMonth() ||
            d.getFullYear() !== now.getFullYear())
        )
          return false;
        if (
          dateFilter === "Last 3 months" &&
          now - d > 90 * 24 * 60 * 60 * 1000
        )
          return false;
        if (dateFilter === "This year" && d.getFullYear() !== now.getFullYear())
          return false;
      }
      return true;
    });
  }, [transactions, search, catFilter, dateFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageTxns = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalCredit = filtered
    .filter((t) => t.isReceived)
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalDebit = filtered
    .filter((t) => !t.isReceived)
    .reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="font-bold text-2xl text-[#0F1117] tracking-tight">
            Transactions
          </div>
          <div className="text-[0.8rem] text-gray-400 mt-0.5">
            {transactions.length} total transactions
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.875rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-px border-none cursor-pointer transition"
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
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-[#F4F6FB] hover:bg-white text-gray-700 text-[0.875rem] font-semibold cursor-pointer transition"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Summary chips */}
      {filtered.length > 0 && (
        <div className="flex gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="text-[0.7rem] font-bold text-emerald-800 uppercase tracking-wider">
              Total Credit
            </span>
            <span className="font-bold text-emerald-600 text-[0.875rem]">
              +₹{totalCredit.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200">
            <span className="text-[0.7rem] font-bold text-red-800 uppercase tracking-wider">
              Total Debit
            </span>
            <span className="font-bold text-red-500 text-[0.875rem]">
              −₹{totalDebit.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2.5 flex-wrap items-center">
        <div className="relative flex-1 min-w-[180px]">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search transactions…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => {
            setCatFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm focus:outline-none focus:border-indigo-600 transition"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-0.5">
          {DATE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setDateFilter(f);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg border-none cursor-pointer text-[0.78rem] font-medium transition-all
                ${dateFilter === f ? "bg-indigo-600 text-white shadow-sm" : "bg-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table or empty state */}
      {transactions.length === 0 ? (
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
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
            </svg>
          </div>
          <div className="font-bold text-[1rem] text-[#0F1117] mb-1.5">
            No transactions yet
          </div>
          <div className="text-gray-400 text-[0.875rem] mb-5">
            Add your first transaction to get started
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.875rem] font-semibold border-none cursor-pointer transition"
          >
            + Add Transaction
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2.5 text-left text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Transaction
                  </th>
                  <th className="px-4 py-2.5 text-left text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Date & Time
                  </th>
                  <th className="px-4 py-2.5 text-left text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-4 py-2.5 text-right text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-4 py-2.5 text-left text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageTxns.map((txn) => (
                  <tr
                    key={txn._id || txn.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${txn.isReceived ? "bg-emerald-50" : "bg-red-50"}`}
                        >
                          <svg
                            width="15"
                            height="15"
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
                    <td className="px-4 py-3.5">
                      <div className="text-gray-600 text-[0.875rem]">
                        {new Date(txn.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-gray-400 text-[0.72rem]">
                        {new Date(txn.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
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
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold ${txn.isReceived ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                      >
                        {txn.isReceived ? "Credit" : "Debit"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50">
            <span className="text-[0.8rem] text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-1.5 rounded-lg border-[1.5px] border-gray-200 bg-[#F4F6FB] hover:bg-white text-gray-700 text-[0.8rem] font-medium cursor-pointer disabled:opacity-40 transition"
              >
                ← Prev
              </button>
              <span className="text-[0.8rem] text-gray-500 px-1">
                {page} / {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="px-3.5 py-1.5 rounded-lg border-[1.5px] border-gray-200 bg-[#F4F6FB] hover:bg-white text-gray-700 text-[0.8rem] font-medium cursor-pointer disabled:opacity-40 transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-3xl shadow-[0_20px_25px_rgba(0,0,0,0.09)] w-full max-w-[440px] p-7 modal-animate">
            <div className="flex items-center justify-between mb-5">
              <div className="font-bold text-[1.1rem] text-[#0F1117]">
                Add Transaction
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 p-1 flex rounded-md transition"
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
            <form onSubmit={submit} className="flex flex-col gap-3.5">
              {/* Receipt scan */}
              <input
                id="receipt-input"
                type="file"
                accept="image/*"
                onChange={handleScan}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("receipt-input").click()}
                disabled={isScanning}
                className={`px-4 py-2.5 rounded-xl border-2 border-dashed text-[0.875rem] font-medium flex items-center justify-center gap-2 transition cursor-pointer
                  ${isScanning ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 bg-transparent text-gray-500 hover:border-indigo-600 hover:text-indigo-600"}`}
              >
                {isScanning ? (
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
                    Scanning receipt…
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>{" "}
                    Scan Receipt with AI
                  </>
                )}
              </button>

              {scanMsg && (
                <div
                  className={`px-3 py-2 rounded-lg text-[0.8rem] font-medium ${scanMsg === "success" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {scanMsg === "success"
                    ? "✓ Details extracted from receipt"
                    : "Couldn't read receipt — fill in manually"}
                </div>
              )}
              {receiptPreview && (
                <img
                  src={receiptPreview}
                  alt="receipt"
                  className="h-[60px] w-[60px] object-cover rounded-lg border border-gray-200"
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Amount (₹)</label>
                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="e.g. Groceries"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="What was this for?"
                  required
                />
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-3 px-3.5 py-3 bg-gray-50 rounded-xl border border-gray-200">
                <div
                  className="relative w-[42px] h-[24px] rounded-full cursor-pointer shrink-0 transition-colors"
                  style={{
                    background: form.isReceived ? "#4F46E5" : "#D1D5DB",
                  }}
                  onClick={() =>
                    setForm((p) => ({ ...p, isReceived: !p.isReceived }))
                  }
                >
                  <div
                    className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform"
                    style={{
                      transform: form.isReceived
                        ? "translateX(21px)"
                        : "translateX(3px)",
                      transition:
                        "transform 0.2s cubic-bezier(0.34,1.3,0.64,1)",
                    }}
                  />
                </div>
                <div>
                  <div className="text-[0.875rem] font-semibold text-[#0F1117]">
                    Money received (Credit)
                  </div>
                  <div className="text-[0.75rem] text-gray-400">
                    Toggle off for expense / debit
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-[#F4F6FB] hover:bg-white text-gray-700 text-[0.875rem] font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.875rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] disabled:opacity-55 disabled:cursor-not-allowed border-none cursor-pointer transition"
                >
                  {submitting ? (
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
                      Adding…
                    </>
                  ) : (
                    "Add Transaction"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
