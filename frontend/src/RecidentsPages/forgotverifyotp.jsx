import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowLeft, 
  KeyRound, 
  Loader2, 
  CheckCircle2, 
  MailQuestion 
} from "lucide-react";
import API from "../services/api";

export default function ForgotVerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Safely get email from navigation state
  const email = location.state?.email || "your registered email";

  // 🔥 VERIFY OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the OTP");

    try {
      setLoading(true);
      await API.post("/resident/verify-otp", {
        email,
        otp
      });

      alert("OTP Verified ✅");
      // 👉 Go to Reset Password Page
      navigate("/reset-password", { state: { email } });

    } catch (err) {
      alert(err.response?.data?.detail || "Invalid or Expired OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 RESEND OTP
  const handleResend = async () => {
    try {
      setResending(true);
      await API.post("/auth/send-otp", { email });
      alert("A new security code has been sent 📧");
    } catch (err) {
      alert("Error resending OTP ❌");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans text-slate-900">
      
      {/* --- LEFT SIDE: BRANDING --- */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12 lg:p-20 text-white">
        {/* Abstract Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight uppercase italic">SocietySync</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
            Verify your <br />
            <span className="text-blue-200">Identity.</span>
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 max-w-md font-medium leading-relaxed">
            We've sent a unique security code to ensure it's really you. Your safety is our priority.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm font-bold text-blue-100 uppercase tracking-[0.2em]">
           <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Secure Verification</span>
        </div>
      </div>

      {/* --- RIGHT SIDE: OTP FORM --- */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 relative">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/login")}
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-blue-50 rounded-3xl text-blue-600 mb-6 border border-blue-100 shadow-sm">
              <KeyRound size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Enter OTP</h2>
            <p className="text-slate-500 mt-3 font-medium">
              We've sent a 6-digit code to <br />
              <span className="text-slate-900 font-bold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] block text-center mb-4">
                Verification Code
              </label>
              
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                className="w-full bg-white border border-slate-200 rounded-2xl py-5 text-center text-3xl font-black tracking-[0.5em] text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all placeholder:text-slate-200"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Didn't receive the code?{" "}
              <button 
                type="button"
                disabled={resending}
                className="text-blue-600 font-bold hover:underline disabled:text-slate-400"
                onClick={handleResend}
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            </p>
          </div>

          <div className="mt-12 p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
             <MailQuestion className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
               Please check your spam folder if you don't see the email in your inbox. The code is valid for 10 minutes.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}