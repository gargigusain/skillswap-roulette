import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
          skills: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError("Server error, please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-xl rounded-2xl">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8">📝 Create Account</h2>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form className="flex flex-col gap-5" onSubmit={handleSignup}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          ✅ Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
