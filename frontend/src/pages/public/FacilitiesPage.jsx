import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import moduleApi from '../../api/moduleApi'
import FacilitiesSection from '../../components/public/FacilitiesSection'
import {
  createEmptyFacilityForm,
  facilityStatusOptions
} from '../../data/sportsModuleConfig'

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-sliit-muted">
      {label}
      {children}
    </label>
  )
}

const toFacilityForm = (facility) => ({
  facility: facility.facility || '',
  description: facility.description || '',
  slots: facility.slots?.length
    ? facility.slots.map((slot) => ({ time: slot.time || '', status: slot.status || 'Open' }))
    : createEmptyFacilityForm().slots
})

export default function FacilitiesPage() {
  const { user } = useAuth()
  const { showToast } = useOutletContext()
  const isAdmin = user?.role === 'admin'

  const [facilities, setFacilities] = useState([])
  const [selectedFacilityId, setSelectedFacilityId] = useState(null)
  const [facilityForm, setFacilityForm] = useState(createEmptyFacilityForm())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedFacility = useMemo(
    () => facilities.find((facility) => facility.id === selectedFacilityId) ?? null,
    [facilities, selectedFacilityId]
  )

  const facilityOverview = useMemo(() => ([
    {
      title: 'Book sports spaces',
      description: 'Use the data entry form to keep facility names, descriptions, and slot visibility current for your organization.'
    },
    {
      title: 'Show availability windows',
      description: 'Each facility supports multiple time slots so users can quickly understand when access is open, limited, or booked.'
    },
    {
      title: 'Update from the dashboard',
      description: 'Admins can manage availability records without changing code, and the page updates from the backend automatically.'
    }
  ]), [])

  useEffect(() => {
    loadFacilities()
  }, [])

  useEffect(() => {
    setFacilityForm(selectedFacility ? toFacilityForm(selectedFacility) : createEmptyFacilityForm())
  }, [selectedFacility])

  async function loadFacilities(preferredId = null) {
    try {
      setLoading(true)
      const facilityData = await moduleApi.getFacilities()
      setFacilities(facilityData)
      setSelectedFacilityId((current) => {
        if (preferredId && facilityData.some((facility) => facility.id === preferredId)) return preferredId
        if (current && facilityData.some((facility) => facility.id === current)) return current
        return facilityData[0]?.id ?? null
      })
    } catch (loadError) {
      console.error('loadFacilities', loadError)
      setError('Unable to load facility records.')
    } finally {
      setLoading(false)
    }
  }

  function updateSlot(index, field, value) {
    setFacilityForm((current) => ({
      ...current,
      slots: current.slots.map((slot, slotIndex) => (
        slotIndex === index ? { ...slot, [field]: value } : slot
      ))
    }))
  }

  function addSlot() {
    setFacilityForm((current) => ({
      ...current,
      slots: [...current.slots, { time: '', status: 'Open' }]
    }))
  }

  function removeSlot(index) {
    setFacilityForm((current) => ({
      ...current,
      slots: current.slots.filter((_, slotIndex) => slotIndex !== index)
    }))
  }

  async function saveFacility(event) {
    event.preventDefault()
    setError('')

    const payload = {
      facility: facilityForm.facility.trim(),
      description: facilityForm.description.trim(),
      slots: facilityForm.slots.map((slot) => ({
        time: slot.time.trim(),
        status: slot.status
      }))
    }

    try {
      const saved = selectedFacilityId
        ? await moduleApi.updateFacility(selectedFacilityId, payload)
        : await moduleApi.createFacility(payload)

      showToast(selectedFacilityId ? 'Facility updated successfully.' : 'Facility created successfully.')
      await loadFacilities(saved.id)
    } catch (saveError) {
      console.error('saveFacility', saveError)
      setError(saveError?.response?.data?.message || 'Unable to save the facility record.')
    }
  }

  async function removeFacility() {
    if (!selectedFacilityId || !confirm('Delete this facility record?')) return

    try {
      await moduleApi.deleteFacility(selectedFacilityId)
      showToast('Facility deleted successfully.')
      await loadFacilities(null)
      setFacilityForm(createEmptyFacilityForm())
    } catch (removeError) {
      console.error('removeFacility', removeError)
      setError(removeError?.response?.data?.message || 'Unable to delete the facility record.')
    }
  }

  return (
    <section className="sliit-section py-12 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="sliit-pill justify-center">Facilities</p>
        <h1 className="sliit-heading mt-6 text-5xl text-slate-950 sm:text-6xl">
          Maintain facility descriptions and time-slot availability.
        </h1>
        <p className="mt-5 text-lg leading-8 text-sliit-muted">
          Facilities now come from backend records, and admins can keep slot information current directly from the dashboard.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-800/60 bg-rose-200 px-4 py-3 text-sm text-rose-950">
          {error}
        </div>
      ) : null}

      <div className="mt-10">
        {loading ? (
          <div className="sliit-card p-8 text-center text-sliit-muted">Loading facilities...</div>
        ) : (
          <FacilitiesSection overview={facilityOverview} availability={facilities} />
        )}
      </div>

      {isAdmin ? (
        <div className="sliit-card mt-8 space-y-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sliit-muted">Admin Form</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                {selectedFacilityId ? `Edit ${selectedFacility?.facility}` : 'Create a new facility'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedFacilityId(null)
                setFacilityForm(createEmptyFacilityForm())
              }}
              className="sliit-button-secondary"
            >
              New Facility
            </button>
          </div>

          {facilities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {facilities.map((facility) => (
                <button
                  key={facility.id}
                  type="button"
                  onClick={() => setSelectedFacilityId(facility.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedFacilityId === facility.id
                      ? 'bg-sliit-gold text-sliit-bg'
                      : 'border border-white/10 bg-white/5 text-sliit-muted hover:text-white'
                  }`}
                >
                  {facility.facility}
                </button>
              ))}
            </div>
          ) : null}

          <form className="grid gap-6" onSubmit={saveFacility}>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Field label="Facility name">
                  <input
                    className="sliit-input"
                    value={facilityForm.facility}
                    onChange={(event) => setFacilityForm({ ...facilityForm, facility: event.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <textarea
                    rows="4"
                    className="sliit-input resize-none"
                    value={facilityForm.description}
                    onChange={(event) => setFacilityForm({ ...facilityForm, description: event.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">Time Slots</h4>
                  <p className="mt-1 text-sm text-sliit-muted">Add one or more availability entries for this facility.</p>
                </div>
                <button type="button" onClick={addSlot} className="sliit-button-secondary">
                  Add Slot
                </button>
              </div>

              <div className="mt-4 grid gap-4">
                {facilityForm.slots.map((slot, index) => (
                  <div key={`${slot.time}-${index}`} className="grid gap-4 rounded-2xl border border-white/10 bg-[#0d1528] p-4 sm:grid-cols-[1fr_1fr_auto]">
                    <Field label="Time">
                      <input
                        className="sliit-input"
                        value={slot.time}
                        onChange={(event) => updateSlot(index, 'time', event.target.value)}
                      />
                    </Field>
                    <Field label="Status">
                      <select
                        className="sliit-input"
                        value={slot.status}
                        onChange={(event) => updateSlot(index, 'status', event.target.value)}
                      >
                        {facilityStatusOptions.map((option) => (
                          <option key={option} value={option} className="bg-sliit-bg text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        disabled={facilityForm.slots.length === 1}
                        className="rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <button type="submit" className="sliit-button-primary">
                {selectedFacilityId ? 'Save Facility' : 'Create Facility'}
              </button>
              {selectedFacilityId ? (
                <button type="button" onClick={removeFacility} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-3 font-semibold text-rose-200">
                  Delete Facility
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}
