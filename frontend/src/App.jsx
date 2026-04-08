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
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/event/:id" element={<EventLandingPage />} />
      <Route path="/dashboard" element={<Navigate to="/events" replace />} />

      <Route
        path="/events"
        element={<ProtectedRoute><EventsPage /></ProtectedRoute>}
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
        path="/events/create"
        element={<AdminRoute><CreateEventPage /></AdminRoute>}
      />
      <Route
        path="/events/edit/:id"
        element={<AdminRoute><EditEventPage /></AdminRoute>}
      />
      <Route
        path="/registrations"
        element={<AdminRoute><RegistrationsPage /></AdminRoute>}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}