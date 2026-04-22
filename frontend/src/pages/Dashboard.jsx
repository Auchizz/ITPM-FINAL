import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
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
    <Layout>
      {/* Hero banner */}
      <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-[#224764] to-sportgreen text-white shadow-xl">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.5fr,1fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/70 mb-4">
              Season Ready
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              Welcome back, {user?.name || 'Admin'}.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              This dashboard keeps profile quality, access level, and student identity visible at a glance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/profile" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-white/90">
                Open Profile Studio
              </Link>
              <Link to="/events" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
                View Events
              </Link>
              <Link to="/settings" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
                Review Settings
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="text-xs uppercase tracking-widest text-white/55">Current Role</div>
              <div className="mt-2 text-2xl font-black capitalize">{user?.role || 'admin'}</div>
              <div className="mt-1 text-xs text-white/70">Permissions and dashboard access are synchronized with your account type.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="text-xs uppercase tracking-widest text-white/55">Profile Completion</div>
              <div className="mt-2 text-2xl font-black">{completionScore(user)}</div>
              <div className="mt-1 text-xs text-white/70">Complete faculty and student ID details for a stronger profile.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <SummaryCard title="Account Type" value={user?.role || 'admin'} detail="Assigned from your platform permissions">◉</SummaryCard>
        <SummaryCard title="Profile Status" value={user?.faculty && user?.studentId ? 'Complete' : 'Needs Work'} detail="Based on required academic fields">✓</SummaryCard>
        <SummaryCard title="Faculty" value={user?.faculty || 'Not set'} detail="Displayed across your sport identity">⌘</SummaryCard>
        <SummaryCard title="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'} detail="First recorded account activity">◌</SummaryCard>
      </section>

      {/* Recent activity */}
      <section>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Momentum</div>
              <h3 className="mt-1 text-xl font-black text-primary">Recent profile activity</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Live account view</span>
          </div>
          <div className="space-y-3">
            {[
              ['Profile available', 'Your account is authenticated and ready to edit.'],
              ['Faculty captured', user?.faculty || 'Faculty is still missing from your profile.'],
              ['Student identity', user?.studentId ? `Student ID: ${user.studentId}` : 'Student ID has not been added yet.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-lg">•</div>
                <div>
                  <div className="font-semibold text-primary text-sm">{title}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
