import React from 'react'

export default function SummaryCard({ title, value, detail, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start justify-between gap-4">
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</div>
        <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
        {detail && <div className="mt-1 text-xs text-slate-400">{detail}</div>}
      </div>
      {children && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 text-lg">
          {children}
        </div>
      )}
    </div>
  )
}
