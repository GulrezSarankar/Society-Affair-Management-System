import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      await API.post("/auth/send-otp", { email });

      alert("OTP sent to email 📧");

      navigate("/verify", { state: { email } });
    } catch (err) {
      alert("User not found ❌");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-full mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSendOTP}
        className="bg-blue-500 text-white px-4 py-2 w-full"
      >
        Send OTP
      </button>
    </div>
  );
}

export default ForgotPassword;