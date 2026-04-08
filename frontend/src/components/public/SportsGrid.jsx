export default function SportsGrid({ sports, selectedId, onSelect }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sports.map((sport) => {
        const active = sport.id === selectedId
        return (
          <button
            key={sport.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(sport.id)}
            className={`sliit-card group flex h-full flex-col p-5 text-left transition duration-300 hover:-translate-y-1 ${
              active
                ? 'border-sliit-gold/45 bg-sliit-gold/10'
                : 'hover:border-sliit-gold/35 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-4xl">{sport.icon}</div>
              <span className="rounded-full border border-sliit-gold/25 bg-sliit-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sliit-gold">
                Join Team
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-semibold text-white">{sport.name}</h3>
            <p className="mt-1 text-sm text-sliit-muted">{sport.team}</p>
            <p className="mt-4 text-sm leading-7 text-sliit-muted flex-1">{sport.description}</p>
          </button>
        )
      })}
    </div>
  )
}
