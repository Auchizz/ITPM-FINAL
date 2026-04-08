export default function StatsBar({ stats }) {
  return (
    <section className="sliit-section">
      <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-sliit sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-[#0e1628] px-5 py-4 text-center">
            <div className="sliit-heading text-4xl text-sliit-gold">{stat.value}</div>
            <div className="mt-2 text-sm uppercase tracking-[0.28em] text-sliit-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
