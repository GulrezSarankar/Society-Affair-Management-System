import { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "./components/sidebar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";
import { 
  TrendingUp, Users, CreditCard, Activity, 
  ArrowUpRight, ArrowDownRight, Menu, Inbox 
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/maintenance/stats");
      // Check if data exists, otherwise fallback to zeros
      setStats(res.data || { total: 0, paid: 0, pending: 0, users: 0 });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      // We don't set an error state here so the UI just shows "Empty"
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const barData = [
    { name: "Total", value: stats.total },
    { name: "Paid", value: stats.paid },
    { name: "Pending", value: stats.pending }
  ];

  const pieData = [
    { name: "Paid", value: stats.paid },
    { name: "Pending", value: stats.pending }
  ];

  // Logic to determine if data is truly "Empty"
  const isEmpty = stats.total === 0 && stats.users === 0;
  const COLORS = ["#10b981", "#f43f5e"];

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''} lg:ml-64 w-full`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">SocietySync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-full">
            <Menu size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">System Overview</h1>
              <p className="text-slate-500 flex items-center gap-2 text-sm md:text-base">
                <Activity size={16} className="text-emerald-500" /> 
                Real-time analytics for SocietySync
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard title="Total Revenue" value={`₹${stats.total}`} icon={<TrendingUp className="text-blue-600" />} trend="+0%" isUp={true} />
            <StatCard title="Collection" value={`₹${stats.paid}`} icon={<CreditCard className="text-emerald-600" />} trend="+0%" isUp={true} />
            <StatCard title="Outstanding" value={`₹${stats.pending}`} icon={<Activity className="text-rose-600" />} trend="0%" isUp={false} />
            <StatCard title="Total Residents" value={stats.users} icon={<Users className="text-purple-600" />} trend="None" isUp={true} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            
            {/* BAR CHART */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <h2 className="text-base md:text-lg font-bold text-slate-800 mb-6">Maintenance Breakdown</h2>
              <div className="h-64 md:h-80 w-full flex items-center justify-center">
                {isEmpty && !loading ? (
                  <EmptyState message="No maintenance data available" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* PIE CHART */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base md:text-lg font-bold text-slate-800 mb-6">Collection Status</h2>
              <div className="h-64 md:h-80 w-full flex items-center justify-center">
                {isEmpty && !loading ? (
                  <EmptyState message="No payment records found" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Custom Empty State Component
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center text-slate-400">
      <Inbox size={48} strokeWidth={1} className="mb-2 opacity-50" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isUp }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">{icon}</div>
        <div className={`flex items-center text-[10px] md:text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
        </div>
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{value || "0"}</p>
      </div>
    </div>
  );
}