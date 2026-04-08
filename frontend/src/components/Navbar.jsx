import { useAuth } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/news':      'News & Announcements',
  '/gallery':   'Gallery & Highlights',
  '/events':    'Upcoming Events',
  '/realtime':  'Real-Time Info',
  '/profile':   'My Profile',
  '/settings':  'Settings',
}

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const isAdmin = user?.role === 'admin'

  return (
    <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-30 w-full"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,.07)' }}>

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base"
        >☰</button>
        <h1 className="font-display text-lg font-bold text-slate-900">
          {pageTitles[pathname] || 'Sportsphere'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Bell */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-sm hover:bg-slate-200 transition-colors">
          🔔
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User pill */}
        <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-slate-100 transition-colors cursor-default">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-unigreen flex items-center justify-center text-white font-bold text-xs">
            {user?.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-700 leading-tight">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">{user?.role || 'member'}</div>
          </div>
          {isAdmin && (
            <span className="badge badge-admin text-[9px] px-1.5 py-0.5">⚡ Admin</span>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          Log out
        </button>
      </div>
    </header>
  )
}
