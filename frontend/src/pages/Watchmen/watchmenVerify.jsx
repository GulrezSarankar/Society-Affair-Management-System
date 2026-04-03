import { useState } from "react";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function WatchmanVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      await API.post("/watchman/verify-otp", {
        email,
        otp
      });

      alert("OTP Verified ✅");

      navigate("/watchman/login");

    } catch (err) {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          Verify OTP
        </h2>

        <input
          placeholder="Enter OTP"
          className="border p-2 w-full mb-3 text-center"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}