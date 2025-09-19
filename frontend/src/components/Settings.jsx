import React, { useState } from "react";

const Settings = ({ userInfo, authAxios, onLogout }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAxios.post("/user/changeps", form);
      alert("✅ Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Change password failed", err);
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#273469]">Settings</h1>
        <button onClick={onLogout} className="btn-primary">
          Logout
        </button>
      </div>

      
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="font-semibold">{userInfo.name}</div>
        <div className="text-sm text-gray-500">{userInfo.email}</div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold text-lg text-[#273469] mb-3">Change Password</h2>
        <form className="space-y-3 max-w-sm" onSubmit={handlePasswordChange}>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Current password"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New password"
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2"
          >
            {loading ? "Updating…" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
