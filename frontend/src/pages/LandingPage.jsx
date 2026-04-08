<<<<<<< HEAD
=======
import React from 'react'
>>>>>>> origin/main
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fffaf2] to-pagebg">
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto w-full">
        <div className="text-2xl font-bold text-primary">SportSphere</div>
        <div className="flex gap-4">
          <Link to="/login" className="rounded-2xl border border-[#d8c6ab] px-4 py-2 text-primary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <section className="max-w-5xl text-center py-20">
          <div className="inline-block rounded-full bg-gradient-to-r from-primary to-sportgreen px-4 py-2 font-semibold text-[#fff8ef] mb-6">University Edition • Beta</div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary">Welcome to SportSphere</h1>
          <p className="mt-4 text-lg text-[#6f675d]">A modern user platform for university systems with secure access and profile management.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="rounded-2xl border border-[#d8c6ab] bg-[#fffdf8]/90 px-6 py-3 text-primary">Login</Link>
          </div>
        </section>

        <section className="w-full max-w-6xl grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <h3 className="text-xl font-semibold text-primary">Secure Access</h3>
            <p className="mt-2 text-[#6f675d]">Built with JWT authentication and role based access controls.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-primary">Profile Management</h3>
            <p className="mt-2 text-[#6f675d]">Students and admins manage accounts, roles and preferences.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-primary">Responsive Dashboard</h3>
            <p className="mt-2 text-[#6f675d]">Modern UI with actionable insights and user management tools.</p>
          </div>
        </section>

        <section className="w-full text-center py-8">
          <div className="card max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-primary">Platform Preview</h3>
            <p className="mt-2 text-[#6f675d]">Responsive dashboard, user management, settings, and profile editing.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[22px] bg-[#f8f1e7] p-4 text-primary">Live preview of the dashboard with clean metrics and activity feed.</div>
              <div className="rounded-[22px] bg-[#f8f1e7] p-4 text-primary">Manage users, roles, and account preferences from a single place.</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-6 text-center text-sm text-[#7d7467]">© {new Date().getFullYear()} SportSphere — Built for demo</footer>
>>>>>>> origin/main
    </div>
  )
}
