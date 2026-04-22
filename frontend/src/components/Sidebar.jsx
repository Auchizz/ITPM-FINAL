import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${isActive ? 'bg-white/15 font-semibold' : 'text-white/90'}`
    }
  >
    {children}
  </NavLink>
)

export default function Sidebar({ className = '' }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(prev => !prev)
    window.addEventListener('toggleSidebar', handler)
    return () => window.removeEventListener('toggleSidebar', handler)
  }, [])

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      <LinkItem to="/dashboard">Dashboard</LinkItem>
      <LinkItem to="/events">Events</LinkItem>
      <LinkItem to="/my-events">My Events</LinkItem>
      {isAdmin && <LinkItem to="/events/create">Create Event</LinkItem>}
      {isAdmin && <LinkItem to="/registrations">Registrations</LinkItem>}
      {isAdmin && <LinkItem to="/users">User Management</LinkItem>}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col w-64 min-h-screen bg-primary text-white p-4 ${className}`}>
        <div className="text-2xl font-bold mb-6">SportSphere</div>
        <NavLinks />
        <div className="mt-auto pt-4 text-xs text-white/50">© 2025 SportSphere</div>
      </aside>

      {/* Mobile overlay sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-primary text-white p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold">SportSphere</div>
              <button onClick={() => setOpen(false)} className="p-2 rounded bg-white/10">✕</button>
            </div>
            <NavLinks />
          </div>
        </div>
      )}
    </>
  )
}
