import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Contacts from "./Contacts";
import Transactions from "./Transactions";
import SendMoney from "./SendMoney";
import DashboardHome from "./DashboardHome";
import Budgets from "./Budgets";
import Goals from "./Goals";
import Settings from "./Settings";
import { FiMenu, FiX } from "react-icons/fi";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [balance, setBalance] = useState(0);
  const [payees, setPayees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);  
  const [selectedPayee, setSelectedPayee] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const apiurl = `${import.meta.env.VITE_API_URL}`;

  // memoized axios instance
  const authAxios = useMemo(
    () =>
      axios.create({
        baseURL: apiurl,
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId || "",
        },
      }),
    [apiurl, token, userId]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, payeesRes, transactionsRes, userRes, budgetsRes, goalsRes] =
          await Promise.all([
            authAxios.get("/account/balance"),
            authAxios.get("/user/contacts"),
            authAxios.get("/account/transactions"),
            authAxios.get("/user/me"),
            authAxios.get("/account/budgets"),
            authAxios.get("/account/goals"), 
          ]);

        setBalance(balanceRes.data.balance);
        setPayees(payeesRes.data);
        setTransactions(transactionsRes.data.transactions || []);
        setUserInfo({
          name: userRes.data.name || "",
          email: userRes.data.email || "",
        });
        setBudgets(budgetsRes.data || []);
        setGoals(goalsRes.data || []);
      } catch (err) {
        console.error(
          "Error fetching dashboard data:",
          err.response?.data || err.message
        );
      }
    };

    fetchData();
  }, [authAxios]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/dashboard";
  };

  const goToSendMoney = (payee_username) => {
    setSelectedPayee(payee_username);
    setActivePage("SendMoney");
    setIsSidebarOpen(false);
  };

  const refreshDashboard = async () => {
    try {
      const [balanceRes, transactionsRes, payeesRes, budgetsRes, goalsRes] =
        await Promise.all([
          authAxios.get("/account/balance"),
          authAxios.get("/account/transactions"),
          authAxios.get("/user/contacts"),
          authAxios.get("/account/budgets"),
          authAxios.get("/account/goals"),
        ]);
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions || []);
      setPayees(payeesRes.data);
      setBudgets(budgetsRes.data || []);
      setGoals(goalsRes.data || []);
    } catch (err) {
      console.error("Refresh failed:", err.response?.data || err.message);
    }
  };

  const renderPage = () => {
    const commonProps = { authAxios, refreshDashboard, userInfo };

    switch (activePage) {
      case "Dashboard":
        return (
          <DashboardHome
            balance={balance}
            transactions={transactions}
            payees={payees}
            {...commonProps}
          />
        );
      case "Transactions":
        return (
          <Transactions
            transactions={transactions}
            refreshDashboard={refreshDashboard}
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
          />
        );
      case "SendMoney":
        return (
          <SendMoney
            prefillPayee={selectedPayee}
            refreshDashboard={refreshDashboard}
            authAxios={authAxios}
          />
        );
      case "Budgets":
        return (
          <Budgets
            authAxios={authAxios}
            budgets={budgets}
            setBudgets={setBudgets}
            refreshDashboard={refreshDashboard}
          />
        );
      case "Goals":
        return (
          <Goals
            authAxios={authAxios}
            goals={goals}
            setGoals={setGoals}
            refreshDashboard={refreshDashboard}
          />
        );
      case "Settings":
        return (
          <Settings
            userInfo={userInfo}
            authAxios={authAxios}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <DashboardHome
            balance={balance}
            transactions={transactions}
            payees={payees}
            {...commonProps}
          />
        );
    }
  };

  const initial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "?";

  const menuItems = [
    { name: "Dashboard", label: "Dashboard" },
    { name: "Transactions", label: "Transactions" },
    { name: "SendMoney", label: "Send Money" },
    { name: "Contacts", label: "Contacts" },
    { name: "Budgets", label: "Budgets" },
    { name: "Goals", label: "Goals" },
    { name: "Settings", label: "Settings" },
  ];

  const handleMenuClick = (itemName) => {
    setActivePage(itemName);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#fafaff]">
      {/* Top Bar */}
      <div className="h-14 px-6 flex items-center justify-between bg-[#273469] text-white fixed top-0 left-0 right-0 z-50 shadow">
        <div className="font-bold text-2xl">SpendQuest App</div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          {isSidebarOpen ? (
            <FiX
              className="text-3xl text-[#e4d9ff] cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            />
          ) : (
            <FiMenu
              className="text-3xl text-[#e4d9ff] cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            />
          )}
        </div>

        {/* User + Logout (desktop only) */}
        <div className="hidden md:flex items-center gap-4 relative">
          <button
            className="w-10 h-10 rounded-full bg-purple-400 text-white font-bold flex items-center justify-center"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            {initial}
          </button>
          {showUserDropdown && (
            <div className="absolute right-0 top-12 bg-white text-black rounded shadow p-4 min-w-[220px] z-50">
              <div className="font-semibold">{userInfo.name}</div>
              <div className="text-sm">{userInfo.email}</div>
              <div className="mt-3">
                <button
                  onClick={handleLogout}
                  className="btn-primary text-sm w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 pt-14">
        {/* Sidebar Desktop */}
        <div className="bg-[#273469] text-white w-64 p-4 fixed h-full hidden md:block">
          <h2 className="text-lg font-bold mb-8">
            {userInfo.name || "User"}
          </h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleMenuClick(item.name)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors duration-200 ${
                    activePage === item.name
                      ? "bg-[#e4d9ff] text-[#273469] font-bold"
                      : "hover:bg-[#e4d9ff] hover:text-[#273469]"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Mobile */}
        {isSidebarOpen && (
          <div className="absolute top-14 left-0 w-full bg-[#273469] text-white p-4 z-40 md:hidden">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleMenuClick(item.name)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors duration-200 ${
                      activePage === item.name
                        ? "bg-[#e4d9ff] text-[#273469] font-bold"
                        : "hover:bg-[#e4d9ff] hover:text-[#273469]"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded hover:bg-red-500"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="md:ml-64 p-6 w-full">{renderPage()}</div>
      </div>
    </div>
  );
};

export default Dashboard;