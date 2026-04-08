import React from 'react'
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
          <section className="mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-[#224764] to-sportgreen text-[#fff8ef] shadow-2xl shadow-[rgba(23,50,77,0.16)]">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.5fr,1fr] lg:p-10">
              <div>
                <div className="inline-flex rounded-full border border-[#fff8ef]/10 bg-[#fff8ef]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#fff8ef]/70">
                  Season Ready
                </div>
                <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                  Welcome back, {user?.name || 'User'}.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#fff8ef]/74">
                  This refreshed dashboard keeps profile quality, access level, and student identity visible at a glance.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/profile" className="btn-primary">
                    Open Profile Studio
                  </a>
                  <a
                    href="/dashboard/module"
                    className="inline-flex items-center justify-center rounded-2xl border border-[#fff8ef]/15 bg-[#fff8ef]/10 px-5 py-3 text-sm font-semibold text-[#fff8ef] transition hover:bg-[#fff8ef]/15"
                  >
                    Open Sports Module
                  </a>
                  <a
                    href="/settings"
                    className="inline-flex items-center justify-center rounded-2xl border border-[#fff8ef]/15 bg-[#fff8ef]/10 px-5 py-3 text-sm font-semibold text-[#fff8ef] transition hover:bg-[#fff8ef]/15"
                  >
                    Review Settings
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[28px] border border-[#fff8ef]/10 bg-[#fff8ef]/10 p-5 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.28em] text-[#fff8ef]/55">Current Role</div>
                  <div className="mt-3 text-3xl font-black capitalize">{user?.role || 'student'}</div>
                  <div className="mt-2 text-sm text-[#fff8ef]/74">Permissions and dashboard access are synchronized with your account type.</div>
                </div>
                <div className="rounded-[28px] border border-[#fff8ef]/14 bg-[#d88c4f]/16 p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-[#fff1de]/84">Profile Completion</div>
                  <div className="mt-3 text-3xl font-black">{completionScore(user)}</div>
                  <div className="mt-2 text-sm text-[#fff1de]/80">Complete faculty and student ID details for a stronger profile.</div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard title="Account Type" value={user?.role || 'student'} detail="Assigned from your platform permissions">
              ◉
            </SummaryCard>
            <SummaryCard title="Profile Status" value={user?.faculty && user?.studentId ? 'Ready' : 'Needs Work'} detail="Based on required academic fields">
              ✓
            </SummaryCard>
            <SummaryCard title="Faculty" value={user?.faculty || 'Not set'} detail="Displayed across your sport identity">
              ⌘
            </SummaryCard>
            <SummaryCard title="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'} detail="First recorded account activity">
              ◌
            </SummaryCard>
          </section>

          <section className="mt-8">
            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Momentum</div>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Recent profile activity</h3>
                </div>
                <div className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-semibold text-primary">Live account view</div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ['Profile available', 'Your account is authenticated and ready to edit.'],
                  ['Faculty captured', user?.faculty ? user.faculty : 'Faculty is still missing from your profile.'],
                  ['Student identity', user?.studentId ? `Student ID ${user.studentId}` : 'Student ID has not been added yet.'],
                ].map(([title, description]) => (
                  <div key={title} className="flex flex-col gap-4 rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4 sm:flex-row">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fffdf8] text-lg shadow-sm">
                      •
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{title}</div>
                      <div className="mt-1 text-sm leading-6 text-[#6f675d]">{description}</div>
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
