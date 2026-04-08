import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Phone,
  Info,
  RefreshCw,
  Clock,
  ShieldCheck,
  Menu,
  UserPlus
} from "lucide-react";
import API from "../services/api";
import ResidentSidebar from "./components/ResidentSidebar";

export default function ResidentVisitorApproval() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Use a ref for the interval to clean it up properly
  const pollingRef = useRef(null);

  // Safely get user data
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  // --- FETCH VISITORS ---
  const fetchVisitors = useCallback(async (showLoader = false) => {
    if (!user?.id) return;
    if (showLoader) setLoading(true);

    try {
      const res = await API.get(`/watchman/my-requests/${user.id}`);
      setVisitors(res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // --- RESPOND (With Optimistic UI) ---
  const respond = async (id, status) => {
    // 1. Store previous state for rollback
    const previousVisitors = [...visitors];

    // 2. Optimistically update the UI
    setVisitors(prev =>
      prev.map(v => (v.id === id ? { ...v, status: status } : v))
    );

    try {
      await API.put(`/watchman/respond/${id}?status=${status}`);
      // Optional: fetchVisitors() to sync with server time
    } catch (err) {
      console.error("Response Error:", err);
      alert("Failed to update status. Please try again.");
      // 3. Rollback on failure
      setVisitors(previousVisitors);
    }
  };

  // --- POLLING LOGIC ---
  useEffect(() => {
    fetchVisitors(true);

    pollingRef.current = setInterval(() => {
      // Only fetch if the tab is actually active/visible
      if (document.visibilityState === "visible") {
        fetchVisitors();
      }
    }, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchVisitors]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <ResidentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64">
        
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={28} />
              <h1 className="font-bold text-xl tracking-tight text-slate-800">Gate Access</h1>
            </div>
          </div>

          <button 
            onClick={() => fetchVisitors(true)}
            className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90"
            disabled={loading}
          >
            <RefreshCw className={`${loading ? "animate-spin text-blue-600" : "text-slate-500"}`} size={20} />
          </button>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Bell className="text-blue-600" size={20} />
              Incoming Requests
            </h2>
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              Live Updates Active
            </span>
          </div>

          {/* VISITOR LIST */}
          {visitors.length > 0 ? (
            <div className="space-y-4">
              {visitors.map((v) => (
                <div 
                  key={v.id} 
                  className={`bg-white p-5 rounded-xl shadow-sm border-l-4 transition-all ${
                    v.status === 'PENDING' ? 'border-amber-400' : 
                    v.status === 'APPROVED' ? 'border-green-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    {/* VISITOR INFO */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-slate-800">{v.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} className="text-slate-400" /> {v.phone}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Info size={14} className="text-slate-400" /> {v.purpose || "General Visit"}
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS / STATUS */}
                    <div className="w-full sm:w-auto">
                      {v.status === "PENDING" ? (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => respond(v.id, "REJECTED")}
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                          >
                            Deny
                          </button>
                          <button
                            onClick={() => respond(v.id, "APPROVED")}
                            className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-shadow shadow-md active:shadow-none"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-full ${
                          v.status === "APPROVED" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                        }`}>
                          {v.status === "APPROVED" ? (
                            <><CheckCircle2 size={18} /> Approved</>
                          ) : (
                            <><XCircle size={18} /> Rejected</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FOOTER INFO */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-xs text-slate-400">
                    <Clock size={12} className="mr-1" />
                    <span>Requested: {v.created_at ? new Date(v.created_at).toLocaleTimeString() : "Just now"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <UserPlus size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No visitor requests at the moment.</p>
              <p className="text-slate-400 text-sm">New requests will appear here automatically.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}