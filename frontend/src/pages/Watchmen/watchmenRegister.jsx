import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import API from "../../services/api";

export default function WatchmanRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await API.post("/watchman/register", form);

      alert("OTP sent to email 📧");

      // Navigating to verify page (matching your route naming)
      navigate("/watchmen-verify", {
        state: { email: form.email }
      });

    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans text-slate-900">
      
      {/* --- LEFT SIDE: SECURITY BRANDING --- */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 lg:p-20 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight uppercase italic text-white">Society Affair Management System</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
            Join the <br />
            <span className="text-blue-500">Security Team.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 max-w-md font-medium leading-relaxed">
            Create your officer account to begin managing gate access, visitor logs, and society safety protocols.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
           <span className="flex items-center gap-2 text-slate-300"><CheckCircle2 size={16} className="text-blue-500"/> Official Enrollment</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: REGISTRATION FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 relative">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/watchmen-login")}
          className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl text-blue-600 mb-4">
              <UserPlus size={28} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Officer Registration</h2>
            <p className="text-slate-500 mt-2 font-medium">Please enter your details to request system access.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Officer Name"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                  value={form.name}
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
                  name="email"
                  type="email"
                  required
                  placeholder="guard@society.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Create Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span>Register Account</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/watchmen-login")} 
                className="text-blue-600 font-bold hover:underline"
              >
                Sign In here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}