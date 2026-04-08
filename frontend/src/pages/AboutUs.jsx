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
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* --- ELITE NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? "bg-white/70 backdrop-blur-xl py-3 border-b border-slate-200/50 shadow-sm" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform duration-300">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-[1000] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-600">
              SocietySync
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
              <a href="#features" className="hover:text-blue-600 transition-colors">Platform</a>
              <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
            </div>
            
            <div className="h-4 w-px bg-slate-200" />

            <button 
              onClick={() => navigate("/watchmen-login")} 
              className="group flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-all"
            >
              <ShieldAlert size={16} className="group-hover:animate-bounce" /> Gate Guard
            </button>

            <button 
              onClick={() => navigate("/admin-login")} 
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
            >
              Admin Portal
            </button>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-48 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-600/5 border border-blue-600/10 px-4 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Smart Infrastructure v3.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter text-slate-900 leading-[0.9] lg:px-10">
            Automate your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">neighborhood.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            The world's most intuitive ERP for housing societies. Real-time billing, military-grade visitor tracking, and seamless communication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={() => navigate("/admin-login")}
              className="group w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3"
            >
              Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-lg hover:border-blue-600 transition-all flex items-center justify-center gap-2"
            >
              Resident Portal <ChevronRight size={20} className="text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      {/* --- METRICS BAR --- */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 grid grid-cols-2 md:grid-cols-4 gap-8 relative overflow-hidden">
          <StatBox label="Managed Units" value="12k+" />
          <StatBox label="Daily Logins" value="45k+" />
          <StatBox label="System Uptime" value="99.9%" />
          <StatBox label="Support Hub" value="24/7" />
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-[1000] tracking-tight mb-4">Powerful Features. Zero Friction.</h2>
          <p className="text-slate-500 font-medium">Modular tools built for committees, residents, and staff.</p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 auto-rows-[280px]">
          <div className="md:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-10 flex items-end justify-between hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
             <div className="space-y-4 relative z-10">
                <div className="bg-blue-50 p-3 rounded-2xl w-fit text-blue-600"><CreditCard size={32}/></div>
                <h3 className="text-3xl font-black">Financial Intelligence</h3>
                <p className="text-slate-500 font-medium max-w-md leading-relaxed">Automated invoice generation, multi-channel UPI payments, and end-to-end audit logs.</p>
             </div>
          </div>

          <div className="md:col-span-4 bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between group">
             <ShieldCheck size={40} className="text-blue-500 group-hover:scale-110 transition-transform"/>
             <div>
                <h3 className="text-2xl font-black mb-2">Gate Fortress</h3>
                <p className="text-slate-400 text-sm font-medium">Digital visitor verification and SOS security protocols.</p>
             </div>
          </div>

          <div className="md:col-span-4 bg-blue-600 rounded-[3rem] p-10 text-white flex flex-col justify-between group">
             <Smartphone size={40} className="group-hover:rotate-12 transition-transform"/>
             <div>
                <h3 className="text-2xl font-black mb-2">Super App</h3>
                <p className="text-blue-100 text-sm font-medium">One-tap facility booking and neighbor chat.</p>
             </div>
          </div>

          <div className="md:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col justify-between hover:shadow-2xl transition-all relative group overflow-hidden">
             <div className="flex justify-between items-start">
                <div className="space-y-2">
                   <h3 className="text-3xl font-black">Admin Command</h3>
                   <p className="text-slate-500 font-medium max-w-sm">Manage entire society operations from a single workspace.</p>
                </div>
                <LayoutDashboard size={40} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
             </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-20">
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Building2 className="text-white" size={24} />
                </div>
                <span className="text-2xl font-[1000] tracking-tighter">SocietySync</span>
              </div>
              <p className="text-slate-500 max-w-xs leading-relaxed font-medium">
                Optimizing urban living through smart automation and community-first technology.
              </p>
            </div>

            <div className="text-left md:text-right space-y-4">
               <p className="text-xs font-black uppercase tracking-widest text-slate-400">Masterminded By</p>
               <h4 className="text-3xl font-[1000] text-slate-900 leading-none">Gulrez Sarankar</h4>
               <p className="text-sm font-bold text-blue-600">Full Stack Developer • Java Specialist</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 SocietySync. Future-Proofed Infrastructure.</p>
            <div className="flex items-center gap-4 text-xs font-black text-slate-400">
               <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500"/> SSL SECURE</span>
               <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500"/> SYSTEM ACTIVE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="text-center group">
      <h4 className="text-4xl font-[1000] text-white leading-none mb-2 group-hover:text-blue-500 transition-colors">{value}</h4>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{label}</p>
    </div>
  );
}