import React, { useState, useEffect } from "react";
import { toast } from "./Toast";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition";
const labelCls =
  "block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider";

export default function SendMoney({
  prefillPayee,
  refreshDashboard,
  authAxios,
}) {
  const [form, setForm] = useState({ toUsername: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(null);

  useEffect(() => {
    if (prefillPayee) setForm((p) => ({ ...p, toUsername: prefillPayee }));
  }, [prefillPayee]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.toUsername || Number(form.amount) <= 0) {
      toast.error("Enter a valid recipient and amount");
      return;
    }
    setLoading(true);
    try {
      await authAxios.post("/account/transfer", {
        amount: Number(form.amount),
        toUsername: form.toUsername,
      });
      setSent({ to: form.toUsername, amount: form.amount });
      setForm({ toUsername: "", amount: "" });
      toast.success(`₹${form.amount} sent to ${form.toUsername}`);
      refreshDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[520px] flex flex-col gap-5 animate-fade-up">
      <div>
        <div className="font-bold text-2xl text-[#0F1117] tracking-tight">
          Send Money
        </div>
        <div className="text-[0.8rem] text-gray-400 mt-0.5">
          Transfer funds to another SpendQuest user
        </div>
      </div>

      {sent && (
        <div className="flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="w-10 h-10 rounded-[10px] bg-emerald-500 flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-bold text-emerald-800">
              Transfer complete
            </div>
            <div className="text-[0.8rem] text-emerald-700 mt-0.5">
              ₹{sent.amount} sent to {sent.to}
            </div>
          </div>
          <button
            onClick={() => setSent(null)}
            className="bg-transparent border-none cursor-pointer text-emerald-500 p-1 flex"
          >
            <svg
              width="16"
              height="16"
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
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="w-[52px] h-[52px] rounded-[14px] bg-indigo-50 flex items-center justify-center mb-6">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Recipient Username / Email</label>
            <input
              name="toUsername"
              className={inputCls}
              placeholder="Enter username or email"
              value={form.toUsername}
              onChange={(e) =>
                setForm((p) => ({ ...p, toUsername: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className={labelCls}>Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                ₹
              </span>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                className={`${inputCls} pl-7 font-bold text-[1.2rem] tracking-tight`}
                placeholder="0.00"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[0.8rem] text-gray-500">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Transfers are instant and cannot be reversed. Double-check the
            username before sending.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[1rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none border-none cursor-pointer transition"
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
                Processing…
              </>
            ) : (
              <>Send ₹{form.amount || "0.00"} →</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
