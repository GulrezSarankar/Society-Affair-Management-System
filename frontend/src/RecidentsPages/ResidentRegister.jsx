import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  Loader2,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

const ResidentRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/resident/register", form);
      // Redirect to verify page with email state
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      
      {/* --- LEFT SIDE: HERO SECTION (Branding) --- */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12 lg:p-20 text-white">
        {/* Abstract Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => navigate("/")}>
            <Building2 size={32} strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight">SocietySync Pro</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
            Start Your <br />
            <span className="text-blue-200">Digital Journey.</span>
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 max-w-md font-medium leading-relaxed">
            Create your account to access maintenance records, society notices, and digital amenities.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm font-bold text-blue-200 uppercase tracking-widest">
           <span className="flex items-center gap-2"><ShieldCheck size={16}/> Secure Data</span>
           <span className="flex items-center gap-2"><CheckCircle2 size={16}/> Verified Access</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: REGISTER FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50">
        <div className="w-full max-w-md">
          
          {/* Mobile-only Logo */}
          <div className="md:hidden flex flex-col items-center mb-10 text-center">
             <div className="p-3 bg-blue-600 rounded-2xl shadow-xl mb-4">
                <Building2 className="text-white" size={28} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900">SocietySync</h2>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Join your society's digital community today.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl flex items-center gap-3 animate-pulse">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          <form onSubmit={register} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Gulrez Sarankar"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Official Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@gmail.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Min. 8 characters"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Register Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-sm text-slate-500 font-medium">
               Already have an account? <button onClick={() => navigate("/login")} className="text-blue-600 font-bold hover:underline">Sign In</button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentRegister;