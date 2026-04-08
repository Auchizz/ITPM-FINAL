import ContactPersonCard from './ContactPersonCard'

export default function ClubDetailPanel({ club, onContact }) {
  if (!club) return null

  const displayIcon = club.icon && club.icon.trim().toUpperCase() !== 'CL' ? club.icon : ''

  return (
    <aside className="sliit-card lg:sticky lg:top-24">
      <div className="border-b border-white/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sliit-muted">Selected Club</p>
            <h3 className="mt-3 text-4xl font-semibold text-white">
              {displayIcon ? (
                <span className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                  {displayIcon}
                </span>
              ) : null}
              {club.name}
            </h3>
          </div>
          <span className="rounded-full border border-sliit-blue/30 bg-sliit-blue/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-sliit-blue">
            How to Join
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-sliit-muted">{club.description}</p>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <ContactPersonCard
          title="Club President"
          person={club.president}
          accent="blue"
          onContact={() => onContact({
            recipientName: club.president.name,
            recipientRole: 'President',
            sportOrClubName: club.name,
            entityType: 'club'
          })}
        />
        <ContactPersonCard
          title="Club Secretary"
          person={club.secretary}
          accent="blue"
          onContact={() => onContact({
            recipientName: club.secretary.name,
            recipientRole: 'Secretary',
            sportOrClubName: club.name,
            entityType: 'club'
          })}
        />
      </div>
    </aside>
  )
}
