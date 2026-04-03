// utils/auth.js

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };
  
  export const getUserRole = () => {
    return localStorage.getItem("role"); // optional (admin/resident/watchman)
  };