import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import EventLandingPage from './pages/EventLandingPage'
import CreateEventPage from './pages/CreateEventPage'
import EditEventPage from './pages/EditEventPage'
import RegistrationsPage from './pages/RegistrationsPage'
import MyEventsPage from './pages/MyEventsPage'
import NotFoundPage from './pages/NotFoundPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import UserManagementPage from './pages/UserManagementPage'
import NewsPage from './pages/NewsPage'
import GalleryPage from './pages/GalleryPage'
import RealTimePage from './pages/RealTimePage'
import FeedbackPage from './pages/FeedbackPage'
import NotificationsPage from './pages/NotificationsPage'
import ParticipationPage from './pages/ParticipationPage'
import ActivityAdminPage from './pages/ActivityAdminPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/event/:id" element={<EventLandingPage />} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/events"
        element={<ProtectedRoute><EventsPage /></ProtectedRoute>}
      />
      {/* /events/create must be declared before /events/:id to prevent "create" matching as an id */}
      <Route
        path="/events/create"
        element={<AdminRoute><CreateEventPage /></AdminRoute>}
      />
      <Route
        path="/events/edit/:id"
        element={<AdminRoute><EditEventPage /></AdminRoute>}
      />
      <Route
        path="/events/:id"
        element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>}
      />
      <Route
        path="/my-events"
        element={<ProtectedRoute><MyEventsPage /></ProtectedRoute>}
      />
      <Route
        path="/registrations"
        element={<AdminRoute><RegistrationsPage /></AdminRoute>}
      />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
      <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
      <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
      <Route path="/realtime" element={<ProtectedRoute><RealTimePage /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/participation" element={<ProtectedRoute><ParticipationPage /></ProtectedRoute>} />
      <Route path="/activity-admin" element={<AdminRoute><ActivityAdminPage /></AdminRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}