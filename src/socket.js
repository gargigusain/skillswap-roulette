// socket.js
import { io } from "socket.io-client";

// ✅ Replace with your backend URL or use environment variable
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ✅ Create socket instance
const socket = io(API_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // Connect manually when needed (e.g., after login)
});

// ✅ Export the socket for use across components
export default socket;
