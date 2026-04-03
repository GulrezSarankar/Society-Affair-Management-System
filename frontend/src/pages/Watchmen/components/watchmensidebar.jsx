import React from "react";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  UserPlus, 
  ClipboardList, 
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

  // Retrieve Watchman info from local storage
  const guard = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear();
    navigate("/watchman-login");
  };

  const menuItems = [
    { 
      name: "Gate Console", 
      path: "/watchman/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      name: "Visitor Entry", 
      path: "/add-visitor", 
      icon: UserPlus 
    },
    { 
      name: "Daily Logs", 
      path: "/watchman/logs", 
      icon: ClipboardList 
    },
    { 
      name: "Entry History", 
      path: "/watchman/history", 
      icon: History 
    },
  ];

  return (
    <>
      {/* --- MOBILE OVERLAY --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 z-50
        transform transition-all duration-300 ease-in-out border-r border-white/5
        shadow-2xl shadow-black
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* LOGO SECTION */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white tracking-tighter text-xl uppercase italic leading-none">Guard</span>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1">SocietySync</span>
            </div>
          </div>

          <button 
            className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg text-slate-400"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* NOTIFICATION BADGE (Optional Security Alert) */}
        <div className="px-4 mt-6">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-3 flex items-center gap-3">
            <div className="relative">
              <Bell size={18} className="text-blue-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
            </div>
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Gate 01 Status: Secure</p>
          </div>
        </div>

        {/* NAVIGATION MENU */}
        <nav className="p-4 mt-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center justify-between w-full p-3.5 rounded-2xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1" 
                    : "hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"} />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM SECTION: GUARD INFO & LOGOUT */}
        <div className="absolute bottom-0 w-full bg-slate-900/50 backdrop-blur-md border-t border-white/5 p-4">
          
          {/* Guard Profile */}
          <div className="px-2 py-3 flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 border border-white/5 font-bold shadow-inner">
              {guard.name?.charAt(0) || "G"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{guard.name || "Duty Guard"}</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Shift Active</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-rose-400 font-bold text-xs hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 transition-all group"
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