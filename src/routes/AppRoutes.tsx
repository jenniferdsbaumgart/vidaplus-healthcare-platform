// AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminPanelPage from '../pages/admin/AdminPanelPage';
import AppointmentSchedulePage from '../pages/appointments/AppointmentSchedulePage';
import LoginPage from '../pages/auth/LoginPage';
import NewExamPage from '../pages/exams/NewExamPage';
import NotFoundPage from '../pages/NotFoundPage';
import NewPatientPage from '../pages/patients/NewPatientPage';
import PatientDetailsPage from '../pages/patients/PatientDetailsPage';
import PatientListPage from '../pages/patients/PatientListPage';
import NewPrescriptionPage from '../pages/prescriptions/NewPrescriptionPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ReportsPage from '../pages/reports/ReportsPage';
import NewStaffPage from '../pages/staff/NewStaffPage';
import StaffDetailsPage from '../pages/staff/StaffDetailsPage';
import StaffListPage from '../pages/staff/StaffListPage';
import NewTeleconsultationPage from '../pages/telemedicine/NewTeleconsultationPage';
import TelemedicinePage from '../pages/telemedicine/TelemedicinePage';
import { useAuth } from '../hooks/useAuth'; 
import SignUpPage from '../pages/auth/SignUpPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
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
      <Route path="dashboard" element={<AdminPanelPage />} />
      <Route path="patients" element={<PatientListPage />} />
      <Route path="patients/new" element={<NewPatientPage />} />
      <Route path="patients/:id" element={<PatientDetailsPage />} />
      <Route path="patients/:patientId/prescriptions/new" element={<NewPrescriptionPage />} />
      <Route path="patients/:patientId/exams/new" element={<NewExamPage />} />
      <Route path="staff" element={<StaffListPage />} />
      <Route path="staff/new" element={<NewStaffPage />} />
      <Route path="staff/:id" element={<StaffDetailsPage />} />
      <Route path="telemedicine" element={<TelemedicinePage />} />
      <Route path="telemedicine/new" element={<NewTeleconsultationPage />} />
      <Route path="appointments/schedule" element={<AppointmentSchedulePage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
