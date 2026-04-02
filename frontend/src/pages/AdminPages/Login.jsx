import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail, Eye, EyeOff, Building2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion"; // Add this for smooth animations
import API from "../../services/api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/Admin-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Left Side: Branding & Info (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900 rounded-full -ml-20 -mb-20 blur-3xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-white">
            <Building2 className="h-10 w-10 text-blue-300" />
            <span className="text-2xl font-bold tracking-tight">SocietySync Pro</span>
          </div>
        </div>

        <div className="relative z-10 text-white">
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Smart Living, <br /> 
            <span className="text-blue-300">Managed Effortlessly.</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-md">
            Join over 5,000+ communities managing maintenance, security, and notices through our unified digital portal.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-4 text-blue-200 text-sm">
          <div className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2"/> Secure Encryption</div>
          <div className="flex items-center"><Building2 className="h-4 w-4 mr-2"/> ISO Certified</div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-slate-800">Welcome Back</h3>
            <p className="text-slate-500 mt-2">Enter your credentials to access your society dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@society.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="remember" className="text-sm text-slate-600">Keep me signed in for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Access Dashboard"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm">
              New resident? <a href="#" className="text-blue-600 font-bold hover:underline">Request Access</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}