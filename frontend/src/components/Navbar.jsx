<<<<<<< HEAD
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
=======
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'

const pageMeta = {
  '/dashboard': {
    title: 'Performance Snapshot',
    subtitle: 'A cleaner view of account health, access level, and profile readiness.',
  },
  '/profile': {
    title: 'Profile Studio',
    subtitle: 'Manage your profile, and for admins, curate the full member directory.',
  },
  '/settings': {
    title: 'System Preferences',
    subtitle: 'Security, integrations, and account defaults.',
  },
  '/participation': {
    title: 'Participation Tracking',
    subtitle: 'Separate participation history and request flow powered by sports module data.',
  },
  '/feedback': {
    title: 'Feedback System',
    subtitle: 'Collect and review experience feedback in a dedicated page.',
  },
  '/notifications': {
    title: 'Notification Center',
    subtitle: 'Read participation and feedback updates in one place.',
  },
  '/activity-admin': {
    title: 'Activity Admin Review',
    subtitle: 'Admin review area for participation and feedback records.',
  },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const meta = pageMeta[location.pathname] || {
    title: 'SportSphere',
    subtitle: 'Student sports platform',
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7dac3] bg-[#fff8ef]/90 px-4 py-4 backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
            className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8c6ab] bg-[#fffdf8] text-primary shadow-sm md:hidden"
          >
            ☰
          </button>
          <div className="min-w-0">
            <div className="inline-flex rounded-full border border-[#e7dac3] bg-[#efe3d3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              Control Panel
            </div>
            <h1 className="mt-3 break-words text-xl font-black tracking-tight text-primary sm:text-2xl">{meta.title}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6f675d]">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div className="hidden min-w-0 items-center gap-3 rounded-2xl border border-[#e7dac3] bg-[#fffdf8]/92 px-4 py-3 shadow-sm xl:flex">
            <div className="text-right">
              <div className="text-xs uppercase tracking-[0.3em] text-[#8c7d69]">Signed in</div>
              <div className="max-w-[15rem] truncate text-sm font-semibold text-primary">{user?.email || 'No email'}</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-[#254e6f] to-sportgreen text-lg font-bold text-[#fff8ef] shadow-lg shadow-[rgba(23,50,77,0.22)]">
              {user?.name?.[0] || 'U'}
            </div>
          </div>

          <Link
            to="/notifications"
            aria-label="Open notifications"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d8c6ab] bg-[#fffdf8] text-lg font-semibold text-primary shadow-sm transition hover:border-accent hover:text-primary"
          >
            <IoNotificationsOutline className="text-[1.35rem]" />
          </Link>

          <button
            onClick={logout}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#d8c6ab] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-primary shadow-sm transition hover:border-accent hover:text-primary"
          >
            Logout
          </button>
        </div>
>>>>>>> origin/main
      </div>
    </header>
  )
}
