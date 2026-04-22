import React from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import { useAuth } from '../context/AuthContext'

function completionScore(user) {
  const fields = [user?.name, user?.email, user?.studentId, user?.faculty]
  const filled = fields.filter(Boolean).length
  return `${Math.round((filled / fields.length) * 100)}%`
}

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-pagebg md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="px-4 py-6 md:px-8">

          {/* Hero banner */}
          <section className="mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-[#224764] to-sportgreen text-white shadow-2xl">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.5fr,1fr] lg:p-10">
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 mb-4">
                  Season Ready
                </div>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Welcome back, {user?.name || 'User'}.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74">
                  This dashboard keeps profile quality, access level, and student identity visible at a glance.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/profile" className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90">
                    Open Profile Studio
                  </Link>
                  <Link to="/events" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                    View Events
                  </Link>
                  <Link to="/settings" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                    Review Settings
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/55">Current Role</div>
                  <div className="mt-3 text-3xl font-black capitalize">{user?.role || 'student'}</div>
                  <div className="mt-2 text-sm text-white/74">Permissions and dashboard access are synchronized with your account type.</div>
                </div>
                <div className="rounded-[28px] border border-white/14 bg-white/10 p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/84">Profile Completion</div>
                  <div className="mt-3 text-3xl font-black">{completionScore(user)}</div>
                  <div className="mt-2 text-sm text-white/80">Complete faculty and student ID details for a stronger profile.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Summary cards */}
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">
            <SummaryCard title="Account Type" value={user?.role || 'student'} detail="Assigned from your platform permissions">◉</SummaryCard>
            <SummaryCard title="Profile Status" value={user?.faculty && user?.studentId ? 'Complete' : 'Needs Work'} detail="Based on required academic fields">✓</SummaryCard>
            <SummaryCard title="Faculty" value={user?.faculty || 'Not set'} detail="Displayed across your sport identity">⌘</SummaryCard>
            <SummaryCard title="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'} detail="First recorded account activity">◌</SummaryCard>
          </section>

          {/* Recent activity */}
          <section>
            <div className="card">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Momentum</div>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Recent profile activity</h3>
                </div>
                <div className="rounded-full bg-primary-pale px-3 py-1 text-xs font-semibold text-primary">Live account view</div>
              </div>

              <div className="space-y-4">
                {[
                  ['Profile available', 'Your account is authenticated and ready to edit.'],
                  ['Faculty captured', user?.faculty ? user.faculty : 'Faculty is still missing from your profile.'],
                  ['Student identity', user?.studentId ? `Student ID ${user.studentId}` : 'Student ID has not been added yet.'],
                ].map(([title, description]) => (
                  <div key={title} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-lg shadow-sm">•</div>
                    <div>
                      <div className="font-semibold text-primary">{title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-500">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
