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
import {
  DashboardSkeleton,
  TransactionsSkeleton,
  CardGridSkeleton,
  FormSkeleton,
} from "./Skeleton";

const NAV = [
  {
    name: "Dashboard",
    label: "Dashboard",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: "Transactions",
    label: "Transactions",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    name: "SendMoney",
    label: "Send Money",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
  {
    name: "Contacts",
    label: "Contacts",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Budgets",
    label: "Budgets",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    name: "Goals",
    label: "Goals",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    name: "Settings",
    label: "Settings",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const SKELETON_MAP = {
  Dashboard: <DashboardSkeleton />,
  Transactions: <TransactionsSkeleton />,
  Contacts: <CardGridSkeleton />,
  SendMoney: <FormSkeleton />,
  Budgets: <CardGridSkeleton />,
  Goals: <CardGridSkeleton />,
  Settings: <FormSkeleton />,
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [balance, setBalance] = useState(0);
  const [payees, setPayees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedPayee, setSelectedPayee] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const apiurl = import.meta.env.VITE_API_URL;

  const authAxios = useMemo(
    () =>
      axios.create({
        baseURL: apiurl,
        headers: { Authorization: `Bearer ${token}`, userId: userId || "" },
      }),
    [apiurl, token, userId],
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) setActivePage(hash);
    const onHash = () =>
      setActivePage(window.location.hash.slice(1) || "Dashboard");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [b, p, t, u, bg, g] = await Promise.all([
          authAxios.get("/account/balance"),
          authAxios.get("/user/contacts"),
          authAxios.get("/account/transactions"),
          authAxios.get("/user/me"),
          authAxios.get("/account/budgets"),
          authAxios.get("/account/goals"),
        ]);
        setBalance(b.data.balance);
        setPayees(p.data);
        setTransactions(t.data.transactions || []);
        setUserInfo({ name: u.data.name || "", email: u.data.email || "" });
        setBudgets(bg.data || []);
        setGoals(g.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [authAxios]);

  const refresh = async () => {
    try {
      const [b, t, p, bg, g] = await Promise.all([
        authAxios.get("/account/balance"),
        authAxios.get("/account/transactions"),
        authAxios.get("/user/contacts"),
        authAxios.get("/account/budgets"),
        authAxios.get("/account/goals"),
      ]);
      setBalance(b.data.balance);
      setTransactions(t.data.transactions || []);
      setPayees(p.data);
      setBudgets(bg.data || []);
      setGoals(g.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/dashboard";
  };
  const navigate = (name) => {
    window.location.hash = name;
    setActivePage(name);
    setMobileOpen(false);
  };
  const goToSendMoney = (username) => {
    setSelectedPayee(username);
    navigate("SendMoney");
  };

  const renderPage = () => {
    if (loading) return SKELETON_MAP[activePage] || <DashboardSkeleton />;
    const cp = { authAxios, refreshDashboard: refresh, userInfo };
    switch (activePage) {
      case "Dashboard":
        return (
          <DashboardHome
            balance={balance}
            transactions={transactions}
            payees={payees}
            setActivePage={setActivePage}
            {...cp}
          />
        );
      case "Transactions":
        return (
          <Transactions
            transactions={transactions}
            refreshDashboard={refresh}
            authAxios={authAxios}
            userInfo={userInfo}
          />
        );
      case "Contacts":
        return (
          <Contacts
            payees={payees}
            onSendMoneyClick={goToSendMoney}
            authAxios={authAxios}
            refreshDashboard={refresh}
          />
        );
      case "SendMoney":
        return (
          <SendMoney
            prefillPayee={selectedPayee}
            refreshDashboard={refresh}
            authAxios={authAxios}
          />
        );
      case "Budgets":
        return (
          <Budgets
            authAxios={authAxios}
            budgets={budgets}
            setBudgets={setBudgets}
            refreshDashboard={refresh}
          />
        );
      case "Goals":
        return (
          <Goals
            authAxios={authAxios}
            goals={goals}
            setGoals={setGoals}
            refreshDashboard={refresh}
          />
        );
      case "Settings":
        return (
          <Settings
            userInfo={userInfo}
            authAxios={authAxios}
            onLogout={logout}
          />
        );
      default:
        return (
          <DashboardHome
            balance={balance}
            transactions={transactions}
            payees={payees}
            setActivePage={setActivePage}
            {...cp}
          />
        );
    }
  };

  const initial = userInfo.name ? userInfo.name[0].toUpperCase() : "?";

  const Sidebar = () => (
    <div className="flex flex-col h-full px-3 pb-5">
      {/* Logo */}
      <div className="px-1 pt-5 pb-7 border-b border-white/[0.07] mb-4">
        <div className="font-extrabold text-[1.3rem] text-white tracking-tight">
          Spend<span className="text-indigo-400">Quest</span>
        </div>
      </div>

      {/* Nav label */}
      <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-white/[0.28] px-1 mb-2">
        Menu
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = activePage === item.name;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.name)}
              className={`relative flex items-center gap-[11px] w-full px-3 py-2.5 rounded-xl text-left text-[0.875rem] font-medium border-none cursor-pointer transition-all
                ${
                  active
                    ? "bg-indigo-600/[0.22] text-white font-semibold"
                    : "bg-transparent text-white/55 hover:bg-white/[0.07] hover:text-white"
                }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-indigo-500 rounded-r" />
              )}
              <span className={active ? "opacity-100" : "opacity-70"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-white/[0.07] pt-4 mt-4">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] bg-white/[0.05]">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-[0.85rem] shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[0.8rem] font-semibold text-white truncate">
              {userInfo.name || "User"}
            </div>
            <div className="text-[0.7rem] text-white/40 truncate">
              {userInfo.email}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="shrink-0 p-1 rounded-md text-white/35 hover:text-red-400/80 transition-colors bg-transparent border-none cursor-pointer flex"
          >
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FB]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[232px] shrink-0 bg-[#0D1117] border-r border-white/[0.06] flex-col overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-[#0D1117] border-r border-white/[0.06] overflow-y-auto sidebar-animate">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[58px] px-6 flex items-center justify-between bg-white border-b border-gray-200 shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden bg-transparent border-none cursor-pointer text-gray-600 flex p-1"
              onClick={() => setMobileOpen(true)}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <div className="font-bold text-[1rem] text-[#0F1117]">
                {NAV.find((n) => n.name === activePage)?.label || "Dashboard"}
              </div>
              <div className="text-[0.72rem] text-gray-400 mt-0.5">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="w-[34px] h-[34px] rounded-[9px] bg-indigo-600 border-none cursor-pointer text-white font-bold text-[0.85rem] flex items-center justify-center shadow-[0_4px_14px_rgba(79,70,229,0.35)]"
              >
                {initial}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-[42px] bg-white rounded-2xl shadow-[0_20px_25px_rgba(0,0,0,0.09),0_8px_10px_rgba(0,0,0,0.04)] border border-gray-200 p-2 min-w-[200px] z-40 animate-fade-in">
                  <div className="px-3 py-2.5 pb-3 border-b border-gray-100 mb-1.5">
                    <div className="font-semibold text-[0.875rem] text-[#0F1117]">
                      {userInfo.name}
                    </div>
                    <div className="text-[0.75rem] text-gray-400 mt-0.5">
                      {userInfo.email}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border-none bg-transparent cursor-pointer text-[0.875rem] text-red-500 font-medium hover:bg-red-50 transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 animate-fade-up">
          {renderPage()}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}