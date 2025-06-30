// components/SearchUsers.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) return setResults([]);

      try {
        const res = await axios.get(
          `${API_URL}/api/users/search?name=${encodeURIComponent(query)}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("❌ Search error:", err);
        setResults([]);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="mb-6 w-full max-w-md mx-auto">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="🔍 Search users by name..."
      />

      {query.trim() && (
        <ul className="bg-white shadow-md rounded mt-2 max-h-40 overflow-y-auto">
          {results.length > 0 ? (
            results.map((user) => (
              <li
                key={user._id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                onClick={() => navigate(`/chat/${user._id}`)}
              >
                <img
                  src={user.photo || "https://via.placeholder.com/40"}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">
                  {user.username || user.name}
                </span>
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500 italic text-sm">
              No users found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;
