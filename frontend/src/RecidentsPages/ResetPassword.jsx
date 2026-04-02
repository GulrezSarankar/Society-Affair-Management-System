import { useState } from "react";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleReset = async () => {
    try {
      await API.post("/auth/reset-password", {
        email,
        new_password: password
      });

      alert("Password updated successfully 🔐");

      navigate("/");
    } catch (err) {
      alert("Error resetting password ❌");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        className="border p-2 w-full mb-3"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleReset}
        className="bg-purple-500 text-white px-4 py-2 w-full"
      >
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;