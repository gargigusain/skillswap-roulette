// components/Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await axios.get(
        `${API_URL}/api/users/search?name=${encodeURIComponent(searchQuery)}`
      );
      setResults(res.data);
    } catch (err) {
      console.error("❌ Search error:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const startChat = (userId) => {
    setSearchQuery("");
    setResults([]);
    navigate(`/chat/${userId}`);
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div className="flex flex-wrap gap-5 items-center">
        <Link to="/" className="hover:text-indigo-600 font-semibold">
          🏠 Home
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="hover:text-indigo-600 font-semibold">
              📊 Dashboard
            </Link>
            <Link to="/create-swap" className="hover:text-indigo-600 font-semibold">
              ✍️ Create
            </Link>
            <Link to="/browse-swaps" className="hover:text-indigo-600 font-semibold">
              🔍 Browse
            </Link>
            <Link
              to={`/chat/${user?._id}`}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm shadow hover:bg-indigo-700"
            >
              💬 Chat
            </Link>
          </>
        )}
      </div>

      {isLoggedIn && (
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1.5 text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
          >
            Search
          </button>

          {results.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white border rounded shadow-md z-50 max-h-48 overflow-y-auto">
              {results.map((user) => (
                <div
                  key={user._id}
                  onClick={() => startChat(user._id)}
                  className="p-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={user?.photo || "https://via.placeholder.com/40"}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">
                    {user.username || user.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:underline"
          >
            🔓 Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-600 font-semibold">
              🔐 Login
            </Link>
            <Link to="/signup" className="hover:text-indigo-600 font-semibold">
              📝 Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
