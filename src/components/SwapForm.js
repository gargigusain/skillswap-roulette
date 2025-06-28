import React, { useState } from "react";

const SwapForm = ({ onPostSuccess }) => {
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to post a swap.");

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/swaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ skillOffered, skillWanted, description }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Swap posted successfully!");
        setSkillOffered("");
        setSkillWanted("");
        setDescription("");
        onPostSuccess?.(); // refresh list
      } else {
        alert(data.error || "Failed to post swap.");
      }
    } catch (err) {
      console.error("Error posting swap:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto my-12 p-8 bg-white border border-gray-200 rounded-2xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-indigo-700">
        🎯 Post a New Skill Swap
      </h2>

      <div>
        <label className="block font-semibold mb-2 text-gray-700">Skill Offered</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={skillOffered}
          onChange={(e) => setSkillOffered(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-2 text-gray-700">Skill Wanted</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={skillWanted}
          onChange={(e) => setSkillWanted(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-2 text-gray-700">Description (Optional)</label>
        <textarea
          className="w-full px-4 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Posting..." : "🚀 Post Swap"}
        </button>
      </div>
    </form>
  );
};

export default SwapForm;
