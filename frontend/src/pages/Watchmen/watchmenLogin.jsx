import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Building2,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";

export default function WatchmanLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/watchman/login", form);
      localStorage.setItem("token", res.data.access_token);
      
      // Navigate to watchman specific dashboard
      navigate("/watchman-dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid security credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      
      {/* --- LEFT SIDE: SECURITY HERO SECTION --- */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 lg:p-20 text-white">
        {/* Abstract Security Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-800/50 rounded-full blur-[80px] -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => navigate("/")}>
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight uppercase italic">Sync Guard</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
            Security & <br />
            <span className="text-blue-500">Access Control.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 max-w-md font-medium leading-relaxed">
            Authorized personnel portal for monitoring visitors, verifying residents, and maintaining society safety.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
           <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500"/> Secure Terminal</span>
           <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Live Auth</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50">
        <div className="w-full max-w-md">
          
          {/* Mobile-only Header */}
          <div className="md:hidden flex flex-col items-center mb-10 text-center">
             <div className="p-3 bg-slate-900 rounded-2xl shadow-xl mb-4 text-blue-500">
                <ShieldCheck size={28} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter italic">SocietySync Guard</h2>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Watchman Login</h2>
            <p className="text-slate-500 mt-2 font-medium">Verify your identity to access the security console.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl flex items-center gap-3 animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Officer Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="guard@society.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span>Sign In Terminal</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
             <ShieldCheck className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
             <p className="text-[11px] text-blue-700 font-medium leading-relaxed uppercase tracking-wider">
               Authorized Personnel Only. All login attempts are recorded for society surveillance and audit trails.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}