import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

// ✅ Use environment variable or fallback to local
const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

const ChatPage = () => {
  const { id: receiverId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    socket.emit("register", user._id);

    socket.on("private_message", ({ from, message }) => {
      if (from === receiverId) {
        setChatLog((prev) => [...prev, { from, message }]);
      }
    });

    return () => {
      socket.off("private_message");
    };
  }, [receiverId, user]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("private_message", {
      to: receiverId,
      from: user._id,
      message,
    });

    setChatLog((prev) => [...prev, { from: user._id, message }]);
    setMessage("");
  };

  const startVideoCall = () => {
    navigate("/video-call", {
      state: { receiverId },
    });
  };

  const startVoiceCall = () => {
    navigate("/voice-call", {
      state: { receiverId },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-indigo-700">💬 Live Chat</h2>
        <div className="flex gap-3">
          <button
            onClick={startVoiceCall}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm shadow transition duration-200"
          >
            🎧 Voice Call
          </button>
          <button
            onClick={startVideoCall}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow transition duration-200"
          >
            📹 Video Call
          </button>
        </div>
      </div>

      {/* Chat Box */}
      <div className="h-72 overflow-y-auto bg-gray-100 p-4 mb-5 rounded-lg shadow-inner">
        {chatLog.length === 0 ? (
          <p className="text-center text-gray-500 italic">Start chatting!</p>
        ) : (
          chatLog.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] mb-3 px-4 py-2 rounded-xl shadow-sm ${
                msg.from === user?._id
                  ? "ml-auto bg-blue-100 text-right"
                  : "mr-auto bg-gray-300 text-left"
              }`}
            >
              <p className="text-sm">
                <strong>{msg.from === user._id ? "You" : "Them"}:</strong> {msg.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-3">
        <textarea
          rows="3"
          className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow transition duration-200 self-end"
        >
          🚀 Send Message
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
