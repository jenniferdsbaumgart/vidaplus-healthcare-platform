import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminPanelPage from "../pages/main/AdminPanelPage";
import AppointmentSchedulePage from "../pages/appointments/AppointmentSchedulePage";
import LoginPage from "../pages/auth/LoginPage";
import NewExamPage from "../pages/exams/NewExamPage";
import NotFoundPage from "../pages/NotFoundPage";
import NewPatientPage from "../pages/patients/NewPatientPage";
import PatientDetailsPage from "../pages/patients/PatientDetailsPage";
import PatientListPage from "../pages/patients/PatientListPage";
import NewPrescriptionPage from "../pages/prescriptions/NewPrescriptionPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ReportsPage from "../pages/reports/ReportsPage";
import NewStaffPage from "../pages/staff/NewStaffPage";
import StaffDetailsPage from "../pages/staff/StaffDetailsPage";
import StaffListPage from "../pages/staff/StaffListPage";
import NewTeleconsultationPage from "../pages/telemedicine/NewTeleconsultationPage";
import TelemedicinePage from "../pages/telemedicine/TelemedicinePage";
import { useAuth } from "../hooks/useAuth";
import SignUpPage from "../pages/auth/SignUpPage";
import AppointmentsPage from "../pages/appointments/AppointmentsPage";
import StaffPanelPage from "../pages/main/StaffPanelPage";
import PatientPanelPage from "../pages/main/PatientPanelPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            user?.role === "admin" ? (
              <AdminPanelPage />
            ) : user?.role === "doctor" ||
              user?.role === "nurse" ||
              user?.role === "technician" ? (
              <StaffPanelPage />
            ) : user?.role === "patient" ? (
              <PatientPanelPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />


        {/* Patients */}
        <Route
          path="patients"
          element={
            user?.role === "admin" || user?.role === "doctor" ? (
              <PatientListPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="patients/new"
          element={
            user?.role === "admin" || user?.role === "doctor" ? (
              <NewPatientPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="patients/:id"
          element={
            user?.role === "admin" || user?.role === "doctor" ? (
              <PatientDetailsPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="patients/:patientId/prescriptions/new"
          element={
            user?.role === "admin" || user?.role === "doctor" ? (
              <NewPrescriptionPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="patients/:patientId/exams/new"
          element={
            user?.role === "admin" || user?.role === "doctor" ? (
              <NewExamPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Staff */}
        <Route
          path="staff"
          element={
            user?.role === "admin" ? (
              <StaffListPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="staff/new"
          element={
            user?.role === "admin" ? (
              <NewStaffPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="staff/:id"
          element={
            user?.role === "admin" ? (
              <StaffDetailsPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Telemedicine - accessible to all authenticated users */}
        <Route path="telemedicine" element={<TelemedicinePage />} />
        <Route path="telemedicine/new" element={<NewTeleconsultationPage />} />

        {/* Appointments */}
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route
          path="appointments/schedule"
          element={<AppointmentSchedulePage />}
        />

        {/* Reports */}
        <Route
          path="reports"
          element={
            user?.role === "admin" ? (
              <ReportsPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Profile */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
