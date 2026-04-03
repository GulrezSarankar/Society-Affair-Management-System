import React, { useEffect, useState, useCallback } from "react";
import { 
  Menu, RefreshCw, Search, 
  CheckCircle, XCircle, Users, Activity
} from "lucide-react";
import API from "../../services/api";
import WatchmanSidebar from "./components/watchmensidebar";

export default function WatchmanDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH DATA
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Only fetching visitors now as residents are no longer needed for a form
      const res = await API.get("/watchman/all");
      setVisitors(res.data || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // UPDATE VISITOR STATUS (Approve/Deny)
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/watchman/update/${id}?status=${status}`);
      fetchData();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // CHECKOUT VISITOR
  const checkout = async (id) => {
    try {
      await API.put(`/watchman/checkout/${id}`);
      fetchData();
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  // FILTER LOGS
  const filteredVisitors = visitors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <WatchmanSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Gate Console</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Live</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search logs..."
                className="bg-slate-100 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchData} 
              disabled={loading}
              className={`p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 transition-all shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* STATS SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard 
              icon={<Users className="text-blue-600" />} 
              label="Currently Inside" 
              value={visitors.filter(v => v.status === "APPROVED" && !v.check_out).length} 
            />
            <StatCard 
              icon={<Activity className="text-amber-600" />} 
              label="Awaiting Approval" 
              value={visitors.filter(v => v.status === "PENDING").length} 
            />
            <StatCard 
              icon={<CheckCircle className="text-emerald-600" />} 
              label="Total Activity (Today)" 
              value={visitors.length} 
            />
          </div>

          {/* ENTRY LOG TABLE */}
          <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Security Entry Logs</h2>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Live Monitoring</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="p-5">Visitor Information</th>
                    <th className="p-5">Resident / Flat</th>
                    <th className="p-5 text-center">Status</th>
                    <th className="p-5 text-right">Gate Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVisitors.length > 0 ? (
                    filteredVisitors.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-5 text-sm font-bold text-slate-700">
                          {v.name} 
                          <div className="text-[10px] text-slate-400 font-normal">{v.phone}</div>
                        </td>
                        <td className="p-5 text-sm font-bold text-slate-700">
                          {v.resident_name || "N/A"} 
                          <div className="text-[10px] text-slate-400 font-normal italic">{v.purpose || "General Visit"}</div>
                        </td>
                        <td className="p-5 text-center">
                          <StatusBadge status={v.status} />
                        </td>
                        <td className="p-5 text-right">
                          {v.status === "PENDING" ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => updateStatus(v.id, "APPROVED")} 
                                className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                              >
                                Allow
                              </button>
                              <button 
                                onClick={() => updateStatus(v.id, "REJECTED")} 
                                className="bg-rose-50 text-rose-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                              >
                                Deny
                              </button>
                            </div>
                          ) : v.status === "APPROVED" && !v.check_out ? (
                            <button 
                              onClick={() => checkout(v.id)} 
                              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all"
                            >
                              Confirm Checkout
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase italic">
                              {v.check_out ? "Exited" : "No Action Required"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-slate-400 text-sm italic font-medium">
                        No entry logs found matching your search.
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

// UI HELPER COMPONENTS
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 shadow-sm">
    <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
};