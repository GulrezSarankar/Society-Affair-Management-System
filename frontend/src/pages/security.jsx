import React from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { 
  ShieldCheck, 
  UserCheck, 
  Smartphone, 
  Bell, 
  Users, 
  FileText, 
  ChevronRight,
  CheckCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';

const SecurityLandingPage = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-slate-50">
        {/* --- ADDED LINK TO HOME ON LOGO --- */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")} 
        >
          <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-extrabold tracking-tight group-hover:text-blue-600 transition-colors">
            Society Affair Management System
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
          <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
        </div>
        
        <button 
          onClick={() => navigate("/admin-login")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md shadow-blue-100 active:scale-95"
        >
          Get Started
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="px-6 py-16 md:py-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
          <ShieldAlert size={16} /> Now securing over 500+ Housing Societies
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6">
          Modern Security for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Smart Societies.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one platform to digitize visitor entries, manage staff attendance, 
          and ensure resident safety with real-time mobile approvals.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            Schedule a Demo <ChevronRight size={20} />
          </button>
          <button className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-xl font-bold text-lg hover:border-blue-600 transition-all">
            View Pricing
          </button>
        </div>
      </header>

      {/* --- FEATURE GRID --- */}
      <section id="features" className="py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything your society needs</h2>
            <p className="text-slate-500">Say goodbye to old paper registers and hello to digital safety.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<UserCheck size={32} />}
              title="Visitor Management"
              desc="Instant notifications to residents for guest approval, delivery, or service entries."
            />
            <FeatureCard 
              icon={<Clock size={32} />}
              title="Staff Attendance"
              desc="Digital log for maids, drivers, and maintenance staff using biometric or QR codes."
            />
            <FeatureCard 
              icon={<Smartphone size={32} />}
              title="Digital Gate-Pass"
              desc="Residents can pre-approve guests by sending a secure QR code for fast-track entry."
            />
            <FeatureCard 
              icon={<Bell size={32} />}
              title="Emergency SOS"
              desc="One-tap panic button for residents to alert security and neighbors during medical or fire emergencies."
            />
            <FeatureCard 
              icon={<Users size={32} />}
              title="Committee Dashboard"
              desc="Detailed analytics on society entries, water tankers, and visitor trends for management."
            />
            <FeatureCard 
              icon={<FileText size={32} />}
              title="Notice Board"
              desc="Instantly broadcast important announcements to all residents via mobile notifications."
            />
          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-20">Secure Entry in 3 Simple Steps</h2>
        <div className="space-y-20">
          <Step 
            num="01" 
            title="Guard Records Entry" 
            desc="Security guard enters visitor details into the GateGuard Tablet at the gate."
          />
          <Step 
            num="02" 
            title="Resident Notification" 
            desc="Resident receives an instant 'Approve' or 'Deny' notification on their mobile phone."
            reversed
          />
          <Step 
            num="03" 
            title="Safe Entry" 
            desc="Once approved, the gate opens and a digital timestamp is logged in the cloud system."
          />
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="bg-blue-600 mx-6 mb-20 rounded-3xl py-16 px-6 text-center text-white shadow-2xl shadow-blue-200">
        <h2 className="text-4xl font-black mb-6">Ready to secure your premises?</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
          Join hundreds of smart societies already using GateGuardPro to keep their families safe.
        </p>
        <button className="bg-white text-blue-600 px-12 py-4 rounded-xl font-black text-xl hover:bg-blue-50 transition-colors shadow-lg">
          Get a Free Quote
        </button>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600" />
            <span className="font-bold">Society Affair Management System © 2026</span>
          </div>
          <p className="text-slate-400 text-sm">Empowering Security Guards & Residents through Technology.</p>
        </div>
      </footer>
    </div>
  );
};

/* Helper Component for Feature Cards */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all">
    <div className="text-blue-600 mb-6">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

/* Helper Component for Steps */
const Step = ({ num, title, desc, reversed }) => (
  <div className={`flex flex-col md:flex-row items-center gap-10 ${reversed ? 'md:flex-row-reverse' : ''}`}>
    <div className="flex-1">
      <div className="text-7xl font-black text-slate-100 mb-4">{num}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-500 text-lg">{desc}</p>
      <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold">
        <CheckCircle size={18} /> Automated Logging
      </div>
    </div>
    <div className="flex-1 w-full h-64 bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center italic text-slate-400">
      [Graphic Illustrating Step {num}]
    </div>
  </div>
);

export default SecurityLandingPage;