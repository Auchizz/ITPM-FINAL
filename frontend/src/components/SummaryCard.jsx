import React from 'react'

export default function SummaryCard({ title, value, children }) {
  return (
    <div className="card flex-1 min-w-[160px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
        <div className="text-3xl opacity-40">{children}</div>
      </div>
    </div>
  )
}
