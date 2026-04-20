import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="w-full flex items-center justify-between px-4 md:px-6 py-3 bg-white shadow sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
          className="md:hidden p-2 rounded-lg bg-slate-100">
          ☰
        </button>
        <div className="text-xl font-semibold text-primary">SportSphere</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <input placeholder="Search..." className="px-3 py-2 rounded-lg border w-64" />
        </div>
        <button className="p-2 text-slate-600">🔔</button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sportgreen flex items-center justify-center text-white">{user?.name?.[0] || 'U'}</div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-500">{user?.role || 'member'}</div>
          </div>
          <button onClick={logout} className="ml-2 text-sm text-danger">Logout</button>
        </div>
      </div>
    </header>
  )
}
