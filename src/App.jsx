import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/national-command" element={<NationalCommandCentre />} />
        <Route path="/live-queue" element={<LiveQueueControl />} />
        <Route path="/procurement" element={<ProcurementWorkspace />} />
        <Route path="/smart-congestion" element={<SmartCongestion />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
