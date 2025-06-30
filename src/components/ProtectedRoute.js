import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) return <div>🔒 Checking authentication...</div>;

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
