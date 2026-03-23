import React, { useState } from "react";
import { toast } from "./Toast";

export default function Goals({ authAxios, goals, setGoals, refreshDashboard }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({ title:"", target:"" });
  const [adding, setAdding]   = useState(false);
  const [deletingId, setDel]  = useState(null);

  const add = async (e) => {
    e.preventDefault(); setAdding(true);
    try {
      const res = await authAxios.post("account/goals", { title:form.title, target:Number(form.target) });
      setGoals(p => [...p, res.data]); setShowAdd(false); setForm({ title:"", target:"" });
      toast.success(`Goal "${form.title}" created`); refreshDashboard();
    } catch { toast.error("Failed to create goal"); } finally { setAdding(false); }
  };
  const del = async (id, title) => {
    setDel(id);
    try {
      await authAxios.delete(`account/goals/${id}`);
      setGoals(p => p.filter(g => g._id !== id));
      toast.info(`"${title}" deleted`); refreshDashboard();
    } catch { toast.error("Failed to delete"); } finally { setDel(null); }
  };

  const totalTarget  = goals.reduce((s,g) => s + g.target, 0);
  const totalSaved   = goals.reduce((s,g) => s + (g.progress||0), 0);
  const doneCount    = goals.filter(g => (g.progress||0) >= g.target).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="animate-fade-up">
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div className="page-title">Goals</div>
          <div style={{ fontSize:"0.8rem", color:"var(--t4)", marginTop:3 }}>Savings targets • match transaction category names to track</div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Goal
        </button>
      </div>

      {goals.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:12 }}>
          {[
            { label:"Total Target",  value:`₹${totalTarget.toLocaleString("en-IN")}`, color:"var(--brand)" },
            { label:"Total Saved",   value:`₹${totalSaved.toLocaleString("en-IN")}`, color:"var(--green)" },
            { label:"Goals Achieved",value:doneCount, color: doneCount > 0 ? "var(--green)" : "var(--t2)" },
            { label:"In Progress",   value:goals.length - doneCount, color:"var(--amber)" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:"16px 20px" }}>
              <div style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--t4)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.4rem", color:s.color, letterSpacing:"-0.02em" }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {goals.length === 0 ? (
        <div className="card" style={{ textAlign:"center", padding:"64px 24px" }}>
          <div className="empty-icon" style={{ margin:"0 auto 16px" }}>
            <svg width="24" height="24" fill="none" stroke="var(--brand)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <div className="section-title" style={{ marginBottom:6 }}>No goals yet</div>
          <div style={{ color:"var(--t4)", fontSize:"0.875rem" }}>Create a savings goal and track your progress</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 }}>
          {goals.map(g => {
            const progress = g.progress || 0;
            const pct  = Math.min(100, (progress / g.target) * 100);
            const done = progress >= g.target;
            const isDeleting = deletingId === g._id;

            return (
              <div key={g._id} className="card card-p" style={{ opacity: isDeleting ? 0.5 : 1, transition:"opacity 0.2s" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem", color:"var(--t1)" }}>{g.title}</div>
                      {done && <span className="badge badge-green">✓ Achieved!</span>}
                    </div>
                    <div style={{ fontSize:"0.75rem", color:"var(--t4)" }}>Target: ₹{Number(g.target).toLocaleString("en-IN")}</div>
                  </div>
                  <button disabled={isDeleting} onClick={() => del(g._id, g.title)} className="btn btn-icon btn-danger">
                    {isDeleting ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="9" strokeDasharray="28 56"/></svg>
                      : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>}
                  </button>
                </div>

                <div className="progress-track" style={{ marginBottom:10 }}>
                  <div className="progress-fill" style={{ width:`${pct}%`, background: done ? "var(--green)" : "var(--brand)" }}/>
                </div>

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"0.8rem", color:"var(--t2)" }}>
                    <strong style={{ color:"var(--t1)", fontFamily:"var(--font-display)" }}>₹{progress.toLocaleString("en-IN")}</strong> saved
                  </span>
                  <span className="badge badge-brand">{pct.toFixed(0)}% complete</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.1rem" }}>New Goal</div>
              <button onClick={() => setShowAdd(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--t4)", padding:4, display:"flex" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={add} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div><label className="label">Goal Name</label><input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} className="input" placeholder="e.g. New Laptop, Emergency Fund" required/></div>
              <div><label className="label">Target Amount (₹)</label><input type="number" min="1" value={form.target} onChange={e => setForm(f=>({...f,target:e.target.value}))} className="input" placeholder="0" required/></div>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={adding}>
                  {adding ? "Creating…" : "Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
