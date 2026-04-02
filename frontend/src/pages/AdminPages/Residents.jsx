import { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "./components/sidebar";
import { 
  Search, 
  Trash2, 
  RefreshCw, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle,
  Clock,
  MoreHorizontal, 
  Menu 
} from "lucide-react";

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchResidents = async () => {
    try {
      setLoading(true);

      // 🔥 Only residents
      const res = await API.get("/auth/residents");

      setResidents(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 APPROVE USER
  const approveUser = async (id) => {
    try {
      await API.put(`/auth/approve-user/${id}`);
      fetchResidents();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this resident?")) return;
    try {
      await API.delete(`/auth/user/${id}`);
      fetchResidents();
    } catch (err) {
      alert("Cannot delete admin");
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  // 🔥 FILTER ONLY RESIDENTS + SEARCH
  const filteredResidents = residents
    .filter(r => r.role === "RESIDENT")
    .filter(r => 
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''}`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b p-4 flex justify-between items-center">
          <h1 className="font-bold">SocietySync</h1>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Residents</h1>

            <input
              type="text"
              placeholder="Search..."
              className="border px-3 py-2 rounded"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-center">Flat</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center">Loading...</td>
                  </tr>
                ) : filteredResidents.length > 0 ? (
                  filteredResidents.map((r) => (
                    <tr key={r.id} className="border-t">

                      {/* USER */}
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-sm text-gray-500">{r.email}</p>
                        </div>
                      </td>

                      {/* FLAT */}
                      <td className="p-4 text-center">
                        {r.flat_number || "N/A"} - {r.block || "-"}
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        {r.is_approved ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={14} /> Approved
                          </span>
                        ) : (
                          <span className="text-yellow-600 flex items-center gap-1">
                            <Clock size={14} /> Pending
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right flex gap-2 justify-end">

                        {/* APPROVE BUTTON */}
                        {!r.is_approved && (
                          <button
                            onClick={() => approveUser(r.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Approve
                          </button>
                        )}

                        {/* DELETE */}
                        <button
                          onClick={() => deleteUser(r.id)}
                          className="text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center">
                      No residents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}