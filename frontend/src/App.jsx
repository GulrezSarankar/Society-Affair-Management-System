import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/AdminPages/Login";
import Dashboard from "./pages/AdminPages/Dashboard";
// import Residents from "./pages/AdminPages/Residents";
import AddResident from "./pages/AdminPages/AddResidents";
import Maintenance from "./pages/AdminPages/Maintainence";
import Flats from "./pages/AdminPages/AddFlats";
import RecidentsLogin from "./RecidentsPages/RecidentsLogin";
import ForgotPassword from "./RecidentsPages/ForgotPassword";
import ResetPassword from "./RecidentsPages/ResetPassword";
import VerifyOTP from "./RecidentsPages/Verify-Otp";
import Home from "./pages/Home";
import AdminApproval from "./pages/AdminPages/AdminApproval";
import ResidentDashboard from "./RecidentsPages/ResidentDashboard";
import Complaint from "./RecidentsPages/ResidentComplaint";
import AdminComplaints from "./pages/AdminPages/AdminComplaint";
import ResidentComplaintHistory from "./RecidentsPages/ResidentComplainHistory";
import ResidentRegister from "./RecidentsPages/ResidentRegister";
import PaymentHistory from "./RecidentsPages/payementhistory";
import Users from "./pages/AdminPages/Residents";
import WatchmanLogin from "./pages/Watchmen/watchmenLogin";
import WatchmanDashboard from "./pages/Watchmen/watchmenDashboard";
import WatchmanAddVisitor from "./pages/Watchmen/AddVisitor";


function App() {
  return (
    <BrowserRouter>


    {/* Admin Routes */}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Admin-Login" element={<Login/>} />
        <Route path="/Admin-dashboard" element={<Dashboard/>} />
        <Route path="/Admin-residents" element={<Users/>}/>
        <Route path="/Admin-add-residents" element={<AddResident/>}/>
        <Route path="/Admin-maintenence" element={<Maintenance/>}/>
        <Route path="Admin-Add-flats" element={<Flats/>}/>
        <Route path="/Admin-approvals" element={<AdminApproval/>}/>
        <Route path="/Admin-complaint" element={<AdminComplaints/>}/>

        {/* Recidents Routs */}
        <Route path="/register" element={<ResidentRegister/>}/>
        <Route path="/login" element={<RecidentsLogin/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
        <Route path="/reset" element={<ResetPassword/>}/>
        <Route path="/verify-otp" element={<VerifyOTP/>}/>
        <Route path="/Resident-dashboard" element={<ResidentDashboard/>}/>
        <Route path="/Resident-complaint" element={<Complaint/>}/>
        <Route path="/resident-complaint-history" element={<ResidentComplaintHistory/>}/>
        <Route path="payment-history" element={<PaymentHistory/>}/>

        {/* Watchmen Routes */}
        <Route path="/watchmen-login" element={<WatchmanLogin/>}/>
        <Route path="/watchman-dashboard" element={<WatchmanDashboard/>}/>
        <Route path="/add-visitor" element={<WatchmanAddVisitor/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;