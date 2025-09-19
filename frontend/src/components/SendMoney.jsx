import React, { useState, useEffect } from "react";

const SendMoney = ({ prefillPayee, refreshDashboard, authAxios }) => {
  const [form, setForm] = useState({
    toUsername: "",
    amount: ""
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill payee when coming from Contacts section
  useEffect(() => {
    if (prefillPayee) {
      setForm((prev) => ({ ...prev, toUsername: prefillPayee }));
    }
  }, [prefillPayee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.toUsername || Number(form.amount) <= 0) {
      alert("Please enter a valid payee and amount.");
      return;
    }
    setLoading(true);
    try {
      await authAxios.post("/account/transfer", {
        amount: Number(form.amount),
        toUsername: form.toUsername
      });
      alert("✅ Money sent successfully!");
      setForm({ toUsername: "", amount: "" });
      refreshDashboard();
    } catch (err) {
      console.error("❌ Transfer failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-[6vw] py-16">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-[#273469] mb-4">Send Money</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">Payee username</label>
            <input
              name="toUsername"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Enter payee username"
              value={form.toUsername}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">Amount</label>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Money"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendMoney;