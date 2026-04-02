import React, { useEffect, useState } from "react";
import API from "../services/api";
import ResidentSidebar from "./components/ResidentSidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { 
  Menu, 
  Wallet, 
  CreditCard, 
  Home, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  RefreshCw 
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
      // Simulate/Trigger payment
      await API.post(`/resident/pay/${id}`);
      fetchData();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  // Calculations
  const total = maintenance.reduce((sum, m) => sum + m.amount, 0);
  const paid = maintenance
    .filter((m) => m.status === "PAID")
    .reduce((sum, m) => sum + m.amount, 0);
  const pending = total - paid;

  const chartData = [
    { name: "Cleared", value: paid },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#10b981", "#f43f5e"];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <ResidentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? "blur-sm lg:blur-none" : ""}`}>
        
        {/* MOBILE TOP BAR */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <Wallet className="text-blue-400" size={20} />
            <span className="font-bold tracking-tight">Resident Portal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10">
          {/* WELCOME HEADER */}
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                Hello, {profile?.name?.split(' ')[0] || "Resident"} 👋
              </h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <Home size={16} className="text-blue-500" />
                Unit {profile?.flat?.flat_number || "..."} • {profile?.flat?.block || "..."} Block
              </p>
            </div>
            <button 
              onClick={fetchData} 
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm w-fit"
            >
              <RefreshCw size={20} className={`${loading ? "animate-spin" : ""} text-slate-600`} />
            </button>
          </header>

          {/* QUICK STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Dues" 
              value={`₹${total}`} 
              icon={<Wallet className="text-blue-600" />} 
              color="bg-blue-50" 
            />
            <StatCard 
              title="Pending Amount" 
              value={`₹${pending}`} 
              icon={<Clock className="text-rose-600" />} 
              color="bg-rose-50" 
              isWarning={pending > 0}
            />
            <StatCard 
              title="Paid Till Date" 
              value={`₹${paid}`} 
              icon={<CheckCircle2 className="text-emerald-600" />} 
              color="bg-emerald-50" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* CHART SECTION */}
            <div className="lg:col-span-5 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Payment Distribution</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      dataKey="value" 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5}
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT BILLS SECTION */}
            <div className="lg:col-span-7 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Maintenance History</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border">Invoice List</span>
              </div>
              
              <div className="p-2 max-h-[400px] overflow-y-auto">
                {maintenance.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-medium">No billing records found.</div>
                ) : (
                  maintenance.map((m) => (
                    <div
                      key={m.id}
                      className="group flex flex-col sm:flex-row justify-between items-center p-4 mb-2 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                        <div className={`p-3 rounded-xl ${m.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">₹{m.amount}</p>
                          <p className="text-xs text-slate-500 font-medium">Maintenance Fee</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                          m.status === "PAID" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}>
                          {m.status}
                        </span>

                        {m.status !== "PAID" && (
                          <button
                            onClick={() => pay(m.id)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                          >
                            Pay Now <ArrowUpRight size={16} />
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

// Reusable Stat Card
const StatCard = ({ title, value, icon, color, isWarning }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
    <div className={`p-4 rounded-2xl ${color} shadow-sm`}>{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className={`text-2xl font-black mt-1 ${isWarning ? "text-rose-600" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  </div>
);

export default ResidentDashboard;