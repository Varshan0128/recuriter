import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { LoginPage, SignupPage } from './components/AuthPages'
import RecruiterPortal from './components/RecruiterPortal'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RecruiterPortal page="home" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/hr/home" element={<Navigate to="/" replace />} />
          <Route path="/hr/dashboard" element={<RecruiterPortal page="dashboard" />} />
          <Route path="/hr/post-job" element={<RecruiterPortal page="post-job" />} />
          <Route path="/hr/jobs" element={<RecruiterPortal page="jobs" />} />
          <Route path="/hr/applications" element={<RecruiterPortal page="applications" />} />
          <Route path="/hr/shortlisted" element={<RecruiterPortal page="shortlisted" />} />
          <Route path="/hr/interviews" element={<RecruiterPortal page="interviews" />} />
          <Route path="/hr/company" element={<RecruiterPortal page="company" />} />
          <Route path="/hr/settings" element={<RecruiterPortal page="settings" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App