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
    </div>
  )
}
