// KoinX Assignment API endpoint
const BASE_URL = 'https://koinx-backend-assignment.onrender.com'

// Fetch holdings data with an 8-second timeout
export async function fetchHoldings() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(`${BASE_URL}/holdings`, {
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    console.log('[KoinX API] response:', data)
    return data
  } catch (err) {
    clearTimeout(timer)
    console.warn('[KoinX API] failed:', err.message)
    throw err
  }
}

// Fallback mock data — used if the API is unreachable
export const MOCK_HOLDINGS = [
  {
    coin: 'Bitcoin',
    coinSymbol: 'BTC',
    currentPrice: 93640.31,
    totalHolding: 0.0568,
    averageBuyPrice: 88000,
    stcg: { gain: 42.33, loss: 0 },
    ltcg: { gain: 231.45, loss: 0 },
  },
  {
    coin: 'Ethereum',
    coinSymbol: 'ETH',
    currentPrice: 1802.37,
    totalHolding: 2.45,
    averageBuyPrice: 2500,
    stcg: { gain: 0, loss: 1709.3 },
    ltcg: { gain: 0, loss: 0 },
  },
  {
    coin: 'Solana',
    coinSymbol: 'SOL',
    currentPrice: 148.36,
    totalHolding: 12.0,
    averageBuyPrice: 130,
    stcg: { gain: 0, loss: 0 },
    ltcg: { gain: 217.37, loss: 0 },
  },
  {
    coin: 'Cardano',
    coinSymbol: 'ADA',
    currentPrice: 0.695,
    totalHolding: 5000,
    averageBuyPrice: 1.2,
    stcg: { gain: 0, loss: 2525 },
    ltcg: { gain: 0, loss: 0 },
  },
  {
    coin: 'Polygon',
    coinSymbol: 'MATIC',
    currentPrice: 0.385,
    totalHolding: 8000,
    averageBuyPrice: 0.5,
    stcg: { gain: 0, loss: 0 },
    ltcg: { gain: 0, loss: 920 },
  },
  {
    coin: 'Chainlink',
    coinSymbol: 'LINK',
    currentPrice: 13.42,
    totalHolding: 100,
    averageBuyPrice: 12.0,
    stcg: { gain: 142, loss: 0 },
    ltcg: { gain: 0, loss: 0 },
  },
  {
    coin: 'Uniswap',
    coinSymbol: 'UNI',
    currentPrice: 5.81,
    totalHolding: 200,
    averageBuyPrice: 8.0,
    stcg: { gain: 0, loss: 438 },
    ltcg: { gain: 0, loss: 0 },
  },
  {
    coin: 'Avalanche',
    coinSymbol: 'AVAX',
    currentPrice: 22.14,
    totalHolding: 50,
    averageBuyPrice: 18,
    stcg: { gain: 0, loss: 0 },
    ltcg: { gain: 207, loss: 0 },
  },
]

// Compute the net gain/loss from a list of holdings
export function computeGains(holdings) {
  return holdings.reduce(
    (acc, h) => {
      acc.stcg += (h.stcg?.gain || 0) - (h.stcg?.loss || 0)
      acc.ltcg += (h.ltcg?.gain || 0) - (h.ltcg?.loss || 0)
      return acc
    },
    { stcg: 0, ltcg: 0 }
  )
}

// Format number as currency string
export function fmt(value, decimals = 2) {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${value < 0 ? '-' : ''}$${formatted}`
}
