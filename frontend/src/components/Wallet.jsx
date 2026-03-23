// Wallet is superseded by the inline hero card in DashboardHome
// Keeping as thin pass-through for compatibility
import React from "react";

export default function Wallet({ balance, setActivePage }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 text-white"
      style={{ background: "linear-gradient(135deg, #1E1B4B, #4338CA)" }}
    >
      <div className="absolute -top-7 -right-7 w-36 h-36 rounded-full bg-white/[0.05] pointer-events-none" />
      <div className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-indigo-200/60 mb-2">
        Balance
      </div>
      <div className="text-[2rem] font-extrabold tracking-[-0.03em] mb-5">
        ₹{Number(balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </div>
      <button
        onClick={() => {
          window.location.hash = "Transactions";
          setActivePage("Transactions");
        }}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/[0.12] hover:bg-white/20 border border-white/20 text-white text-[0.8rem] font-semibold cursor-pointer transition"
      >
        + Add Transaction
      </button>
    </div>
  );
}
