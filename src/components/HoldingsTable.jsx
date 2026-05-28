import React from 'react'
import { fmt } from '../utils/api'

function CoinLogo({ symbol, name }) {
  const [imgError, setImgError] = React.useState(false)

  const colors = {
    BTC: '#F7931A', ETH: '#627EEA', SOL: '#9945FF', ADA: '#0033AD',
    MATIC: '#8247E5', LINK: '#2A5ADA', UNI: '#FF007A', AVAX: '#E84142',
    BNB: '#F3BA2F', XRP: '#00AAE4',
  }

  const color = colors[symbol?.toUpperCase()] || '#3B82F6'
  const initials = symbol?.slice(0, 2).toUpperCase() || '??'

  if (imgError) {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={`https://assets.coincap.io/assets/icons/${symbol?.toLowerCase()}@2x.png`}
      alt={name}
      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      onError={() => setImgError(true)}
    />
  )
}

function GainCell({ gain, loss }) {
  const net = (gain || 0) - (loss || 0)
  const isNeg = net < 0
  return (
    <div className="text-right">
      <span
        className={`text-sm font-mono font-medium ${
          isNeg ? 'text-red-400' : net > 0 ? 'text-green-400' : 'text-gray-500'
        }`}
      >
        {fmt(net)}
      </span>
    </div>
  )
}

export default function HoldingsTable({ holdings, selected, onToggle }) {
  const [sortKey, setSortKey] = React.useState(null)
  const [sortDir, setSortDir] = React.useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = React.useMemo(() => {
    if (!sortKey) return holdings
    return [...holdings].sort((a, b) => {
      let aVal, bVal
      if (sortKey === 'stcg') { aVal = (a.stcg?.gain || 0) - (a.stcg?.loss || 0); bVal = (b.stcg?.gain || 0) - (b.stcg?.loss || 0) }
      else if (sortKey === 'ltcg') { aVal = (a.ltcg?.gain || 0) - (a.ltcg?.loss || 0); bVal = (b.ltcg?.gain || 0) - (b.ltcg?.loss || 0) }
      else if (sortKey === 'coin') { aVal = a.coin?.toLowerCase(); bVal = b.coin?.toLowerCase() }
      else { aVal = a[sortKey]; bVal = b[sortKey] }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [holdings, sortKey, sortDir])

  const allSelected = holdings.length > 0 && holdings.every((h) => selected.has(h.coinSymbol))
  const toggleAll = () => {
    if (allSelected) holdings.forEach((h) => onToggle(h.coinSymbol, false))
    else holdings.forEach((h) => onToggle(h.coinSymbol, true))
  }

  function SortIcon({ col }) {
    if (sortKey !== col) return <span className="text-gray-600 ml-1">↕</span>
    return <span className="text-blue-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  function Th({ col, label, className = '' }) {
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-300 transition-colors whitespace-nowrap ${className}`}
        onClick={() => handleSort(col)}
      >
        {label}<SortIcon col={col} />
      </th>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-thin rounded-xl border border-white/10">
      <table className="w-full min-w-[720px]">
        <thead className="bg-[#0d1117] border-b border-white/10">
          <tr>
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </th>
            <Th col="coin" label="Asset" />
            <Th col="totalHolding" label="Holdings" className="text-right" />
            <Th col="currentPrice" label="Current Price" className="text-right" />
            <Th col="stcg" label="Short-term Gain/Loss" className="text-right" />
            <Th col="ltcg" label="Long-term Gain/Loss" className="text-right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-[#0f1219]">
          {sorted.map((holding) => {
            const isChecked = selected.has(holding.coinSymbol)
            const hasLoss = (holding.stcg?.loss || 0) > 0 || (holding.ltcg?.loss || 0) > 0

            return (
              <tr
                key={holding.coinSymbol}
                onClick={() => onToggle(holding.coinSymbol, !isChecked)}
                className={`cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-blue-950/40 hover:bg-blue-950/60'
                    : 'hover:bg-white/5'
                }`}
              >
                <td className="px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => { e.stopPropagation(); onToggle(holding.coinSymbol, e.target.checked) }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                  />
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <CoinLogo symbol={holding.coinSymbol} name={holding.coin} />
                    <div>
                      <div className="font-semibold text-sm text-gray-100">{holding.coin}</div>
                      <div className="text-xs text-gray-500 font-mono">{holding.coinSymbol}</div>
                    </div>
                    {hasLoss && (
                      <span className="ml-1 text-xs bg-red-950/60 text-red-400 font-medium px-2 py-0.5 rounded-full border border-red-800/40">
                        Loss
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3.5 text-right">
                  <div className="text-sm font-mono text-gray-200">
                    {holding.totalHolding?.toLocaleString('en-US', { maximumFractionDigits: 6 })}{' '}
                    <span className="text-gray-500 text-xs">{holding.coinSymbol}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {fmt(holding.totalHolding * holding.currentPrice)}
                  </div>
                </td>

                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-mono text-gray-200">{fmt(holding.currentPrice)}</span>
                </td>

                <td className="px-4 py-3.5">
                  <GainCell gain={holding.stcg?.gain} loss={holding.stcg?.loss} />
                </td>

                <td className="px-4 py-3.5">
                  <GainCell gain={holding.ltcg?.gain} loss={holding.ltcg?.loss} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {holdings.length === 0 && (
        <div className="py-16 text-center text-gray-600">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm">No holdings data found.</p>
        </div>
      )}
    </div>
  )
}
