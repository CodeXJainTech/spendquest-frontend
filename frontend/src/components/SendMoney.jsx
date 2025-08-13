import React, { useState, useEffect } from "react";

const SendMoney = ({ prefillPayee, refreshDashboard, authAxios }) => {
  const [form, setForm] = useState({
    toUsername: "",
    amount: ""
  });

  // Pre-fill payee when coming from Payees section
  useEffect(() => {
    if (prefillPayee) {
      setForm((prev) => ({ ...prev, to: prefillPayee }));
    }
  }, [prefillPayee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAxios.post("/account/transfer", {
        amount: Number(form.amount),
        toUsername: form.to // userId from Payees
      });
      alert("✅ Money sent successfully!");
      setForm({ to: "", amount: "" }); // reset form
      refreshDashboard();
    } catch (err) {
      console.error("❌ Transfer failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <div className="px-[15vw] py-24">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-[#273469] mb-4">Send Money</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Payee ID Field */}
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">
              Payee username
            </label>
            <input
              name="to"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Enter payee username"
              value={form.to}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">Amount</label>
            <input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Send Money
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendMoney;