import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { useAuth } from './auth/AuthContext'
import { LoginPage, SignupPage } from './components/AuthPages'
import Home from './components/Home'
import RecruiterPortal from './components/RecruiterPortal'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-sm text-white">Checking your session...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/hr/home" element={<ProtectedRoute><RecruiterPortal page="home" /></ProtectedRoute>} />
          <Route path="/hr/dashboard" element={<ProtectedRoute><RecruiterPortal page="dashboard" /></ProtectedRoute>} />
          <Route path="/hr/post-job" element={<ProtectedRoute><RecruiterPortal page="post-job" /></ProtectedRoute>} />
          <Route path="/hr/jobs" element={<ProtectedRoute><RecruiterPortal page="jobs" /></ProtectedRoute>} />
          <Route path="/hr/applications" element={<ProtectedRoute><RecruiterPortal page="applications" /></ProtectedRoute>} />
          <Route path="/hr/shortlisted" element={<ProtectedRoute><RecruiterPortal page="shortlisted" /></ProtectedRoute>} />
          <Route path="/hr/interviews" element={<ProtectedRoute><RecruiterPortal page="interviews" /></ProtectedRoute>} />
          <Route path="/hr/company" element={<ProtectedRoute><RecruiterPortal page="company" /></ProtectedRoute>} />
          <Route path="/hr/settings" element={<ProtectedRoute><RecruiterPortal page="settings" /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App