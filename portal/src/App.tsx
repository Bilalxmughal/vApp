import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ModerationQueue } from './pages/ModerationQueue'
import { Dashboard } from './pages/Dashboard'
import { Layout } from './components/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/moderation" element={<ModerationQueue />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
