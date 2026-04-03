import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    const role = getUserRole();

    // Redirect based on role
    if (role === "admin") return <Navigate to="/Admin-dashboard" replace />;
    if (role === "resident") return <Navigate to="/Resident-dashboard" replace />;
    if (role === "watchman") return <Navigate to="/watchman-dashboard" replace />;

    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;