import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './context/ToastContext'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import PatientDashboard from './pages/patient/PatientDashboard'
import BookAppointment from './pages/patient/BookAppointment'
import MyAppointments from './pages/patient/MyAppointments'
import SubmitFeedback from './pages/patient/SubmitFeedback'
import UpdateProfile from './pages/patient/UpdateProfile'
import DoctorEarnings from './pages/doctor/DoctorEarnings'

import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorPatients from './pages/doctor/DoctorPatients'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManagePatients from './pages/admin/ManagePatients'
import ManageDoctors from './pages/admin/ManageDoctors'
import ManageAppointments from './pages/admin/ManageAppointments'

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/patient" element={
            <ProtectedRoute roles={['PATIENT']}><PatientDashboard /></ProtectedRoute>
          } />
          <Route path="/patient/book" element={
            <ProtectedRoute roles={['PATIENT']}><BookAppointment /></ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute roles={['PATIENT']}><MyAppointments /></ProtectedRoute>
          } />
          <Route path="/patient/feedback" element={
            <ProtectedRoute roles={['PATIENT']}><SubmitFeedback /></ProtectedRoute>
          } />
          <Route path="/patient/profile" element={
            <ProtectedRoute roles={['PATIENT']}><UpdateProfile /></ProtectedRoute>
          } />

          <Route path="/doctor" element={
            <ProtectedRoute roles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute roles={['DOCTOR']}><DoctorAppointments /></ProtectedRoute>
          } />
          <Route path="/doctor/patients" element={
            <ProtectedRoute roles={['DOCTOR']}><DoctorPatients /></ProtectedRoute>
          } />
          <Route path="/doctor/earnings" element={
            <ProtectedRoute roles={['DOCTOR']}><DoctorEarnings /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/patients" element={
            <ProtectedRoute roles={['ADMIN']}><ManagePatients /></ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute roles={['ADMIN']}><ManageDoctors /></ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute roles={['ADMIN']}><ManageAppointments /></ProtectedRoute>
          } />

          <Route path="/unauthorized" element={
            <div style={{textAlign:'center',padding:'60px'}}>
              <h2>Access Denied</h2>
              <p>You do not have permission to view this page.</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
