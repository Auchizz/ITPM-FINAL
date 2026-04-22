import { useState, useEffect } from 'react'
import Layout      from '../components/Layout'
import RealTimeBar from '../components/RealTimeBar'

const ACTIVITY = [
  { color:'bg-unigreen', text:'New event registration: Annual Research Symposium',  time:'Just now' },
  { color:'bg-blue-500', text:'Library booking confirmed — Level 3, Room 302',       time:'2 min ago' },
  { color:'bg-accent',   text:'Announcement posted by Examinations Board',           time:'5 min ago' },
  { color:'bg-unigreen', text:'New student registered: Faculty of Science',          time:'8 min ago' },
  { color:'bg-blue-500', text:'Course material uploaded: CS301 — Data Structures',   time:'12 min ago' },
]
const OCCUPANCY = [
  { label:'Library',         pct:78,  color:'bg-unigreen' },
  { label:'Cafeteria',       pct:91,  color:'bg-accent' },
  { label:'Sports Complex',  pct:45,  color:'bg-blue-500' },
  { label:'Computer Labs',   pct:62,  color:'bg-primary' },
]

export default function RealTimePage() {
  const [online,   setOnline]   = useState(1247)
  const [sessions, setSessions] = useState(847)
  const [subs,     setSubs]     = useState(124)
  const [msgs,     setMsgs]     = useState(38)

  useEffect(() => {
    const t = setInterval(() => {
      setOnline(1200 + Math.floor(Math.random()*100))
      setSessions(800 + Math.floor(Math.random()*80))
      setSubs(120 + Math.floor(Math.random()*20))
      setMsgs(30  + Math.floor(Math.random()*15))
    }, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <Layout>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
          Real-Time Information
        </h2>
        <div className="flex items-center gap-1.5 text-xs font-bold text-unigreen">
          <span className="w-2 h-2 rounded-full bg-unigreen animate-pulse"/>Live
        </div>
      </div>

      <RealTimeBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Clock & Academic */}
        <div className="card">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Academic Status</div>
          <ClockBlock />
        </div>

        {/* Weather */}
        <div className="rounded-2xl p-5 text-white" style={{ background:'linear-gradient(135deg,#1E3A8A,#3B5FC3)', boxShadow:'0 6px 20px rgba(30,58,138,.2)' }}>
          <div className="text-[10.5px] font-bold tracking-widest uppercase opacity-65 mb-2">Campus Weather · Colombo</div>
          <div className="text-5xl font-extrabold mb-1">28°C</div>
          <div className="text-sm opacity-80 mb-3">☀️ Partly Cloudy</div>
          <div className="flex gap-5 text-xs opacity-75">
            <span>💧 Humidity: 74%</span>
            <span>🌬️ Wind: 12 km/h</span>
          </div>
        </div>

        {/* Occupancy */}
        <div className="card">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Campus Occupancy</div>
          <div className="space-y-3.5">
            {OCCUPANCY.map(o => (
              <div key={o.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{o.label}</span>
                  <span className="font-bold" style={{ color: o.pct>80?'#F97316':o.pct>60?'#0284C7':'#16A34A' }}>{o.pct}%</span>
                </div>
                <div className="pwd-track">
                  <div className={`pwd-fill ${o.color}`} style={{ width:`${o.pct}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portal stats */}
        <div className="card">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Portal Activity</div>
          <div className="text-center pb-4 border-b border-slate-100 mb-4">
            <div className="text-4xl font-extrabold text-primary">{online.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-unigreen animate-pulse"/>Students currently online
            </div>
          </div>
          <div className="space-y-2">
            {[['📋 Active Sessions', sessions], ['📝 Submissions Today', subs], ['📧 New Messages', msgs]].map(([lbl, val]) => (
              <div key={lbl} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-600">{lbl}</span>
                <span className="text-base font-extrabold text-slate-900">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="card md:col-span-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Live Activity Feed</div>
          <div className="space-y-2">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`}/>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-700">{a.text}</div>
                  <div className="text-[10.5px] text-slate-400 mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

function ClockBlock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [week, setWeek] = useState('')
  const [days, setDays] = useState('')

  useEffect(() => {
    function tick() {
      const now = new Date()
      const pad = n => String(n).padStart(2,'0')
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
      const ds=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
      const ms=['January','February','March','April','May','June','July','August','September','October','November','December']
      setDate(`${ds[now.getDay()]}, ${now.getDate()} ${ms[now.getMonth()]} ${now.getFullYear()}`)
      const wk = Math.max(1, Math.min(16, Math.floor((now - new Date('2025-02-03')) / (7*24*60*60*1000)) + 1))
      setWeek(`Wk ${wk}`)
      setDays(`${Math.max(0, Math.floor((new Date('2025-05-05') - now) / (24*60*60*1000)))} days`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <div className="text-4xl font-extrabold text-primary tabular-nums mb-1">{time}</div>
      <div className="text-sm text-slate-500 mb-4">{date}</div>
      <div className="space-y-2">
        {[['📅 Academic Week', week], ['⏳ Days to Exams', days], ['📖 Semester', 'Semester 2']].map(([lbl, val]) => (
          <div key={lbl} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-600">{lbl}</span>
            <span className="text-sm font-extrabold text-slate-900">{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
