import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "./components/sidebar";
import { 
  UserCheck, 
  UserX, 
  Mail, 
  Building, 
  Menu, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Inbox,
  ArrowRight
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, flatRes] = await Promise.all([
        API.get("/auth/pending-users"),
        API.get("/flats")
      ]);
      setUsers(userRes.data);
      setFlats(flatRes.data);
    } catch (err) {
      setError("Failed to sync with server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const approveUser = async (id, name) => {
    const flat_id = selectedFlats[id];
    if (!flat_id) {
      setError("Please select a flat assignment first.");
      return;
    }

    setActionLoading(id);
    try {
      await API.put(`/auth/approve-user/${id}?flat_id=${flat_id}`);
      setMessage(`Success: ${name} is now an active resident.`);
      fetchData();
    } catch (err) {
      setError("Approval process failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''}`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserCheck className="text-blue-400" size={24} />
            <span className="font-bold tracking-tight">SocietySync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg text-slate-400">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pending Requests</h1>
              <p className="text-slate-500 text-sm mt-1">Assign flats and authorize new society members.</p>
            </div>
            <button 
              onClick={fetchData}
              className="w-fit p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm flex items-center gap-2"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-blue-600" : ""} />
              <span className="hidden sm:inline font-medium text-slate-600">Refresh</span>
            </button>
          </div>

          {/* Toast Alerts */}
          <div className="fixed bottom-6 right-6 z-50 space-y-3 w-full max-w-xs px-4">
            {message && (
              <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                <CheckCircle size={20} /> <p className="text-xs font-bold">{message}</p>
              </div>
            )}
            {error && (
              <div className="bg-rose-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                <AlertCircle size={20} /> <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </div>

          {/* Approval Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-64 bg-slate-200/50 animate-pulse rounded-[2rem]" />)
            ) : users.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <Inbox size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No Pending Approvals</h3>
                <p className="text-slate-500 text-sm">New registrations will appear here.</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-900 truncate">{user.name}</h3>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                          <Mail size={12} /> <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Flat Assignment Dropdown */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assign Flat Assignment</label>
                      <div className="relative group">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                        <select
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                          value={selectedFlats[user.id] || ""}
                          onChange={(e) => setSelectedFlats({ ...selectedFlats, [user.id]: e.target.value })}
                        >
                          <option value="">Choose Unit...</option>
                          {flats.map((f) => (
                            <option key={f.id} value={f.id}>{f.flat_number} ({f.block} Block)</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => approveUser(user.id, user.name)}
                      disabled={actionLoading === user.id || !selectedFlats[user.id]}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {actionLoading === user.id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <>Authorize <ArrowRight size={16} /></>
                      )}
                    </button>
                    <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                      <UserX size={18} />
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