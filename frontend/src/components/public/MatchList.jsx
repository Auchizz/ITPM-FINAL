import { useMemo } from 'react'
import MatchCard from './MatchCard'

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Results', value: 'result' }
]

export default function MatchList({ matches, activeFilter, onFilterChange }) {
  const filteredMatches = useMemo(() => (
    activeFilter === 'all'
      ? matches
      : matches.filter((match) => match.status === activeFilter)
  ), [matches, activeFilter])

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Match status filters">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === option.value}
            onClick={() => onFilterChange(option.value)}
            className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
              activeFilter === option.value
                ? 'bg-sliit-gold text-sliit-bg'
                : 'border border-white/10 bg-white/5 text-sliit-muted hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {filteredMatches.length === 0 ? (
        <div className="sliit-card mt-8 p-8 text-center">
          <h3 className="text-2xl font-semibold text-white">No matches in this view.</h3>
          <p className="mt-3 text-sm text-sliit-muted">Try another status filter to view live fixtures or results.</p>
        </div>
      ) : null}
    </div>
  )
}
