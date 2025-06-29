import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import PatientListPage from './pages/patients/PatientListPage';
import NewPatientPage from './pages/patients/NewPatientPage';
import PatientDetailsPage from './pages/patients/PatientDetailsPage';
import StaffListPage from './pages/staff/StaffListPage';
import NewStaffPage from './pages/staff/NewStaffPage';
import StaffDetailsPage from './pages/staff/StaffDetailsPage';
import AdminPanelPage from './pages/admin/AdminPanelPage';
import TelemedicinePage from './pages/telemedicine/TelemedicinePage';
import NewTeleconsultationPage from './pages/telemedicine/NewTeleconsultationPage';
import NewPrescriptionPage from './pages/prescriptions/NewPrescriptionPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AppointmentSchedulePage from './pages/appointments/AppointmentSchedulePage';
import ReportsPage from './pages/reports/ReportsPage';
import NewExamPage from './pages/exams/NewExamPage';
import SignUpPage from './pages/auth/SignUpPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
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
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="appointments/schedule" element={<AppointmentSchedulePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;