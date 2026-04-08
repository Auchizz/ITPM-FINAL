import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pagebg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto w-full">
        <div className="font-display text-xl font-bold text-primary">Sportsphere</div>
        <div className="flex gap-3">
          <Link to="/login"    className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">Login</Link>
          <Link to="/register" className="btn-primary px-5 py-2 text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-unigreen text-white text-xs font-bold mb-6 tracking-wide">
          🎓 University Edition · 2025
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 mb-4 max-w-2xl leading-tight">
          Welcome to Sportsphere
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mb-8">
          Your central hub for university sports events, news, announcements, gallery highlights and real-time campus information.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="btn-primary px-8 py-3 text-base">Get Started →</Link>
          <Link to="/login"    className="btn-secondary px-8 py-3 text-base">Sign In</Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 w-full max-w-4xl">
          {[
            { icon:'📰', title:'News & Announcements', desc:'Stay updated with the latest university news, departmental announcements and academic updates.' },
            { icon:'🏆', title:'Events & Gallery',      desc:'Browse upcoming events, register instantly, and explore campus highlights through the gallery.' },
            { icon:'⏱️',  title:'Real-Time Info',        desc:'Live clock, campus occupancy, weather, student activity feed and portal statistics.' },
          ].map(f => (
            <div key={f.title} className="card text-left hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Sportsphere - University Sports & Events System
      </footer>
    </div>
  )
}
