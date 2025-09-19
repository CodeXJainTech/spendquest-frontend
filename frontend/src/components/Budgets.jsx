import React, { useState } from "react";
import { FiTrash } from "react-icons/fi";

const Budgets = ({ authAxios, budgets, setBudgets, refreshDashboard }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: "", limit: "" });

  const addBudget = async (e) => {
    e.preventDefault();
    try {
      const res = await authAxios.post("account/budgets", {
        category: form.category,
        limit: Number(form.limit),
      });
      setBudgets((prev) => [...prev, res.data]);
      setShowAdd(false);
      setForm({ category: "", limit: "" });
      refreshDashboard();
    } catch (err) {
      console.error("Add budget failed", err);
    }
  };

  const deleteBudget = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await authAxios.delete(`account/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
      refreshDashboard();
    } catch (err) {
      console.error("Delete budget failed", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#273469]">Budgets</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          + Add Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <p className="text-gray-500">No budgets created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => (
            <div
              key={b._id}
              className="relative bg-white p-4 rounded shadow border"
            >
              <button
                onClick={() => deleteBudget(b._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <FiTrash size={18} />
              </button>
              <h2 className="font-semibold text-lg">{b.category}</h2>
              <p className="text-sm text-gray-500">Limit: ₹{b.limit}</p>
              <div className="mt-3 w-full bg-gray-200 rounded h-3">
                <div
                  className={`${
                    b.spent > b.limit ? "bg-red-500" : "bg-green-500"
                  } h-3 rounded`}
                  style={{
                    width: `${Math.min(
                      100,
                      (b.spent / b.limit) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-600">
                Spent: ₹{b.spent || 0} / ₹{b.limit}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Budget Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-semibold text-lg mb-4">New Budget</h3>
            <form className="space-y-3" onSubmit={addBudget}>
              <input
                name="category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="Category (e.g. Food)"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                name="limit"
                type="number"
                value={form.limit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, limit: e.target.value }))
                }
                placeholder="Limit amount"
                className="w-full border rounded px-3 py-2"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
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
      )}
    </div>
  );
};

export default Budgets;