import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { section: 'Main' },
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/news',      icon: '📰', label: 'News & Announcements' },
  { section: 'Campus' },
  { to: '/gallery',   icon: '🖼️',  label: 'Gallery & Highlights' },
  { to: '/events',    icon: '🏆', label: 'Upcoming Events' },
  { section: 'Live' },
  { to: '/realtime',  icon: '⏱️',  label: 'Real-Time Info' },
]

const adminLinks = [
  { section: 'Account' },
  { to: '/profile',  icon: '👤', label: 'My Profile' },
  { to: '/settings', icon: '⚙️',  label: 'Settings' },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const allLinks = isAdmin ? [...links, ...adminLinks] : links

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-[9px] font-bold tracking-[.18em] uppercase text-white/40 mb-1">
          University Sports &amp; Events
        </div>
        <div className="font-display text-lg font-bold text-white tracking-tight">
          Sportsphere
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {allLinks.map((item, i) =>
          item.section ? (
            <div
              key={i}
              className="text-[9.5px] font-bold tracking-[.13em] uppercase text-white/35 px-3 pt-3 pb-1 mt-1"
            >
              {item.section}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
                ${isActive
                  ? 'bg-white/15 text-white font-bold sidebar-link-active'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'}`
              }
            >
              <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-sm flex-shrink-0">
                {item.icon}
              </div>
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/10 text-[11px] text-white/35">
        © 2025 Sportsphere · IT Dept
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden md:flex flex-col w-64 bg-primary text-white fixed left-0 top-0 h-screen z-40"
        style={{ boxShadow: '4px 0 20px rgba(30,58,138,.2)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/45" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-primary text-white flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="font-display text-lg font-bold text-white">Sportsphere</div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-sm"
              >✕</button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
