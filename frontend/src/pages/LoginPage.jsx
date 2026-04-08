import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ studentId: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [toast,   setToast]   = useState(null)
  const [loading, setLoading] = useState(false)

  const rules = {
    studentId: v => /^[A-Za-z0-9]{4,12}$/.test(v.trim()) || 'Must be 4–12 alphanumeric characters.',
    password:  v => v.length >= 6 || 'Password must be at least 6 characters.',
  }

  function validate(field, value) {
    const result = rules[field]?.(value)
    setErrors(e => ({ ...e, [field]: result === true ? '' : result }))
    return result === true
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) validate(name, value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const valid = Object.keys(rules).map(k => validate(k, form[k])).every(Boolean)
    if (!valid) return
    setLoading(true)
    setToast(null)
    const res = await login(form)
    setLoading(false)
    if (res.ok) {
      setToast({ type:'ok', msg:`✓ Welcome back, ${res.user?.firstName}!` })
      setTimeout(() => navigate('/dashboard'), 1000)
    } else {
      setToast({ type:'fail', msg:`✕ ${res.message}` })
    }
  }

  async function demoLogin(role) {
    setLoading(true)
    const creds = role === 'admin'
      ? { studentId:'admin',   password:'admin123'   }
      : { studentId:'student', password:'student123' }
    const res = await login(creds)
    setLoading(false)
    if (res.ok) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pagebg p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center p-10 rounded-2xl text-white"
          style={{ background:'linear-gradient(135deg,#1E3A8A,#3B5FC3)' }}>
          <div className="font-display text-3xl font-bold mb-3">Welcome back</div>
          <p className="text-white/80 leading-relaxed mb-6">
            Sign in to access Sportsphere - your university's central sports and events hub.
          </p>
          <div className="text-xs text-white/60">
            Demo credentials:<br/>
            <span className="text-white/80 font-bold">Admin:</span> admin / admin123<br/>
            <span className="text-white/80 font-bold">Student:</span> student / student123
          </div>
        </div>

        {/* Form */}
        <div className="card p-8">
          <div className="font-display text-2xl font-bold text-slate-900 mb-1">Sign In</div>
          <p className="text-sm text-slate-500 mb-6">Enter your credentials to continue</p>

          {toast && (
            <div className={`p-3 rounded-xl text-sm font-semibold mb-4 ${toast.type==='ok' ? 'bg-unigreen-pale text-unigreen' : 'bg-danger-pale text-danger'}`}>
              {toast.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Student / Staff ID <span className="text-red-500">*</span></label>
              <input name="studentId" value={form.studentId} onChange={handleChange}
                className={`form-input ${errors.studentId ? 'invalid' : form.studentId ? 'valid' : ''}`}
                placeholder="e.g. 2021CS0234"/>
              {errors.studentId && <div className="form-error">{errors.studentId}</div>}
            </div>
            <div>
              <label className="form-label">Password <span className="text-red-500">*</span></label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                className={`form-input ${errors.password ? 'invalid' : form.password.length >= 6 ? 'valid' : ''}`}
                placeholder="Enter your password"/>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600">
                <input type="checkbox" className="accent-primary"/> Remember me
              </label>
              <a href="#" className="text-primary font-bold hover:underline">Forgot password?</a>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-200"/>or demo login<div className="flex-1 h-px bg-slate-200"/>
          </div>
          <div className="flex gap-2">
            <button onClick={() => demoLogin('admin')}
              className="flex-1 py-2 text-xs font-bold rounded-xl border border-primary-pale bg-primary-pale text-primary hover:bg-primary hover:text-white transition-all">
              ⚡ Admin Demo
            </button>
            <button onClick={() => demoLogin('student')}
              className="flex-1 py-2 text-xs font-bold rounded-xl border border-unigreen-pale bg-unigreen-pale text-unigreen hover:bg-unigreen hover:text-white transition-all">
              🎓 Student Demo
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
