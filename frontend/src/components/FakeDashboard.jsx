import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import mainLogo from "../assets/mainLogo.png";
import axios from "axios";

const FakeDashboard = () => {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const apiurl = `${import.meta.env.VITE_API_URL}/user/signin`;

  const handleDemoLogin = async () => {
    setLoadingDemo(true);
    try {
      const res = await axios.post(
        apiurl,
        { userName: "pika@p.com", password: "123456" },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Signin error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signin failed");
      setLoadingDemo(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <img
          src={mainLogo}
          alt="SpendQuest"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-[#273469]/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
            SpendQuest
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mb-8">
            Take control of your finances. Track wallets, set budgets & goals,
            and send money effortlessly.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              disabled={loadingDemo}
              className="bg-[#273469] text-white px-6 py-3 rounded-lg shadow hover:bg-[#1f2959] transition-all duration-200 disabled:opacity-50"
              onClick={() => (window.location.href = "/signin")}
            >
              Sign In
            </button>
            <button
              disabled={loadingDemo}
              className="bg-[#e4d9ff] text-[#273469] px-6 py-3 rounded-lg shadow hover:bg-[#d2c1f5] transition-all duration-200 disabled:opacity-50"
              onClick={() => (window.location.href = "/signup")}
            >
              Create Account
            </button>
            <button
              className="bg-[#ffdede] text-[#a01d1d] px-6 py-3 rounded-lg shadow hover:bg-[#ffc7c7] transition-all duration-200 flex items-center gap-2 disabled:opacity-60"
              onClick={handleDemoLogin}
              disabled={loadingDemo}
            >
              {loadingDemo ? (
                <>
                  <FiLoader className="animate-spin" /> Demo loading…
                </>
              ) : (
                "Quick Demo"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeDashboard;