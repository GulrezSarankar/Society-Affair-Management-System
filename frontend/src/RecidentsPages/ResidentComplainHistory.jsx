import React, { useEffect, useState } from "react";
import API from "../services/api";
import ResidentSidebar from "./components/ResidentSidebar";
import { Menu } from "lucide-react";

const ResidentComplaintHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/resident/my-complaints");
      setData(res.data.complaints); // ✅ FIX
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-600";
      case "IN_PROGRESS":
        return "text-blue-600";
      default:
        return "text-red-500";
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* SIDEBAR */}
      <ResidentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN */}
      <div className={`flex-1 ${isSidebarOpen ? "blur-sm lg:blur-none" : ""}`}>
        {/* MOBILE HEADER */}
        <div className="lg:hidden bg-white p-4 flex justify-between shadow">
          <h1 className="font-bold">My Complaints</h1>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu />
          </button>
        </div>

        <div className="p-6 lg:ml-64">
          <h1 className="text-2xl font-bold mb-6">Complaint History</h1>

          {loading ? (
            <p>Loading...</p>
          ) : data.length === 0 ? (
            <p>No complaints found</p>
          ) : (
            data.map((c) => (
              <div key={c.id} className="bg-white p-4 mb-4 rounded shadow">
                {/* IMAGE */}
                {c.image && (
                  <img
                    src={c.image}
                    alt="complaint"
                    className="w-40 h-40 object-cover mb-3 rounded"
                  />
                )}

                {/* INFO */}
                <h3 className="font-bold">{c.title}</h3>
                <p className="text-gray-600">{c.description}</p>

                {/* STATUS */}
                <p className={`mt-2 font-semibold ${getStatusColor(c.status)}`}>
                  Status: {c.status}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentComplaintHistory;
