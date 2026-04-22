import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ContactModal from '../components/public/ContactModal'
import ToastNotification from '../components/public/ToastNotification'
import { moduleNavLinks } from '../data/sportsModuleConfig'

export default function ModuleLayout() {
  const { user } = useAuth()
  const [activeContact, setActiveContact] = useState(null)
  const [toast, setToast] = useState(null)
  const isAdmin = user?.role === 'admin'
  const navLinks = isAdmin
    ? [...moduleNavLinks, { label: 'Admin Portal', to: '/dashboard/module/admin' }]
    : moduleNavLinks

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const outletContext = useMemo(() => ({
    openContactModal: ({
      recipientName,
      recipientRole,
      sportOrClubName,
      entityType = 'team'
    }) => {
      setActiveContact({
        recipientName,
        recipientRole,
        sportOrClubName,
        entityType
      })
    },
    showToast: (message) => setToast({ message })
  }), [])

  return (
    <div className="module-shell sliit-grid p-4 shadow-sliit sm:p-6 lg:p-8">
      <section className="sliit-card overflow-hidden rounded-[2rem] border-sliit-line bg-sliit-bg p-5 text-white shadow-sliit sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="sliit-pill">Sports Information Module</p>
            <h1 className="sliit-heading mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">
              Manage sports information inside the authenticated SportSphere portal.
            </h1>
            <p className="mt-4 text-base leading-7 text-sliit-muted sm:text-lg sm:leading-8">
              This module is only available after login and now reads and writes sports, club, fixture, player, facility, and inquiry data through the Mongo-backed backend.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `rounded-full px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-sliit-gold text-sliit-bg'
                  : 'border border-white/10 bg-white/5 text-sliit-muted hover:text-white'
              }`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {isAdmin ? (
          <div className="mt-8 rounded-[1.75rem] border border-sliit-gold/25 bg-sliit-gold/10 p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-sliit-gold">Admin Panel</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Create and update live records from the dashboard forms.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-sliit-muted">
              As an admin, you can enter captain details, club officers, fixtures, player records, facilities, and availability without editing code.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <NavLink to="/dashboard/module/admin" className="sliit-button-primary">
                Open Admin Portal
              </NavLink>
              <NavLink to="/dashboard/module/directory" className="sliit-button-primary">
                Manage Directory
              </NavLink>
              <NavLink to="/dashboard/module/matches" className="sliit-button-secondary">
                Manage Matches
              </NavLink>
              <NavLink to="/dashboard/module/players" className="sliit-button-secondary">
                Manage Players
              </NavLink>
              <NavLink to="/dashboard/module/facilities" className="sliit-button-secondary">
                Manage Facilities
              </NavLink>
            </div>
          </div>
        ) : null}
      </section>

      <div className="mt-6">
        <Outlet context={outletContext} />
      </div>

      {activeContact && (
        <ContactModal
          recipientName={activeContact.recipientName}
          recipientRole={activeContact.recipientRole}
          sportOrClubName={activeContact.sportOrClubName}
          entityType={activeContact.entityType}
          onClose={() => setActiveContact(null)}
          onSuccess={() => {
            setToast({
              message: `Message sent! ${activeContact.recipientName} will get back to you soon.`
            })
          }}
        />
      )}

      {toast && <ToastNotification message={toast.message} />}
    </div>
  )
}
