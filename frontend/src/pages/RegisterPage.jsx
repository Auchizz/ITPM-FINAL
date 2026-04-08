<<<<<<< HEAD
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'

const STEPS = ['Personal', 'Account', 'Review']

const rules = {
  firstName: v => (v || '').trim().length >= 2       || 'At least 2 characters required.',
  lastName:  v => (v || '').trim().length >= 2       || 'At least 2 characters required.',
  studentId: v => /^[A-Za-z0-9]{6,12}$/.test((v || '').trim()) || 'Must be 6–12 alphanumeric characters.',
  faculty:   v => (v || '') !== ''                   || 'Please select your faculty.',
  dob:       v => {
    if (!v) return 'Date of birth is required.'
    const age = (new Date() - new Date(v)) / (365.25 * 24 * 60 * 60 * 1000)
    return age >= 16 || 'You must be at least 16 years old.'
  },
  phone:     v => /^[0-9]{10}$/.test((v || '').replace(/\s/g, '')) || 'Enter a valid 10-digit phone number.',
  email:     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()) || 'Enter a valid email address.',
  username:  v => /^[A-Za-z0-9_]{3,20}$/.test((v || '').trim()) || '3–20 chars, letters/numbers/underscores.',
  password:  v => (v || '').length >= 8             || 'At least 8 characters required.',
  confirm:   (v, all) => v === all.password          || 'Passwords do not match.',
  terms:     v => v === true                         || 'You must accept the terms.',
}

function strength(pwd) {
  let s = 0
  if (pwd.length >= 8) s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[0-9]/.test(pwd)) s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  return [['Weak','#EF4444','25%'],['Fair','#D97706','50%'],['Good','#0284C7','75%'],['Strong','#16A34A','100%']][Math.max(0, s - 1)]
}

const STEP_FIELDS = [
  ['firstName', 'lastName', 'studentId', 'role', 'faculty', 'dob', 'phone'],
  ['email', 'username', 'password', 'confirm'],
  ['terms'],
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step,    setStep]    = useState(0)
  const [form,    setForm]    = useState({ firstName:'', lastName:'', studentId:'',role:'student', faculty:'', dob:'', phone:'', email:'', username:'', password:'', confirm:'', terms:false })
  const [errors,  setErrors]  = useState({})
  const [toast,   setToast]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  // Validate all step fields at once, batching state update into a single setErrors call
  function validateStep(fields) {
    const newErrors = {}
    let allValid = true
    for (const field of fields) {
      try {
        const result = rules[field]?.(form[field], form)
        const msg = result === true ? '' : (result || '')
        newErrors[field] = msg
        if (msg) allValid = false
      } catch (e) {
        newErrors[field] = 'Invalid value.'
        allValid = false
      }
    }
    setErrors(prev => ({ ...prev, ...newErrors }))
    return allValid
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm(f => ({ ...f, [name]: val }))
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function next() {
    const valid = validateStep(STEP_FIELDS[step])
    if (!valid) { setToast({ type: 'fail', msg: 'Please fix the errors above.' }); return }
    setToast(null)
    setStep(s => s + 1)
  }

  async function submit() {
    const valid = validateStep(STEP_FIELDS[2])
    if (!valid) { setToast({ type: 'fail', msg: 'Please accept the Terms of Service.' }); return }
    setLoading(true)
    try {
      await authApi.register({
        firstName:  form.firstName,
        lastName:   form.lastName,
        studentId:  form.studentId,
        email:      form.email,
        password:   form.password,
        phone:      form.phone,
        department: form.faculty,
        role:       'student',
      })
      setDone(true)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.'
      setToast({ type: 'fail', msg })
    } finally {
      setLoading(false)
    }
  }

  const pwd = form.password
  const [strLabel, strColor, strWidth] = pwd ? strength(pwd) : ['', '#E2E8F0', '0%']

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-pagebg p-6">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <div className="font-display text-2xl font-bold text-unigreen mb-2">Account Created!</div>
        <p className="text-slate-500 text-sm mb-6">Welcome to Sportsphere! You can now sign in with your Student ID.</p>
        <Link to="/login" className="btn-primary px-8 py-3 text-sm">Go to Sign In →</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-pagebg p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center p-10 rounded-2xl text-white"
          style={{ background: 'linear-gradient(135deg,#1E3A8A,#3B5FC3)' }}>
          <div className="font-display text-3xl font-bold mb-3">Join Sportsphere</div>
          <p className="text-white/80 mb-6">Create your account to access sports events, news and announcements.</p>
          <div className="space-y-2">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-3 text-sm ${i <= step ? 'text-white' : 'text-white/40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i < step ? 'bg-unigreen border-unigreen' : i === step ? 'bg-white/20 border-white' : 'border-white/30'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Form panel */}
        <div className="card p-8">
          <div className="font-display text-2xl font-bold text-slate-900 mb-1">Create Account</div>

          {/* Mobile step bar */}
          <div className="flex gap-1 mb-5 md:hidden">
            {STEPS.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-slate-200'}`} />
            ))}
          </div>

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Step {step + 1} — {STEPS[step]}
          </p>

          {toast && (
            <div className={`p-3 rounded-xl text-xs font-semibold mb-4 ${toast.type === 'ok' ? 'bg-unigreen-pale text-unigreen' : 'bg-danger-pale text-danger'}`}>
              {toast.msg}
            </div>
          )}

          {/* Step 1 — Personal */}
          {step === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {['firstName', 'lastName'].map(f => (
                  <div key={f}>
                    <label className="form-label">{f === 'firstName' ? 'First' : 'Last'} Name <span className="text-red-500">*</span></label>
                    <input name={f} value={form[f]} onChange={handleChange}
                      className={`form-input ${errors[f] ? 'invalid' : form[f].trim().length >= 2 ? 'valid' : ''}`}
                      placeholder={f === 'firstName' ? 'First name' : 'Last name'} />
                    {errors[f] && <div className="form-error">{errors[f]}</div>}
                  </div>
                ))}
              </div>
              <div>
                <label className="form-label">Student / Staff ID <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                       <input
                          name="studentId"
                          value={form.studentId}
                          onChange={handleChange}
                          style={{ flex: 1, minWidth: 0 }}
                          className={`form-input flex-1 ${errors.studentId ? 'invalid' : /^[A-Za-z0-9]{6,12}$/.test(form.studentId) ? 'valid' : ''}`}
                          placeholder="e.g. 2021CS0234"
                        />
                       <select
                          name="role"
                          value={form.role}
                          onChange={handleChange}
                          style={{ width: '130px', flexShrink: 0 }}
                          className="form-input"
                        >
                          <option value="student">Student</option>
                          <option value="staff">Staff</option>
                    
                        </select>
                    </div>
                     {errors.studentId && <div className="form-error">{errors.studentId}</div>}
                     <div className="text-[10.5px] text-slate-400 mt-1">6–12 alphanumeric characters</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Faculty <span className="text-red-500">*</span></label>
                  <select name="faculty" value={form.faculty} onChange={handleChange}
                    className={`form-input ${errors.faculty ? 'invalid' : form.faculty ? 'valid' : ''}`}>
                    <option value="">Select faculty</option>
                    {['Faculty of Engineering','Faculty of Science','Faculty of Arts','Faculty of Business','Faculty of Medicine','Faculty of Law','Other'].map(f => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                  {errors.faculty && <div className="form-error">{errors.faculty}</div>}
                </div>
                <div>
                  <label className="form-label">Date of Birth <span className="text-red-500">*</span></label>
                  <input name="dob" type="date" value={form.dob} onChange={handleChange}
                    className={`form-input ${errors.dob ? 'invalid' : form.dob ? 'valid' : ''}`} />
                  {errors.dob && <div className="form-error">{errors.dob}</div>}
                </div>
              </div>
              <div>
                <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                  className={`form-input ${errors.phone ? 'invalid' : /^[0-9]{10}$/.test(form.phone.replace(/\s/g, '')) ? 'valid' : ''}`}
                  placeholder="e.g. 0771234567" />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
            </div>
          )}

          {/* Step 2 — Account */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="form-label">University Email <span className="text-red-500">*</span></label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className={`form-input ${errors.email ? 'invalid' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'valid' : ''}`}
                  placeholder="yourname@university.edu" />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div>
                <label className="form-label">Username <span className="text-red-500">*</span></label>
                <input name="username" value={form.username} onChange={handleChange}
                  className={`form-input ${errors.username ? 'invalid' : /^[A-Za-z0-9_]{3,20}$/.test(form.username) ? 'valid' : ''}`}
                  placeholder="Choose a username" />
                {errors.username && <div className="form-error">{errors.username}</div>}
              </div>
              <div>
                <label className="form-label">Password <span className="text-red-500">*</span></label>
                <input name="password" type="password" value={form.password} onChange={handleChange}
                  className={`form-input ${errors.password ? 'invalid' : form.password.length >= 8 ? 'valid' : ''}`}
                  placeholder="Create a strong password" />
                {errors.password && <div className="form-error">{errors.password}</div>}
                {pwd && (
                  <div className="mt-1.5">
                    <div className="pwd-track"><div className="pwd-fill" style={{ width: strWidth, background: strColor }} /></div>
                    <div className="text-[10.5px] font-bold mt-0.5" style={{ color: strColor }}>Strength: {strLabel}</div>
                  </div>
                )}
                <div className="text-[10.5px] text-slate-400 mt-1">Use 8+ chars, uppercase, number &amp; symbol</div>
              </div>
              <div>
                <label className="form-label">Confirm Password <span className="text-red-500">*</span></label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
                  className={`form-input ${errors.confirm ? 'invalid' : form.confirm && form.confirm === form.password ? 'valid' : ''}`}
                  placeholder="Re-enter your password" />
                {errors.confirm && <div className="form-error">{errors.confirm}</div>}
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Review Your Details</div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[['First Name',form.firstName],['Last Name',form.lastName],['Student ID',form.studentId],['Role', form.role],['Faculty',form.faculty],['Date of Birth',form.dob],['Phone',form.phone],['Email',form.email],['Username',form.username]].map(([l, v]) => (
                    <div key={l}>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l}</div>
                      <div className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{v || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <input type="checkbox" name="terms" id="terms" checked={form.terms} onChange={handleChange}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer flex-shrink-0" />
                <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                  I agree to the <a href="#" className="text-primary font-bold">Terms of Service</a> and <a href="#" className="text-primary font-bold">Privacy Policy</a>. I confirm I am a currently enrolled student or staff member. <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.terms && <div className="form-error">{errors.terms}</div>}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-2 mt-5">
            {step > 0 && (
              <button onClick={() => { setStep(s => s - 1); setToast(null) }}
                className="btn-secondary px-5 py-2.5 text-sm">← Back</button>
            )}
            {step < 2
              ? <button onClick={next} className="btn-primary flex-1 py-2.5 text-sm">Continue →</button>
              : <button onClick={submit} disabled={loading} className="btn-primary flex-1 py-2.5 text-sm">
                  {loading ? 'Creating account...' : '✅ Create Account'}
                </button>
            }
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
=======
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', studentId: '', faculty: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Full name is required.'
    else if (form.name.trim().length < 3) nextErrors.name = 'Full name must be at least 3 characters.'

    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email)) nextErrors.email = 'Enter a valid email address.'

    if (!form.studentId.trim()) nextErrors.studentId = 'Student ID is required.'
    if (!form.faculty.trim()) nextErrors.faculty = 'Faculty is required.'

    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'

    if (!form.confirm) nextErrors.confirm = 'Confirm your password.'
    else if (form.password !== form.confirm) nextErrors.confirm = 'Passwords do not match.'

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!validate()) return

    try {
      setSubmitting(true)
      await authApi.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        studentId: form.studentId.trim(),
        faculty: form.faculty.trim(),
      })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    if (fieldErrors[key]) {
      setFieldErrors((current) => ({ ...current, [key]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-pagebg px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[36px] border border-[#d8c6ab] bg-[#fffaf2] shadow-[0_32px_90px_-36px_rgba(23,50,77,0.35)] lg:grid-cols-[1.04fr,0.96fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-[#224764] to-accent p-10 text-[#fff8ef] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,248,239,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(47,122,107,0.18),transparent_28%)]" />
          <div className="relative">
            <div className="inline-flex rounded-full border border-[#fff8ef]/15 bg-[#fff8ef]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#fff8ef]/75">
              Team Entry
            </div>
            <h1 className="mt-6 max-w-md text-5xl font-black tracking-tight">Create your sport identity.</h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#fff8ef]/78">
              Register once, then manage student details, roles, and profile controls from one unified dashboard.
            </p>
          </div>

          <div className="relative mt-10">
            <img src="/register-sport.svg" alt="SportSphere registration illustration" className="w-full max-w-lg" />
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-lg">
            <div className="mb-8">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8c7d69]">Register</div>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-primary">Create account</h2>
              <p className="mt-3 text-sm leading-7 text-[#6f675d]">
                Start with the details your campus sport system needs from the beginning.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-primary">Full name</label>
                  <input
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`input mt-2 ${fieldErrors.name ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.name ? <p className="mt-2 text-sm text-danger">{fieldErrors.name}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-primary">Email</label>
                  <input
                    placeholder="student@sport.edu"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`input mt-2 ${fieldErrors.email ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.email ? <p className="mt-2 text-sm text-danger">{fieldErrors.email}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-primary">Student ID</label>
                  <input
                    placeholder="ST-2026-001"
                    value={form.studentId}
                    onChange={(e) => updateField('studentId', e.target.value)}
                    className={`input mt-2 ${fieldErrors.studentId ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.studentId ? <p className="mt-2 text-sm text-danger">{fieldErrors.studentId}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-primary">Faculty</label>
                  <input
                    placeholder="Faculty"
                    value={form.faculty}
                    onChange={(e) => updateField('faculty', e.target.value)}
                    className={`input mt-2 ${fieldErrors.faculty ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.faculty ? <p className="mt-2 text-sm text-danger">{fieldErrors.faculty}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-primary">Password</label>
                  <input
                    placeholder="Create password"
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className={`input mt-2 ${fieldErrors.password ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.password ? <p className="mt-2 text-sm text-danger">{fieldErrors.password}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-primary">Confirm password</label>
                  <input
                    placeholder="Repeat password"
                    type="password"
                    value={form.confirm}
                    onChange={(e) => updateField('confirm', e.target.value)}
                    className={`input mt-2 ${fieldErrors.confirm ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.confirm ? <p className="mt-2 text-sm text-danger">{fieldErrors.confirm}</p> : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create account'}
                </button>
                <Link to="/login" className="text-sm font-semibold text-primary">Login</Link>
              </div>
            </form>
          </div>
>>>>>>> origin/main
        </div>
      </div>
    </div>
  )
}
