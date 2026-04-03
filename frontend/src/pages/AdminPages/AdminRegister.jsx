import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Building2, 
  ShieldCheck, 
  UserPlus,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  // 📝 Universal Input Handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 HANDLE REGISTER
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!form.name || !form.email || !form.password) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", form);
      alert("✅ Admin registered successfully");
      navigate("/Admin-Login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Left Side: Branding & Info (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900 rounded-full -ml-20 -mb-20 blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <Building2 className="h-10 w-10 text-blue-300" />
            <span className="text-2xl font-bold tracking-tight">Society Affair Management System</span>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold leading-tight mb-6 text-white">
            Start Managing <br /> 
            <span className="text-blue-300">Your Community.</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-md font-medium">
            Create an administrator account to set up your society, onboard residents, and automate maintenance workflows.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-4 text-blue-200 text-sm">
          <div className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2"/> Secure Admin Portal</div>
          <div className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-2"/> Instant Setup</div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        
        {/* --- BACK BUTTON --- */}
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
               <UserPlus className="text-blue-600" size={24} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Registration</h3>
            <p className="text-slate-500 mt-2 font-medium">Join us to streamline your society management.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none font-medium"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* EMAIL ADDRESS */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@society.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none font-medium"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white transition-all outline-none font-medium"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm font-medium">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/Admin-Login")} 
                className="text-blue-600 font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}