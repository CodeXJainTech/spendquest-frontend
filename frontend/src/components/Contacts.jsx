import React, { useState, useEffect } from "react";
import { toast } from "./Toast";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
];
const initials = (p) =>
  `${p.firstName?.[0] || ""}${p.lastName?.[0] || ""}`.toUpperCase() || "?";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white text-[#0F1117] text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/10 transition";
const labelCls =
  "block text-[0.75rem] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider";

export default function Contacts({
  payees = [],
  onSendMoneyClick,
  authAxios,
  refreshDashboard,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
  });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDel] = useState(null);
  const [local, setLocal] = useState(payees);
  const [search, setSearch] = useState("");

  useEffect(() => setLocal(payees), [payees]);

  const filtered = local.filter(
    (p) =>
      !search ||
      `${p.firstName} ${p.lastName} ${p.userName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const add = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await authAxios.post("/user/contacts", form);
      const nc = res.data?.contact || {
        ...form,
        userId: Date.now().toString(),
      };
      setLocal((p) => [...p, nc]);
      setShowAdd(false);
      setForm({ firstName: "", lastName: "", userName: "" });
      toast.success(`${form.firstName} added`);
      if (refreshDashboard) refreshDashboard();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add contact");
    } finally {
      setAdding(false);
    }
  };

  const del = async (id, name) => {
    setDel(id);
    try {
      await authAxios.delete(`/user/contacts/${id}`);
      setLocal((p) => p.filter((c) => (c.userId || c.id) !== id));
      toast.info(`${name} removed`);
      if (refreshDashboard) refreshDashboard();
    } catch {
      toast.error("Failed to remove contact");
    } finally {
      setDel(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="font-bold text-2xl text-[#0F1117] tracking-tight">
            Contacts
          </div>
          <div className="text-[0.8rem] text-gray-400 mt-0.5">
            {local.length} contact{local.length !== 1 ? "s" : ""}
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.875rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-px transition border-none cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Contact
        </button>
      </div>

      {/* Search */}
      {local.length > 0 && (
        <div className="relative max-w-[320px]">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className={`${inputCls} pl-9`}
          />
        </div>
      )}

      {/* Empty state */}
      {local.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm text-center px-6 py-16">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="font-bold text-[1rem] text-[#0F1117] mb-1.5">
            No contacts yet
          </div>
          <div className="text-gray-400 text-[0.875rem]">
            Add people you frequently send money to
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-10 text-center text-gray-400 text-[0.875rem]">
          No contacts match "{search}"
        </div>
      ) : (
        <div
          className="grid gap-3.5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {filtered.map((p, i) => {
            const id = p.userId || p.id;
            const isDeleting = deletingId === id;
            return (
              <div
                key={id || p.userName}
                className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4 transition-opacity ${isDeleting ? "opacity-50" : "opacity-100"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[0.9rem] shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    >
                      {initials(p)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0F1117] text-[0.9rem]">
                        {p.firstName} {p.lastName}
                      </div>
                      <div className="text-[0.75rem] text-gray-400 mt-0.5">
                        {p.userName}
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={isDeleting}
                    onClick={() => del(id, `${p.firstName} ${p.lastName}`)}
                    className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 border-[1.5px] border-red-200 disabled:opacity-55 cursor-pointer transition"
                  >
                    {isDeleting ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-spin"
                      >
                        <circle cx="12" cy="12" r="9" strokeDasharray="28 56" />
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      </svg>
                    )}
                  </button>
                </div>
                {p.lastAmount && (
                  <div className="text-[0.75rem] text-gray-500 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                    Last sent: <strong>₹{p.lastAmount}</strong>
                  </div>
                )}
                <button
                  onClick={() => onSendMoneyClick(p.userName)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.85rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-px border-none cursor-pointer transition"
                >
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send Money
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="bg-white rounded-3xl shadow-[0_20px_25px_rgba(0,0,0,0.09)] w-full max-w-[440px] p-7 modal-animate">
            <div className="flex items-center justify-between mb-5">
              <div className="font-bold text-[1.1rem] text-[#0F1117]">
                Add Contact
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 p-1 flex transition"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={add} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="Raj"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="Sharma"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Username / Email</label>
                <input
                  name="userName"
                  value={form.userName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, userName: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="raj@example.com"
                  required
                />
              </div>
              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-[#F4F6FB] hover:bg-white text-gray-700 text-[0.875rem] font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[0.875rem] font-semibold shadow-[0_4px_14px_rgba(79,70,229,0.35)] disabled:opacity-55 disabled:cursor-not-allowed border-none cursor-pointer transition"
                >
                  {adding ? "Adding…" : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}