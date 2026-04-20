import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', studentId: '', faculty: '' })
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirm) return setError('Passwords do not match')
    try {
      await authApi.register({ name: form.name, email: form.email, password: form.password, studentId: form.studentId, faculty: form.faculty })
      navigate('/login')
    } catch (err) {
      setError('Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-pagebg">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="hidden md:flex flex-col justify-center p-8 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
          <h3 className="text-3xl font-bold">Join SportSphere</h3>
          <p className="mt-3 opacity-90">Create an account to manage your campus access and profiles.</p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Create Account</h2>
          {error && <div className="text-danger mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input placeholder="Student ID" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              <input placeholder="Faculty" value={form.faculty} onChange={e=>setForm({...form,faculty:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <input placeholder="Confirm Password" type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <div className="flex items-center justify-between">
              <button className="btn-primary" type="submit">Create account</button>
              <Link to="/login" className="text-sm">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
