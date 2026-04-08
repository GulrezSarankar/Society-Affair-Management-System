import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();

  if (authenticated) {
    let role = getUserRole();

    // 🔥 Safety: handle null/undefined + normalize role
    role = role?.toUpperCase();

    // 🔥 Redirect based on role
    switch (role) {
      case "ADMIN":
        return <Navigate to="/Admin-dashboard" replace />;
      case "USER":
        return <Navigate to="/Resident-dashboard" replace />;
      case "WATCHMAN":
        return <Navigate to="/watchman-dashboard" replace />;
      default:
        // If role unknown → logout for safety
        localStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }
  }

  // If NOT authenticated → allow access (login page etc.)
  return children;
};

export default PublicRoute;