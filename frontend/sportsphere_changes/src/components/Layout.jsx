import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar  from './Navbar'
import Ticker  from './Ticker'
import ChatBox from './ChatBox'

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex w-full bg-pagebg overflow-x-hidden">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content pushed right of sidebar on desktop */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 w-full">
        <Ticker />
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 page-enter">
          {children}
        </main>
        <footer className="bg-primary text-white/50 py-5 px-6 text-center text-xs">
          <div className="font-display font-bold text-white/80 text-sm mb-1">
            Sportsphere — University Sports &amp; Events System
          </div>
          <p>© 2025 University. All rights reserved. · Sports Dept · IT Department · Student Affairs</p>
        </footer>
      </div>

      <ChatBox />
    </div>
  )
}
