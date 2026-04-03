import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Fingerprint
} from "lucide-react";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email address");

    setLoading(true);
    try {
      await API.post("/resident/send-otp", { email });

      alert("Security code sent to your email 📧");

      // Navigate to the OTP verification page
      navigate("/verify", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.detail || "User not found or connection error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans text-slate-900">
      
      {/* --- LEFT SIDE: HERO SECTION (Hidden on mobile) --- */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12 lg:p-20 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight">Society Affair Management System</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
            Account <br />
            <span className="text-blue-200">Recovery.</span>
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 max-w-md font-medium leading-relaxed">
            Don't worry, it happens to the best of us. Let's get you back into your dashboard securely.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm font-bold text-blue-200 uppercase tracking-widest">
           <span className="flex items-center gap-2"><CheckCircle2 size={16}/> Encrypted Recovery</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM SECTION --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 relative">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/login")}
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-blue-50 rounded-3xl text-blue-600 mb-6 border border-blue-100 shadow-sm">
              <Fingerprint size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h2>
            <p className="text-slate-500 mt-3 font-medium">
              Enter your registered email and we'll send you a 6-digit code to reset your password.
            </p>
          </div>

          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Registered Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@society.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span>Request Security Code</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
             <ShieldCheck className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
               For security reasons, we will never ask for your password via email. If you didn't request this, please contact your society admin immediately.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}