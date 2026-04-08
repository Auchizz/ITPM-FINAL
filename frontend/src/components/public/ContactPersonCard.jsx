export default function ContactPersonCard({
  title,
  person,
  accent = 'gold',
  onContact
}) {
  const accentClasses = accent === 'blue'
    ? 'border-sliit-blue/25 bg-sliit-blue/10'
    : 'border-sliit-gold/20 bg-sliit-gold/10'

  return (
    <div className={`rounded-[1.75rem] border p-5 ${accentClasses} flex min-w-0 flex-col`}>
      <div className="text-xs uppercase tracking-[0.28em] text-sliit-muted">{title}</div>
      <div className="mt-3 text-xl font-semibold text-white break-words">{person.name}</div>
      <div className="mt-3 space-y-2 text-sm text-sliit-muted break-words">
        <p className="leading-6"><span className="text-white">Email:</span> {person.email}</p>
        {person.phone ? <p className="leading-6"><span className="text-white">Phone:</span> {person.phone}</p> : null}
      </div>
      <button type="button" onClick={onContact} className="sliit-button-secondary mt-5 w-full justify-center">
        Send Message
      </button>
    </div>
  )
}
