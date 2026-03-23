// Wallet is superseded by the inline hero card in DashboardHome
// Keeping as thin pass-through for compatibility
import React from "react";
export default function Wallet({ balance, setActivePage }) {
  return (
    <div style={{ borderRadius:20, padding:"24px", background:"linear-gradient(135deg,#1E1B4B,#4338CA)", color:"#fff", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
      <div style={{ fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(199,210,254,0.6)", marginBottom:8 }}>Balance</div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:800, letterSpacing:"-0.03em", marginBottom:20 }}>
        ₹{Number(balance).toLocaleString("en-IN", { minimumFractionDigits:2 })}
      </div>
      <button onClick={() => { window.location.hash="Transactions"; setActivePage("Transactions"); }}
        style={{ padding:"8px 18px", borderRadius:10, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", cursor:"pointer", fontSize:"0.8rem", fontWeight:600, fontFamily:"var(--font-body)", display:"inline-flex", alignItems:"center", gap:6 }}>
        + Add Transaction
      </button>
    </div>
  );
}
