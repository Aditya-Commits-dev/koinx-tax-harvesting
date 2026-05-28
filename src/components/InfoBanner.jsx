import React from 'react'

export default function InfoBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-blue-950/40 border border-blue-800/40 p-4">
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm text-blue-300 font-medium">
          Important: This tool is for informational purposes only
        </p>
        <p className="text-xs text-blue-400/70 mt-1 leading-relaxed">
          Tax loss harvesting involves selling assets at a loss to offset capital gains. The
          figures shown are estimates. Consult a qualified tax professional before making any
          investment decisions. Wash sale rules may apply in your jurisdiction.
        </p>
      </div>
    </div>
  )
}
