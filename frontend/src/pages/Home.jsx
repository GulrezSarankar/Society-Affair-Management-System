import { useNavigate } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  Users,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  ShieldAlert,
  Zap,
  LayoutDashboard,
  Smartphone,
  ChevronRight,
  PhoneCall, // Added for mobile nav icon
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* --- PREMIUM GLASS NAVIGATION --- */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl py-3 border-b border-slate-200/50 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Society Affair Management System
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
              <a
                href="#features"
                className="hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <button
                onClick={() => navigate("/about")}
                className="hover:text-blue-600 transition-colors font-bold"
              >
                About Us
              </button>
              {/* --- ADDED CONTACT US LINK --- */}
              <button
                onClick={() => navigate("/contact")}
                className="hover:text-blue-600 transition-colors font-bold"
              >
                Contact Us
              </button>
              <a
                href="/security"
                className="hover:text-blue-600 transition-colors"
              >
                Security
              </a>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <button
              onClick={() => navigate("/watchmen-login")}
              className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-all"
            >
              <ShieldAlert size={16} /> Guard Access
            </button>

            <button
              onClick={() => navigate("/admin-login")}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
            >
              Admin Portal
            </button>
          </div>

          <button
            className="md:hidden p-2 bg-slate-100 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* --- MOBILE DROPDOWN --- */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-4 animate-in slide-in-from-top-5 shadow-xl">
            <button
              onClick={() => { navigate("/about"); setIsMenuOpen(false); }}
              className="block w-full text-left font-bold text-slate-600 hover:text-blue-600"
            >
              About Us
            </button>
            {/* --- ADDED CONTACT US MOBILE --- */}
            <button
              onClick={() => { navigate("/contact"); setIsMenuOpen(false); }}
              className="block w-full text-left font-bold text-slate-600 hover:text-blue-600"
            >
              Contact Us
            </button>
            <button
              onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
              className="block w-full text-left font-bold text-slate-600"
            >
              Resident Login
            </button>
            <button
              onClick={() => { navigate("/watchmen-login"); setIsMenuOpen(false); }}
              className="block w-full text-left font-bold text-orange-600"
            >
              Guard Login
            </button>
            <button
              onClick={() => { navigate("/admin-login"); setIsMenuOpen(false); }}
              className="block w-full text-left font-bold text-blue-600"
            >
              Admin Portal
            </button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-44 pb-32 overflow-hidden px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white px-4 py-2 rounded-full shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              v3.0 is Live
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-[1000] tracking-tight text-slate-900 leading-[0.95]">
            Society management <br />
            <span className="text-blue-600">reimagined.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            The all-in-one platform for modern communities. Automate maintenance
            billing, visitor tracking, and resident requests in one beautiful
            dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate("/admin-login")}
              className="group w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-2"
            >
              Get Started{" "}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Resident Login{" "}
              <ChevronRight size={20} className="text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* --- STATS TRUST BAR --- */}
      <section className="max-w-6xl mx-auto px-6 -mt-12 mb-24">
        <div className="bg-slate-900 rounded-[3rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-2xl">
          <StatBox label="Active Societies" value="1,200+" />
          <StatBox label="Safe Entries" value="500k+" />
          <StatBox label="Uptime" value="99.9%" />
          <StatBox label="Support" value="24/7" />
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              One platform,
              <br />
              total control.
            </h2>
            <p className="text-slate-500 font-medium">
              Everything you need to run a flawless community.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group overflow-hidden relative">
            <div className="relative z-10 space-y-6">
              <div className="bg-emerald-50 p-4 rounded-2xl w-fit text-emerald-600">
                <CreditCard size={32} />
              </div>
              <h3 className="text-3xl font-black">Smart Billing & Accounts</h3>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                Automated invoice generation, online UPI payments, and real-time
                expense tracking.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <div className="bg-white/10 p-4 rounded-2xl w-fit">
              <ShieldCheck size={32} className="text-blue-400" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black">Military-Grade Security</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Verified visitor entries and digital gate passes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Building2 className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter">
                  Society Affair Management System
                </span>
              </div>
              <p className="text-slate-500 max-w-xs leading-relaxed font-medium">
                Optimizing urban living through smart automation and
                community-first technology.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-6">
              <div className="flex gap-6 mb-4">
                <button
                  onClick={() => navigate("/about")}
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </button>
                <a
                  href="#features"
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Features
                </a>
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Developed By
              </h4>
              <div className="text-left md:text-right group">
                <a
                  href="https://my-portfolio-lemon-chi-19hswt08ld.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-[1000] text-slate-900 transition-all hover:text-blue-600 block mb-1"
                >
                  Gulrez Sarankar
                </a>
                <div className="flex md:justify-end items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-slate-400">
                    Open for new projects
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-sm font-semibold italic">
              © 2026 SocietySync. Modernized Housing ERP.
            </p>
            <div className="flex items-center gap-6 text-sm font-black text-slate-400">
              <span className="flex items-center gap-2 uppercase tracking-tighter">
                <CheckCircle2 size={16} className="text-emerald-500" /> AES-256
                Encrypted
              </span>
              <span className="flex items-center gap-2 uppercase tracking-tighter">
                <CheckCircle2 size={16} className="text-emerald-500" /> GDPR
                Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="text-center space-y-1">
      <h4 className="text-3xl font-black text-white leading-none tracking-tight">
        {value}
      </h4>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
    </div>
  );
}