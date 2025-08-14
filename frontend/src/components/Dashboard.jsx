import React, { useState, useEffect } from "react";
import axios from "axios";
import Wallet from "./Wallet";
import Payees from "./Payees";
import Transactions from "./Transactions";
import SendMoney from "./SendMoney";
import { FiMenu, FiX } from "react-icons/fi";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Wallet");
  const [balance, setBalance] = useState(0);
  const [payees, setPayees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedPayee, setSelectedPayee] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const apiurl = import.meta.env.VITE_API_URL;
  // const apiurl = "http://localhost:3000/api/v1";

  const authAxios = axios.create({
    baseURL: apiurl,
    headers: {
      Authorization: `Bearer ${token}`,
      userId: userId || ""
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, payeesRes, transactionsRes, userRes] = await Promise.all([
          authAxios.get("/account/balance"),
          authAxios.get("/user/payee"),
          authAxios.get("/account/transactions"),
          authAxios.get("/user/me")
        ]);

        setBalance(balanceRes.data.balance);
        setPayees(payeesRes.data);
        setTransactions(transactionsRes.data.transactions);
        setUserInfo({
          name: userRes.data.name,
          email: userRes.data.email
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/signin";
  };

  const goToSendMoney = (payee_username) => {
    setSelectedPayee(payee_username);
    setActivePage("SendMoney");
    setIsSidebarOpen(false); // close sidebar on mobile after selecting
  };

  const refreshDashboard = async () => {
    try {
      const [balanceRes, transactionsRes, payeesRes] = await Promise.all([
        authAxios.get("/account/balance"),
        authAxios.get("/account/transactions"),
        authAxios.get("/user/payee")
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions);
      setPayees(payeesRes.data);
    } catch (err) {
      console.error("Refresh failed:", err.response?.data || err.message);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "Wallet":
        return <Wallet balance={balance} />;
      case "Payees":
        return <Payees payees={payees} onSendMoneyClick={goToSendMoney} />;
      case "Transactions":
        return (
          <Transactions
            transactions={transactions}
            refreshDashboard={refreshDashboard}
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
      default:
        return <Wallet balance={balance} />;
    }
  };

  const initial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "?";

  const menuItems = [
    { name: "Wallet", label: "Wallet" },
    { name: "Payees", label: "Payees" },
    { name: "Transactions", label: "Transactions" },
    { name: "SendMoney", label: "Send Money" }
  ];

  const handleMenuClick = (itemName) => {
    setActivePage(itemName);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#fafaff]">
      {/* Top Bar */}
      <div className="h-14 px-6 flex items-center justify-between bg-[#273469] text-white fixed top-0 left-0 right-0 z-50 shadow">
        <div className="font-bold text-lg">SpendQuest App</div>

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
            <div className="absolute right-14 top-14 bg-white text-black rounded shadow p-4 min-w-[200px] z-50">
              <div className="font-semibold">{userInfo.name}</div>
              <div className="text-sm">{userInfo.email}</div>
            </div>
          )}
          <button onClick={handleLogout} className="btn-primary text-sm">
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1 pt-14">
        {/* Sidebar Desktop */}
        <div className="bg-[#273469] text-white w-64 p-4 fixed h-full hidden md:block">
          <h2 className="text-lg font-bold mb-8">{userInfo.name}'s Dashboard</h2>
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
