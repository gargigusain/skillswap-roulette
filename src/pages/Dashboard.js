import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../socket"; // ✅ Import shared socket

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [swaps, setSwaps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatSwap, setChatSwap] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ No token found in localStorage");
      return navigate("/login");
    }

    // Fetch user data
    fetch(`${API_URL}/api/auth/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const text = await res.text();
        console.log("📡 Dashboard fetch status:", res.status);
        console.log("📥 Raw response text:", text);

        let data = {};
        try {
          data = JSON.parse(text);
        } catch {
          console.warn("⚠️ Failed to parse JSON");
        }

        if (res.ok && (data?.username || data?.name)) {
          setUser({
            ...data,
            username: data.username || data.name,
          });
          socket.emit("register", data._id); // ✅ Register socket
        } else {
          console.warn("❌ Invalid or expired token — logging out");
          handleLogout();
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching dashboard:", err);
        handleLogout();
      });

    // Fetch skill swaps
    fetch(`${API_URL}/api/swaps`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSwaps(data))
      .catch((err) => console.error("❌ Error fetching swaps:", err));
  }, [navigate]);

  useEffect(() => {
    const messageHandler = ({ from, message }) => {
      setMessages((prev) => [
        ...prev,
        { from, message, direction: "incoming" },
      ]);
    };

    socket.on("private_message", messageHandler);
    return () => socket.off("private_message", messageHandler);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (chatSwap) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [chatSwap]);

  const sendMessage = () => {
    const from = user._id;
    const to = chatSwap?.user?._id;

    if (!chatMessage.trim()) return;

    socket.emit("private_message", { to, from, message: chatMessage });

    setMessages((prev) => [
      ...prev,
      { from, message: chatMessage, direction: "outgoing" },
    ]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2">🎯 Dashboard</h1>
        {user ? (
          <div className="text-gray-700">
            <p>Welcome, <strong>{user.username}</strong></p>
            <p className="text-sm">📧 {user.email}</p>
            <p className="text-xs text-gray-500">ID: {user._id}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-left">💡 Skill Swaps</h2>

        <input
          type="text"
          placeholder="🔍 Search skill offered or wanted..."
          className="mb-6 px-4 py-2 border rounded w-full max-w-xl shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />

        <ul className="space-y-6">
          {swaps
            .filter(
              (swap) =>
                swap.skillOffered.toLowerCase().includes(searchTerm) ||
                swap.skillWanted.toLowerCase().includes(searchTerm)
            )
            .map((swap, index) => (
              <motion.li
                key={swap._id}
                className="border p-5 rounded-xl shadow bg-white flex items-start gap-4 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">
                  {swap.user?.username
                    ? getInitials(swap.user.username)
                    : "?"}
                </div>

                <div className="flex-1 text-left">
                  <p><strong>Offered:</strong> {swap.skillOffered}</p>
                  <p><strong>Wanted:</strong> {swap.skillWanted}</p>
                  {swap.description && <p><strong>Description:</strong> {swap.description}</p>}
                  <p><strong>Posted By:</strong> {swap.user?.username || swap.user?.name}</p>
                  <p className="text-xs text-gray-500">
                    <strong>User ID:</strong> {swap.user?._id}
                  </p>

                  <button
                    onClick={() => {
                      setChatSwap(swap);
                      setMessages([]);
                    }}
                    className="mt-3 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    💬 Let’s Connect
                  </button>
                </div>
              </motion.li>
            ))}
        </ul>
      </div>

      {/* 💬 Chat Modal */}
      <AnimatePresence>
        {chatSwap && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <h3 className="text-xl font-bold mb-4 text-indigo-700 text-center">
                💬 Chat with {chatSwap.user?.username || chatSwap.user?.name}
              </h3>

              <div className="max-h-64 overflow-y-auto border rounded p-3 bg-gray-100 mb-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 my-1 rounded text-sm max-w-[75%] ${
                      msg.direction === "incoming"
                        ? "bg-gray-300 text-left"
                        : "bg-indigo-100 text-right ml-auto"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <textarea
                rows={2}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message and press Enter..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setChatSwap(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
