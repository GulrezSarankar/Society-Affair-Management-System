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
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SocietySync</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <button 
              onClick={() => navigate("/login")} 
              className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              Resident Login
            </button>
            <button 
              onClick={() => navigate("/admin-login")} 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
            >
              Admin Portal
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-4 animate-in slide-in-from-top-5">
            <button onClick={() => navigate("/login")} className="block w-full text-left font-bold text-slate-700">Resident Login</button>
            <button onClick={() => navigate("/admin-login")} className="block w-full text-left font-bold text-blue-600">Admin Portal</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold mb-6 animate-bounce">
            <ShieldCheck size={14} />
            Smart Society Management v3.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            Manage your Society <br />
            <span className="text-blue-600">Without the Stress.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            From automated maintenance billing to resident directories, SocietySync is the all-in-one digital operating system for modern living.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate("/admin-login")}
              className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              Admin Access <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
            >
              Resident Login <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Users className="text-blue-600" size={32} />}
            title="Resident Directory"
            desc="Maintain full digital records of every member, flat assignment, and contact details."
          />
          <FeatureCard 
            icon={<CreditCard className="text-emerald-600" size={32} />}
            title="Automated Billing"
            desc="Generate maintenance invoices and track payment status in real-time with one click."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-purple-600" size={32} />}
            title="Secure Access"
            desc="Role-based permissions ensure that sensitive society data stays protected at all times."
          />
        </div>
      </section>

      {/* --- TRUST FOOTER --- */}
      <footer className="bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-200 pt-12">
          <div className="flex items-center gap-2">
            <Building2 className="text-slate-400" size={24} />
            <span className="font-bold text-slate-500">SocietySync © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
            <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500"/> Real-time Sync</div>
            <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500"/> Cloud Secured</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group">
      <div className="mb-6 p-4 bg-slate-50 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}