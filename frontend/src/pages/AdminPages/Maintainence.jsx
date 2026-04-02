import { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "./components/sidebar";
import { 
  Send, Wallet, Clock, CheckCircle, Search, 
  RefreshCw, AlertCircle, IndianRupee, Menu 
} from "lucide-react";

export default function Maintenance() {
  const [users, setUsers] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Sidebar State
  const [form, setForm] = useState({ user_id: "", amount: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, mainRes] = await Promise.all([
        API.get("/auth/residents"),
        API.get("/maintenance/all")
      ]);
      setUsers(usersRes.data);
      setMaintenance(mainRes.data);
    } catch (err) {
      setError("Failed to sync data with server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSend = async () => {
    if (!form.user_id || !form.amount) {
      setError("Please select a user and enter an amount.");
      return;
    }
    try {
      await API.post("/maintenance/send", form);
      setMessage("Invoice sent successfully.");
      setForm({ user_id: "", amount: "" });
      fetchData();
    } catch (err) {
      setError("Error creating record.");
    }
  };

  const handlePay = async (id) => {
    try {
      await API.post(`/maintenance/pay/${id}`);
      setMessage("Payment successful.");
      fetchData();
    } catch (err) {
      setError("Payment failed.");
    }
  };

  const filteredMaintenance = maintenance.filter(m => 
    m.user_id.toString().includes(searchTerm) || m.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar with Mobile Props */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''}`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 border-b sticky top-0 z-30">
          <span className="font-bold text-blue-600 text-lg">SocietySync</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 md:p-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Maintenance & Billing</h1>
              <p className="text-slate-500 text-sm">Manage dues and track payments.</p>
            </div>
            <button 
              onClick={fetchData}
              className="w-fit p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm"
            >
              <RefreshCw size={20} className={loading ? "animate-spin text-blue-600" : "text-slate-600"} />
            </button>
          </div>

          {/* Stats Section - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <StatCard 
              title="Pending" 
              value={`₹${maintenance.filter(m => m.status === "PENDING").reduce((acc, curr) => acc + curr.amount, 0)}`}
              icon={<Clock className="text-amber-600" />}
              color="bg-amber-50"
            />
            <StatCard 
              title="Collected" 
              value={`₹${maintenance.filter(m => m.status === "PAID").reduce((acc, curr) => acc + curr.amount, 0)}`}
              icon={<CheckCircle className="text-emerald-600" />}
              color="bg-emerald-50"
            />
            <StatCard 
              title="Users" 
              value={users.length}
              icon={<Wallet className="text-blue-600" />}
              color="bg-blue-50"
            />
          </div>

          {/* Toast Notifications */}
          <div className="fixed bottom-4 right-4 lg:top-6 lg:right-6 z-50 space-y-2 pointer-events-none">
            {message && (
              <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
                <CheckCircle size={18} /> {message}
              </div>
            )}
            {error && (
              <div className="bg-rose-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-pulse">
                <AlertCircle size={18} /> {error}
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:sticky lg:top-24">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Send size={18} className="text-blue-600" /> Generate Bill
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Resident</label>
                    <select
                      value={form.user_id}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                    >
                      <option value="">Choose...</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Amount</label>
                    <div className="relative">
                      <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        value={form.amount}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    Send Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                  <h2 className="font-bold text-slate-800">History</h2>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search status..."
                      className="w-full sm:w-48 pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b">
                        <th className="px-6 py-4">Resident ID</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMaintenance.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-12 text-center text-slate-400 italic">No records.</td>
                        </tr>
                      ) : (
                        filteredMaintenance.map((m) => (
                          <tr key={m.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-600">ID: {m.user_id}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">₹{m.amount}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                m.status === "PAID" 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                  : "bg-rose-50 text-rose-600 border-rose-100"
                              }`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {m.status === "PENDING" ? (
                                <button
                                  onClick={() => handlePay(m.id)}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg transition-all"
                                >
                                  Mark Paid
                                </button>
                              ) : (
                                <CheckCircle size={18} className="text-emerald-400 ml-auto mr-4" />
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}