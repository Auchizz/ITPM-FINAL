import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `block px-4 py-2 rounded-lg hover:bg-white/10 ${isActive ? 'bg-white/10 font-semibold' : 'text-white/90'}`}>
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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:block w-64 bg-primary text-white p-4 space-y-4 ${className}`}>
        <div className="text-2xl font-bold mb-4">SportSphere</div>
        <nav className="flex flex-col gap-2">
          <LinkItem to="/events">Events</LinkItem>
        </nav>
        <div className="mt-6 text-sm opacity-80">© SportSphere</div>
      </aside>

      {/* Mobile overlay sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-primary text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold">SportSphere</div>
              <button onClick={() => setOpen(false)} className="p-2 rounded bg-white/10">✕</button>
            </div>
            <nav className="flex flex-col gap-2">
              <LinkItem to="/events">Events</LinkItem>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
