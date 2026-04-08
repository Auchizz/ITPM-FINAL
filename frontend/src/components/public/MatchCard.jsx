const statusStyles = {
  live: {
    label: 'Live',
    className: 'border-rose-500/30 bg-rose-500/10 text-rose-200'
  },
  upcoming: {
    label: 'Upcoming',
    className: 'border-sliit-gold/30 bg-sliit-gold/10 text-sliit-gold'
  },
  result: {
    label: 'Full Time',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
  }
}

export default function MatchCard({ match }) {
  const statusMeta = statusStyles[match.status]

  return (
    <article className="sliit-card overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-sliit-gold/30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-sliit-muted">
          {match.sport}
        </span>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${statusMeta.className}`}>
          {match.status === 'live' ? <span className="sliit-live-dot" /> : null}
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-6">
        <div className="text-2xl font-semibold text-white sm:text-3xl">
          {match.homeTeam} <span className="text-sliit-muted">vs</span> {match.awayTeam}
        </div>
        <div className="mt-4 text-4xl font-bold text-white">
          {match.score || 'Fixture Pending'}
        </div>
        {match.liveNote ? (
          <div className="mt-2 text-sm font-medium text-sliit-gold">{match.liveNote}</div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-sliit-muted sm:grid-cols-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white">Date</div>
          <div className="mt-1">{match.date}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white">Time</div>
          <div className="mt-1">{match.time}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white">Venue</div>
          <div className="mt-1">{match.venue}</div>
        </div>
      </div>
    </article>
  )
}
