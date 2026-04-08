import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import moduleApi from '../../api/moduleApi'
import MatchList from '../../components/public/MatchList'
import {
  createEmptyMatchForm,
  matchStatusOptions
} from '../../data/sportsModuleConfig'

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-sliit-muted">
      {label}
      {children}
    </label>
  )
}

const toMatchForm = (match) => ({
  sport: match.sport || '',
  homeTeam: match.homeTeam || '',
  awayTeam: match.awayTeam || '',
  score: match.score || '',
  status: match.status || 'upcoming',
  liveNote: match.liveNote || '',
  date: match.date || '',
  time: match.time || '',
  venue: match.venue || ''
})

export default function MatchesPage() {
  const { user } = useAuth()
  const { showToast } = useOutletContext()
  const isAdmin = user?.role === 'admin'

  const [activeFilter, setActiveFilter] = useState('all')
  const [matches, setMatches] = useState([])
  const [selectedMatchId, setSelectedMatchId] = useState(null)
  const [matchForm, setMatchForm] = useState(createEmptyMatchForm())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedMatch = useMemo(
    () => matches.find((match) => match.id === selectedMatchId) ?? null,
    [matches, selectedMatchId]
  )

  useEffect(() => {
    loadMatches()
  }, [])

  useEffect(() => {
    setMatchForm(selectedMatch ? toMatchForm(selectedMatch) : createEmptyMatchForm())
  }, [selectedMatch])

  async function loadMatches(preferredId = null) {
    try {
      setLoading(true)
      const matchData = await moduleApi.getMatches()
      setMatches(matchData)
      setSelectedMatchId((current) => {
        if (preferredId && matchData.some((match) => match.id === preferredId)) return preferredId
        if (current && matchData.some((match) => match.id === current)) return current
        return matchData[0]?.id ?? null
      })
    } catch (loadError) {
      console.error('loadMatches', loadError)
      setError('Unable to load match records.')
    } finally {
      setLoading(false)
    }
  }

  async function saveMatch(event) {
    event.preventDefault()
    setError('')

    try {
      const saved = selectedMatchId
        ? await moduleApi.updateMatch(selectedMatchId, {
          ...matchForm,
          score: matchForm.score.trim(),
          liveNote: matchForm.liveNote.trim()
        })
        : await moduleApi.createMatch({
          ...matchForm,
          score: matchForm.score.trim(),
          liveNote: matchForm.liveNote.trim()
        })

      showToast(selectedMatchId ? 'Match updated successfully.' : 'Match created successfully.')
      await loadMatches(saved.id)
    } catch (saveError) {
      console.error('saveMatch', saveError)
      setError(saveError?.response?.data?.message || 'Unable to save the match record.')
    }
  }

  async function removeMatch() {
    if (!selectedMatchId || !confirm('Delete this match record?')) return

    try {
      await moduleApi.deleteMatch(selectedMatchId)
      showToast('Match deleted successfully.')
      await loadMatches(null)
      setMatchForm(createEmptyMatchForm())
    } catch (removeError) {
      console.error('removeMatch', removeError)
      setError(removeError?.response?.data?.message || 'Unable to delete the match record.')
    }
  }

  return (
    <section className="sliit-section py-12 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="sliit-pill justify-center">Matches</p>
        <h1 className="sliit-heading mt-6 text-5xl text-slate-950 sm:text-6xl">
          Publish live action, upcoming fixtures, and completed results.
        </h1>
        <p className="mt-5 text-lg leading-8 text-sliit-muted">
          Match cards are now driven by backend records, and admins can manage the entire schedule from the form below.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-800/60 bg-rose-200 px-4 py-3 text-sm text-rose-950">
          {error}
        </div>
      ) : null}

      <div className="mt-10">
        {loading ? (
          <div className="sliit-card p-8 text-center text-sliit-muted">Loading matches...</div>
        ) : (
          <MatchList matches={matches} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        )}
      </div>

      {isAdmin ? (
        <div className="sliit-card mt-8 p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sliit-muted">Admin Form</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                {selectedMatchId ? `Edit ${selectedMatch?.homeTeam} vs ${selectedMatch?.awayTeam}` : 'Create a new match'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedMatchId(null)
                setMatchForm(createEmptyMatchForm())
              }}
              className="sliit-button-secondary"
            >
              New Match
            </button>
          </div>

          {matches.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {matches.map((match) => (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => setSelectedMatchId(match.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedMatchId === match.id
                      ? 'bg-sliit-gold text-sliit-bg'
                      : 'border border-white/10 bg-white/5 text-sliit-muted hover:text-white'
                  }`}
                >
                  {match.homeTeam} vs {match.awayTeam}
                </button>
              ))}
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={saveMatch}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sport">
                <input
                  className="sliit-input"
                  value={matchForm.sport}
                  onChange={(event) => setMatchForm({ ...matchForm, sport: event.target.value })}
                />
              </Field>
              <Field label="Status">
                <select
                  className="sliit-input"
                  value={matchForm.status}
                  onChange={(event) => setMatchForm({ ...matchForm, status: event.target.value })}
                >
                  {matchStatusOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-sliit-bg text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Home team">
                <input
                  className="sliit-input"
                  value={matchForm.homeTeam}
                  onChange={(event) => setMatchForm({ ...matchForm, homeTeam: event.target.value })}
                />
              </Field>
              <Field label="Away team">
                <input
                  className="sliit-input"
                  value={matchForm.awayTeam}
                  onChange={(event) => setMatchForm({ ...matchForm, awayTeam: event.target.value })}
                />
              </Field>
              <Field label="Score">
                <input
                  className="sliit-input"
                  value={matchForm.score}
                  onChange={(event) => setMatchForm({ ...matchForm, score: event.target.value })}
                />
              </Field>
              <Field label="Live note">
                <input
                  className="sliit-input"
                  value={matchForm.liveNote}
                  onChange={(event) => setMatchForm({ ...matchForm, liveNote: event.target.value })}
                />
              </Field>
              <Field label="Date">
                <input
                  className="sliit-input"
                  value={matchForm.date}
                  onChange={(event) => setMatchForm({ ...matchForm, date: event.target.value })}
                />
              </Field>
              <Field label="Time">
                <input
                  className="sliit-input"
                  value={matchForm.time}
                  onChange={(event) => setMatchForm({ ...matchForm, time: event.target.value })}
                />
              </Field>
            </div>

            <Field label="Venue">
              <input
                className="sliit-input"
                value={matchForm.venue}
                onChange={(event) => setMatchForm({ ...matchForm, venue: event.target.value })}
              />
            </Field>

            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <button type="submit" className="sliit-button-primary">
                {selectedMatchId ? 'Save Match' : 'Create Match'}
              </button>
              {selectedMatchId ? (
                <button type="button" onClick={removeMatch} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-3 font-semibold text-rose-200">
                  Delete Match
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}
