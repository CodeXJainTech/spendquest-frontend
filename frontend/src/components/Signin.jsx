import React, { useState } from "react";
import axios from "axios";

const Signin = () => {
  const [form, setForm] = useState({
    userName: "", // backend expects userName
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Signin success:", res.data);

      // Store token and userId for later use
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Signin error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="bg-[#30343f] px-6 py-8 min-h-screen flex items-center justify-center">
      <div className="bg-[#fafaff] p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#273469] text-center">
          Sign In
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
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

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;