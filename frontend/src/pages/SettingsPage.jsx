import { useState } from 'react'
import Layout from '../components/Layout'

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <label className="toggle-switch cursor-pointer">
      <input type="checkbox" checked={on} onChange={() => setOn(o=>!o)} className="sr-only"/>
      <div className="toggle-slider"/>
    </label>
  )
}

function SettingsCard({ icon, iconBg, title, children }) {
  return (
    <div className="card mb-4">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${iconBg}`}>{icon}</div>
        <div className="font-bold text-sm text-slate-900">{title}</div>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, defaultChecked = false }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div>
        <div className="text-sm font-semibold text-slate-700">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <Toggle defaultChecked={defaultChecked}/>
    </div>
  )
}

export default function SettingsPage() {
  const [saved,  setSaved]  = useState(false)
  const [pwdMsg, setPwdMsg] = useState('')

  function showSaved() { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  function updatePwd()  { setPwdMsg('✓ Password updated successfully!'); setTimeout(() => setPwdMsg(''), 3000) }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
          Settings
        </h2>
        <span className="badge badge-admin text-xs px-3 py-1">⚡ Admin</span>
      </div>

      <div className="max-w-2xl">

        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-unigreen-pale text-unigreen text-sm font-semibold border border-green-200">
            ✓ Settings saved successfully!
          </div>
        )}

        <SettingsCard icon="🔔" iconBg="bg-blue-50" title="Notification Preferences">
          <ToggleRow label="Email Notifications"    desc="Receive updates and alerts via email"                  defaultChecked/>
          <ToggleRow label="In-App Notifications"   desc="Show alerts within UniPortal"                          defaultChecked/>
          <ToggleRow label="Event Reminders"        desc="Get reminded 24 hours before events"                   defaultChecked/>
          <ToggleRow label="Announcement Alerts"    desc="Instant alert when a new announcement is posted"/>
        </SettingsCard>

        <SettingsCard icon="🎨" iconBg="bg-accent-pale" title="Appearance">
          <ToggleRow label="Compact Sidebar"  desc="Use icon-only sidebar to save space"/>
          <ToggleRow label="Animations"       desc="Enable page transition animations" defaultChecked/>
          <div className="mt-3">
            <label className="form-label">Language</label>
            <select className="form-input">
              <option>English</option>
              <option>සිංහල (Sinhala)</option>
              <option>தமிழ் (Tamil)</option>
            </select>
          </div>
        </SettingsCard>

        <SettingsCard icon="🔒" iconBg="bg-unigreen-pale" title="Security">
          <div className="space-y-3">
            <div>
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" placeholder="Enter current password"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="New password"/>
              </div>
              <div>
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-input" placeholder="Confirm password"/>
              </div>
            </div>
            <ToggleRow label="Two-Factor Authentication" desc="Extra security layer for your account"/>
          </div>
          {pwdMsg && <div className="mt-3 p-2.5 rounded-xl bg-unigreen-pale text-unigreen text-xs font-semibold">{pwdMsg}</div>}
          <button onClick={updatePwd} className="btn-primary px-6 py-2.5 text-sm mt-4">💾 Update Password</button>
        </SettingsCard>

        <SettingsCard icon="🛡️" iconBg="bg-primary-pale" title="Privacy">
          <ToggleRow label="Show Profile to Other Students" desc="Others can search and view your profile"     defaultChecked/>
          <ToggleRow label="Activity Visible to Admins"     desc="Allow admins to see your login activity"    defaultChecked/>
          <button onClick={showSaved} className="btn-primary px-6 py-2.5 text-sm mt-4">💾 Save All Settings</button>
        </SettingsCard>

        {/* Danger zone */}
        <div className="card border-red-200 mb-4">
          <div className="flex items-center gap-3 pb-3 border-b border-red-100 mb-4">
            <div className="w-8 h-8 rounded-xl bg-danger-pale flex items-center justify-center text-sm">⚠️</div>
            <div className="font-bold text-sm text-danger">Danger Zone</div>
          </div>
          <p className="text-xs text-slate-500 mb-4">These actions are permanent and cannot be undone.</p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => window.confirm('Deactivate your account?') && alert('Request submitted.')}
              className="btn-danger px-5 py-2.5 text-sm">Deactivate Account</button>
            <button onClick={() => window.confirm('Delete ALL your data? This cannot be undone.') && alert('Deletion request submitted.')}
              className="btn-danger px-5 py-2.5 text-sm">Delete All Data</button>
          </div>
        </div>

      </div>
    </Layout>
  )
}
