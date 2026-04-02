import { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "./components/sidebar";
import { 
  Building2, 
  Plus, 
  Trash2, 
  Layers, 
  Layout, 
  Search, 
  RefreshCw, 
  Menu,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function Flats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null); // Track which ID is being deleted
  
  const [form, setForm] = useState({
    flat_number: "",
    floor: "",
    block: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchFlats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/flats/");
      setFlats(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  // Auto-hide alerts
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.flat_number || !form.floor || !form.block) {
      setError("Validation Error: All fields are required.");
      return;
    }

    const payload = {
      flat_number: form.flat_number.trim(),
      floor: parseInt(form.floor, 10),
      block: form.block.trim().toUpperCase()
    };

    try {
      await API.post("/flats/", payload);
      setMessage(`Success: Unit ${payload.flat_number} registered.`);
      setForm({ flat_number: "", floor: "", block: "" });
      fetchFlats();
    } catch (err) {
      setError("Duplicate Error: This flat number already exists in the system.");
    }
  };

  const handleDelete = async (id, flatNum) => {
    // A clean, non-intrusive confirm could be a custom modal, 
    // but here we use a descriptive window confirm for safety.
    if (!window.confirm(`Are you sure you want to permanently delete Flat ${flatNum}?`)) return;

    setDeletingId(id);
    try {
      await API.delete(`/flats/${id}`);
      setMessage(`Deleted: Flat ${flatNum} has been removed from inventory.`);
      fetchFlats();
    } catch (err) {
      // Logic for why it failed
      setError(`Cannot Delete: Flat ${flatNum} is currently assigned to a resident.`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredFlats = flats.filter(f => 
    f.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.block.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''}`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-400" size={24} />
            <span className="font-bold tracking-tight">SocietySync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10">
          {/* Page Title */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
              <p className="text-slate-500 text-sm">Manage society assets and blocks.</p>
            </div>
            <button onClick={fetchFlats} className="hidden md:block p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <RefreshCw size={20} className={loading ? "animate-spin text-blue-600" : "text-slate-600"} />
            </button>
          </div>

          {/* 🔥 ENHANCED TOAST NOTIFICATIONS */}
          <div className="fixed bottom-10 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 z-50 space-y-4 w-full max-w-sm px-6 md:px-0">
            {message && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-10">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-emerald-400">Inventory Sync</p>
                  <p className="text-xs text-slate-300">{message}</p>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-10 border-l-4 border-rose-500">
                <div className="p-2 bg-rose-500 rounded-lg">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-rose-400">Action Blocked</p>
                  <p className="text-xs text-slate-300">{error}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Card */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm lg:sticky lg:top-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Add New Unit</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Flat Number</label>
                    <div className="relative">
                      <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        placeholder="e.g. A-101"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                        value={form.flat_number}
                        onChange={(e) => setForm({ ...form, flat_number: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Floor</label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none"
                          value={form.floor}
                          onChange={(e) => setForm({ ...form, floor: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Block</label>
                      <input
                        type="text"
                        placeholder="Block"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none"
                        value={form.block}
                        onChange={(e) => setForm({ ...form, block: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
                    Register Flat
                  </button>
                </form>
              </div>
            </div>

            {/* Inventory List */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" /> Current Inventory
                  </h2>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Filter unit or block..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none bg-white"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b bg-slate-50/30">
                        <th className="px-8 py-5">Unit Info</th>
                        <th className="px-8 py-5 text-center">Location</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFlats.map((f) => (
                        <tr key={f.id} className="hover:bg-blue-50/40 transition-all group">
                          <td className="px-8 py-5">
                            <span className="font-bold text-slate-700 block">{f.flat_number}</span>
                            <span className="text-[10px] text-slate-400 font-medium">UNIT-ID: #{f.id}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                                Block {f.block}
                              </span>
                              <span className="text-slate-400 text-xs">{f.floor}F</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() => handleDelete(f.id, f.flat_number)}
                              disabled={deletingId === f.id}
                              className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              {deletingId === f.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
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