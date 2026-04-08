import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
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
    </div>
  )
}
