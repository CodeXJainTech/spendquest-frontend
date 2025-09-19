import React from "react";

const Wallet = ({ balance , setActivePage}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-[#273469] mb-4">Wallet</h1>
      <p className="text-lg text-gray-700">
        Current Balance:{" "}
        <span className="font-semibold text-[#1e2749]">₹{balance.toFixed(2)}</span>
      </p>
      <button
        className="btn-primary px-4 py-2"
        onClick={() => {
          window.location.hash = "Transactions"
          setActivePage("Transactions")
        }}
      >
        + Add Transaction
      </button>
    </div>
  );
};

export default Wallet;
