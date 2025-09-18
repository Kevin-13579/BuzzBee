import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/Common/SplashScreen';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import OtpVerify from './pages/Auth/OtpVerify';
import HomePage from './pages/Passenger/HomePage';
import BusDetailsPage from './pages/Passenger/BusDetailsPage';
import TimetablePage from './pages/Passenger/TimetablePage';
import AuthorityDashboard from './pages/Authority/AuthorityDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


function RequireAuth({ children, role }) {
  const token = localStorage.getItem('sb_token');
  const userStr = localStorage.getItem('sb_user');
  if (!token) return <Navigate to="/login" replace />;
  if (role) {
    try {
      const user = JSON.parse(userStr || '{}');
      if (user.role !== role) return <Navigate to="/" replace />;
    } catch {}
  }
  return children;
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <div className="container">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OtpVerify />} />

            <Route path="/home" element={<HomePage />} />
            <Route path="/buses/:id" element={<BusDetailsPage />} />
            <Route path="/timetable/:id" element={<TimetablePage />} />

            <Route path="/authority" element={
              <RequireAuth role="authority">
                <AuthorityDashboard />
              </RequireAuth>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
