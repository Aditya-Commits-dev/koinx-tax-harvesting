import React, { useState, useEffect, useMemo } from 'react'
import Navbar from './components/Navbar'
import CapitalGainsCard from './components/CapitalGainsCard'
import HoldingsTable from './components/HoldingsTable'
import InfoBanner from './components/InfoBanner'
import { fetchHoldings, MOCK_HOLDINGS, computeGains, fmt } from './utils/api'

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Loading your portfolio...</p>
    </div>
  )
}

export default function App() {
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [selected, setSelected] = useState(new Set())

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchHoldings()
      let arr = []
      if (Array.isArray(data)) arr = data
      else if (Array.isArray(data?.data)) arr = data.data
      else if (Array.isArray(data?.holdings)) arr = data.holdings

      if (arr.length > 0) {
        setHoldings(arr)
        setUsingMock(false)
      } else {
        setHoldings(MOCK_HOLDINGS)
        setUsingMock(true)
      }
    } catch (err) {
      setHoldings(MOCK_HOLDINGS)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleToggle = (symbol, checked) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(symbol)
      else next.delete(symbol)
      return next
    })
  }

  const preGains = useMemo(() => computeGains(holdings), [holdings])
  const selectedHoldings = useMemo(() => holdings.filter((h) => selected.has(h.coinSymbol)), [holdings, selected])
  const postGains = useMemo(() => {
    const sg = computeGains(selectedHoldings)
    return { stcg: preGains.stcg - sg.stcg, ltcg: preGains.ltcg - sg.ltcg }
  }, [preGains, selectedHoldings])

  const savings = useMemo(() => {
    const preTax = Math.max(0, preGains.stcg) * 0.3 + Math.max(0, preGains.ltcg) * 0.2
    const postTax = Math.max(0, postGains.stcg) * 0.3 + Math.max(0, postGains.ltcg) * 0.2
    return preTax - postTax
  }, [preGains, postGains])

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Tax Loss Harvesting
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select assets to simulate selling them and see your tax savings
            </p>
          </div>
          {usingMock && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded-lg px-3 py-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Using demo data (API unavailable)
            </div>
          )}
        </div>

        {/* Info banner */}
        <InfoBanner />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Capital Gains Comparison */}
            <div className="bg-[#0d1117] rounded-xl border border-white/10 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
                <h2 className="text-base font-semibold text-white">
                  Capital Gains Overview
                </h2>
                {selected.size > 0 && savings > 0 && (
                  <div className="flex items-center gap-2 bg-green-950/40 border border-green-700/40 text-green-400 text-sm font-semibold px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Potential savings: {fmt(savings)}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <CapitalGainsCard title="Pre-Harvesting" stcg={preGains.stcg} ltcg={preGains.ltcg} />
                <div className="flex items-center justify-center text-gray-700">
                  <svg className="w-6 h-6 rotate-90 sm:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <CapitalGainsCard title="After Harvesting" stcg={postGains.stcg} ltcg={postGains.ltcg} highlight={selected.size > 0} />
              </div>

              {selected.size === 0 && (
                <p className="mt-4 text-xs text-gray-600 text-center">
                  ☝️ Select assets from the table below to simulate tax loss harvesting
                </p>
              )}
            </div>

            {/* Holdings Table */}
            <div className="bg-[#0d1117] rounded-xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Your Holdings</h2>
                <div className="flex items-center gap-3">
                  {selected.size > 0 && (
                    <button
                      onClick={() => setSelected(new Set())}
                      className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
                    >
                      Clear selection
                    </button>
                  )}
                  <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    {selected.size} / {holdings.length} selected
                  </span>
                </div>
              </div>

              <HoldingsTable holdings={holdings} selected={selected} onToggle={handleToggle} />
            </div>

            <p className="text-xs text-gray-600 text-center pb-4">
              Tax estimates based on 30% STCG rate and 20% LTCG rate. Actual rates may vary.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
