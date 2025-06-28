import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) return setResults([]);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/search?name=${query}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
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
        placeholder="🔍 Search user by name..."
      />
      {results.length > 0 && (
        <ul className="bg-white shadow-md rounded mt-2 max-h-40 overflow-y-auto">
          {results.map((user) => (
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
              <span className="font-medium">{user.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;
