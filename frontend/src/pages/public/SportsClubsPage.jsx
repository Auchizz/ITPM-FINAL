import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import moduleApi from '../../api/moduleApi'
import SportsGrid from '../../components/public/SportsGrid'
import ClubsGrid from '../../components/public/ClubsGrid'
import SportDetailPanel from '../../components/public/SportDetailPanel'
import ClubDetailPanel from '../../components/public/ClubDetailPanel'
import {
  createEmptyClubForm,
  createEmptyContact,
  createEmptySportForm
} from '../../data/sportsModuleConfig'

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-sliit-muted">
      {label}
      {children}
    </label>
  )
}

function ContactFields({ title, value, onChange }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Name">
          <input
            className="sliit-input"
            value={value.name}
            onChange={(event) => onChange('name', event.target.value)}
          />
        </Field>
        <Field label="Email">
          <input
            className="sliit-input"
            type="email"
            value={value.email}
            onChange={(event) => onChange('email', event.target.value)}
          />
        </Field>
        <Field label="Phone">
          <input
            className="sliit-input"
            value={value.phone}
            onChange={(event) => onChange('phone', event.target.value)}
          />
        </Field>
      </div>
    </div>
  )
}

const toSportForm = (sport) => ({
  name: sport.name || '',
  icon: sport.icon || '',
  team: sport.team || '',
  description: sport.description || '',
  captain: { ...createEmptyContact(), ...sport.captain },
  viceCaptain: { ...createEmptyContact(), ...sport.viceCaptain }
})

const toClubForm = (club) => ({
  name: club.name || '',
  icon: club.icon || '',
  description: club.description || '',
  president: { ...createEmptyContact(), ...club.president },
  secretary: { ...createEmptyContact(), ...club.secretary }
})

const trimContact = (contact) => ({
  name: contact.name.trim(),
  email: contact.email.trim(),
  phone: contact.phone.trim()
})

export default function SportsClubsPage() {
  const { user } = useAuth()
  const { openContactModal, showToast } = useOutletContext()
  const location = useLocation()
  const navigate = useNavigate()
  const sportsSectionRef = useRef(null)
  const clubsSectionRef = useRef(null)
  const isAdmin = user?.role === 'admin'

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sports')
  const [sports, setSports] = useState([])
  const [clubs, setClubs] = useState([])
  const [selectedSportId, setSelectedSportId] = useState(null)
  const [selectedClubId, setSelectedClubId] = useState(null)
  const [sportForm, setSportForm] = useState(createEmptySportForm())
  const [clubForm, setClubForm] = useState(createEmptyClubForm())
  const [error, setError] = useState('')

  const selectedSport = useMemo(
    () => sports.find((sport) => sport.id === selectedSportId) ?? null,
    [sports, selectedSportId]
  )
  const selectedClub = useMemo(
    () => clubs.find((club) => club.id === selectedClubId) ?? null,
    [clubs, selectedClubId]
  )

  useEffect(() => {
    const targetTab = location.hash === '#clubs' ? 'clubs' : 'sports'
    setActiveTab(targetTab)
    const targetRef = targetTab === 'clubs' ? clubsSectionRef : sportsSectionRef
    window.requestAnimationFrame(() => {
      targetRef.current?.focus()
      targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.hash])

  useEffect(() => {
    loadDirectory()
  }, [])

  useEffect(() => {
    setSportForm(selectedSport ? toSportForm(selectedSport) : createEmptySportForm())
  }, [selectedSport])

  useEffect(() => {
    setClubForm(selectedClub ? toClubForm(selectedClub) : createEmptyClubForm())
  }, [selectedClub])

  async function loadDirectory(preferredSelection = {}) {
    try {
      setLoading(true)
      const [sportsData, clubsData] = await Promise.all([
        moduleApi.getSports(),
        moduleApi.getClubs()
      ])

      setSports(sportsData)
      setClubs(clubsData)

      setSelectedSportId((current) => {
        const preferred = preferredSelection.sportId
        if (preferred && sportsData.some((sport) => sport.id === preferred)) return preferred
        if (current && sportsData.some((sport) => sport.id === current)) return current
        return sportsData[0]?.id ?? null
      })

      setSelectedClubId((current) => {
        const preferred = preferredSelection.clubId
        if (preferred && clubsData.some((club) => club.id === preferred)) return preferred
        if (current && clubsData.some((club) => club.id === current)) return current
        return clubsData[0]?.id ?? null
      })
    } catch (loadError) {
      console.error('loadDirectory', loadError)
      setError('Unable to load sports and clubs right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    navigate(`/dashboard/module/directory#${tab}`, { replace: true })
  }

  const updateSportContact = (contactKey, field, value) => {
    setSportForm((current) => ({
      ...current,
      [contactKey]: {
        ...current[contactKey],
        [field]: value
      }
    }))
  }

  const updateClubContact = (contactKey, field, value) => {
    setClubForm((current) => ({
      ...current,
      [contactKey]: {
        ...current[contactKey],
        [field]: value
      }
    }))
  }

  async function saveSport(event) {
    event.preventDefault()
    setError('')

    const payload = {
      name: sportForm.name.trim(),
      icon: sportForm.icon.trim(),
      team: sportForm.team.trim(),
      description: sportForm.description.trim(),
      captain: trimContact(sportForm.captain),
      viceCaptain: trimContact(sportForm.viceCaptain)
    }

    try {
      const saved = selectedSportId
        ? await moduleApi.updateSport(selectedSportId, payload)
        : await moduleApi.createSport(payload)

      showToast(selectedSportId ? 'Sport updated successfully.' : 'Sport created successfully.')
      await loadDirectory({ sportId: saved.id })
    } catch (saveError) {
      console.error('saveSport', saveError)
      setError(saveError?.response?.data?.message || 'Unable to save the sport record.')
    }
  }

  async function saveClub(event) {
    event.preventDefault()
    setError('')

    const payload = {
      name: clubForm.name.trim(),
      icon: clubForm.icon.trim(),
      description: clubForm.description.trim(),
      president: trimContact(clubForm.president),
      secretary: trimContact(clubForm.secretary)
    }

    try {
      const saved = selectedClubId
        ? await moduleApi.updateClub(selectedClubId, payload)
        : await moduleApi.createClub(payload)

      showToast(selectedClubId ? 'Club updated successfully.' : 'Club created successfully.')
      await loadDirectory({ clubId: saved.id })
    } catch (saveError) {
      console.error('saveClub', saveError)
      setError(saveError?.response?.data?.message || 'Unable to save the club record.')
    }
  }

  async function removeSport() {
    if (!selectedSportId || !confirm('Delete this sport record?')) return

    try {
      await moduleApi.deleteSport(selectedSportId)
      showToast('Sport deleted successfully.')
      await loadDirectory({ sportId: null })
      setSportForm(createEmptySportForm())
    } catch (removeError) {
      console.error('removeSport', removeError)
      setError(removeError?.response?.data?.message || 'Unable to delete the sport record.')
    }
  }

  async function removeClub() {
    if (!selectedClubId || !confirm('Delete this club record?')) return

    try {
      await moduleApi.deleteClub(selectedClubId)
      showToast('Club deleted successfully.')
      await loadDirectory({ clubId: null })
      setClubForm(createEmptyClubForm())
    } catch (removeError) {
      console.error('removeClub', removeError)
      setError(removeError?.response?.data?.message || 'Unable to delete the club record.')
    }
  }

  return (
    <section className="sliit-section py-12 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="sliit-pill justify-center">Directory</p>
        <h1 className="sliit-heading mt-6 text-5xl text-slate-950 sm:text-6xl">
          Browse and manage sports teams, clubs, and their key contacts.
        </h1>
        <p className="mt-5 text-lg leading-8 text-sliit-muted">
          All records below are loaded from the backend. Admin users can create or edit records directly in the forms on this page.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3" role="tablist" aria-label="Sports and clubs tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'sports'}
          onClick={() => handleTabChange('sports')}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
            activeTab === 'sports'
              ? 'bg-sliit-gold text-sliit-bg'
              : 'border border-white/10 bg-white/5 text-sliit-muted hover:text-white'
          }`}
        >
          Sports
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'clubs'}
          onClick={() => handleTabChange('clubs')}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
            activeTab === 'clubs'
              ? 'bg-sliit-blue text-white'
              : 'border border-white/10 bg-white/5 text-sliit-muted hover:text-white'
          }`}
        >
          Clubs & Groups
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-800/60 bg-rose-200 px-4 py-3 text-sm text-rose-950">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="sliit-card mt-8 p-8 text-center text-sliit-muted">Loading directory data...</div>
      ) : (
        <div className="mt-10 space-y-14">
          <section
            id="sports"
            ref={sportsSectionRef}
            tabIndex="-1"
            className={activeTab === 'sports' ? 'outline-none' : 'hidden'}
          >
            <div className="mb-8 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-sliit-muted">Sports Directory</p>
              <h2 className="sliit-heading mt-3 text-4xl text-slate-950 sm:text-5xl">
                Select a sport to review contacts or update the stored record.
              </h2>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              {sports.length > 0 ? (
                <>
                  <SportsGrid sports={sports} selectedId={selectedSport?.id} onSelect={setSelectedSportId} />
                  <SportDetailPanel sport={selectedSport} onContact={openContactModal} />
                </>
              ) : (
                <div className="sliit-card xl:col-span-2 p-8 text-center">
                  <h3 className="text-2xl font-semibold text-white">No sports have been added yet.</h3>
                  <p className="mt-3 text-sm text-sliit-muted">
                    Use the admin form below to create the first sport record.
                  </p>
                </div>
              )}
            </div>

            {isAdmin ? (
              <div className="sliit-card mt-8 p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-sliit-muted">Admin Form</p>
                    <h3 className="mt-2 text-3xl font-semibold text-white">
                      {selectedSportId ? `Edit ${selectedSport?.name}` : 'Create a new sport'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSportId(null)
                      setSportForm(createEmptySportForm())
                    }}
                    className="sliit-button-secondary"
                  >
                    New Sport
                  </button>
                </div>

                <form className="mt-6 grid gap-4" onSubmit={saveSport}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Sport name">
                      <input
                        className="sliit-input"
                        value={sportForm.name}
                        onChange={(event) => setSportForm({ ...sportForm, name: event.target.value })}
                      />
                    </Field>
                    <Field label="Icon or short label">
                      <input
                        className="sliit-input"
                        value={sportForm.icon}
                        onChange={(event) => setSportForm({ ...sportForm, icon: event.target.value })}
                      />
                    </Field>
                    <Field label="Team name">
                      <input
                        className="sliit-input"
                        value={sportForm.team}
                        onChange={(event) => setSportForm({ ...sportForm, team: event.target.value })}
                      />
                    </Field>
                    <Field label="Description">
                      <textarea
                        rows="4"
                        className="sliit-input resize-none"
                        value={sportForm.description}
                        onChange={(event) => setSportForm({ ...sportForm, description: event.target.value })}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4">
                    <ContactFields title="Captain" value={sportForm.captain} onChange={(field, value) => updateSportContact('captain', field, value)} />
                    <ContactFields title="Vice Captain" value={sportForm.viceCaptain} onChange={(field, value) => updateSportContact('viceCaptain', field, value)} />
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
                    <button type="submit" className="sliit-button-primary">
                      {selectedSportId ? 'Save Sport' : 'Create Sport'}
                    </button>
                    {selectedSportId ? (
                      <button type="button" onClick={removeSport} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-3 font-semibold text-rose-200">
                        Delete Sport
                      </button>
                    ) : null}
                  </div>
                </form>
              </div>
            ) : null}
          </section>

          <section
            id="clubs"
            ref={clubsSectionRef}
            tabIndex="-1"
            className={activeTab === 'clubs' ? 'outline-none' : 'hidden'}
          >
            <div className="mb-8 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-sliit-blue">Clubs & Groups</p>
              <h2 className="sliit-heading mt-3 text-4xl text-slate-950 sm:text-5xl">
                Select a club to review contacts or maintain its stored record.
              </h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              {clubs.length > 0 ? (
                <>
                  <ClubsGrid clubs={clubs} selectedId={selectedClub?.id} onSelect={setSelectedClubId} />
                  <ClubDetailPanel club={selectedClub} onContact={openContactModal} />
                </>
              ) : (
                <div className="sliit-card xl:col-span-2 p-8 text-center">
                  <h3 className="text-2xl font-semibold text-white">No clubs have been added yet.</h3>
                  <p className="mt-3 text-sm text-sliit-muted">
                    Use the admin form below to create the first club record.
                  </p>
                </div>
              )}
            </div>

            {isAdmin ? (
              <div className="sliit-card mt-8 p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-sliit-muted">Admin Form</p>
                    <h3 className="mt-2 text-3xl font-semibold text-white">
                      {selectedClubId ? `Edit ${selectedClub?.name}` : 'Create a new club'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClubId(null)
                      setClubForm(createEmptyClubForm())
                    }}
                    className="sliit-button-secondary"
                  >
                    New Club
                  </button>
                </div>

                <form className="mt-6 grid gap-4" onSubmit={saveClub}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Club name">
                      <input
                        className="sliit-input"
                        value={clubForm.name}
                        onChange={(event) => setClubForm({ ...clubForm, name: event.target.value })}
                      />
                    </Field>
                    <Field label="Icon or short label">
                      <input
                        className="sliit-input"
                        value={clubForm.icon}
                        onChange={(event) => setClubForm({ ...clubForm, icon: event.target.value })}
                      />
                    </Field>
                  </div>

                  <Field label="Description">
                    <textarea
                      rows="4"
                      className="sliit-input resize-none"
                      value={clubForm.description}
                      onChange={(event) => setClubForm({ ...clubForm, description: event.target.value })}
                    />
                  </Field>

                  <div className="grid gap-4">
                    <ContactFields title="President" value={clubForm.president} onChange={(field, value) => updateClubContact('president', field, value)} />
                    <ContactFields title="Secretary" value={clubForm.secretary} onChange={(field, value) => updateClubContact('secretary', field, value)} />
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
                    <button type="submit" className="sliit-button-primary">
                      {selectedClubId ? 'Save Club' : 'Create Club'}
                    </button>
                    {selectedClubId ? (
                      <button type="button" onClick={removeClub} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-3 font-semibold text-rose-200">
                        Delete Club
                      </button>
                    ) : null}
                  </div>
                </form>
              </div>
            ) : null}
          </section>
        </div>
      )}
    </section>
  )
}
