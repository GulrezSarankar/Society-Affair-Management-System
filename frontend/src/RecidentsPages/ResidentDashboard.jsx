import React, { useEffect, useState } from "react";
import API from "../services/api";
import ResidentSidebar from "./components/ResidentSidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { 
  Menu, Wallet, CreditCard, Home, ArrowUpRight, 
  Clock, CheckCircle2, RefreshCw, X, AlertCircle 
} from "lucide-react";

const ResidentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [p, m] = await Promise.all([
        API.get("/resident/profile"),
        API.get("/resident/my-maintenance")
      ]);
      setProfile(p.data);
      setMaintenance(m.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pay = async (id) => {
    try {
      // Logic for payment integration would go here
      await API.post(`/resident/pay/${id}`);
      fetchData(); // Refresh data after payment
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  // Safe Calculations
  const total = maintenance?.reduce((sum, m) => sum + (m.amount || 0), 0) || 0;
  const paid = maintenance?.filter((m) => m.status === "PAID")
    .reduce((sum, m) => sum + (m.amount || 0), 0) || 0;
  const pending = total - paid;

  const chartData = [
    { name: "Paid", value: paid },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#10b981", "#f43f5e"];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-slate-900 overflow-x-hidden">
      {/* SIDEBAR COMPONENT */}
      <ResidentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MOBILE OVERLAY (Closes sidebar when clicking outside) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300">
        
        {/* MOBILE TOP NAV */}
        <div className="lg:hidden flex items-center justify-between bg-white border-b p-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Wallet className="text-white" size={18} />
            </div>
            <span className="font-bold text-slate-800">Resident Portal</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">
          
          {/* WELCOME HEADER */}
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                {loading ? "Welcome..." : `Hello, ${profile?.name?.split(' ')[0] || "Resident"} 👋`}
              </h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <Home size={16} className="text-blue-500" />
                Unit {profile?.flat?.flat_number || "..."} • {profile?.flat?.block || "..."} Block
              </p>
            </div>
            <button 
              onClick={fetchData} 
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={18} className={`${loading ? "animate-spin" : ""} text-slate-600`} />
              <span className="text-sm font-bold text-slate-600">Sync Data</span>
            </button>
          </header>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <StatCard 
              title="Total Billed" 
              value={`₹${total}`} 
              icon={<Wallet size={20} className="text-blue-600" />} 
              color="bg-blue-50" 
            />
            <StatCard 
              title="Balance Due" 
              value={`₹${pending}`} 
              icon={<Clock size={20} className="text-rose-600" />} 
              color="bg-rose-50" 
              isWarning={pending > 0}
            />
            <StatCard 
              title="Total Paid" 
              value={`₹${paid}`} 
              icon={<CheckCircle2 size={20} className="text-emerald-600" />} 
              color="bg-emerald-50" 
            />
          </div>

          {/* MAIN DASHBOARD CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CHART SECTION */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                Payment Distribution
              </h2>
              <div className="h-[300px] w-full">
                {/* minWidth={0} fixes the Recharts warning */}
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      dataKey="value" 
                      innerRadius="65%" 
                      outerRadius="85%" 
                      paddingAngle={5}
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                    />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BILLING HISTORY SECTION */}
            <div className="lg:col-span-7 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-lg font-bold text-slate-800">Maintenance History</h2>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border px-3 py-1 rounded-full">
                  Invoices
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[450px] p-2">
                {loading ? (
                  <div className="space-y-3 p-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-16 bg-slate-100 animate-pulse rounded-2xl" />
                    ))}
                  </div>
                ) : maintenance.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                    <p className="font-medium italic">No billing records found.</p>
                  </div>
                ) : (
                  maintenance.map((m) => (
                    <div
                      key={m.id}
                      className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 mb-2 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className={`p-3 rounded-xl ${m.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">₹{m.amount}</p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Maintenance Fee</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <span className={`flex-1 sm:flex-none text-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                          m.status === "PAID" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}>
                          {m.status}
                        </span>

                        {m.status !== "PAID" && (
                          <button
                            onClick={() => pay(m.id)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                          >
                            Pay <ArrowUpRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color, isWarning }) => (
  <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-colors">
    <div className={`p-4 rounded-2xl ${color} shadow-sm`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className={`text-2xl font-black mt-1 ${isWarning ? "text-rose-600" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  </div>
);

export default ResidentDashboard;