import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-pagebg">
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto w-full">
        <div className="text-2xl font-bold text-primary">SportSphere</div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 rounded-lg">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <section className="max-w-5xl text-center py-20">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary to-sportgreen text-white font-semibold mb-6">University Edition • Beta</div>
          <h1 className="text-4xl md:text-6xl font-extrabold">Welcome to SportSphere</h1>
          <p className="mt-4 text-lg text-slate-600">A modern user platform for university systems with secure access and profile management.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="px-6 py-3 rounded-lg border bg-white/80">Login</Link>
          </div>
        </section>

        <section className="w-full max-w-6xl grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <h3 className="text-xl font-semibold">Secure Access</h3>
            <p className="mt-2 text-slate-600">Built with JWT authentication and role based access controls.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold">Profile Management</h3>
            <p className="mt-2 text-slate-600">Students and admins manage accounts, roles and preferences.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold">Responsive Dashboard</h3>
            <p className="mt-2 text-slate-600">Modern UI with actionable insights and user management tools.</p>
          </div>
        </section>

        <section className="w-full text-center py-8">
          <div className="card max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold">Platform Preview</h3>
            <p className="mt-2 text-slate-600">Responsive dashboard, user management, settings, and profile editing.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded">Live preview of the dashboard with clean metrics and activity feed.</div>
              <div className="p-4 bg-slate-50 rounded">Manage users, roles, and account preferences from a single place.</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} SportSphere — Built for demo</footer>
    </div>
  )
}
