import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const API_URL = "http://localhost:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // ✅ Now both values are valid
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("✅ Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 shadow-2xl rounded-2xl bg-white">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8">🔐 Login to SkillSwap</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form className="flex flex-col gap-5" onSubmit={handleLogin}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
          required
        />
        <input
          name="password" // ✅ Corrected here
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          🚀 Login
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-5">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
