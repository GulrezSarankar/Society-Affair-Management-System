import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  ShieldCheck,
  HeadphonesIcon,
  ArrowLeft,
  Globe
} from "lucide-react";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* --- DYNAMIC BACKGROUND DECOR --- */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-200/20 rounded-full blur-[100px]" />
      </div>

      {/* --- HEADER --- */}
      <div className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <button 
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-tight text-slate-900 mb-6 leading-tight">
            Let's build a safer <br />
            <span className="text-blue-600">community together.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Have a specific requirement for your society? Our experts are ready to help you digitize your security.
          </p>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: INFO CARDS (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Contact Channels</h3>
            
            <GlassCard 
              icon={<Phone className="text-blue-600" size={20} />}
              title="Quick Support"
              detail="+91 8767581608"
              label="24/7 Helpline"
            />
            <GlassCard 
              icon={<Mail className="text-blue-600" size={20} />}
              title="Email Us"
              detail="support@society.com"
              label="Avg. response: 2hrs"
            />
            <GlassCard 
              icon={<Globe className="text-blue-600" size={20} />}
              title="Visit Us"
              detail="Mahad, Maharashtra"
              label="Main Tech Hub"
            />

            <div className="p-8 bg-slate-900 rounded-[2rem] text-white mt-8 shadow-2xl shadow-blue-900/20">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-blue-400" />
                <span className="font-bold">Operating Hours</span>
              </div>
              <div className="space-y-3 opacity-80 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Mon - Fri</span> <span>09:00 - 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekends</span> <span>Support Only</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PREMIUM FORM (8 Columns) */}
          <div className="lg:col-span-8">
            <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/60 p-8 md:p-14 border border-white">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Send a request</h2>
                  <p className="text-slate-500 font-medium">Tell us about your society's needs.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                  <input 
                    type="text" required placeholder="Name"
                    className="w-full p-5 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                  <input 
                    type="email" required placeholder="email"
                    className="w-full p-5 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Subject</label>
                  <select 
                    className="w-full p-5 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium appearance-none"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="">Choose a category</option>
                    <option value="Demo">Demo Request</option>
                    <option value="Technical">Technical Support</option>
                    <option value="Pricing">Society Pricing</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">How can we help?</label>
                  <textarea 
                    rows="4" required placeholder="Type your message here..."
                    className="w-full p-5 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                  >
                    Send Message
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassCard({ icon, title, detail, label }) {
  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{detail}</h4>
          <p className="text-xs text-slate-400 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}