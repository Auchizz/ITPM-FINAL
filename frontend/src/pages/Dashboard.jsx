import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard(){
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex bg-pagebg">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="mb-6">
            <div className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}</h2>
                <p className="text-slate-600 mt-1">Here's a quick overview of your account and recent activity.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border">Export</button>
                <button className="btn-primary">New Invite</button>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <SummaryCard title="Account Type" value={user?.role || 'Member'}>👤</SummaryCard>
            <SummaryCard title="Profile Status" value={user ? 'Complete' : 'Incomplete'}>✅</SummaryCard>
            <SummaryCard title="Access Level" value={user?.role || 'Member'}>🔒</SummaryCard>
            <SummaryCard title="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}>📅</SummaryCard>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
              <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">🏃</div>
                  <div>
                    <div className="font-medium">Logged in</div>
                    <div className="text-sm text-slate-500">Today — from campus network</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">📝</div>
                  <div>
                    <div className="font-medium">Updated profile</div>
                    <div className="text-sm text-slate-500">Yesterday — changed faculty</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded">Active users<br/><span className="font-bold text-lg">1,245</span></div>
                <div className="p-3 bg-slate-50 rounded">Admins<br/><span className="font-bold text-lg">8</span></div>
                <div className="p-3 bg-slate-50 rounded">New signups<br/><span className="font-bold text-lg">24</span></div>
                <div className="p-3 bg-slate-50 rounded">Errors<br/><span className="font-bold text-lg text-danger">0</span></div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
