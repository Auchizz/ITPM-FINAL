import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function SettingsPage(){
  return (
    <div className="min-h-screen flex bg-pagebg">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="card max-w-3xl">
            <h3 className="text-xl font-semibold">Settings</h3>
            <div className="mt-4 space-y-6">
              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-medium">Account preferences</h4>
                <div className="mt-2 text-sm text-slate-600">Manage your profile and how others see you.</div>
                <div className="mt-3 flex gap-3">
                  <button className="px-3 py-2 rounded bg-white border">Edit profile</button>
                  <button className="px-3 py-2 rounded btn-primary">Connect SSO</button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-medium">Password update</h4>
                <div className="mt-2 text-sm text-slate-600">Change password (placeholder)</div>
                <div className="mt-3">
                  <input placeholder="New password" className="px-3 py-2 border rounded-lg w-full" />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-medium">Notifications</h4>
                <div className="mt-2 text-sm text-slate-600">Toggle email and in-app notifications.</div>
                <div className="mt-3 flex flex-col gap-2">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" /> <span>Email notifications</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" /> <span>In-app notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
