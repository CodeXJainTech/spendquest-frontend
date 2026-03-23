import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Contacts from "./Contacts";
import Transactions from "./Transactions";
import SendMoney from "./SendMoney";
import DashboardHome from "./DashboardHome";
import Budgets from "./Budgets";
import Goals from "./Goals";
import Settings from "./Settings";
import { ToastContainer } from "./Toast";
import { DashboardSkeleton, TransactionsSkeleton, CardGridSkeleton, FormSkeleton } from "./Skeleton";

const NAV = [
  { name:"Dashboard",    label:"Dashboard",    icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { name:"Transactions", label:"Transactions", icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> },
  { name:"SendMoney",    label:"Send Money",   icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
  { name:"Contacts",     label:"Contacts",     icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { name:"Budgets",      label:"Budgets",      icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { name:"Goals",        label:"Goals",        icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
  { name:"Settings",     label:"Settings",     icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

const SKELETON_MAP = {
  Dashboard: <DashboardSkeleton />, Transactions: <TransactionsSkeleton />,
  Contacts: <CardGridSkeleton />, SendMoney: <FormSkeleton />,
  Budgets: <CardGridSkeleton />, Goals: <CardGridSkeleton />, Settings: <FormSkeleton />,
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [loading, setLoading]       = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [balance, setBalance]           = useState(0);
  const [payees, setPayees]             = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets]           = useState([]);
  const [goals, setGoals]               = useState([]);
  const [selectedPayee, setSelectedPayee] = useState("");
  const [userInfo, setUserInfo]         = useState({ name: "", email: "" });

  const token  = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const apiurl = import.meta.env.VITE_API_URL;

  const authAxios = useMemo(() =>
    axios.create({ baseURL: apiurl, headers: { Authorization: `Bearer ${token}`, userId: userId || "" } }),
    [apiurl, token, userId]
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) setActivePage(hash);
    const onHash = () => setActivePage(window.location.hash.slice(1) || "Dashboard");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [b, p, t, u, bg, g] = await Promise.all([
          authAxios.get("/account/balance"), authAxios.get("/user/contacts"),
          authAxios.get("/account/transactions"), authAxios.get("/user/me"),
          authAxios.get("/account/budgets"), authAxios.get("/account/goals"),
        ]);
        setBalance(b.data.balance); setPayees(p.data);
        setTransactions(t.data.transactions || []);
        setUserInfo({ name: u.data.name || "", email: u.data.email || "" });
        setBudgets(bg.data || []); setGoals(g.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [authAxios]);

  const refresh = async () => {
    try {
      const [b, t, p, bg, g] = await Promise.all([
        authAxios.get("/account/balance"), authAxios.get("/account/transactions"),
        authAxios.get("/user/contacts"), authAxios.get("/account/budgets"), authAxios.get("/account/goals"),
      ]);
      setBalance(b.data.balance); setTransactions(t.data.transactions || []);
      setPayees(p.data); setBudgets(bg.data || []); setGoals(g.data || []);
    } catch (e) { console.error(e); }
  };

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("userId"); window.location.href = "/dashboard"; };

  const navigate = (name) => { window.location.hash = name; setActivePage(name); setMobileOpen(false); };

  const goToSendMoney = (username) => { setSelectedPayee(username); navigate("SendMoney"); };

  const renderPage = () => {
    if (loading) return SKELETON_MAP[activePage] || <DashboardSkeleton />;
    const cp = { authAxios, refreshDashboard: refresh, userInfo };
    switch (activePage) {
      case "Dashboard":    return <DashboardHome balance={balance} transactions={transactions} payees={payees} setActivePage={setActivePage} {...cp}/>;
      case "Transactions": return <Transactions transactions={transactions} refreshDashboard={refresh} authAxios={authAxios} userInfo={userInfo}/>;
      case "Contacts":     return <Contacts payees={payees} onSendMoneyClick={goToSendMoney} authAxios={authAxios} refreshDashboard={refresh}/>;
      case "SendMoney":    return <SendMoney prefillPayee={selectedPayee} refreshDashboard={refresh} authAxios={authAxios}/>;
      case "Budgets":      return <Budgets authAxios={authAxios} budgets={budgets} setBudgets={setBudgets} refreshDashboard={refresh}/>;
      case "Goals":        return <Goals authAxios={authAxios} goals={goals} setGoals={setGoals} refreshDashboard={refresh}/>;
      case "Settings":     return <Settings userInfo={userInfo} authAxios={authAxios} onLogout={logout}/>;
      default:             return <DashboardHome balance={balance} transactions={transactions} payees={payees} setActivePage={setActivePage} {...cp}/>;
    }
  };

  const initial = userInfo.name ? userInfo.name[0].toUpperCase() : "?";

  const Sidebar = ({ mobile = false }) => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", padding:"0 12px 20px" }}>
      {/* Logo */}
      <div style={{ padding:"20px 4px 28px", borderBottom:"1px solid rgba(255,255,255,0.07)", marginBottom:"16px" }}>
        <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.3rem", color:"#fff", letterSpacing:"-0.02em" }}>
          Spend<span style={{ color:"#818CF8" }}>Quest</span>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", padding:"0 4px", marginBottom:"8px" }}>Menu</div>

      {/* Nav items */}
      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:"2px" }}>
        {NAV.map(item => (
          <button key={item.name} onClick={() => navigate(item.name)}
            className={`nav-item ${activePage === item.name ? "active" : ""}`}>
            <span style={{ opacity: activePage === item.name ? 1 : 0.7, flexShrink:0 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:"16px", marginTop:"16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 10px", borderRadius:"10px", background:"rgba(255,255,255,0.05)" }}>
          <div style={{ width:32, height:32, borderRadius:"8px", background:"var(--brand)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:"0.85rem", fontFamily:"var(--font-display)", flexShrink:0 }}>{initial}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:"0.8rem", fontWeight:600, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userInfo.name || "User"}</div>
            <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.4)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userInfo.email}</div>
          </div>
          <button onClick={logout} title="Sign out" style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.35)", padding:"4px", borderRadius:"6px", flexShrink:0, transition:"color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color="rgba(239,68,68,0.8)"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.35)"}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"var(--bg)" }}>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex" style={{ width:232, flexShrink:0, background:"var(--sidebar-bg)", borderRight:"1px solid var(--sidebar-border)", flexDirection:"column", overflowY:"auto" }}>
        <Sidebar />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:50 }} className="md:hidden">
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(2px)" }} onClick={() => setMobileOpen(false)}/>
          <aside style={{ position:"absolute", left:0, top:0, bottom:0, width:240, background:"var(--sidebar-bg)", borderRight:"1px solid var(--sidebar-border)", animation:"slideIn 0.22s ease", overflowY:"auto" }}>
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* ── Main area ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <header style={{ height:58, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--bg-card)", borderBottom:"1px solid var(--border)", flexShrink:0, gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className="md:hidden" onClick={() => setMobileOpen(true)}
              style={{ background:"none", border:"none", cursor:"pointer", color:"var(--t2)", display:"flex", padding:4 }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"1rem", color:"var(--t1)" }}>
                {NAV.find(n => n.name === activePage)?.label || "Dashboard"}
              </div>
              <div style={{ fontSize:"0.72rem", color:"var(--t4)", marginTop:1 }}>
                {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Avatar button */}
            <div style={{ position:"relative" }}>
              <button onClick={() => setUserMenuOpen(v => !v)}
                style={{ width:34, height:34, borderRadius:"9px", background:"var(--brand)", border:"none", cursor:"pointer", color:"#fff", fontWeight:700, fontSize:"0.85rem", fontFamily:"var(--font-display)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"var(--shadow-brand)" }}>
                {initial}
              </button>
              {userMenuOpen && (
                <div style={{ position:"absolute", right:0, top:42, background:"var(--bg-card)", borderRadius:"var(--r-lg)", boxShadow:"var(--shadow-xl)", border:"1px solid var(--border)", padding:"8px", minWidth:200, zIndex:40, animation:"fadeIn 0.15s ease" }}>
                  <div style={{ padding:"10px 12px 12px", borderBottom:"1px solid var(--border)", marginBottom:6 }}>
                    <div style={{ fontWeight:600, fontSize:"0.875rem", color:"var(--t1)" }}>{userInfo.name}</div>
                    <div style={{ fontSize:"0.75rem", color:"var(--t4)", marginTop:2 }}>{userInfo.email}</div>
                  </div>
                  <button onClick={logout} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 12px", borderRadius:"var(--r-sm)", border:"none", background:"none", cursor:"pointer", fontSize:"0.875rem", color:"var(--red)", fontWeight:500 }}
                    onMouseEnter={e => e.currentTarget.style.background="var(--red-bg)"}
                    onMouseLeave={e => e.currentTarget.style.background="none"}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, overflowY:"auto", padding:"24px" }} className="animate-fade-up">
          {renderPage()}
        </main>
      </div>

      <ToastContainer />
      <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
