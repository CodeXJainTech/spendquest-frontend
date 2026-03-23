import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Signin() {
  const [form, setForm]   = useState({ userName:"", password:"" });
  const [loading, setLoad] = useState(false);
  const [error, setError]  = useState("");
  const [showPw, setShowPw] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoad(true); setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      window.location.href = "/dashboard";
    } catch (e) {
      setError(e.response?.data?.message || "Sign in failed. Check your credentials.");
      setLoad(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--bg)" }}>
      {/* Left panel */}
      <div className="hidden md:flex" style={{ width:"42%", background:"linear-gradient(160deg, #1E1B4B 0%, #312E81 55%, #4338CA 100%)", flexDirection:"column", justifyContent:"space-between", padding:"48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-60, left:-60, width:240, height:240, borderRadius:"50%", background:"rgba(129,140,248,0.12)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.4rem", color:"#fff", letterSpacing:"-0.02em" }}>
          Spend<span style={{ color:"#818CF8" }}>Quest</span>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.8rem,3.5vw,2.6rem)", fontWeight:800, color:"#fff", lineHeight:1.2, letterSpacing:"-0.03em", marginBottom:16 }}>
            Every rupee tracked.<br/>Every goal reached.
          </div>
          <p style={{ color:"rgba(199,210,254,0.65)", fontSize:"0.95rem", lineHeight:1.7 }}>
            Your personal finance companion — budgets, goals, AI receipt scanning, and instant transfers.
          </p>
        </div>
        <div style={{ display:"flex", gap:28, position:"relative" }}>
          {["AI Scanning","Budgets","Goals"].map(f => (
            <div key={f} style={{ fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(199,210,254,0.4)" }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          {/* Mobile logo */}
          <div className="md:hidden" style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.6rem", color:"var(--t1)", marginBottom:32, letterSpacing:"-0.02em" }}>
            Spend<span style={{ color:"var(--brand)" }}>Quest</span>
          </div>

          <div style={{ marginBottom:32 }}>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.75rem", color:"var(--t1)", letterSpacing:"-0.02em" }}>Welcome back</div>
            <div style={{ color:"var(--t4)", marginTop:6, fontSize:"0.9rem" }}>Sign in to your account to continue</div>
          </div>

          <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label className="label">Email Address</label>
              <input name="userName" type="email" value={form.userName}
                onChange={e => { setForm(p=>({...p,userName:e.target.value})); setError(""); }}
                className="input" placeholder="you@example.com" required/>
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position:"relative" }}>
                <input name="password" type={showPw ? "text" : "password"} value={form.password}
                  onChange={e => { setForm(p=>({...p,password:e.target.value})); setError(""); }}
                  className="input" style={{ paddingRight:42 }} placeholder="Enter your password" required/>
                <button type="button" onClick={() => setShowPw(v=>!v)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--t4)", display:"flex", padding:2 }}>
                  {showPw
                    ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding:"10px 14px", borderRadius:"var(--r-md)", background:"var(--red-bg)", border:"1px solid #FECACA", color:"var(--red-text)", fontSize:"0.85rem", fontWeight:500 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width:"100%", padding:"12px", fontSize:"0.95rem", marginTop:4 }} disabled={loading}>
              {loading ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="9" strokeDasharray="28 56"/></svg> Signing in…</> : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop:24, textAlign:"center", fontSize:"0.875rem", color:"var(--t4)" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color:"var(--brand)", fontWeight:600, textDecoration:"none" }}>Create one →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
