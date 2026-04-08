const statusStyles = {
  Open: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  Limited: 'border-sliit-gold/30 bg-sliit-gold/10 text-sliit-gold',
  Booked: 'border-rose-500/30 bg-rose-500/10 text-rose-200'
}

export default function FacilitiesSection({ overview, availability }) {
  return (
    <div className="space-y-10">
      <div className="grid gap-5 lg:grid-cols-3">
        {overview.map((item) => (
          <article key={item.title} className="sliit-card p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-sliit-muted">Facilities</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-sliit-muted">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="sliit-card overflow-hidden p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sliit-muted">Availability Grid</p>
          <h2 className="sliit-heading mt-3 text-4xl text-white sm:text-5xl">Check the latest facility availability before you request a booking.</h2>
        </div>

        <div className="mt-8 grid gap-4">
          {availability.map((facility) => (
            <div key={facility.facility} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{facility.facility}</h3>
                  <p className="mt-2 text-sm text-sliit-muted">Live slot visibility for courts, grounds, halls, and shared activity spaces.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {facility.slots.map((slot) => (
                    <div key={`${facility.facility}-${slot.time}`} className="rounded-2xl border border-white/10 bg-[#0d1528] px-4 py-3 text-center">
                      <div className="text-xs uppercase tracking-[0.24em] text-sliit-muted">{slot.time}</div>
                      <div className={`mt-3 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${statusStyles[slot.status]}`}>
                        {slot.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
