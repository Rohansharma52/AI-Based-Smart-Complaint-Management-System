import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, PublicRoute, AdminRoute } from './routes/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

// Public pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

// User pages
import UserDashboard from './pages/user/Dashboard'
import MyComplaints from './pages/user/MyComplaints'
import RegisterComplaint from './pages/user/RegisterComplaint'
import UserProfile from './pages/user/Profile'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AllComplaints from './pages/admin/AllComplaints'
import Analytics from './pages/admin/Analytics'
import AdminProfile from './pages/admin/AdminProfile'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col" style={{ background: '#0a0a14' }}>
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

              {/* User routes */}
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/my-complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
              <Route path="/register-complaint" element={<ProtectedRoute><RegisterComplaint /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/complaints" element={<AdminRoute><AllComplaints /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
              <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />

              {/* Redirects */}
              <Route path="/admin" element={<AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>} />
              <Route path="/complaints" element={<ProtectedRoute><Navigate to="/my-complaints" replace /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>

        <Toaster position="top-right" toastOptions={{
          duration: 3500,
          style: {
            background: '#12121f',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '14px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#12121f' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#12121f' } }
        }} />
      </Router>
    </AuthProvider>
  )
}
