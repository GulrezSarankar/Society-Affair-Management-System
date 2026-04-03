import { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "./components/sidebar";
import { Trash2, CheckCircle, Clock, Menu } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedFlats, setSelectedFlats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔥 FETCH ALL USERS
  const fetchData = async () => {
    try {
      setLoading(true);

      const [userRes, flatRes] = await Promise.all([
        API.get("/auth/all-users"),
        API.get("/flats"),
      ]);

      setUsers(userRes.data || []);
      setFlats(flatRes.data || []);

    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 APPROVE USER
  const approveUser = async (user) => {
    const flat_id = selectedFlats[user.id];

    // Only for resident
    if (user.role === "RESIDENT" && !flat_id) {
      alert("⚠️ Please select flat first");
      return;
    }

    try {
      const url =
        user.role === "RESIDENT"
          ? `/auth/approve-user/${user.id}?flat_id=${flat_id}`
          : `/auth/approve-user/${user.id}`;

      await API.put(url);

      alert("✅ User approved");
      fetchData();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Approval failed");
    }
  };

  // 🔥 DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/auth/user/${id}`);
      alert("🗑 User deleted");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Cannot delete");
    }
  };

  // 🔥 SEARCH FILTER
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 w-full lg:ml-64">

        {/* MOBILE HEADER */}
        <div className="lg:hidden bg-white border-b p-4 flex justify-between">
          <h1 className="font-bold">SocietySync</h1>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 md:p-8">

          {/* HEADER */}
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">All Users</h1>

            <input
              type="text"
              placeholder="Search user..."
              className="border px-3 py-2 rounded"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-center">Role</th>
                  <th className="p-4 text-center">Flat</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t">

                      {/* NAME */}
                      <td className="p-4">
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </td>

                      {/* ROLE */}
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          u.role === "WATCHMAN"
                            ? "bg-yellow-100 text-yellow-700"
                            : u.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      {/* FLAT */}
                      <td className="p-4 text-center">
                        {u.role === "RESIDENT" ? (
                          u.flat_number
                            ? `${u.flat_number} (${u.block})`
                            : (
                              <>
                                <select
                                  className="border p-1 mt-1"
                                  value={selectedFlats[u.id] || ""}
                                  onChange={(e) =>
                                    setSelectedFlats({
                                      ...selectedFlats,
                                      [u.id]: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Assign Flat</option>
                                  {flats.map((f) => (
                                    <option key={f.id} value={f.id}>
                                      {f.flat_number} ({f.block})
                                    </option>
                                  ))}
                                </select>
                              </>
                            )
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        {u.is_approved ? (
                          <span className="text-green-600 flex gap-1 items-center">
                            <CheckCircle size={14} /> Approved
                          </span>
                        ) : (
                          <span className="text-yellow-600 flex gap-1 items-center">
                            <Clock size={14} /> Pending
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right flex gap-2 justify-end">

                        {!u.is_approved && u.role !== "ADMIN" && (
                          <button
                            onClick={() => approveUser(u)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Approve
                          </button>
                        )}

                        {u.role !== "ADMIN" && (
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-6">
                      🚫 No users found
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