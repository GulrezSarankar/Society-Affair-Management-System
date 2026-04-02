import { useState, useEffect } from "react";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Building, 
  ArrowLeft, 
  Loader2, 
  RefreshCw, 
  User, 
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import API from "../../services/api";

export default function AddResident() {
  const navigate = useNavigate();
  
  // State for responsive sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    flat_id: "",
  });

  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFlats, setFetchingFlats] = useState(true);

  const fetchFlats = async () => {
    try {
      const res = await API.get("/flats/");
      setFlats(res.data);
    } catch (err) {
      console.error("Error fetching flats:", err);
    } finally {
      setFetchingFlats(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: name === "flat_id" ? Number(value) : value 
    }));
  };

  const generatePassword = () => {
    const randomPass = Math.random().toString(36).slice(-8);
    setForm((prev) => ({ ...prev, password: randomPass }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/add-resident", form);
      alert("✅ Resident onboarded successfully!");
      navigate("/residents"); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Connection failed";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 1. Responsive Sidebar Logic */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. Main Content Wrapper */}
      <main className={`flex-1 transition-all duration-300 lg:ml-64 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''}`}>
        
        {/* Mobile Navbar */}
        <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-400" />
            <span className="font-bold tracking-tight">SocietySync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
            <Menu size={20} />
          </button>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12">
          
          {/* Back Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-500 hover:text-blue-600 transition-all font-semibold text-sm"
            >
              <ArrowLeft size={18} className="mr-2" />
              Directory
            </button>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 w-fit">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Admin Secured</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            
            {/* Header Section */}
            <div className="bg-slate-900 p-8 md:p-12 text-white relative">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                <div className="p-5 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-500/20">
                  <UserPlus size={36} strokeWidth={2} />
                </div>
                <div className="mt-2">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight">New Resident</h2>
                  <p className="text-slate-400 mt-2 font-medium">Register a society member to the digital portal.</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                
                {/* Input Component Wrapper */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      name="name"
                      required
                      placeholder="e.g. Gulrez Sarankar"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="resident@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Access Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      name="password"
                      required
                      value={form.password}
                      placeholder="Click refresh to generate"
                      className="w-full pl-12 pr-14 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800"
                      onChange={handleChange}
                    />
                    <button 
                      type="button"
                      onClick={generatePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-blue-50 p-2.5 rounded-xl transition-all"
                    >
                      <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Unit Assignment</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <select
                      name="flat_id"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none appearance-none transition-all cursor-pointer text-slate-800"
                      onChange={handleChange}
                    >
                      <option value="">{fetchingFlats ? "Fetching Units..." : "Choose a Flat"}</option>
                      {flats.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.flat_number} — {f.block} Block
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || fetchingFlats}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-5 rounded-[1.5rem] transition-all shadow-xl shadow-blue-500/30 active:scale-[0.97] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-6 w-6" />
                  ) : (
                    "Complete Onboarding"
                  )}
                </button>
                <p className="mt-6 text-center text-slate-400 text-[11px] font-semibold uppercase tracking-widest">
                  Account becomes active instantly after creation
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}