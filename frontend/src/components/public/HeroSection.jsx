import { Link } from 'react-router-dom'

export default function HeroSection({ overview }) {
  return (
    <section className="sliit-section relative overflow-hidden py-12 sm:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <div className="sliit-pill">
            <span>Authenticated Access</span>
            <span className="h-1 w-1 rounded-full bg-sliit-gold" />
            <span>Sports Information Module</span>
          </div>

          <h1 className="sliit-heading mt-6 max-w-4xl text-5xl leading-[0.95] text-black sm:text-6xl">
            One protected space for sports, clubs, players, fixtures, and facilities.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-sliit-muted">
            This module now lives inside the existing SportSphere dashboard and reads data from the backend instead of hardcoded placeholders.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/dashboard/module/directory#sports" className="sliit-button-primary">
              Open Directory
            </Link>
            <Link to="/dashboard/module/matches" className="sliit-button-secondary">
              View Matches
            </Link>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="sliit-grid sliit-card relative overflow-hidden p-6 sm:p-8">
            <div className="absolute right-6 top-6 h-24 w-24 rounded-full border border-sliit-gold/30 bg-sliit-gold/10 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-[#0d1529] p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-sliit-muted">Live Module Snapshot</div>
              <h2 className="mt-4 text-3xl font-bold text-white">Protected records available immediately after login.</h2>
              <p className="mt-3 text-sm leading-7 text-sliit-muted">
                Admin users can create and update records, while all authenticated users can browse directories and submit inquiries.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-sliit-muted">Sports & Clubs</div>
                  <div className="mt-2 text-3xl font-bold text-white">{overview.sports + overview.clubs}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-sliit-muted">People & Facilities</div>
                  <div className="mt-2 text-3xl font-bold text-white">{overview.players + overview.facilities}</div>
                </div>
                <div className="rounded-2xl border border-sliit-gold/25 bg-sliit-gold/10 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-sliit-gold">Matches</div>
                  <div className="mt-2 text-3xl font-bold text-white">{overview.matches}</div>
                </div>
                <div className="rounded-2xl border border-sliit-blue/25 bg-sliit-blue/10 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-sliit-blue">Inquiries</div>
                  <div className="mt-2 text-3xl font-bold text-white">{overview.inquiries}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
