import React, { useEffect, useState, useCallback } from "react";
import { 
    Search, 
    RefreshCw, 
    Calendar, 
    User, 
    Clock, 
    FileText,
    Menu,
    LogOut // <--- ADD THIS LINE
  } from "lucide-react";
import API from "../../services/api";
import WatchmanSidebar from "./components/watchmensidebar";// Import your common sidebar

export default function WatchmanVisitorHistory() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔄 FETCH VISITORS
  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/watchman/all");
      setVisitors(res.data || []);
    } catch (err) {
      console.error("History Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // 🕒 DATE FORMATTER HELPER
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔍 FILTER LOGIC
  const filtered = visitors.filter(
    (v) =>
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.resident_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.phone?.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* 1. SIDEBAR */}
      <WatchmanSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Entry History</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Permanent Records</p>
            </div>
          </div>

          <button 
            onClick={fetchVisitors} 
            className={`p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 shadow-sm transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">

          {/* --- SEARCH & FILTERS --- */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by visitor name, phone, or resident..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
              <FileText size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{filtered.length} Records</span>
            </div>
          </div>

          {/* --- HISTORY TABLE --- */}
          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="p-5">Visitor Details</th>
                    <th className="p-5">Resident / Purpose</th>
                    <th className="p-5 text-center">Timing (In/Out)</th>
                    <th className="p-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length > 0 ? (
                    filtered.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                        
                        {/* Visitor Info */}
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              <User size={18} />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{v.name}</div>
                              <div className="text-xs text-slate-400">{v.phone}</div>
                            </div>
                          </div>
                        </td>

                        {/* Resident Info */}
                        <td className="p-5">
                          <div className="text-sm font-bold text-slate-700">{v.resident_name || "—"}</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-tight italic">
                            {v.purpose || "General Visit"}
                          </div>
                        </td>

                        {/* Timing */}
                        <td className="p-5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 w-fit">
                              <Clock size={12} /> {formatDateTime(v.check_in)}
                            </div>
                            {v.check_out && (
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 w-fit">
                                <LogOut size={12} /> {formatDateTime(v.check_out)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-5 text-center">
                          <StatusBadge status={v.status} />
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <Calendar size={48} />
                          <p className="font-black uppercase tracking-widest text-xs">No records found matching search</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENT: STATUS BADGE ---
const StatusBadge = ({ status }) => {
  const styles = {
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-tighter ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};