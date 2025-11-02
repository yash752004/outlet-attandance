import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import StaffDashboard from './components/staff/StaffDashboard';
import Login from './components/admin/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import { isAdminLoggedIn } from './utils/auth';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isAdminLoggedIn());
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  UltraDenim Attendance
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/staff"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Staff
                </Link>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard />
              ) : (
                <Login onLoginSuccess={() => setIsAdmin(true)} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home Page Component
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to UltraDenim Attendance System
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Wi-Fi Authenticated Attendance Management
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/staff"
            className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow"
          >
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Staff Dashboard</h2>
            <p className="text-gray-600">
              Punch in/out, view your attendance history, and track working hours
            </p>
          </Link>
          
          <Link
            to="/admin"
            className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow"
          >
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Admin Panel</h2>
            <p className="text-gray-600">
              Manage attendance, configure staff settings, and export reports
            </p>
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="text-2xl mb-2">📡</div>
              <p>Wi-Fi Verification</p>
            </div>
            <div>
              <div className="text-2xl mb-2">⏱️</div>
              <p>Live Timer</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📊</div>
              <p>Attendance Reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
