import { Routes, Route } from "react-router-dom";
import Home from "./new_pages/Home";
import Login from "./new_pages/Login";
import Register from "./new_pages/Register";
import AdminDashboard from "./new_pages/AdminDashboard";
import UserDashboard from "./new_pages/UserDashboard";
import CollectorDashboard from "./new_pages/CollectorDashboard";
import RecyclerDashboard from "./new_pages/RecyclerDashboard";
import ManageRequests from "./new_pages/ManageRequests";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/manage-requests" element={<ManageRequests />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/collector/dashboard" element={<CollectorDashboard />} />
      <Route path="/recycler/dashboard" element={<RecyclerDashboard />} />
    </Routes>
  );
}

export default App;
