import React, { useState } from "react";
import API from "../services/api";
import ResidentSidebar from "./components/ResidentSidebar";
import { 
  AlertCircle, 
  Upload, 
  MessageSquare, 
  FileText, 
  Send, 
  Menu,
  X,
  CheckCircle2,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

const Complaint = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const clearForm = () => {
    setTitle("");
    setDesc("");
    setFile(null);
    setPreview(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !desc) {
      setStatus({ type: "error", msg: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    if (file) formData.append("image", file);

    try {
      await API.post("/resident/complaint", formData);
      setStatus({ type: "success", msg: "Complaint registered successfully! The admin will review it soon." });
      clearForm();
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to submit. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <ResidentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 ${isSidebarOpen ? "blur-sm lg:blur-none" : ""}`}>
        
        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white p-4 sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-blue-400" size={20} />
            <span className="font-bold tracking-tight text-sm uppercase">Help Center</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-800 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10 max-w-4xl mx-auto">
          
          {/* HEADER */}
          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Raise a Complaint</h1>
            <p className="text-slate-500 font-medium mt-1">Found something broken? Let us know and we'll fix it.</p>
          </header>

          {/* STATUS NOTIFICATIONS */}
          {status.msg && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border ${
              status.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                : "bg-rose-50 border-rose-100 text-rose-700"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-bold">{status.msg}</p>
              <button onClick={() => setStatus({ type: "", msg: "" })} className="ml-auto opacity-50 hover:opacity-100">
                <X size={18} />
              </button>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <form onSubmit={submit} className="p-6 md:p-10 space-y-8">
              
              {/* COMPLAINT TITLE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Issue Title</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    placeholder="Briefly describe the issue (e.g. Lift not working)"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 font-medium"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Detailed Description</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <textarea
                    rows="4"
                    placeholder="Provide details that will help our maintenance team..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-800 font-medium resize-none"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD AREA */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Attachment (Optional)</label>
                {!preview ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="text-blue-500" size={24} />
                      </div>
                      <p className="text-sm text-slate-500 font-bold tracking-tight">Upload a Photo</p>
                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter font-bold">PNG, JPG up to 5MB</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
                ) : (
                  <div className="relative rounded-[2rem] overflow-hidden border-2 border-blue-100 group">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => {setFile(null); setPreview(null);}}
                        className="bg-white text-rose-600 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white font-extrabold py-5 rounded-[1.5rem] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      File Official Complaint
                    </>
                  )}
                </button>
                <p className="mt-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Ticket will be sent to society administrator
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Complaint;