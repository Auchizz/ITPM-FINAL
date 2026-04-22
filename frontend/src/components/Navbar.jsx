import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-30 w-full"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,.07)' }}>

      <div className="flex items-center gap-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
          className="md:hidden w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base"
        >☰</button>
        <span className="font-bold text-lg text-primary hidden md:block">SportSphere</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-sm hover:bg-slate-200 transition-colors">
          🔔
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-sportgreen flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-700 leading-tight">{user?.name || 'Admin'}</div>
            <div className="text-[10px] text-slate-400 leading-tight capitalize">{user?.role || 'admin'}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
