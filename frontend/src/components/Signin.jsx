import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const [form, setForm] = useState({
    userName: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const apiurl = `${import.meta.env.VITE_API_URL}/user/signin`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(apiurl, form, { headers: { "Content-Type": "application/json" } });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Signin error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="bg-[#30343f] px-6 py-8 min-h-screen flex items-center justify-center">
      <div className="bg-[#fafaff] p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#273469] text-center">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">Email</label>
            <input name="userName" className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full" type="email" placeholder="Enter email" value={form.userName} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#1e2749]">Password</label>
            <input name="password" className="bg-[#e4d9ff] border border-gray-300 rounded px-3 py-2 w-full" type="password" placeholder="Enter password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>

        <div className="mt-4 flex justify-between items-center gap-2">
          <p className="text-sm text-gray-600">Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signin;