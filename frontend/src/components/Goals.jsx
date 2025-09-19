import React, { useState } from "react";
import { FiTrash } from "react-icons/fi";

const Goals = ({ authAxios, goals, setGoals, refreshDashboard }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", target: "" });

  const addGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await authAxios.post("account/goals", {
        title: form.title,
        target: Number(form.target),
      });
      setGoals((prev) => [...prev, res.data]);
      setShowAdd(false);
      setForm({ title: "", target: "" });
      refreshDashboard();
    } catch (err) {
      console.error("Add goal failed", err);
    }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await authAxios.delete(`account/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g._id !== id));
      refreshDashboard();
    } catch (err) {
      console.error("Delete goal failed", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#273469]">Goals</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          + Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-gray-500">No goals created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <div
              key={g._id}
              className="relative bg-white p-4 rounded shadow border"
            >
              <button
                onClick={() => deleteGoal(g._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <FiTrash size={18} />
              </button>
              <h2 className="font-semibold text-lg">{g.title}</h2>
              <p className="text-sm text-gray-500">Target: ₹{g.target}</p>
              <div className="mt-3 w-full bg-gray-200 rounded h-3">
                <div
                  className={`${
                    g.progress >= g.target ? "bg-green-500" : "bg-red-500"
                  } h-3 rounded`}
                  style={{
                    width: `${Math.min(
                      100,
                      (g.progress / g.target) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-600">
                Saved: ₹{g.progress || 0} / ₹{g.target}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Goal Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-semibold text-lg mb-4">New Goal</h3>
            <form className="space-y-3" onSubmit={addGoal}>
              <input
                name="title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Goal (e.g. Laptop)"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                name="target"
                type="number"
                value={form.target}
                onChange={(e) =>
                  setForm((f) => ({ ...f, target: e.target.value }))
                }
                placeholder="Target amount"
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

export default Goals;