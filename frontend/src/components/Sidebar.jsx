import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white/20 text-white font-semibold'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`
    }
  >
    {children}
  </NavLink>
)

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(prev => !prev)
    window.addEventListener('toggleSidebar', handler)
    return () => window.removeEventListener('toggleSidebar', handler)
  }, [])

  const NavLinks = () => (
    <nav className="flex flex-col gap-0.5">
      <LinkItem to="/dashboard">Dashboard</LinkItem>
      <LinkItem to="/events">Events</LinkItem>
      <LinkItem to="/my-events">My Events</LinkItem>
      <LinkItem to="/news">News</LinkItem>
      <LinkItem to="/gallery">Gallery</LinkItem>
      <LinkItem to="/realtime">Real Time</LinkItem>
      <LinkItem to="/feedback">Feedback</LinkItem>
      <LinkItem to="/notifications">Notifications</LinkItem>
      <LinkItem to="/participation">Participation</LinkItem>
      <LinkItem to="/profile">Profile</LinkItem>
      <LinkItem to="/settings">Settings</LinkItem>
      {isAdmin && <LinkItem to="/events/create">Create Event</LinkItem>}
      {isAdmin && <LinkItem to="/registrations">Registrations</LinkItem>}
      {isAdmin && <LinkItem to="/users">User Management</LinkItem>}
      {isAdmin && <LinkItem to="/activity-admin">Activity Admin</LinkItem>}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-primary text-white flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-xl font-bold text-white">SportSphere</div>
        </div>
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-primary text-white flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <div className="text-xl font-bold">SportSphere</div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <div className="flex-1 px-3 py-4 overflow-y-auto">
              <NavLinks />
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
