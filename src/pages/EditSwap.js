import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditSwap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    skillOffered: "",
    skillWanted: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSwap = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/swaps/${id}`, {
          headers: { Authorization: token },
        });

        const data = await res.json();
        if (res.ok) {
          setForm({
            skillOffered: data.skillOffered,
            skillWanted: data.skillWanted,
            description: data.description || "",
          });
        } else {
          toast.error("Failed to fetch swap");
          navigate("/browse-swaps");
        }
      } catch (err) {
        toast.error("Something went wrong");
        navigate("/browse-swaps");
      } finally {
        setLoading(false);
      }
    };

    fetchSwap();
  }, [id, navigate, API_URL]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/swaps/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Swap updated!");
        navigate("/browse-swaps");
      } else {
        toast.error(data.message || "Failed to update swap");
      }
    } catch (err) {
      toast.error("Error updating swap");
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">✏️ Edit Skill Swap</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="skillOffered"
          placeholder="Skill you offer"
          value={form.skillOffered}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="skillWanted"
          placeholder="Skill you want"
          value={form.skillWanted}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          name="description"
          placeholder="Short description (optional)"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={5}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          💾 Update Swap
        </button>
      </form>
    </div>
  );
};

export default EditSwap;
