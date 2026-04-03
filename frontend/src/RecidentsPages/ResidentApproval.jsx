import React, { useEffect, useState, useCallback } from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Phone,
  Info,
  RefreshCw,
  Clock,
  ShieldCheck,
  Menu
} from "lucide-react";
import API from "../services/api";
import ResidentSidebar from "./components/ResidentSidebar";

export default function ResidentVisitorApproval() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔥 FETCH VISITORS
  const fetchVisitors = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await API.get(`/watchman/my-requests/${user.id}`);
      setVisitors(res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 🔥 APPROVE / REJECT (ONLY ONE FUNCTION ✅)
  const respond = async (id, status) => {
    try {
      await API.put(`/watchman/respond/${id}?status=${status}`);
      fetchVisitors();
    } catch (err) {
      console.error("Response Error:", err);
      alert("Failed to update status");
    }
  };

  // 🔥 AUTO REFRESH
  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 5000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* SIDEBAR */}
      <ResidentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN */}
      <main className="flex-1 lg:ml-64">

        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu />
            </button>

            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-600" />
              <h1 className="font-bold">Gate Access</h1>
            </div>
          </div>

          <button onClick={fetchVisitors}>
            <RefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {/* CONTENT */}
        <div className="p-6 max-w-4xl mx-auto">

          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell className="text-blue-600" />
            Visitor Requests
          </h2>

          {/* LIST */}
          {visitors.length > 0 ? (
            visitors.map((v) => (
              <div key={v.id} className="bg-white p-4 mb-4 rounded shadow">

                <div className="flex justify-between items-center">

                  {/* INFO */}
                  <div>
                    <h3 className="font-bold text-lg">{v.name}</h3>

                    <p className="text-sm text-gray-500 flex gap-2">
                      <Phone size={14} /> {v.phone}
                    </p>

                    <p className="text-sm text-gray-500 flex gap-2">
                      <Info size={14} /> {v.purpose || "Visit"}
                    </p>
                  </div>

                  {/* ACTION */}
                  <div>

                    {v.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => respond(v.id, "REJECTED")}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => respond(v.id, "APPROVED")}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                      </div>
                    )}

                    {v.status === "APPROVED" && (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle2 size={16} /> Approved
                      </span>
                    )}

                    {v.status === "REJECTED" && (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle size={16} /> Rejected
                      </span>
                    )}

                  </div>
                </div>

                {/* TIME */}
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock size={12} />
                  {v.created_at
                    ? new Date(v.created_at).toLocaleString()
                    : "Just now"}
                </p>

              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No visitor requests
            </div>
          )}

        </div>
      </main>
    </div>
  );
}