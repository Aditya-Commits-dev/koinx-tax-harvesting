import React from 'react'

export default function Navbar() {
  return (
    <header className="bg-[#0d0d16] border-b border-[#1a2744] sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-xl text-white tracking-tight">KoinX</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-blue-400 transition-colors">Crypto Taxes</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Free Tools</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Resources</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">
            Sign In
          </button>
          <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40">
            Get Started
          </button>
        </div>
      </div>
    </header>
  )
}
