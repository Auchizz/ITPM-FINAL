import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moduleApi from '../../api/moduleApi'

export default function ModuleAdminPortalPage() {
  const [overview, setOverview] = useState({
    sports: 0,
    clubs: 0,
    matches: 0,
    players: 0,
    facilities: 0,
    inquiries: 0
  })
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAdminPortal() {
      try {
        setLoading(true)
        const [overviewData, inquiryData] = await Promise.all([
          moduleApi.getOverview(),
          moduleApi.getInquiries()
        ])

        if (overviewData) setOverview(overviewData)
        setInquiries(inquiryData.slice(0, 5))
      } catch (loadError) {
        console.error('loadAdminPortal', loadError)
        setError('Unable to load the admin portal right now.')
      } finally {
        setLoading(false)
      }
    }

    loadAdminPortal()
  }, [])

  const adminSections = [
    {
      title: 'Sports and clubs',
      description: 'Create sports, clubs, and update captain or officer details.',
      to: '/dashboard/module/directory'
    },
    {
      title: 'Matches',
      description: 'Add live fixtures, results, venues, and timing updates.',
      to: '/dashboard/module/matches'
    },
    {
      title: 'Players',
      description: 'Maintain player roles, emails, phone numbers, and team assignments.',
      to: '/dashboard/module/players'
    },
    {
      title: 'Facilities',
      description: 'Manage spaces, descriptions, and time-slot availability.',
      to: '/dashboard/module/facilities'
    },
    {
      title: 'User management',
      description: 'Open the admin user management page for member and role control.',
      to: '/users'
    },
    {
      title: 'Activity admin',
      description: 'Review participation tracking and feedback in your separate admin page.',
      to: '/activity-admin'
    }
  ]

  return (
    <section className="sliit-section py-12 sm:py-16">
      <div className="max-w-4xl">
        <p className="sliit-pill">Admin Portal</p>
        <h1 className="sliit-heading mt-6 text-5xl text-black sm:text-6xl">
          Control center for module administrators.
        </h1>
        <p className="mt-5 text-lg leading-8 text-sliit-muted">
          Use this portal to jump into the admin forms for sports, matches, players, facilities, and inquiry review.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-800/60 bg-rose-200 px-4 py-3 text-sm text-rose-950">
          {error}
        </div>
      ) : null}

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { label: 'Sports', value: overview.sports },
          { label: 'Clubs', value: overview.clubs },
          { label: 'Matches', value: overview.matches },
          { label: 'Players', value: overview.players },
          { label: 'Facilities', value: overview.facilities },
          { label: 'Inquiries', value: overview.inquiries }
        ].map((item) => (
          <article key={item.label} className="sliit-card p-5">
            <div className="text-sm uppercase tracking-[0.28em] text-sliit-muted">{item.label}</div>
            <div className="mt-3 text-4xl font-bold text-white">{item.value}</div>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          {adminSections.map((section) => (
            <article key={section.title} className="sliit-card p-6">
              <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-sliit-muted">{section.description}</p>
              <Link to={section.to} className="sliit-button-primary mt-6">
                Open Section
              </Link>
            </article>
          ))}
        </div>

        <aside className="sliit-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sliit-muted">Latest Inquiries</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Recent contact requests</h2>
            </div>
            <Link to="/dashboard/module/join" className="sliit-button-secondary">
              Open Directory
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 text-sm text-sliit-muted">Loading admin data...</div>
          ) : inquiries.length > 0 ? (
            <div className="mt-6 space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm uppercase tracking-[0.24em] text-sliit-gold">{inquiry.recipientRole}</div>
                    <div className="text-xs text-sliit-muted">{new Date(inquiry.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">{inquiry.sportOrClubName}</div>
                  <div className="mt-1 text-sm text-sliit-muted">
                    {inquiry.fullName} to {inquiry.recipientName}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-sliit-muted">{inquiry.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-sliit-muted">
              No inquiries have been submitted yet.
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
