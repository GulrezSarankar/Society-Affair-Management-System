import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  CreditCard, 
  UserCheck,
  Settings, 
  LogOut, 
  Building2,
  Menu,
  X 
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    { name: "Dashboard", path: "/Admin-dashboard", icon: LayoutDashboard },
    { name: "Residents", path: "/Admin-residents", icon: Users },
    { name: "Admin Approval", path: "/Admin-approvals", icon: UserCheck }, 
    { name: "Complaints", path: "/Admin-complaint", icon: UserPlus },
    { name: "Maintenance", path: "/Admin-maintenence", icon: CreditCard },
    { name: "Add Flats", path: "/Admin-Add-flats", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-400" />
          <span className="font-bold tracking-tight">SocietySync</span>
        </div>
        <button onClick={toggleSidebar} className="p-1 hover:bg-slate-800 rounded">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- SIDEBAR OVERLAY (Mobile) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <Building2 className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold text-white tracking-tight">Society Affair Management System</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false); // Close menu on mobile after navigation
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1" 
                  : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3 mb-4 px-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-inner">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{user.role || "Resident"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}