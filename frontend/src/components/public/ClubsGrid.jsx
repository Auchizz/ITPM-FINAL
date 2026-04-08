export default function ClubsGrid({ clubs, selectedId, onSelect }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {clubs.map((club) => {
        const active = club.id === selectedId
        const displayIcon = club.icon && club.icon.trim().toUpperCase() !== 'CL' ? club.icon : ''
        return (
          <button
            key={club.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(club.id)}
            className={`sliit-card group flex h-full flex-col p-5 text-left transition duration-300 hover:-translate-y-1 ${
              active
                ? 'border-sliit-blue/45 bg-sliit-blue/10'
                : 'hover:border-sliit-blue/35 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex h-10 w-10 items-center justify-center text-4xl" aria-hidden="true">
                {displayIcon}
              </div>
              <span className="rounded-full border border-sliit-blue/30 bg-sliit-blue/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sliit-blue">
                Join Club
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-semibold text-white">{club.name}</h3>
            <p className="mt-1 text-sm text-sliit-muted">Club & Group</p>
            <p className="mt-4 flex-1 text-sm leading-7 text-sliit-muted">{club.description}</p>
          </button>
        )
      })}
    </div>
  )
}
