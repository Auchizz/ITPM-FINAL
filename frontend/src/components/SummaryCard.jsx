export default function SummaryCard({ title, value, delta, icon, color = 'blue', live = false }) {
  const colors = {
    blue:   { bg: 'bg-primary-pale',    accent: 'bg-primary' },
    green:  { bg: 'bg-unigreen-pale',   accent: 'bg-unigreen' },
    orange: { bg: 'bg-accent-pale',     accent: 'bg-accent' },
    info:   { bg: 'bg-blue-50',         accent: 'bg-blue-500' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className="card relative overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
      {/* corner accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10 ${c.accent}`} />

      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base mb-2.5 ${c.bg}`}>
        {icon}
      </div>
      <div className="text-xs font-semibold text-slate-500 mb-1">{title}</div>
      <div className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight mb-1">{value}</div>
      {delta && (
        <div className="text-xs font-semibold text-unigreen">▲ {delta}</div>
      )}
      {live && (
        <div className="text-[10.5px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="live-dot" />Live
        </div>
      )}
    </div>
  )
}
