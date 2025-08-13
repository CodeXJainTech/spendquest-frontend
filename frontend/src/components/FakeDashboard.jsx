import React from "react";

const FakeDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] px-4">
      {/* Logo */}
      <img
        src="/logo192.png" // Replace with your logo
        alt="SpendQuest"
        className="w-24 h-24 mb-4 drop-shadow-md"
      />

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-[#273469] mb-2 text-center">
        Welcome to SpendQuest
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Your all-in-one platform to track wallet balances, manage payees, and send money securely.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          className="bg-[#273469] text-white px-6 py-2 rounded-lg shadow hover:bg-[#1f2959] transition-all duration-200"
          onClick={() => (window.location.href = "/signin")}
        >
          Sign In
        </button>
        <button
          className="bg-[#e4d9ff] text-[#273469] px-6 py-2 rounded-lg shadow hover:bg-[#d2c1f5] transition-all duration-200"
          onClick={() => (window.location.href = "/signup")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default FakeDashboard;