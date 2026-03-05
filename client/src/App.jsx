import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentHistory from './pages/StudentHistory';
import LiveTracking from './pages/LiveTracking';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminBuses from './pages/AdminBuses';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or an unauthorized page
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col font-sans bg-ride-white text-ride-charcoal">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />

              <Route path="/student/history" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentHistory />
                </ProtectedRoute>
              } />

              <Route path="/student/tracking" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <LiveTracking />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/students" element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminStudents />
                </ProtectedRoute>
              } />

              <Route path="/admin/buses" element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminBuses />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
