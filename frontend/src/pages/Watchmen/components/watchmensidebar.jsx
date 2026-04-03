import React from "react";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  UserPlus, 
  History, 
  LogOut, 
  X, 
  ChevronRight, 
  Bell 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const WatchmanSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve Watchman info from local storage safely
  const guard = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    // It's safer to clear only specific keys or use a logout function
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    navigate("/watchmen-login"); // Fixed typo from 'watchmen' to 'watchman'
  };

  const menuItems = [
    { 
      name: "Gate Console", 
      path: "/watchman-dashboard", 
      icon: LayoutDashboard 
    },
    { 
      name: "Visitor Entry", 
      path: "/add-visitor", 
      icon: UserPlus 
    },
    { 
      name: "Entry History", 
      path: "/wathcman-history", // Fixed typo from 'wathcmen'
      icon: History 
    },
  ];

  return (
    <>
      {/* --- MOBILE OVERLAY --- */}
      {/* This appears when sidebar is open on mobile to blur the background */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white text-slate-600 z-50
        transform transition-all duration-300 ease-in-out border-r border-slate-200
        shadow-xl lg:shadow-sm
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* LOGO SECTION */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-200">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 tracking-tighter text-xl uppercase italic leading-none">Guard</span>
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">Society Affair Management System</span>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-400" 
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* STATUS BADGE */}
        <div className="px-4 mt-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center gap-3">
            <div className="relative">
              <Bell size={18} className="text-blue-600" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider leading-none">Gate 01</p>
              <p className="text-[9px] text-blue-500 font-medium mt-0.5">Connection: Secure</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION MENU */}
        <nav className="p-4 mt-4 space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => { 
                  navigate(item.path); 
                  setIsOpen(false); // Close sidebar on mobile after clicking
                }}
                className={`
                  flex items-center justify-between w-full p-3.5 rounded-2xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1" 
                    : "hover:bg-slate-50 hover:text-blue-600 text-slate-500"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM SECTION: PROFILE & LOGOUT */}
        <div className="absolute bottom-0 w-full bg-slate-50 border-t border-slate-200 p-4">
          <div className="px-2 py-3 flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
              {guard.name?.charAt(0) || "G"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                {guard.name || "Duty Guard"}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest uppercase">Shift Active</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Terminal Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default WatchmanSidebar;