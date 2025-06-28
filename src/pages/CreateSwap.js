import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateSwap = () => {
  const [form, setForm] = useState({
    skillOffered: "",
    skillWanted: "",
    description: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/swaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create swap");
        return;
      }

      toast.success("Skill swap posted successfully!");
      navigate("/browse-swaps");
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">🚀 Create a Skill Swap</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="skillOffered"
          placeholder="Skill you are offering"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="skillWanted"
          placeholder="Skill you want to learn"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Add a short description (optional)"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={5}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          📤 Post Swap
        </button>
      </form>
    </div>
  );
};

export default CreateSwap;
