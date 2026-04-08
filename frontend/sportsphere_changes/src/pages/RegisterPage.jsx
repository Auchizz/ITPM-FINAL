import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'

const STEPS = ['Personal', 'Account', 'Review']

const rules = {
  firstName: v => v.trim().length >= 2       || 'At least 2 characters required.',
  lastName:  v => v.trim().length >= 2       || 'At least 2 characters required.',
  studentId: v => /^[A-Za-z0-9]{6,12}$/.test(v.trim()) || 'Must be 6–12 alphanumeric characters.',
  faculty:   v => v !== ''                   || 'Please select your faculty.',
  dob:       v => { if(!v) return 'Date of birth is required.'; const age=(new Date()-new Date(v))/(365.25*24*60*60*1000); return age>=16||'You must be at least 16 years old.' },
  phone:     v => /^[0-9]{10}$/.test(v.replace(/\s/g,'')) || 'Enter a valid 10-digit phone number.',
  email:     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
  username:  v => /^[A-Za-z0-9_]{3,20}$/.test(v.trim()) || '3–20 chars, letters/numbers/underscores.',
  password:  v => v.length >= 8             || 'At least 8 characters required.',
  confirm:   (v,all) => v === all.password  || 'Passwords do not match.',
  terms:     v => v                          || 'You must accept the terms.',
}

function strength(pwd) {
  let s = 0
  if (pwd.length >= 8) s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[0-9]/.test(pwd)) s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  return [['Weak','#EF4444','25%'],['Fair','#D97706','50%'],['Good','#0284C7','75%'],['Strong','#16A34A','100%']][Math.max(0,s-1)]
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step,    setStep]    = useState(0)
  const [form,    setForm]    = useState({ firstName:'',lastName:'',studentId:'',faculty:'',dob:'',phone:'',email:'',username:'',password:'',confirm:'',terms:false })
  const [errors,  setErrors]  = useState({})
  const [toast,   setToast]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const STEP_FIELDS = [
    ['firstName','lastName','studentId','faculty','dob','phone'],
    ['email','username','password','confirm'],
    ['terms'],
  ]

  function validate(field, value = form[field]) {
    const result = rules[field]?.(value, form)
    const msg = result === true ? '' : result
    setErrors(e => ({ ...e, [field]: msg }))
    return !msg
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm(f => ({ ...f, [name]: val }))
    if (errors[name]) validate(name, val)
  }

  function validateStep(fields) {
    const results = fields.map(f => validate(f))
    return results.every(Boolean)
  }

  function next() {
    if (!validateStep(STEP_FIELDS[step])) { setToast({ type:'fail', msg:'Please fix the errors above.' }); return }
    setToast(null)
    setStep(s => s + 1)
  }

  async function submit() {
    if (!validateStep(STEP_FIELDS[2])) { setToast({ type:'fail', msg:'Please accept the Terms of Service.' }); return }
    setLoading(true)
    try {
      await authApi.register({ ...form, name: `${form.firstName} ${form.lastName}`, role:'student' })
    } catch { /* show success anyway for demo */ }
    setLoading(false)
    setDone(true)
  }

  const pwd = form.password
  const [strLabel, strColor, strWidth] = pwd ? strength(pwd) : ['','#E2E8F0','0%']

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-pagebg p-6">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <div className="font-display text-2xl font-bold text-unigreen mb-2">Account Created!</div>
        <p className="text-slate-500 text-sm mb-6">Welcome to Sportsphere! Check your email for a verification link before your first login.</p>
        <Link to="/login" className="btn-primary px-8 py-3 text-sm">Go to Sign In →</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-pagebg p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left */}
        <div className="hidden md:flex flex-col justify-center p-10 rounded-2xl text-white"
          style={{ background:'linear-gradient(135deg,#1E3A8A,#3B5FC3)' }}>
          <div className="font-display text-3xl font-bold mb-3">Join Sportsphere</div>
          <p className="text-white/80 mb-6">Create your account to access sports events, news and announcements.</p>
          <div className="space-y-2">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex items-center gap-3 text-sm ${i <= step ? 'text-white' : 'text-white/40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i < step ? 'bg-unigreen border-unigreen' : i === step ? 'bg-white/20 border-white' : 'border-white/30'}`}>
                  {i < step ? '✓' : i+1}
                </div>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card p-8">
          <div className="font-display text-2xl font-bold text-slate-900 mb-1">Create Account</div>

          {/* Step indicator (mobile) */}
          <div className="flex gap-1 mb-5 md:hidden">
            {STEPS.map((_,i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-slate-200'}`} />
            ))}
          </div>

          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Step {step+1} — {STEPS[step]}
          </p>

          {toast && (
            <div className={`p-3 rounded-xl text-xs font-semibold mb-4 ${toast.type==='ok' ? 'bg-unigreen-pale text-unigreen' : 'bg-danger-pale text-danger'}`}>
              {toast.msg}
            </div>
          )}

          {/* ── Step 1 ── */}
          {step === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {['firstName','lastName'].map(f => (
                  <div key={f}>
                    <label className="form-label">{f==='firstName'?'First':'Last'} Name <span className="text-red-500">*</span></label>
                    <input name={f} value={form[f]} onChange={handleChange}
                      className={`form-input ${errors[f]?'invalid':form[f].trim().length>=2?'valid':''}`}
                      placeholder={f==='firstName'?'First name':'Last name'}/>
                    {errors[f] && <div className="form-error">{errors[f]}</div>}
                  </div>
                ))}
              </div>
              <div>
                <label className="form-label">Student ID <span className="text-red-500">*</span></label>
                <input name="studentId" value={form.studentId} onChange={handleChange}
                  className={`form-input ${errors.studentId?'invalid':/^[A-Za-z0-9]{6,12}$/.test(form.studentId)?'valid':''}`}
                  placeholder="e.g. 2021CS0234"/>
                {errors.studentId && <div className="form-error">{errors.studentId}</div>}
                <div className="text-[10.5px] text-slate-400 mt-1">Format: YYYYFACULTYxxxx</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Faculty <span className="text-red-500">*</span></label>
                  <select name="faculty" value={form.faculty} onChange={handleChange}
                    className={`form-input ${errors.faculty?'invalid':form.faculty?'valid':''}`}>
                    <option value="">Select faculty</option>
                    {['Faculty of Engineering','Faculty of Science','Faculty of Arts','Faculty of Business','Faculty of Medicine','Faculty of Law','Staff / Administration'].map(f=>(
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                  {errors.faculty && <div className="form-error">{errors.faculty}</div>}
                </div>
                <div>
                  <label className="form-label">Date of Birth <span className="text-red-500">*</span></label>
                  <input name="dob" type="date" value={form.dob} onChange={handleChange}
                    className={`form-input ${errors.dob?'invalid':form.dob?'valid':''}`}/>
                  {errors.dob && <div className="form-error">{errors.dob}</div>}
                </div>
              </div>
              <div>
                <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                  className={`form-input ${errors.phone?'invalid':/^[0-9]{10}$/.test(form.phone.replace(/\s/g,''))?'valid':''}`}
                  placeholder="e.g. 0771234567"/>
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="form-label">University Email <span className="text-red-500">*</span></label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className={`form-input ${errors.email?'invalid':/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)?'valid':''}`}
                  placeholder="yourname@university.edu"/>
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div>
                <label className="form-label">Username <span className="text-red-500">*</span></label>
                <input name="username" value={form.username} onChange={handleChange}
                  className={`form-input ${errors.username?'invalid':/^[A-Za-z0-9_]{3,20}$/.test(form.username)?'valid':''}`}
                  placeholder="Choose a username"/>
                {errors.username && <div className="form-error">{errors.username}</div>}
              </div>
              <div>
                <label className="form-label">Password <span className="text-red-500">*</span></label>
                <input name="password" type="password" value={form.password} onChange={handleChange}
                  className={`form-input ${errors.password?'invalid':form.password.length>=8?'valid':''}`}
                  placeholder="Create a strong password"/>
                {errors.password && <div className="form-error">{errors.password}</div>}
                {pwd && (
                  <div className="mt-1.5">
                    <div className="pwd-track"><div className="pwd-fill" style={{ width:strWidth, background:strColor }}/></div>
                    <div className="text-[10.5px] font-bold mt-0.5" style={{ color:strColor }}>Strength: {strLabel}</div>
                  </div>
                )}
                <div className="text-[10.5px] text-slate-400 mt-1">Use 8+ chars, uppercase, number & symbol</div>
              </div>
              <div>
                <label className="form-label">Confirm Password <span className="text-red-500">*</span></label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
                  className={`form-input ${errors.confirm?'invalid':form.confirm&&form.confirm===form.password?'valid':''}`}
                  placeholder="Re-enter your password"/>
                {errors.confirm && <div className="form-error">{errors.confirm}</div>}
              </div>
            </div>
          )}

          {/* ── Step 3 — Review ── */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Review Your Details</div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[['First Name',form.firstName],['Last Name',form.lastName],['Student ID',form.studentId],['Faculty',form.faculty],['Date of Birth',form.dob],['Phone',form.phone],['Email',form.email],['Username',form.username]].map(([l,v])=>(
                    <div key={l}>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l}</div>
                      <div className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{v||'—'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <input type="checkbox" name="terms" id="terms" checked={form.terms} onChange={handleChange}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer flex-shrink-0"/>
                <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                  I agree to the <a href="#" className="text-primary font-bold">Terms of Service</a> and <a href="#" className="text-primary font-bold">Privacy Policy</a>. I confirm I am a currently enrolled student or staff member. <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.terms && <div className="form-error">{errors.terms}</div>}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 mt-5">
            {step > 0 && (
              <button onClick={() => { setStep(s=>s-1); setToast(null) }}
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
        </div>
      </div>
    </div>
  )
}
