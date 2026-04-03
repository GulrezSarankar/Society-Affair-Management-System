import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

export default function WatchmanDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    purpose: "",
    resident_id: ""
  });

  // 🔄 Fetching Data (Wrapped in useCallback for stability)
  const fetchVisitors = useCallback(async () => {
    try {
      const res = await API.get("/watchman/all");
      setVisitors(res.data || []);
    } catch (err) {
      console.error("Error fetching visitors:", err);
    }
  }, []);

  const fetchResidents = useCallback(async () => {
    try {
      const res = await API.get("/watchman/residents");
      setResidents(res.data || []);
    } catch (err) {
      console.error("Error fetching residents:", err);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
    fetchResidents();
  }, [fetchVisitors, fetchResidents]);

  // 📝 Universal Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ➕ Add Visitor
  const addVisitor = async () => {
    if (!form.name || !form.phone || !form.resident_id) {
      return alert("⚠️ Please fill all required fields");
    }

    setLoading(true);
    try {
      await API.post("/watchman/add", form);
      alert("Visitor added successfully 🚪");
      
      setForm({ name: "", phone: "", purpose: "", resident_id: "" });
      fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding visitor");
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Update Status (Approve/Reject)
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/watchman/update/${id}?status=${status}`);
      fetchVisitors();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // 🏁 Checkout
  const checkout = async (id) => {
    try {
      await API.put(`/watchman/checkout/${id}`);
      fetchVisitors();
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">👮 Watchman Dashboard</h1>
        <button 
          onClick={fetchVisitors} 
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          🔄 Refresh List
        </button>
      </header>

      {/* --- ADD VISITOR SECTION --- */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
        <h2 className="font-semibold mb-4 text-gray-700">Add New Visitor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            name="name"
            placeholder="Visitor Name"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            name="purpose"
            placeholder="Purpose (Optional)"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.purpose}
            onChange={handleChange}
          />
          <select
            name="resident_id"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.resident_id}
            onChange={handleChange}
          >
            <option value="">Select Resident/Flat</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} {r.flat ? `— Flat ${r.flat}` : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={addVisitor}
          disabled={loading}
          className={`mt-4 w-full py-2 rounded font-medium transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Adding..." : "Register Visitor"}
        </button>
      </section>

      {/* --- VISITOR LIST SECTION --- */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-gray-600 font-semibold">Visitor</th>
                <th className="p-4 text-gray-600 font-semibold">Contact</th>
                <th className="p-4 text-gray-600 font-semibold">Resident</th>
                <th className="p-4 text-gray-600 font-semibold text-center">Status</th>
                <th className="p-4 text-gray-600 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length > 0 ? (
                visitors.map((v) => (
                  <tr key={v.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{v.name}</td>
                    <td className="p-4 text-gray-600">{v.phone}</td>
                    <td className="p-4">
                      <div className="text-sm">{v.resident_name || "N/A"}</div>
                      <div className="text-xs text-gray-400">{v.purpose}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        v.status === "APPROVED" ? "bg-green-100 text-green-700" :
                        v.status === "REJECTED" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {v.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => updateStatus(v.id, "APPROVED")}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(v.id, "REJECTED")}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {v.status === "APPROVED" && !v.check_out && (
                        <button
                          onClick={() => checkout(v.id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Checkout
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No active visitor logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}