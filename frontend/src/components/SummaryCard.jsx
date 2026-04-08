<<<<<<< HEAD
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
=======
import React from 'react'

export default function SummaryCard({ title, value, detail, children }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#efe3d3] blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">{title}</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-primary">{value}</div>
          {detail ? <div className="mt-2 text-sm text-[#6f675d]">{detail}</div> : null}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-[#fff8ef] shadow-lg shadow-[rgba(23,50,77,0.15)]">
          {children}
        </div>
      </div>
>>>>>>> origin/main
    </div>
  )
}
