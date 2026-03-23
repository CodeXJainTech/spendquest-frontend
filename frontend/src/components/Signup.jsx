import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [form, setForm]   = useState({ userName:"", firstName:"", lastName:"", password:"", s_balance:"" });
  const [loading, setLoad] = useState(false);
  const [error, setError]  = useState("");

  const submit = async (e) => {
    e.preventDefault(); setLoad(true); setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, { ...form, s_balance: Number(form.s_balance) });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setTimeout(() => { window.location.href = "/dashboard"; }, 400);
    } catch (e) {
      setError(e.response?.data?.message || "Sign up failed. Please try again.");
      setLoad(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)", padding:"40px 24px" }}>
      <div style={{ width:"100%", maxWidth:460 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.9rem", color:"var(--t1)", letterSpacing:"-0.02em", marginBottom:8 }}>
            Spend<span style={{ color:"var(--brand)" }}>Quest</span>
          </div>
          <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.3rem", color:"var(--t1)" }}>Create your account</div>
          <div style={{ color:"var(--t4)", marginTop:6, fontSize:"0.875rem" }}>Start taking control of your finances today</div>
        </div>

        <div className="card card-p">
          <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label className="label">Email Address</label>
              <input name="userName" type="email" value={form.userName} onChange={e => { setForm(p=>({...p,userName:e.target.value})); setError(""); }} className="input" placeholder="you@example.com" required/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label className="label">First Name</label>
                <input name="firstName" value={form.firstName} onChange={e => setForm(p=>({...p,firstName:e.target.value}))} className="input" placeholder="Raj" required/>
              </div>
              <div>
                <label className="label">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={e => setForm(p=>({...p,lastName:e.target.value}))} className="input" placeholder="Sharma" required/>
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} className="input" placeholder="Min. 6 characters" required/>
            </div>
            <div>
              <label className="label">Starting Balance (₹)</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontFamily:"var(--font-display)", fontWeight:700, color:"var(--t3)" }}>₹</span>
                <input name="s_balance" type="number" min="0" step="0.01" value={form.s_balance} onChange={e => setForm(p=>({...p,s_balance:e.target.value}))} className="input" style={{ paddingLeft:28 }} placeholder="0.00" required/>
              </div>
            </div>

            {error && (
              <div style={{ padding:"10px 14px", borderRadius:"var(--r-md)", background:"var(--red-bg)", border:"1px solid #FECACA", color:"var(--red-text)", fontSize:"0.85rem", fontWeight:500 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width:"100%", padding:"12px", fontSize:"0.95rem", marginTop:4 }} disabled={loading}>
              {loading ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="9" strokeDasharray="28 56"/></svg> Creating account…</> : "Create Account →"}
            </button>
          </form>

          <div style={{ marginTop:20, textAlign:"center", fontSize:"0.875rem", color:"var(--t4)", paddingTop:20, borderTop:"1px solid var(--border)" }}>
            Already have an account?{" "}
            <Link to="/signin" style={{ color:"var(--brand)", fontWeight:600, textDecoration:"none" }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
