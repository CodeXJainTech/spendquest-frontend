import React, { useState } from "react";
import { FiTrash } from "react-icons/fi";

const Contacts = ({ payees = [], onSendMoneyClick, authAxios }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", userName: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addContact = async (e) => {
    e.preventDefault();
    try {
      await authAxios.post("/user/contacts", form);
      setShowAdd(false);
      setForm({ firstName: "", lastName: "", userName: "" });
      window.location.reload(); // refresh list
    } catch (err) {
      console.error("Add contact failed", err);
      alert(err.response?.data?.message || "Failed to add contact");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await authAxios.delete(`/user/contacts/${id}`);
      window.location.reload();
    } catch (err) {
      console.error("Delete contact failed", err);
      alert(err.response?.data?.message || "Failed to delete contact");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#273469]">Contacts</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          Add Contact
        </button>
      </div>

      {payees.length === 0 ? (
        <p className="text-gray-500">No contacts added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {payees.map((p) => (
            <div
              key={p.userId || p.userName}
              className="relative bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200"
            >
              {/* Delete button */}
              <button
                onClick={() => deleteContact(p.userId || p.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <FiTrash size={18} />
              </button>

              <div>
                <div className="font-semibold text-lg text-[#1e2749]">
                  {p.firstName} {p.lastName}
                </div>
                <div className="text-sm text-gray-500">{p.userName}</div>
                {p.lastAmount && (
                  <div className="text-sm text-gray-400">Last: ₹{p.lastAmount}</div>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={() => onSendMoneyClick(p.userName)}
                  className="btn-primary text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-semibold text-[#273469] mb-4">Add Contact</h3>
            <form onSubmit={addContact} className="space-y-3">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="First name"
                required
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Last name"
              />
              <input
                name="userName"
                value={form.userName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="username / email"
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-4 py-2 rounded">
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

export default Contacts;