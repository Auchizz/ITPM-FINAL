import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import moduleApi from '../../api/moduleApi'
import PlayerGrid from '../../components/public/PlayerGrid'
import {
  createEmptyPlayerForm,
  playerRoleOptions
} from '../../data/sportsModuleConfig'

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-sliit-muted">
      {label}
      {children}
    </label>
  )
}

const toPlayerForm = (player) => ({
  name: player.name || '',
  sport: player.sport || '',
  role: player.role || 'Member',
  email: player.email || '',
  phone: player.phone || '',
  batch: player.batch || ''
})

export default function PlayersPage() {
  const { user } = useAuth()
  const { openContactModal, showToast } = useOutletContext()
  const isAdmin = user?.role === 'admin'

  const [players, setPlayers] = useState([])
  const [query, setQuery] = useState('')
  const [sportFilter, setSportFilter] = useState('all')
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)
  const [playerForm, setPlayerForm] = useState(createEmptyPlayerForm())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const sportOptions = useMemo(
    () => ['all', ...new Set(players.map((player) => player.sport).filter(Boolean))],
    [players]
  )

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      if (sportFilter !== 'all' && player.sport !== sportFilter) return false
      if (!query.trim()) return true

      const searchValue = `${player.name} ${player.sport} ${player.role}`.toLowerCase()
      return searchValue.includes(query.trim().toLowerCase())
    })
  }, [players, query, sportFilter])

  const selectedPlayer = useMemo(
    () => players.find((player) => player.id === selectedPlayerId) ?? null,
    [players, selectedPlayerId]
  )

  useEffect(() => {
    loadPlayers()
  }, [])

  useEffect(() => {
    setPlayerForm(selectedPlayer ? toPlayerForm(selectedPlayer) : createEmptyPlayerForm())
  }, [selectedPlayer])

  async function loadPlayers(preferredId = null) {
    try {
      setLoading(true)
      const playerData = await moduleApi.getPlayers()
      setPlayers(playerData)
      setSelectedPlayerId((current) => {
        if (preferredId && playerData.some((player) => player.id === preferredId)) return preferredId
        if (current && playerData.some((player) => player.id === current)) return current
        return playerData[0]?.id ?? null
      })
    } catch (loadError) {
      console.error('loadPlayers', loadError)
      setError('Unable to load player records.')
    } finally {
      setLoading(false)
    }
  }

  async function savePlayer(event) {
    event.preventDefault()
    setError('')

    try {
      const saved = selectedPlayerId
        ? await moduleApi.updatePlayer(selectedPlayerId, {
          ...playerForm,
          email: playerForm.email.trim(),
          phone: playerForm.phone.trim(),
          batch: playerForm.batch.trim()
        })
        : await moduleApi.createPlayer({
          ...playerForm,
          email: playerForm.email.trim(),
          phone: playerForm.phone.trim(),
          batch: playerForm.batch.trim()
        })

      showToast(selectedPlayerId ? 'Player updated successfully.' : 'Player created successfully.')
      await loadPlayers(saved.id)
    } catch (saveError) {
      console.error('savePlayer', saveError)
      setError(saveError?.response?.data?.message || 'Unable to save the player record.')
    }
  }

  async function removePlayer() {
    if (!selectedPlayerId || !confirm('Delete this player record?')) return

    try {
      await moduleApi.deletePlayer(selectedPlayerId)
      showToast('Player deleted successfully.')
      await loadPlayers(null)
      setPlayerForm(createEmptyPlayerForm())
    } catch (removeError) {
      console.error('removePlayer', removeError)
      setError(removeError?.response?.data?.message || 'Unable to delete the player record.')
    }
  }

  return (
    <section className="sliit-section py-12 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="sliit-pill justify-center">Players</p>
        <h1 className="sliit-heading mt-6 text-5xl text-slate-950 sm:text-6xl">
          Search players by name, sport, and leadership role.
        </h1>
        <p className="mt-5 text-lg leading-8 text-sliit-muted">
          Leadership contacts remain interactive for all authenticated users, while admin users can manage player records below.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-800/60 bg-rose-200 px-4 py-3 text-sm text-rose-950">
          {error}
        </div>
      ) : null}

      <div className="mt-10 grid gap-5 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-lg backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
        <label className="grid gap-2 text-left text-sm font-semibold text-slate-700">
          Search by player name or sport
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="7" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full rounded-2xl border border-black/30 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-black/60 focus:outline-none focus:ring-2 focus:ring-sliit-gold/30"
              placeholder="Search by player name or sport"
              aria-label="Search players"
            />
          </div>
        </label>

        <label className="grid gap-2 text-left text-sm font-semibold text-slate-700">
          Filter by sport
          <select
            value={sportFilter}
            onChange={(event) => setSportFilter(event.target.value)}
            className="h-12 w-full rounded-2xl border border-black/30 bg-white px-4 text-sm text-slate-900 shadow-sm focus:border-black/60 focus:outline-none focus:ring-2 focus:ring-sliit-gold/30"
            aria-label="Filter players by sport"
          >
            {sportOptions.map((sport) => (
              <option key={sport} value={sport} className="bg-sliit-bg text-white">
                {sport === 'all' ? 'All sports' : sport}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="sliit-card p-8 text-center text-sliit-muted">Loading players...</div>
        ) : (
          <PlayerGrid
            players={filteredPlayers}
            onContact={(player) => openContactModal({
              recipientName: player.name,
              recipientRole: player.role,
              sportOrClubName: player.sport,
              entityType: 'team'
            })}
          />
        )}
      </div>

      {isAdmin ? (
        <div className="sliit-card mt-8 p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sliit-muted">Admin Form</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                {selectedPlayerId ? `Edit ${selectedPlayer?.name}` : 'Create a new player'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedPlayerId(null)
                setPlayerForm(createEmptyPlayerForm())
              }}
              className="sliit-button-secondary"
            >
              New Player
            </button>
          </div>

          {players.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {players.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => setSelectedPlayerId(player.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedPlayerId === player.id
                      ? 'bg-sliit-gold text-sliit-bg'
                      : 'border border-white/10 bg-white/5 text-sliit-muted hover:text-white'
                  }`}
                >
                  {player.name}
                </button>
              ))}
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={savePlayer}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  className="sliit-input"
                  value={playerForm.name}
                  onChange={(event) => setPlayerForm({ ...playerForm, name: event.target.value })}
                />
              </Field>
              <Field label="Sport">
                <input
                  className="sliit-input"
                  value={playerForm.sport}
                  onChange={(event) => setPlayerForm({ ...playerForm, sport: event.target.value })}
                />
              </Field>
              <Field label="Role">
                <select
                  className="sliit-input"
                  value={playerForm.role}
                  onChange={(event) => setPlayerForm({ ...playerForm, role: event.target.value })}
                >
                  {playerRoleOptions.map((role) => (
                    <option key={role} value={role} className="bg-sliit-bg text-white">
                      {role}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Batch or group">
                <input
                  className="sliit-input"
                  value={playerForm.batch}
                  onChange={(event) => setPlayerForm({ ...playerForm, batch: event.target.value })}
                />
              </Field>
              <Field label="Email">
                <input
                  className="sliit-input"
                  type="email"
                  value={playerForm.email}
                  onChange={(event) => setPlayerForm({ ...playerForm, email: event.target.value })}
                />
              </Field>
              <Field label="Phone">
                <input
                  className="sliit-input"
                  value={playerForm.phone}
                  onChange={(event) => setPlayerForm({ ...playerForm, phone: event.target.value })}
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <button type="submit" className="sliit-button-primary">
                {selectedPlayerId ? 'Save Player' : 'Create Player'}
              </button>
              {selectedPlayerId ? (
                <button type="button" onClick={removePlayer} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-3 font-semibold text-rose-200">
                  Delete Player
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}
