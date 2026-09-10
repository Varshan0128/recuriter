import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Home from './components/Home'
import RecruiterPortal from './components/RecruiterPortal'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* The root URL is the public homepage shown before entering the dashboard. */}
          <Route path="/" element={<Home />} />
          {/* Authentication has been removed. Keep old URLs pointing to the public homepage. */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/hr/home" element={<Home />} />
          <Route path="/hr/dashboard" element={<RecruiterPortal page="dashboard" />} />
          <Route path="/hr/post-job" element={<RecruiterPortal page="post-job" />} />
          <Route path="/hr/jobs" element={<RecruiterPortal page="jobs" />} />
          <Route path="/hr/applications" element={<RecruiterPortal page="applications" />} />
          {/* Keep the navigation label's descriptive Candidates URL compatible with the existing page. */}
          <Route path="/hr/candidates" element={<RecruiterPortal page="applications" />} />
          <Route path="/hr/shortlisted" element={<RecruiterPortal page="shortlisted" />} />
          {/* Keep the descriptive Analytics URL compatible with the existing page. */}
          <Route path="/hr/analytics" element={<RecruiterPortal page="shortlisted" />} />
          <Route path="/hr/interviews" element={<RecruiterPortal page="interviews" />} />
          <Route path="/hr/company" element={<RecruiterPortal page="company" />} />
          <Route path="/hr/settings" element={<RecruiterPortal page="settings" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
