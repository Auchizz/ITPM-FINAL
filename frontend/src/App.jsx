import { Routes, Route } from 'react-router-dom'
<<<<<<< HEAD
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
=======
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import UserManagementPage from './pages/UserManagementPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AppShell from './layouts/AppShell'
import ModuleLayout from './layouts/ModuleLayout'
import ModuleAdminLoginPage from './pages/module/ModuleAdminLoginPage'
import ModuleAdminPortalPage from './pages/module/ModuleAdminPortalPage'
import HomePage from './pages/public/HomePage'
import SportsClubsPage from './pages/public/SportsClubsPage'
import JoinTeamPage from './pages/public/JoinTeamPage'
import MatchesPage from './pages/public/MatchesPage'
import PlayersPage from './pages/public/PlayersPage'
import FacilitiesPage from './pages/public/FacilitiesPage'
import ParticipationPage from './pages/ParticipationPage'
import FeedbackPage from './pages/FeedbackPage'
import NotificationsPage from './pages/NotificationsPage'
import ActivityAdminPage from './pages/ActivityAdminPage'
>>>>>>> origin/main

export default function App() {
  return (
    <Routes>
<<<<<<< HEAD
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
=======
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/module-admin/login" element={<ModuleAdminLoginPage />} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
      />
      <Route
        path="/participation"
        element={<ProtectedRoute><ParticipationPage /></ProtectedRoute>}
      />
      <Route
        path="/feedback"
        element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>}
      />
      <Route
        path="/notifications"
        element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>}
      />
      <Route
        path="/users"
        element={<AdminRoute><UserManagementPage /></AdminRoute>}
      />
      <Route
        path="/activity-admin"
        element={<AdminRoute><ActivityAdminPage /></AdminRoute>}
      />

      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/dashboard/module" element={<ModuleLayout />}>
          <Route index element={<HomePage />} />
          <Route path="directory" element={<SportsClubsPage />} />
          <Route path="join" element={<JoinTeamPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="players" element={<PlayersPage />} />
          <Route path="facilities" element={<FacilitiesPage />} />
        </Route>
      </Route>

      <Route
        element={
          <AdminRoute redirectTo="/module-admin/login" fallbackTo="/dashboard/module">
            <AppShell />
          </AdminRoute>
        }
      >
        <Route path="/dashboard/module" element={<ModuleLayout />}>
          <Route path="admin" element={<ModuleAdminPortalPage />} />
        </Route>
      </Route>
>>>>>>> origin/main

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
