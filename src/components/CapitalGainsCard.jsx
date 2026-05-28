import React from 'react'
import { fmt } from '../utils/api'

function GainRow({ label, value }) {
  const isNegative = value < 0
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span
        className={`text-sm font-semibold font-mono ${
          isNegative ? 'text-red-400' : 'text-gray-100'
        }`}
      >
        {fmt(value)}
      </span>
    </div>
  )
}

export default function CapitalGainsCard({ title, stcg, ltcg, highlight }) {
  const total = stcg + ltcg
  const isNegativeTotal = total < 0

  return (
    <div
      className={`rounded-xl border p-5 flex-1 min-w-[200px] transition-all ${
        highlight
          ? 'border-blue-500/40 bg-blue-950/30 shadow-lg shadow-blue-900/20'
          : 'border-white/10 bg-[#111827]'
      }`}
    >
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {title}
      </h3>

      <div className="mb-4">
        <GainRow label="Short-term gains" value={stcg} />
        <GainRow label="Long-term gains" value={ltcg} />
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-semibold text-gray-300">Total gains</span>
        <span
          className={`text-base font-bold font-mono ${
            isNegativeTotal ? 'text-red-400' : 'text-green-400'
          }`}
        >
          {fmt(total)}
        </span>
      </div>
    </div>
  )
}
