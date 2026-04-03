import { useState } from "react";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  // 🔥 VERIFY OTP
  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
  
    try {
      setLoading(true);
  
      await API.post("/resident/verify-otp", {   // ✅ FIX endpoint also
        email,
        otp
      });
  
      alert("Account verified successfully ✅");
  
      // 👉 Go to login page
      navigate("/login");
  
    } catch (err) {
      console.error(err);
      alert("Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 RESEND OTP
  const handleResend = async () => {
    try {
      await API.post("/auth/send-otp", { email });
      alert("OTP resent 📧");
    } catch (err) {
      alert("Error resending OTP ❌");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 mb-3 text-center">
          OTP sent to <b>{email}</b>
        </p>

        {/* OTP INPUT */}
        <input
          type="text"
          placeholder="Enter OTP"
          className="border p-2 w-full mb-4 rounded text-center tracking-widest"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {/* VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded mb-3"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* RESEND */}
        <p className="text-center text-sm">
          Didn’t receive OTP?{" "}
          <span
            onClick={handleResend}
            className="text-blue-500 cursor-pointer"
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;