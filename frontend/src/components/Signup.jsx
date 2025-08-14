import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
    s_balance: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const apiurl = import.meta.env.VITE_API_URL + "/user/signup";
  // const localurl = "http://localhost:3000/api/v1/user/signin";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      s_balance: Number(form.s_balance) // backend expects number type
    };

    try {
      const res = await axios.post(
        apiurl,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Signup success:", res.data);

      // Store auth details for later requests
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      // Redirect to dashboard after short delay so log is visible
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="bg-[#30343f] px-6 py-8 min-h-screen flex items-center justify-center">
      <div className="bg-[#fafaff] p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#273469] text-center">
          Create Your Wallet
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email / Username */}
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">Email</label>
            <input
              name="userName"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              type="email"
              placeholder="Enter email"
              value={form.userName}
              onChange={handleChange}
              required
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">First Name</label>
            <input
              name="firstName"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">Last Name</label>
            <input
              name="lastName"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">Password</label>
            <input
              name="password"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Starting Balance */}
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">
              Starting Balance
            </label>
            <input
              name="s_balance"
              className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.s_balance}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button type="submit" className="btn-primary w-full">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;