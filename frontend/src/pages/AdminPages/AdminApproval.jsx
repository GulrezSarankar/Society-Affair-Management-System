import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "./components/sidebar";
import { 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Building, 
  Menu, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Inbox,
  ArrowRight,
  Loader2,
  UserCog
} from "lucide-react";

const AdminApproval = () => {
  const [users, setUsers] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedFlats, setSelectedFlats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --- 1. DATA SYNC (Combined Fetch) ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [residents, watchmen, flatRes] = await Promise.all([
        API.get("/auth/pending-users"),
        API.get("/auth/pending-watchmen"),
        API.get("/flats"),
      ]);

      // Merge both types of pending staff into one queue
      setUsers([...residents.data, ...watchmen.data]);
      setFlats(flatRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Connection lost. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. NOTIFICATION AUTO-HIDE ---
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // --- 3. APPROVAL LOGIC ---
  const approveUser = async (user) => {
    const flat_id = selectedFlats[user.id];

    // Resident-specific validation
    if (user.role === "RESIDENT" && !flat_id) {
      setError(`Unit assignment required for ${user.name}`);
      return;
    }

    setActionLoading(user.id);

    try {
      // Dynamic URL based on role
      const url = user.role === "RESIDENT"
          ? `/auth/approve-user/${user.id}?flat_id=${flat_id}`
          : `/auth/approve-user/${user.id}`;

      await API.put(url);
      
      setMessage(`Success: ${user.name} (${user.role}) is now authorized.`);
      
      // Remove from list locally
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err.response?.data?.detail || "Authorization failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''}`}>
        
        {/* MOBILE HEADER */}
        <div className="lg:hidden bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-400" size={24} />
            <span className="font-bold tracking-tight uppercase text-xs">Security Desk</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10">
          
          {/* HEADER SECTION */}
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Staff & Resident Queue</h1>
              <p className="text-slate-500 font-medium mt-1">Manage system access for society members and security personnel.</p>
            </div>
            <button 
              onClick={fetchData}
              className="w-fit p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 text-slate-600 font-bold text-sm"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-blue-600" : ""} />
              Refresh Feed
            </button>
          </header>

          {/* FLOATING ALERTS */}
          <div className="fixed bottom-10 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 z-50 space-y-4 w-full max-w-xs px-6 md:px-0">
            {message && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 border-l-4 border-emerald-500">
                <CheckCircle className="text-emerald-500 flex-shrink-0" size={20} />
                <p className="text-xs font-bold">{message}</p>
              </div>
            )}
            {error && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 border-l-4 border-rose-500">
                <AlertCircle className="text-rose-500 flex-shrink-0" size={20} />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </div>

          {/* USER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-white border border-slate-200 rounded-[2.5rem] animate-pulse" />
              ))
            ) : users.length === 0 ? (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-slate-100 rounded-full text-slate-300 mb-6">
                  <Inbox size={64} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">System Queue is Clear</h3>
                <p className="text-slate-500 max-w-xs mt-2 font-medium text-sm">All registration requests have been processed.</p>
              </div>
            ) : (
              users.map((user) => (
                <div 
                  key={user.id} 
                  className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all overflow-hidden flex flex-col group"
                >
                  {/* ROLE BADGE & AVATAR */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                       <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          {user.role === "RESIDENT" ? <Building size={28} /> : <ShieldCheck size={28} />}
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                          user.role === "RESIDENT" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-purple-50 text-purple-600 border-purple-100"
                       }`}>
                          {user.role}
                       </span>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 truncate text-lg leading-tight">{user.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1 font-medium">
                      <Mail size={12} /> <span className="truncate">{user.email}</span>
                    </div>
                  </div>

                  {/* CONDITIONAL ASSIGNMENT AREA */}
                  <div className="px-6 py-4 flex-1">
                    {user.role === "RESIDENT" ? (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Flat Assignment</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <select
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none appearance-none transition-all cursor-pointer text-slate-700"
                            value={selectedFlats[user.id] || ""}
                            onChange={(e) => setSelectedFlats({ ...selectedFlats, [user.id]: e.target.value })}
                          >
                            <option value="">Select Unit...</option>
                            {flats.map((f) => (
                              <option key={f.id} value={f.id}>{f.flat_number} ({f.block} Block)</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                        <UserCog size={20} className="text-purple-500" />
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Staff roles do not require flat assignments. Verify identification before approval.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                    <button
                      onClick={() => approveUser(user)}
                      disabled={actionLoading === user.id}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <>Grant Authorization <ArrowRight size={18} /></>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminApproval;