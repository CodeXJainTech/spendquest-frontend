import React, { useState, useMemo } from "react";
import { AIDataExtractor } from "../AIDataExtractor";
import { toast } from "./Toast";

const DATE_FILTERS = ["All time", "This month", "Last 3 months", "This year"];

export default function Transactions({ transactions = [], refreshDashboard, authAxios }) {
  const [showModal, setShowModal]     = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isScanning, setIsScanning]   = useState(false);
  const [scanMsg, setScanMsg]         = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [form, setForm] = useState({ amount:"", description:"", isReceived:true, category:"", date:"" });
  const [search, setSearch]           = useState("");
  const [catFilter, setCatFilter]     = useState("");
  const [dateFilter, setDateFilter]   = useState("All time");
  const [page, setPage]               = useState(1);
  const PAGE_SIZE = 12;

  const categories = useMemo(() => {
    const s = new Set(); transactions.forEach(t => t.category && s.add(t.category)); return [...s];
  }, [transactions]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleScan = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 204800) { toast.error("File too large (max 200 KB)"); return; }
    setIsScanning(true); setScanMsg(null); setReceiptPreview(URL.createObjectURL(file));
    try {
      const d = await AIDataExtractor.extractReceiptData(file);
      if (d) {
        setForm({ amount: d.amount != null ? String(d.amount) : "", description: d.description || "", isReceived: d.type === "credit", category: d.category || "", date: d.date || "" });
        setScanMsg("success");
      } else setScanMsg("fail");
    } catch (e) { setScanMsg("fail"); }
    finally { setIsScanning(false); }
  };

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await authAxios.post("/account/transactions", { ...form, amount: Number(form.amount) });
      toast.success("Transaction added");
      setShowModal(false);
      setForm({ amount:"", description:"", isReceived:true, category:"", date:"" });
      setReceiptPreview(null); setScanMsg(null);
      refreshDashboard();
    } catch { toast.error("Failed to add transaction"); }
    finally { setSubmitting(false); }
  };

  const exportCSV = () => {
    if (!filtered.length) { toast.info("No transactions to export"); return; }
    const rows = [["Date","Description","Amount","Type","Category"], ...filtered.map(t => [new Date(t.date).toLocaleString(), `"${(t.description||"").replace(/"/g,'""')}"`, t.amount, t.isReceived?"Credit":"Debit", t.category||""])];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type:"text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    toast.success("CSV exported");
  };

  const filtered = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      if (search && !`${t.description} ${t.userName||""}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter && t.category !== catFilter) return false;
      if (dateFilter !== "All time") {
        const d = new Date(t.date);
        if (dateFilter === "This month" && (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear())) return false;
        if (dateFilter === "Last 3 months" && (now - d) > 90*24*60*60*1000) return false;
        if (dateFilter === "This year" && d.getFullYear() !== now.getFullYear()) return false;
      }
      return true;
    });
  }, [transactions, search, catFilter, dateFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageTxns  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const totalCredit = filtered.filter(t => t.isReceived).reduce((s,t) => s+Number(t.amount), 0);
  const totalDebit  = filtered.filter(t => !t.isReceived).reduce((s,t) => s+Number(t.amount), 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="animate-fade-up">
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <div>
          <div className="page-title">Transactions</div>
          <div style={{ fontSize:"0.8rem", color:"var(--t4)", marginTop:3 }}>{transactions.length} total transactions</div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Transaction
          </button>
          <button onClick={exportCSV} className="btn btn-ghost">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Summary chips */}
      {filtered.length > 0 && (
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:"99px", background:"var(--green-bg)", border:"1px solid #A7F3D0" }}>
            <span style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--green-text)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Total Credit</span>
            <span style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"var(--green)", fontSize:"0.875rem" }}>+₹{totalCredit.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:"99px", background:"var(--red-bg)", border:"1px solid #FECACA" }}>
            <span style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--red-text)", textTransform:"uppercase", letterSpacing:"0.05em" }}>Total Debit</span>
            <span style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"var(--red)", fontSize:"0.875rem" }}>−₹{totalDebit.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:"1 1 180px" }}>
          <svg width="14" height="14" fill="none" stroke="var(--t4)" strokeWidth="2" viewBox="0 0 24 24" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search transactions…" className="input" style={{ paddingLeft:36 }}/>
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }} className="input" style={{ width:"auto", flex:"0 0 auto" }}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display:"flex", gap:4, background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--r-md)", padding:3 }}>
          {DATE_FILTERS.map(f => (
            <button key={f} onClick={() => { setDateFilter(f); setPage(1); }}
              style={{ padding:"5px 12px", borderRadius:"var(--r-sm)", border:"none", cursor:"pointer", fontSize:"0.78rem", fontWeight:500, fontFamily:"var(--font-body)", transition:"all 0.15s",
                background: dateFilter === f ? "var(--brand)" : "transparent",
                color: dateFilter === f ? "#fff" : "var(--t3)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {transactions.length === 0 ? (
        <div className="card" style={{ textAlign:"center", padding:"64px 24px" }}>
          <div className="empty-icon" style={{ margin:"0 auto 16px" }}>
            <svg width="24" height="24" fill="none" stroke="var(--brand)" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/></svg>
          </div>
          <div className="section-title" style={{ marginBottom:6 }}>No transactions yet</div>
          <div style={{ color:"var(--t4)", fontSize:"0.875rem", marginBottom:20 }}>Add your first transaction to get started</div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display:"inline-flex" }}>+ Add Transaction</button>
        </div>
      ) : (
        <div className="card" style={{ overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table className="data-table">
              <thead><tr>
                <th>Transaction</th><th>Date & Time</th><th>Category</th><th style={{ textAlign:"right" }}>Amount</th><th>Status</th>
              </tr></thead>
              <tbody>
                {pageTxns.map(txn => (
                  <tr key={txn._id || txn.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:36, height:36, borderRadius:"10px", background:txn.isReceived ? "var(--green-bg)" : "var(--red-bg)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <svg width="15" height="15" fill="none" stroke={txn.isReceived ? "var(--green)" : "var(--red)"} strokeWidth="2.5" viewBox="0 0 24 24">
                            {txn.isReceived ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></> : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}
                          </svg>
                        </div>
                        <span style={{ fontWeight:500, color:"var(--t1)" }}>{txn.description}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ color:"var(--t2)" }}>{new Date(txn.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</div>
                      <div style={{ color:"var(--t4)", fontSize:"0.72rem" }}>{new Date(txn.date).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}</div>
                    </td>
                    <td>{txn.category ? <span className="badge badge-brand">{txn.category}</span> : <span style={{ color:"var(--t4)" }}>—</span>}</td>
                    <td style={{ textAlign:"right" }}>
                      <span style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"0.95rem", color: txn.isReceived ? "var(--green)" : "var(--red)" }}>
                        {txn.isReceived ? "+" : "−"}₹{Number(txn.amount).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td><span className={`badge ${txn.isReceived ? "badge-green" : "badge-red"}`}>{txn.isReceived ? "Credit" : "Debit"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderTop:"1px solid var(--border)", background:"var(--bg)" }}>
            <span style={{ fontSize:"0.8rem", color:"var(--t4)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <button className="btn btn-ghost" style={{ padding:"5px 14px", fontSize:"0.8rem" }} onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>← Prev</button>
              <span style={{ fontSize:"0.8rem", color:"var(--t3)", padding:"0 4px" }}>{page} / {pageCount}</span>
              <button className="btn btn-ghost" style={{ padding:"5px 14px", fontSize:"0.8rem" }} onClick={() => setPage(p => Math.min(pageCount, p+1))} disabled={page===pageCount}>Next →</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1.1rem", color:"var(--t1)" }}>Add Transaction</div>
              <button onClick={() => setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--t4)", padding:4, borderRadius:6, display:"flex" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <input id="receipt-input" type="file" accept="image/*" onChange={handleScan} className="hidden" style={{ display:"none" }}/>
              <button type="button" onClick={() => document.getElementById("receipt-input").click()} disabled={isScanning}
                style={{ padding:"10px 16px", borderRadius:"var(--r-md)", border:"2px dashed var(--border)", background:isScanning ? "var(--bg)" : "transparent", cursor:isScanning ? "not-allowed" : "pointer", fontSize:"0.875rem", color:"var(--t3)", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.18s" }}
                onMouseEnter={e => { if(!isScanning) { e.currentTarget.style.borderColor="var(--brand)"; e.currentTarget.style.color="var(--brand)"; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--t3)"; }}>
                {isScanning ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="9" strokeDasharray="28 56"/></svg> Scanning receipt…</> : <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Scan Receipt with AI</>}
              </button>
              {scanMsg && <div style={{ padding:"8px 12px", borderRadius:"var(--r-sm)", fontSize:"0.8rem", fontWeight:500, background:scanMsg==="success" ? "var(--green-bg)" : "var(--amber-bg)", color:scanMsg==="success" ? "var(--green-text)" : "var(--amber-text)" }}>{scanMsg==="success" ? "✓ Details extracted from receipt" : "Couldn't read receipt — fill in manually"}</div>}
              {receiptPreview && <img src={receiptPreview} alt="receipt" style={{ height:60, width:60, objectFit:"cover", borderRadius:"var(--r-sm)", border:"1px solid var(--border)" }}/>}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div><label className="label">Amount (₹)</label><input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} className="input" placeholder="0.00" required/></div>
                <div><label className="label">Category</label><input name="category" value={form.category} onChange={handleChange} className="input" placeholder="e.g. Groceries"/></div>
              </div>
              <div><label className="label">Date</label><input name="date" type="date" value={form.date} onChange={handleChange} className="input"/></div>
              <div><label className="label">Description</label><input name="description" value={form.description} onChange={handleChange} className="input" placeholder="What was this for?" required/></div>

              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"var(--bg)", borderRadius:"var(--r-md)", border:"1px solid var(--border)" }}>
                <div className="toggle-track" style={{ background: form.isReceived ? "var(--brand)" : "#D1D5DB" }}
                  onClick={() => setForm(p => ({ ...p, isReceived: !p.isReceived }))}>
                  <div className="toggle-thumb" style={{ transform: form.isReceived ? "translateX(18px)" : "translateX(0)" }}/>
                </div>
                <div>
                  <div style={{ fontSize:"0.875rem", fontWeight:600, color:"var(--t1)" }}>Money received (Credit)</div>
                  <div style={{ fontSize:"0.75rem", color:"var(--t4)" }}>Toggle off for expense / debit</div>
                </div>
              </div>

              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={submitting}>
                  {submitting ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="9" strokeDasharray="28 56"/></svg> Adding…</> : "Add Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
