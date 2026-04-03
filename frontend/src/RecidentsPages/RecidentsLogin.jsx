import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  Loader2,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft // Added for the back button
} from "lucide-react";

function ResidentsLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const res = await API.post("/resident/login", form); 
  
      localStorage.setItem("token", res.data.access_token);
  
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
  
      navigate("/Resident-dashboard");
  
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      
      {/* --- LEFT SIDE: HERO SECTION (Hidden on mobile) --- */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12 lg:p-20 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>

        <div className="relative z-10">
          {/* Logo - Clickable to go home */}
          <div className="flex items-center gap-3 mb-12 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Building2 size={32} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight">Society Affair Management System</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
            Smart Living, <br />
            <span className="text-blue-200">Managed Effortlessly.</span>
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 max-w-md font-medium leading-relaxed">
            Join over 5,000+ communities managing maintenance, security, and notices through our unified digital portal.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm font-bold text-blue-200 uppercase tracking-widest">
           <span className="flex items-center gap-2"><ShieldCheck size={16}/> Secure Encryption</span>
           <span className="flex items-center gap-2"><CheckCircle2 size={16}/> ISO Certified</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 relative">
        
        {/* 🔥 BACK BUTTON */}
        <button 
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="w-full max-w-md">
          
          {/* Mobile-only Logo */}
          <div className="md:hidden flex flex-col items-center mb-10 text-center cursor-pointer" onClick={() => navigate("/")}>
             <div className="p-3 bg-blue-600 rounded-2xl shadow-xl mb-4">
                <Building2 className="text-white" size={28} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 tracking-tighter italic">SocietySync</h2>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Enter your credentials to access your society dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl flex items-center gap-3">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@society.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button 
                  type="button"
                  onClick={() => navigate("/forgot")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
               <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
               <label htmlFor="remember" className="text-sm text-slate-500 font-medium cursor-pointer">Keep me signed in for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-sm text-slate-500 font-medium">
               New resident? <button onClick={() => navigate("/register")} className="text-blue-600 font-bold hover:underline">Register</button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResidentsLogin;