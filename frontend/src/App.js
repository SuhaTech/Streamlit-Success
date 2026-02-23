import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import InternalGuideDashboard from "./pages/InternalGuideDashboard";
import HODDashboard from "./pages/HODDashboard";
import DeanDashboard from "./pages/DeanDashboard";
import PlacementCellDashboard from "./pages/PlacementCellDashboard";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Dashboards */}
          <Route path="/student-dashboard" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin-dashboard" element={
            <PrivateRoute allowedRoles={['placement_cell']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/recruiter-dashboard" element={
            <PrivateRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </PrivateRoute>
          } />
          <Route path="/mentor-dashboard" element={
            <PrivateRoute allowedRoles={['mentor']}>
              <MentorDashboard />
            </PrivateRoute>
          } />
          <Route path="/guide-dashboard" element={
            <PrivateRoute allowedRoles={['internal_guide']}>
              <InternalGuideDashboard />
            </PrivateRoute>
          } />
          <Route path="/placement-dashboard" element={
            <PrivateRoute allowedRoles={['placement_cell']}>
              <PlacementCellDashboard />
            </PrivateRoute>
          } />
          <Route path="/hod-dashboard" element={
            <PrivateRoute allowedRoles={['hod']}>
              <HODDashboard />
            </PrivateRoute>
          } />
          <Route path="/dean-dashboard" element={
            <PrivateRoute allowedRoles={['dean']}>
              <DeanDashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['student','recruiter','mentor','internal_guide','placement_cell','hod','dean']}>
              <StudentDashboard />
            </PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
