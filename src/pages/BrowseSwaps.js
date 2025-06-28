import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BrowseSwaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://skillswap-backend.onrender.com";

  const fetchSwaps = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/swaps`, {
        headers: {
          Authorization: token,
        },
      });

      const data = await res.json();
      if (res.ok) setSwaps(data);
      else toast.error(data.message || "Unauthorized");
    } catch (err) {
      console.error("Failed to fetch swaps", err);
      toast.error("Could not fetch swaps");
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this swap?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/swaps/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (res.ok) {
        setSwaps(swaps.filter((s) => s._id !== id));
        toast.success("Swap deleted successfully");
      } else {
        toast.error("Failed to delete swap");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting swap");
    }
  };

  const filteredSwaps = swaps.filter((swap) =>
    swap.skillWanted.toLowerCase().includes(filter.toLowerCase())
  );

  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-6xl mx-auto mt-12 p-6">
      <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
        🔄 Discover & Connect with Skill Swappers
      </h2>

      <div className="mb-10">
        <input
          type="text"
          placeholder="🔍 Search by skill wanted..."
          className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filteredSwaps.length === 0 ? (
        <p className="text-center text-gray-500 italic">No swaps found for that skill.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSwaps.map((swap) => {
            const isOwner = currentUser?.id === swap.user._id;

            return (
              <div
                key={swap._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 border border-gray-100"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">
                    👤 {swap.user.username}
                  </h3>
                  <span className="text-sm text-indigo-500">📧 {swap.user.email}</span>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-3 py-1 rounded-full">
                    Offering: {swap.skillOffered}
                  </span>
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Wants: {swap.skillWanted}
                  </span>
                </div>

                {swap.description && (
                  <p className="text-sm text-gray-600 italic mb-4">
                    "{swap.description}"
                  </p>
                )}

                {isOwner && (
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => navigate(`/edit-swap/${swap._id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-lg transition duration-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(swap._id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseSwaps;
