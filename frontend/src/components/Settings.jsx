import React, { useState } from "react";
import { toast } from "./Toast";

export default function Settings({ userInfo, authAxios, onLogout }) {
  const [form, setForm]     = useState({ currentPassword:"", newPassword:"" });
  const [loading, setLoad]  = useState(false);
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoad(true);
    try {
      await authAxios.post("/user/changeps", form);
      toast.success("Password updated successfully");
      setForm({ currentPassword:"", newPassword:"" });
    } catch (e) { toast.error(e.response?.data?.message || "Failed to update password"); }
    finally { setLoad(false); }
  };

  const initial = userInfo.name ? userInfo.name[0].toUpperCase() : "?";

  const Eye = ({ show }) => show
    ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

  return (
    <div style={{ maxWidth:560, display:"flex", flexDirection:"column", gap:20 }} className="animate-fade-up">
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div className="page-title">Settings</div>
        <button onClick={onLogout} className="btn btn-danger" style={{ fontSize:"0.85rem" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>

      {/* Profile */}
      <div className="card card-p" style={{ display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:56, height:56, borderRadius:"16px", background:"var(--brand)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.3rem", flexShrink:0, boxShadow:"var(--shadow-brand)" }}>
          {initial}
        </div>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.1rem", color:"var(--t1)" }}>{userInfo.name}</div>
          <div style={{ fontSize:"0.8rem", color:"var(--t4)", marginTop:3 }}>{userInfo.email}</div>
        </div>
        <span className="badge badge-brand" style={{ marginLeft:"auto" }}>Active</span>
      </div>

      {/* Change password */}
      <div className="card card-p">
        <div style={{ marginBottom:20 }}>
          <div className="section-title">Change Password</div>
          <div style={{ fontSize:"0.8rem", color:"var(--t4)", marginTop:4 }}>Must be at least 6 characters long</div>
        </div>
        <form onSubmit={save} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label className="label">Current Password</label>
            <div style={{ position:"relative" }}>
              <input type={showCur ? "text" : "password"} name="currentPassword" value={form.currentPassword}
                onChange={e => setForm(p=>({...p,currentPassword:e.target.value}))}
                className="input" style={{ paddingRight:42 }} placeholder="Enter current password" required/>
              <button type="button" onClick={() => setShowCur(v=>!v)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--t4)", display:"flex", padding:2 }}>
                <Eye show={showCur}/>
              </button>
            </div>
          </div>
          <div>
            <label className="label">New Password</label>
            <div style={{ position:"relative" }}>
              <input type={showNew ? "text" : "password"} name="newPassword" value={form.newPassword}
                onChange={e => setForm(p=>({...p,newPassword:e.target.value}))}
                className="input" style={{ paddingRight:42 }} placeholder="Enter new password" required/>
              <button type="button" onClick={() => setShowNew(v=>!v)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--t4)", display:"flex", padding:2 }}>
                <Eye show={showNew}/>
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf:"flex-start" }} disabled={loading}>
            {loading ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="9" strokeDasharray="28 56"/></svg> Saving…</> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
