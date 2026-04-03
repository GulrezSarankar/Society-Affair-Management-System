import React, { useEffect, useState } from "react";
import API from "../services/api";
import ResidentSidebar from "./components/ResidentSidebar";
import { 
  Receipt, 
  Clock, 
  CheckCircle2, 
  ArrowDownLeft, 
  Calendar, 
  IndianRupee,
  Filter,
  Menu,
  RefreshCw,
  Inbox
} from "lucide-react";

const PaymentHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/maintenance/user/${user.id}`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) fetchPayments();
  }, []);

  // Summary Calculations
  const totalPaid = data
    .filter(p => p.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const pendingCount = data.filter(p => p.status !== "PAID").length;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      {/* 1. Sidebar Component */}
      <ResidentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. Main Content Wrapper */}
      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? "blur-sm lg:blur-none pointer-events-none lg:pointer-events-auto" : ""}`}>
        
        {/* MOBILE TOP NAVIGATION BAR */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <Receipt className="text-blue-400" size={20} />
            <span className="font-bold tracking-tight uppercase text-xs">Payment Ledger</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
          
          {/* HEADER & QUICK STATS */}
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Detailed history of your society dues.</p>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex flex-1 items-center gap-3">
                <div className="hidden sm:flex bg-emerald-500 text-white p-2 rounded-xl shadow-md">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Settled</p>
                  <p className="text-sm font-black text-slate-900 leading-tight">₹{totalPaid}</p>
                </div>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl flex flex-1 items-center gap-3">
                <div className="hidden sm:flex bg-rose-500 text-white p-2 rounded-xl shadow-md">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-rose-600 uppercase tracking-wider">Due</p>
                  <p className="text-sm font-black text-slate-900 leading-tight">{pendingCount} Bills</p>
                </div>
              </div>
            </div>
          </header>

          {/* DATA TABLE / LIST CARD */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            
            {/* TOOLBAR */}
            <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
               <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                 <Filter size={18} className="text-blue-500" />
                 Recent Transactions
               </h2>
               <button 
                onClick={fetchPayments}
                className="p-2 md:p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500 flex items-center gap-2 text-xs font-bold"
               >
                 <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                 <span className="hidden sm:inline">Reload</span>
               </button>
            </div>

            {/* MAIN LISTING AREA */}
            <div className="p-3 md:p-4">
              {loading ? (
                <div className="space-y-4 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl w-full" />
                  ))}
                </div>
              ) : data.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <Inbox size={48} className="text-slate-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">No Transactions Found</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Your payment history will appear here once maintenance invoices are issued.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.map((p) => (
                    <div 
                      key={p.id} 
                      className="group flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 rounded-2xl transition-all duration-200"
                    >
                      {/* Left Side: Amount & Date */}
                      <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                        <div className={`p-3 rounded-2xl flex-shrink-0 ${p.status === "PAID" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                          <ArrowDownLeft size={22} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-slate-900 text-lg flex items-center gap-1">
                            <IndianRupee size={16} />{p.amount}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">
                              <Calendar size={12} /> {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                            <p className="sm:hidden text-[10px] text-slate-300 font-mono">#ID-{p.id}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Status & ID */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-8 border-t sm:border-0 pt-3 sm:pt-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</p>
                          <p className="text-xs font-mono font-medium text-slate-500">#SYNC-TXN-{p.id.toString().padStart(4, '0')}</p>
                        </div>

                        <div className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border w-full sm:w-32 text-center ${
                          p.status === "PAID" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}>
                          {p.status === "PAID" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {p.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP FOOTER */}
            <div className="hidden md:flex p-6 bg-slate-50/50 border-t border-slate-100 justify-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
                 Certified digital receipt ledger
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentHistory;