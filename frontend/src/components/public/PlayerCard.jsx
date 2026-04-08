function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function PlayerCard({ player, onContact }) {
  const isLeader = player.role === 'Captain' || player.role === 'Vice Captain'

  return (
    <article className="sliit-card p-6 transition duration-300 hover:-translate-y-1 hover:border-sliit-gold/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sliit-gold/25 bg-sliit-gold/10 text-lg font-bold text-sliit-gold">
            {getInitials(player.name)}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">{player.name}</h3>
            <p className="mt-1 text-sm text-sliit-muted">{player.sport}</p>
          </div>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em] ${
          isLeader
            ? 'border border-sliit-gold/25 bg-sliit-gold/10 text-sliit-gold'
            : 'border border-white/10 bg-white/5 text-sliit-muted'
        }`}>
          {player.role}
        </span>
      </div>

      <div className="mt-6 space-y-2 text-sm text-sliit-muted">
        {player.batch ? <p><span className="text-white">Batch:</span> {player.batch}</p> : null}
        {player.email ? <p><span className="text-white">Email:</span> {player.email}</p> : null}
        {player.phone ? <p><span className="text-white">Phone:</span> {player.phone}</p> : null}
      </div>

      {isLeader ? (
        <button type="button" onClick={() => onContact(player)} className="sliit-button-secondary mt-6 w-full justify-center">
          Contact
        </button>
      ) : null}
    </article>
  )
}
