import React, { useState, useEffect } from "react";
import { toast } from "./Toast";
const COLORS = ["#4F46E5","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#EC4899","#84CC16"];
const initials = p => `${p.firstName?.[0]||""}${p.lastName?.[0]||""}`.toUpperCase()||"?";

export default function Contacts({ payees=[], onSendMoneyClick, authAxios, refreshDashboard }) {
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm]           = useState({ firstName:"", lastName:"", userName:"" });
  const [adding, setAdding]       = useState(false);
  const [deletingId, setDel]      = useState(null);
  const [local, setLocal]         = useState(payees);
  const [search, setSearch]       = useState("");

  useEffect(() => setLocal(payees), [payees]);

  const filtered = local.filter(p =>
    !search || `${p.firstName} ${p.lastName} ${p.userName}`.toLowerCase().includes(search.toLowerCase())
  );

  const add = async (e) => {
    e.preventDefault(); setAdding(true);
    try {
      const res = await authAxios.post("/user/contacts", form);
      const nc = res.data?.contact || { ...form, userId: Date.now().toString() };
      setLocal(p => [...p, nc]); setShowAdd(false); setForm({ firstName:"", lastName:"", userName:"" });
      toast.success(`${form.firstName} added`); if (refreshDashboard) refreshDashboard();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to add contact"); }
    finally { setAdding(false); }
  };

  const del = async (id, name) => {
    setDel(id);
    try {
      await authAxios.delete(`/user/contacts/${id}`);
      setLocal(p => p.filter(c => (c.userId||c.id) !== id));
      toast.info(`${name} removed`); if (refreshDashboard) refreshDashboard();
    } catch { toast.error("Failed to remove contact"); }
    finally { setDel(null); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="animate-fade-up">
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div className="page-title">Contacts</div>
          <div style={{ fontSize:"0.8rem", color:"var(--t4)", marginTop:3 }}>{local.length} contact{local.length!==1?"s":""}</div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Contact
        </button>
      </div>

      {local.length > 0 && (
        <div style={{ position:"relative" }}>
          <svg width="14" height="14" fill="none" stroke="var(--t4)" strokeWidth="2" viewBox="0 0 24 24" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts…" className="input" style={{ paddingLeft:36, maxWidth:320 }}/>
        </div>
      )}

      {local.length === 0 ? (
        <div className="card" style={{ textAlign:"center", padding:"64px 24px" }}>
          <div className="empty-icon" style={{ margin:"0 auto 16px" }}>
            <svg width="24" height="24" fill="none" stroke="var(--brand)" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="section-title" style={{ marginBottom:6 }}>No contacts yet</div>
          <div style={{ color:"var(--t4)", fontSize:"0.875rem" }}>Add people you frequently send money to</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding:"40px 24px", textAlign:"center", color:"var(--t4)", fontSize:"0.875rem" }}>No contacts match "{search}"</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14 }}>
          {filtered.map((p, i) => {
            const id = p.userId || p.id;
            const isDeleting = deletingId === id;
            return (
              <div key={id || p.userName} className="card card-p" style={{ opacity: isDeleting ? 0.5 : 1, transition:"opacity 0.2s", display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:"12px", background:COLORS[i%COLORS.length], display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:"0.9rem", fontFamily:"var(--font-display)", flexShrink:0 }}>
                      {initials(p)}
                    </div>
                    <div>
                      <div style={{ fontWeight:600, color:"var(--t1)", fontSize:"0.9rem" }}>{p.firstName} {p.lastName}</div>
                      <div style={{ fontSize:"0.75rem", color:"var(--t4)", marginTop:1 }}>{p.userName}</div>
                    </div>
                  </div>
                  <button disabled={isDeleting} onClick={() => del(id, `${p.firstName} ${p.lastName}`)} className="btn btn-icon btn-danger">
                    {isDeleting ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="9" strokeDasharray="28 56"/></svg>
                      : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>}
                  </button>
                </div>
                {p.lastAmount && <div style={{ fontSize:"0.75rem", color:"var(--t3)", padding:"6px 10px", background:"var(--bg)", borderRadius:"var(--r-sm)" }}>Last sent: <strong>₹{p.lastAmount}</strong></div>}
                <button onClick={() => onSendMoneyClick(p.userName)} className="btn btn-primary" style={{ width:"100%", fontSize:"0.85rem" }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Send Money
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.1rem" }}>Add Contact</div>
              <button onClick={() => setShowAdd(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--t4)", padding:4, display:"flex" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={add} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div><label className="label">First Name</label><input name="firstName" value={form.firstName} onChange={e => setForm(f=>({...f,firstName:e.target.value}))} className="input" placeholder="Raj" required/></div>
                <div><label className="label">Last Name</label><input name="lastName" value={form.lastName} onChange={e => setForm(f=>({...f,lastName:e.target.value}))} className="input" placeholder="Sharma"/></div>
              </div>
              <div><label className="label">Username / Email</label><input name="userName" value={form.userName} onChange={e => setForm(f=>({...f,userName:e.target.value}))} className="input" placeholder="raj@example.com" required/></div>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={adding}>
                  {adding ? "Adding…" : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
