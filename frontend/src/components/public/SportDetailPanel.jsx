import ContactPersonCard from './ContactPersonCard'

export default function SportDetailPanel({ sport, onContact }) {
  if (!sport) return null

  return (
    <aside className="sliit-card lg:sticky lg:top-24">
      <div className="border-b border-white/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sliit-muted">Selected Sport</p>
            <h3 className="mt-3 text-4xl font-semibold text-white">
              <span className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                {sport.icon}
              </span>
              {sport.name}
            </h3>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-sliit-gold">{sport.team}</p>
          </div>
          <span className="rounded-full border border-sliit-gold/30 bg-sliit-gold/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-sliit-gold">
            How to Join
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-sliit-muted">{sport.description}</p>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <ContactPersonCard
          title="Captain"
          person={sport.captain}
          onContact={() => onContact({
            recipientName: sport.captain.name,
            recipientRole: 'Captain',
            sportOrClubName: sport.name,
            entityType: 'team'
          })}
        />
        <ContactPersonCard
          title="Vice Captain"
          person={sport.viceCaptain}
          onContact={() => onContact({
            recipientName: sport.viceCaptain.name,
            recipientRole: 'Vice Captain',
            sportOrClubName: sport.name,
            entityType: 'team'
          })}
        />
      </div>
    </aside>
  )
}
