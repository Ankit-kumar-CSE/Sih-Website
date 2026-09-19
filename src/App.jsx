import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AdminAuthProvider, ProtectedRoute } from './store/adminAuth'
import Login from './pages/Login'
import NationalCommandCentre from './pages/NationalCommandCentre'
import LiveQueueControl from './pages/LiveQueueControl'
import ProcurementWorkspace from './pages/ProcurementWorkspace'
import SmartCongestion from './pages/SmartCongestion'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AdminAuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/national-command" element={
          <ProtectedRoute><NationalCommandCentre /></ProtectedRoute>
        } />
        <Route path="/live-queue" element={
          <ProtectedRoute><LiveQueueControl /></ProtectedRoute>
        } />
        <Route path="/procurement" element={
          <ProtectedRoute><ProcurementWorkspace /></ProtectedRoute>
        } />
        <Route path="/smart-congestion" element={
          <ProtectedRoute><SmartCongestion /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminAuthProvider>
  )
}
