import React, { useState } from "react";

const Transactions = ({ transactions, refreshDashboard, authAxios }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    isReceived: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await authAxios.post("/account/transactions", {
        ...form,
        amount: Number(form.amount)
      });
      setShowModal(false);
      setForm({ amount: "", description: "", isReceived: true });
      refreshDashboard();
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No transactions found.
        <button
          onClick={() => setShowModal(true)}
          className="ml-4 btn-primary px-4 py-2 rounded"
        >
          Add Transaction
        </button>
        {showModal && renderModal()}
      </div>
    );
  }

  const renderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isReceived"
              checked={form.isReceived}
              onChange={handleChange}
            />
            <label>Is Credit?</label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#273469]">Transactions</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary px-4 py-2 rounded"
        >
          Add Transaction
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f5f5f5] text-gray-700">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Description</th>
              <th className="p-3 border-b">Amount</th>
              <th className="p-3 border-b">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-3 border-b text-sm text-gray-600">
                  {new Date(txn.date).toLocaleDateString()}{" "}
                  <span className="text-xs text-gray-400">
                    {new Date(txn.date).toLocaleTimeString()}
                  </span>
                </td>
                <td className="p-3 border-b">{txn.description}</td>
                <td
                  className={`p-3 border-b font-semibold ${
                    txn.isReceived ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.isReceived ? "+" : "-"}₹{txn.amount}
                </td>
                <td className="p-3 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      txn.isReceived
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {txn.isReceived ? "Credit" : "Debit"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && renderModal()}
    </div>
  );
};

export default Transactions;