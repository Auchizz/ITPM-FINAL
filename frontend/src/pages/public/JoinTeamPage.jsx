import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import moduleApi from '../../api/moduleApi'

export default function JoinTeamPage() {
  const { openContactModal } = useOutletContext()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sports, setSports] = useState([])
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEntries() {
      try {
        setLoading(true)
        const [sportsData, clubsData] = await Promise.all([
          moduleApi.getSports(),
          moduleApi.getClubs()
        ])

        setSports(sportsData)
        setClubs(clubsData)
      } catch (error) {
        console.error('loadEntries', error)
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [])

  const entries = useMemo(() => {
    const sportEntries = sports.map((sport) => ({
      id: sport.id,
      type: 'sport',
      icon: sport.icon,
      name: sport.name,
      label: sport.team,
      primary: { role: 'Captain', ...sport.captain },
      secondary: { role: 'Vice Captain', ...sport.viceCaptain }
    }))

    const clubEntries = clubs.map((club) => ({
      id: club.id,
      type: 'club',
      icon: club.icon,
      name: club.name,
      label: 'Club or Group',
      primary: { role: 'President', ...club.president },
      secondary: { role: 'Secretary', ...club.secretary }
    }))

    return [...sportEntries, ...clubEntries]
  }, [sports, clubs])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filter !== 'all' && entry.type !== filter) return false
      if (!query.trim()) return true

      const searchable = `${entry.name} ${entry.label} ${entry.primary.name} ${entry.secondary.name}`.toLowerCase()
      return searchable.includes(query.trim().toLowerCase())
    })
  }, [entries, filter, query])

  return (
    <section className="sliit-section py-12 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="sliit-pill justify-center">Join Directory</p>
        <h1 className="sliit-heading mt-6 text-5xl text-slate-950 sm:text-6xl">
          Search sports and groups, then contact the right leader directly.
        </h1>
        <p className="mt-5 text-lg leading-8 text-sliit-muted">
          Because the directory is loaded from the backend, this page automatically reflects whatever admins have entered into the module.
        </p>
      </div>

      <div className="mt-10 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-sliit lg:grid-cols-[1.2fr_auto] lg:items-center">
        <label className="grid gap-2 text-left text-sm text-sliit-muted">
          Search sport or club
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="sliit-input"
            placeholder="Search sport or club..."
            aria-label="Search sport or club"
          />
        </label>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {[
            { label: 'All', value: 'all' },
            { label: 'Sports', value: 'sport' },
            { label: 'Clubs & Groups', value: 'club' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                filter === option.value
                  ? 'bg-sliit-gold text-sliit-bg'
                  : 'border border-white/10 bg-white/5 text-sliit-muted hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="sliit-card mt-8 p-8 text-center text-sliit-muted">Loading join directory...</div>
      ) : (
        <div className="mt-8 space-y-4">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="sliit-card grid gap-6 p-6 lg:grid-cols-[1.1fr_0.8fr_0.8fr]"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                    {entry.icon || (entry.type === 'sport' ? 'SP' : 'CL')}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-sliit-muted">
                      {entry.type === 'sport' ? 'Sport' : 'Club & Group'}
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">{entry.name}</h2>
                    <p className="mt-1 text-sm text-sliit-muted">{entry.label}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-sliit-muted">{entry.primary.role}</p>
                <div className="mt-3 text-xl font-semibold text-white">{entry.primary.name}</div>
                <a href={`mailto:${entry.primary.email}`} className="mt-2 block text-sm text-sliit-gold transition hover:text-white">
                  {entry.primary.email}
                </a>
                <button
                  type="button"
                  onClick={() => openContactModal({
                    recipientName: entry.primary.name,
                    recipientRole: entry.primary.role,
                    sportOrClubName: entry.name,
                    entityType: entry.type === 'club' ? 'club' : 'team'
                  })}
                  className="sliit-button-secondary mt-5 w-full justify-center"
                >
                  Contact {entry.primary.role}
                </button>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-sliit-muted">{entry.secondary.role}</p>
                <div className="mt-3 text-xl font-semibold text-white">{entry.secondary.name}</div>
                <a href={`mailto:${entry.secondary.email}`} className="mt-2 block text-sm text-sliit-gold transition hover:text-white">
                  {entry.secondary.email}
                </a>
                <button
                  type="button"
                  onClick={() => openContactModal({
                    recipientName: entry.secondary.name,
                    recipientRole: entry.secondary.role,
                    sportOrClubName: entry.name,
                    entityType: entry.type === 'club' ? 'club' : 'team'
                  })}
                  className="sliit-button-secondary mt-5 w-full justify-center"
                >
                  Contact {entry.secondary.role}
                </button>
              </div>
            </article>
          ))}

          {!loading && filteredEntries.length === 0 ? (
            <div className="sliit-card p-8 text-center">
              <h2 className="text-2xl font-semibold text-white">No matching records found.</h2>
              <p className="mt-3 text-sm text-sliit-muted">
                Try a different search term or wait for an admin to add directory records.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
