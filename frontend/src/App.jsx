import { Routes, Route } from 'react-router-dom'
import LandingPage        from './pages/LandingPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import Dashboard          from './pages/Dashboard'
import NewsPage           from './pages/NewsPage'
import GalleryPage        from './pages/GalleryPage'
import EventsPage         from './pages/EventsPage'
import RealTimePage       from './pages/RealTimePage'
import ProfilePage        from './pages/ProfilePage'
import SettingsPage       from './pages/SettingsPage'
import NotFoundPage       from './pages/NotFoundPage'
import ProtectedRoute     from './components/ProtectedRoute'
import AdminRoute         from './components/AdminRoute'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected — any logged-in user */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/news"      element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
      <Route path="/gallery"   element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
      <Route path="/events"    element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route path="/realtime"  element={<ProtectedRoute><RealTimePage /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/profile"  element={<AdminRoute><ProfilePage /></AdminRoute>} />
      <Route path="/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
