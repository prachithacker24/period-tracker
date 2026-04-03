import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

// Loading Spinner component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0a1a 0%, #1a1025 50%, #0f0a1a 100%)'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '4px solid #3f3f46',
      borderTopColor: '#a855f7',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
)

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route - redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
