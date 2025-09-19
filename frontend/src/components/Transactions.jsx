import React, { useState, useMemo } from "react";

const Transactions = ({ transactions = [], refreshDashboard, authAxios, userInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    isReceived: true,
    category: ""
  });

  // filters & pagination
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const categories = useMemo(() => {
    const set = new Set();
    transactions.forEach(t => t.category && set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await authAxios.post("/account/transactions", {
        ...form,
        amount: Number(form.amount)
      });
      setShowModal(false);
      setForm({ amount: "", description: "", isReceived: true, category: "" });
      refreshDashboard();
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    }
  };

  const filtered = transactions.filter(t => {
    if (search && !`${t.description} ${t.userName || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPageTxns = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    if (!filtered.length) {
      alert("No transactions to export");
      return;
    }
    const header = ["Date", "Description", "Amount", "Type", "Category"];
    const rows = filtered.map(t => [
      new Date(t.date).toLocaleString(),
      `"${(t.description || "").replace(/"/g, '""')}"`,
      t.amount,
      t.isReceived ? "Credit" : "Debit",
      t.category || ""
    ]);
    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input name="amount" type="number" value={form.amount} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <input name="description" value={form.description} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="border rounded px-3 py-2 w-full" placeholder="e.g., Groceries" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isReceived" checked={form.isReceived} onChange={handleChange} />
            <label>Is Credit?</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
            <button type="submit" className="btn-primary">Add</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#273469]">Transactions</h2>

        <div className="flex gap-2 items-center">
          <input value={search} onChange={(e)=>{setSearch(e.target.value); setPage(1);}} placeholder="Search description" className="px-3 py-2 rounded bg-[#f0f3ff]" />
          <select value={categoryFilter} onChange={(e)=>{setCategoryFilter(e.target.value); setPage(1);}} className="px-3 py-2 rounded bg-[#f0f3ff]">
            <option value="">All categories</option>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={()=>setShowModal(true)} className="btn-primary px-4 py-2 rounded">Add Transaction</button>
          <button onClick={exportCSV} className="px-4 py-2 rounded bg-[#e4d9ff] text-[#273469]">Export CSV</button>
        </div>
      </div>

      {(!transactions || transactions.length === 0) ? (
        <div className="p-4 text-gray-500 text-center">
          No transactions found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f5f5] text-gray-700">
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Description</th>
                  <th className="p-3 border-b">Category</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Type</th>
                </tr>
              </thead>
              <tbody>
                {currentPageTxns.map((txn) => (
                  <tr key={txn._id || txn.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 border-b text-sm text-gray-600">{new Date(txn.date).toLocaleDateString()} <span className="text-xs text-gray-400"> {new Date(txn.date).toLocaleTimeString()}</span></td>
                    <td className="p-3 border-b">{txn.description}</td>
                    <td className="p-3 border-b">{txn.category || "—"}</td>
                    <td className={`p-3 border-b font-semibold ${txn.isReceived ? "text-green-600" : "text-red-600"}`}>{txn.isReceived ? "+" : "-"}₹{txn.amount}</td>
                    <td className="p-3 border-b"><span className={`px-3 py-1 rounded-full text-xs font-medium ${txn.isReceived ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{txn.isReceived ? "Credit" : "Debit"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">{filtered.length} results</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={()=>setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
              <div className="px-3 py-1">{page} / {pageCount}</div>
              <button className="px-3 py-1 rounded bg-gray-200" onClick={()=>setPage(p => Math.min(pageCount, p+1))} disabled={page===pageCount}>Next</button>
            </div>
          </div>
        </>
      )}

      {showModal && renderModal()}
    </div>
  );
};

export default Transactions;