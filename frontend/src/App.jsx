import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Login from "./pages/AdminPages/Login";
import Dashboard from "./pages/AdminPages/Dashboard";
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
import WatchmanVisitorHistory from "./pages/Watchmen/wathcmenHistory";
import ResidentVisitorApproval from "./RecidentsPages/ResidentApproval";
import WatchmanRegister from "./pages/Watchmen/watchmenRegister";
import WatchmanVerify from "./pages/Watchmen/watchmenVerify";
import ForgotVerifyOTP from "./RecidentsPages/forgotverifyotp";
import Register from "./pages/AdminPages/AdminRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home (Public Always) */}
        <Route path="/" element={<Home />} />

        {/* Admin Public */}
        <Route path="admin-register" element={
          <PublicRoute><Register /></PublicRoute>
        }/>

        <Route path="/Admin-Login" element={
          <PublicRoute><Login /></PublicRoute>
        } />

        {/* Resident Public */}
        <Route path="/register" element={
          <PublicRoute><ResidentRegister /></PublicRoute>
        }/>

        <Route path="/login" element={
          <PublicRoute><RecidentsLogin /></PublicRoute>
        }/>

        <Route path="/forgot" element={
          <PublicRoute><ForgotPassword /></PublicRoute>
        }/>

        <Route path="/verify-otp" element={
          <PublicRoute><VerifyOTP /></PublicRoute>
        }/>

        <Route path="/reset-password" element={
          <PublicRoute><ResetPassword /></PublicRoute>
        }/>

        <Route path="verify" element={
          <PublicRoute><ForgotVerifyOTP /></PublicRoute>
        }/>

        {/* Watchman Public */}
        <Route path="/watchmen-login" element={
          <PublicRoute><WatchmanLogin /></PublicRoute>
        }/>

        <Route path="/watchmen-register" element={
          <PublicRoute><WatchmanRegister /></PublicRoute>
        }/>

        <Route path="/watchmen-verify" element={
          <PublicRoute><WatchmanVerify /></PublicRoute>
        }/>

        {/* Admin Protected */}
        <Route path="/Admin-dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/Admin-residents" element={
          <ProtectedRoute><Users /></ProtectedRoute>
        }/>

        <Route path="/Admin-add-residents" element={
          <ProtectedRoute><AddResident /></ProtectedRoute>
        }/>

        <Route path="/Admin-maintenence" element={
          <ProtectedRoute><Maintenance /></ProtectedRoute>
        }/>

        <Route path="Admin-Add-flats" element={
          <ProtectedRoute><Flats /></ProtectedRoute>
        }/>

        <Route path="/Admin-approvals" element={
          <ProtectedRoute><AdminApproval /></ProtectedRoute>
        }/>

        <Route path="/Admin-complaint" element={
          <ProtectedRoute><AdminComplaints /></ProtectedRoute>
        }/>

        {/* Resident Protected */}
        <Route path="/Resident-dashboard" element={
          <ProtectedRoute><ResidentDashboard /></ProtectedRoute>
        }/>

        <Route path="/Resident-complaint" element={
          <ProtectedRoute><Complaint /></ProtectedRoute>
        }/>

        <Route path="/resident-complaint-history" element={
          <ProtectedRoute><ResidentComplaintHistory /></ProtectedRoute>
        }/>

        <Route path="payment-history" element={
          <ProtectedRoute><PaymentHistory /></ProtectedRoute>
        }/>

        <Route path="/resident-approval" element={
          <ProtectedRoute><ResidentVisitorApproval /></ProtectedRoute>
        }/>

        {/* Watchman Protected */}
        <Route path="/watchman-dashboard" element={
          <ProtectedRoute><WatchmanDashboard /></ProtectedRoute>
        }/>

        <Route path="/add-visitor" element={
          <ProtectedRoute><WatchmanAddVisitor /></ProtectedRoute>
        }/>

        <Route path="/wathcman-history" element={
          <ProtectedRoute><WatchmanVisitorHistory /></ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;