import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import WatchmanSidebar from "./components/watchmensidebar";
import { 
  UserPlus, 
  User, 
  Phone, 
  MessageSquare, 
  Home, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Menu,
  ShieldCheck
} from "lucide-react";

export default function WatchmanAddVisitor() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    purpose: "",
    resident_id: ""
  });

  const fetchResidents = async () => {
    try {
      const res = await API.get("/watchman/residents");
      setResidents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch residents:", err);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.resident_id) {
      return; // Handled by HTML5 required
    }

    setLoading(true);
    try {
      await API.post("/watchman/add", form);
      navigate("/watchman/dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || "Entry failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <WatchmanSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? "blur-sm lg:blur-none" : ""}`}>
        
        {/* MOBILE TOP BAR */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="font-bold tracking-tight uppercase text-xs">Security Terminal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-12 max-w-2xl mx-auto">
          
          {/* HEADER */}
          <header className="mb-10 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
               <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-all"
               >
                 <ArrowLeft size={20} />
               </button>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">Visitor Registration</h1>
            </div>
            <p className="text-slate-500 font-medium">Log new entry details for society verification.</p>
          </header>

          {/* FORM CARD */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
              
              {/* VISITOR NAME */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Visitor Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    required
                    placeholder="Enter full name"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* PHONE NUMBER */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    required
                    type="tel"
                    placeholder="Phone number"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* PURPOSE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Purpose of Visit</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    required
                    placeholder="e.g., Courier, Guest, Maintenance"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800"
                    value={form.purpose}
                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  />
                </div>
              </div>

              {/* RESIDENT SELECTION */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assign to Resident</label>
                <div className="relative group">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <select
                    required
                    className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800 appearance-none cursor-pointer"
                    value={form.resident_id}
                    onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                  >
                    <option value="">Select Resident / Flat</option>
                    {residents.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} {r.flat ? `— Unit ${r.flat}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Register Entry <ArrowRight size={20} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-white border-2 border-slate-100 text-slate-400 font-bold py-4 rounded-2xl hover:border-rose-500 hover:text-rose-500 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>

              <div className="pt-4 text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                   Secure gate protocol active
                 </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}