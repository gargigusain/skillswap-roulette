import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// SkillSwap Pages
import CreateSwap from "./pages/CreateSwap";
import BrowseSwaps from "./pages/BrowseSwaps";
import EditSwap from "./pages/EditSwap";
import ChatPage from "./pages/ChatPage"; // ✅ Chat Page restored
import VideoCall from "./pages/VideoCall"; // ✅ Video Call Page
import VoiceCall from "./pages/VoiceCall"; // ✅ Import voice call
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-swap"
          element={
            <ProtectedRoute>
              <CreateSwap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse-swaps"
          element={
            <ProtectedRoute>
              <BrowseSwaps />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-swap/:id"
          element={
            <ProtectedRoute>
              <EditSwap />
            </ProtectedRoute>
          }
        />

        {/* ✅ Chat Page (Dynamic ID) */}
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Video Call Page */}
        <Route
          path="/video-call"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />

        <Route
        path="/voice-call"
        element={
        <ProtectedRoute>
          <VoiceCall />
          </ProtectedRoute>
        }
/>
      </Routes>


      {/* ✅ Global Toasts */}
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
