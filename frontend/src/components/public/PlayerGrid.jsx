import PlayerCard from './PlayerCard'

export default function PlayerGrid({ players, onContact }) {
  if (players.length === 0) {
    return (
      <div className="sliit-card p-8 text-center">
        <h3 className="text-2xl font-semibold text-white">No players match your filters.</h3>
        <p className="mt-3 text-sm text-sliit-muted">Adjust the sport filter or search by a different player name.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} onContact={onContact} />
      ))}
    </div>
  )
}
