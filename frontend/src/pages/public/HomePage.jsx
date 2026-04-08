import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../../components/public/HeroSection'
import StatsBar from '../../components/public/StatsBar'
import FeatureHighlights from '../../components/public/FeatureHighlights'
import CTABanner from '../../components/public/CTABanner'
import moduleApi from '../../api/moduleApi'
import { moduleFeatureHighlights } from '../../data/sportsModuleConfig'

export default function HomePage() {
  const [overview, setOverview] = useState({
    sports: 0,
    clubs: 0,
    matches: 0,
    players: 0,
    facilities: 0,
    inquiries: 0
  })
  const [sports, setSports] = useState([])
  const [clubs, setClubs] = useState([])

  useEffect(() => {
    async function loadOverviewPage() {
      try {
        const [overviewData, sportsData, clubsData] = await Promise.all([
          moduleApi.getOverview(),
          moduleApi.getSports(),
          moduleApi.getClubs()
        ])

        if (overviewData) setOverview(overviewData)
        setSports(sportsData)
        setClubs(clubsData)
      } catch (error) {
        console.error('loadOverviewPage', error)
      }
    }

    loadOverviewPage()
  }, [])

  const stats = useMemo(() => ([
    { label: 'Sports', value: String(overview.sports) },
    { label: 'Clubs', value: String(overview.clubs) },
    { label: 'Matches', value: String(overview.matches) },
    { label: 'Players', value: String(overview.players) },
    { label: 'Facilities', value: String(overview.facilities) }
  ]), [overview])

  const featuredSports = sports.slice(0, 4)
  const featuredClubs = clubs.slice(0, 3)

  return (
    <>
      <HeroSection overview={overview} />
      <StatsBar stats={stats} />
      <FeatureHighlights items={moduleFeatureHighlights} />
      <CTABanner />

      <section className="sliit-section py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="sliit-card overflow-hidden p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sliit-muted">Configured Sports</p>
                <h2 className="sliit-heading mt-3 text-5xl text-white">Recently available sports records.</h2>
              </div>
              <Link to="/dashboard/module/directory#sports" className="sliit-button-secondary hidden sm:inline-flex">
                Open Sports Directory
              </Link>
            </div>

            {featuredSports.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {featuredSports.map((sport) => (
                  <Link
                    key={sport.id}
                    to="/dashboard/module/directory#sports"
                    className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-sliit-gold/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-4xl">{sport.icon || 'SP'}</span>
                      <span className="rounded-full border border-sliit-gold/25 bg-sliit-gold/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-sliit-gold">
                        Team
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{sport.name}</h3>
                    <p className="mt-2 text-sm text-sliit-muted">{sport.team}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <h3 className="text-2xl font-semibold text-white">No sports records yet.</h3>
                <p className="mt-3 text-sm text-sliit-muted">
                  Admin users can add the first sport entry from the directory management form.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="sliit-card border-sliit-blue/25 bg-sliit-blue/10 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-sliit-blue">Clubs & Groups</p>
              <h2 className="sliit-heading mt-3 text-4xl text-white">Maintain communities alongside sports teams.</h2>

              {featuredClubs.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {featuredClubs.map((club) => (
                    <Link
                      key={club.id}
                      to="/dashboard/module/directory#clubs"
                      className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition hover:border-sliit-blue/35"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-2xl">{club.icon || 'CL'}</div>
                          <div className="mt-2 font-semibold text-white">{club.name}</div>
                        </div>
                        <span className="rounded-full border border-sliit-blue/30 bg-sliit-blue/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-sliit-blue">
                          Club
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-sliit-muted">
                    No club records yet. Add the first club from the directory page.
                  </p>
                </div>
              )}
            </div>

            <div className="sliit-card p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-sliit-muted">Protected Actions</p>
              <h2 className="sliit-heading mt-3 text-4xl text-white">Everything here uses the existing SportSphere login.</h2>
              <p className="mt-4 text-base leading-7 text-sliit-muted">
                The module is no longer public. Users must sign in to browse or contact, and admins can manage records directly through the dashboard.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/dashboard/module/join" className="sliit-button-primary">
                  Open Join Directory
                </Link>
                <Link to="/dashboard/module/players" className="sliit-button-secondary">
                  Browse People
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
