import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import { useAuth } from '../context/AuthContext'
import eventApi from '../api/eventApi'
import registrationApi from '../api/registrationApi'

export default function Dashboard() {
  const { user } = useAuth()
  const [eventCount, setEventCount] = useState('—')
  const [myRegCount, setMyRegCount] = useState('—')

  useEffect(() => {
    eventApi.getEvents()
      .then(res => setEventCount(res?.data?.length ?? '—'))
      .catch(() => setEventCount('—'))

    registrationApi.getMyRegistrations()
      .then(res => setMyRegCount(res?.data?.length ?? '—'))
      .catch(() => setMyRegCount('—'))
  }, [])

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
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <SummaryCard title="Account Type" value={user?.role || 'Member'}>👤</SummaryCard>
            <SummaryCard title="Profile Status" value={user ? 'Complete' : 'Incomplete'}>✅</SummaryCard>
            <SummaryCard title="Total Events" value={eventCount}>📅</SummaryCard>
            <SummaryCard title="My Registrations" value={myRegCount}>🎟️</SummaryCard>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
              <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">🏃</div>
                  <div>
                    <div className="font-medium">Logged in</div>
                    <div className="text-sm text-slate-500">Today</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Account Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium">{user?.name || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium">{user?.email || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-medium">{user?.role || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Joined</span><span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span></div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
