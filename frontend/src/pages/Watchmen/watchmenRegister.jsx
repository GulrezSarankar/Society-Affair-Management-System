import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function WatchmanRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/watchman/register", form);

      alert("OTP sent to email 📧");

      navigate("/watchman/verify", {
        state: { email: form.email }
      });

    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          Watchman Register
        </h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}