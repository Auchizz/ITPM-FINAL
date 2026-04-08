import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LinkItem({ to, label, icon, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
          isActive
            ? 'bg-[#fff8ef] text-primary shadow-lg shadow-[rgba(0,0,0,0.08)]'
            : 'text-[#f0e7d8]/78 hover:bg-[#fff8ef]/10 hover:text-[#fff8ef]'
        }`
      }
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/10 text-lg transition-colors group-hover:bg-[#fff8ef]/10">
        {icon}
      </span>
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </NavLink>
  )
}

function SidebarContent({ user, onNavigate }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '◫', end: true },
    { to: '/dashboard/module', label: 'Sports Module', icon: '◆' },
    { to: '/participation', label: 'Participation', icon: '◉' },
    { to: '/feedback', label: 'Feedback', icon: '✎' },
    { to: '/profile', label: 'Profiles', icon: '◎' },
    ...(user?.role === 'admin' ? [{ to: '/users', label: 'User Management', icon: '▣' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/activity-admin', label: 'Activity Admin', icon: '▤' }] : []),
    { to: '/settings', label: 'Settings', icon: '⚙' },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-[#274965] bg-gradient-to-b from-primary via-[#1e4260] to-sportgreen p-5 text-[#fff8ef] shadow-2xl shadow-[rgba(23,50,77,0.18)] sm:p-6">
      <div className="mb-8">
        <div className="inline-flex rounded-full border border-[#fff8ef]/15 bg-[#fff8ef]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#fff8ef]/72">
          SportSphere
        </div>
        <h2 className="mt-4 text-xl font-black tracking-tight sm:text-2xl">Campus Sport Hub</h2>
        <p className="mt-2 text-sm leading-6 text-[#fff8ef]/74">
          Profiles, access, and student identity in one place.
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <div key={item.to} onClick={onNavigate}>
            <LinkItem {...item} />
          </div>
        ))}
      </nav>

      <div className="mt-auto rounded-[24px] border border-[#fff8ef]/10 bg-[#fff8ef]/10 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff8ef] text-lg font-bold text-primary">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user?.name || 'User'}</div>
            <div className="truncate text-xs uppercase tracking-[0.25em] text-[#fff8ef]/60">
              {user?.role || 'student'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ className = '' }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setOpen((prev) => !prev)
    window.addEventListener('toggleSidebar', handler)
    return () => window.removeEventListener('toggleSidebar', handler)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return undefined
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <aside className={`hidden h-screen w-72 shrink-0 md:sticky md:top-0 md:block ${className}`}>
        <SidebarContent user={user} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-primary/45 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[88vw] max-w-80">
            <div className="relative h-full">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#fff8ef]/15 bg-[#fff8ef]/10 text-[#fff8ef]"
              >
                ✕
              </button>
              <SidebarContent user={user} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
