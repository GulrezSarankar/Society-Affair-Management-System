import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "./components/sidebar";
import {
  CheckCircle2,
  RefreshCw,
  Menu,
  ExternalLink,
  User,
  Clock,
  AlertCircle,
  Inbox,
  ChevronRight, // <--- ADD THIS LINE
  MoreVertical
} from "lucide-react";

const AdminComplaints = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Constants
  const BASE_URL = "http://127.0.0.1:8000";

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/complaints");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
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

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/auth/complaint/${id}?status=${status}`);
      fetchComplaints();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      RESOLVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
      IN_PROGRESS: "bg-blue-50 text-blue-600 border-blue-100",
      PENDING: "bg-amber-50 text-amber-600 border-amber-100"
    };
    return styles[status] || styles.PENDING;
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? "blur-sm lg:blur-none" : ""}`}>
        
        {/* MOBILE TOP BAR */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-lg">
          <span className="font-bold tracking-tight">SocietySync Admin</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Complaint Desk</h1>
              <p className="text-slate-500 font-medium mt-1">Review, manage, and resolve resident-reported issues.</p>
            </div>
            <button
              onClick={fetchComplaints}
              className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm w-fit"
            >
              <RefreshCw size={20} className={loading ? "animate-spin text-blue-600" : "text-slate-600"} />
              <span className="text-sm font-bold text-slate-700">Refresh Feed</span>
            </button>
          </div>

          {/* CONTENT GRID */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-[2rem]"></div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Inbox size={64} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">Inbox Clear</p>
              <p className="text-slate-400 text-sm mt-1">No active complaints found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {data.map((c) => (
                <div key={c.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden flex flex-col sm:flex-row">
                  
                  {/* LEFT: IMAGE SECTION */}
                  {c.image ? (
                    <div className="w-full sm:w-56 h-56 sm:h-auto relative overflow-hidden group border-r border-slate-50">
                      <img
                        src={`${BASE_URL}${c.image}`}
                        alt="complaint"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a href={`${BASE_URL}${c.image}`} target="_blank" rel="noreferrer" className="p-3 bg-white rounded-full text-slate-900 shadow-xl">
                          <ExternalLink size={20} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full sm:w-56 h-56 sm:h-auto bg-slate-50 flex flex-col items-center justify-center text-slate-300 border-r border-slate-50">
                       <AlertCircle size={40} strokeWidth={1.5} />
                       <span className="text-[10px] font-bold mt-2 uppercase tracking-widest">No Media</span>
                    </div>
                  )}

                  {/* RIGHT: DETAILS SECTION */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border tracking-widest uppercase ${getStatusBadge(c.status)}`}>
                          {c.status.replace("_", " ")}
                        </span>
                        <p className="text-[10px] font-bold text-slate-400">ID: #SYNC-{c.id}</p>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 truncate">{c.title}</h3>
                      <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Submitter Info */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <User size={14} />
                        </div>
                        <div className="text-[10px] leading-tight font-bold text-slate-400">
                          <p className="text-slate-900">{c.user?.name || "Unknown Resident"}</p>
                          <p className="truncate w-24 sm:w-32">{c.user?.email}</p>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="relative w-full sm:w-auto">
                        <select
                          value={c.status}
                          onChange={(e) => updateStatus(c.id, e.target.value)}
                          className="w-full sm:w-auto pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all cursor-pointer shadow-sm"
                        >
                          <option value="PENDING">Mark Pending</option>
                          <option value="IN_PROGRESS">Set In Progress</option>
                          <option value="RESOLVED">Set Resolved</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={14} />
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminComplaints;