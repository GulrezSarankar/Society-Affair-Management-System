import React from "react";
import {
  LayoutDashboard,
  UserCircle,
  Wallet,
  LogOut,
  X,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ResidentSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user data for the profile section
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear(); // Clear all data on logout
    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/resident-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Complaint",
      path: "/Resident-complaint",
      icon: UserCircle,
    },
    {
      name: "Complaint History",
      path: "/resident-complaint-history",
      icon: Wallet,
    },
  ];

  return (
    <>
      {/* --- MOBILE OVERLAY --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-slate-950 text-slate-300 z-50
        transform transition-all duration-300 ease-in-out border-r border-white/5
        shadow-2xl shadow-black
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* HEADER / LOGO */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Building2 className="text-white" size={20} />
            </div>
            <span className="font-black text-white tracking-tight text-xl uppercase italic">
              Society Affair Management System
            </span>
          </div>

          <button
            className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg text-slate-400"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
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
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1"
                      : "hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={20}
                    className={
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-blue-400"
                    }
                  />
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </button>
            );
          })}
        </nav>

        {/* FOOTER SECTION: USER INFO & LOGOUT */}
        <div className="absolute bottom-0 w-full bg-slate-950/50 backdrop-blur-md border-t border-white/5">
          {/* User Preview */}
          <div className="px-6 py-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {user.name?.charAt(0) || "R"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {user.name || "Resident"}
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                Active Member
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-4 pb-6">
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-rose-400 font-bold text-sm hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 transition-all group"
            >
              <LogOut
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ResidentSidebar;
