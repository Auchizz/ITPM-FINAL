import { useState, useEffect } from 'react'

export default function RealTimeBar() {
  const [time,    setTime]    = useState('')
  const [date,    setDate]    = useState('')
  const [week,    setWeek]    = useState('')
  const [daysLeft,setDaysLeft]= useState('')
  const [online,  setOnline]  = useState('1,247')

  useEffect(() => {
    function tick() {
      const now = new Date()
      const pad = n => String(n).padStart(2,'0')
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
      const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
      const months=['January','February','March','April','May','June','July','August','September','October','November','December']
      setDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`)
      const semStart = new Date('2025-02-03')
      const wk = Math.max(1, Math.min(16, Math.floor((now - semStart) / (7*24*60*60*1000)) + 1))
      setWeek(`Wk ${wk}`)
      const examDate = new Date('2025-05-05')
      setDaysLeft(`${Math.max(0, Math.floor((examDate - now) / (24*60*60*1000)))} days`)
    }
    tick()
    const t1 = setInterval(tick, 1000)
    const t2 = setInterval(() => setOnline((1200+Math.floor(Math.random()*100)).toLocaleString()), 5000)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div className="rounded-2xl px-6 py-4 mb-6 flex items-center justify-between flex-wrap gap-4 relative overflow-hidden"
      style={{ background:'linear-gradient(135deg,#1E3A8A 0%,#2348a8 60%,#3B5FC3 100%)', boxShadow:'0 6px 24px rgba(30,58,138,.22)' }}>
      <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-white/5 -translate-y-8 translate-x-8" />

      <div className="flex items-baseline gap-2 relative z-10">
        <div className="text-3xl font-extrabold text-white tracking-wide tabular-nums">{time}</div>
        <div className="text-xs text-white/60">{date}</div>
      </div>

      <div className="flex gap-8 relative z-10">
        {[['Academic Week', week], ['To Exams', daysLeft], ['Semester', 'Sem 2']].map(([lbl, val]) => (
          <div key={lbl} className="text-center">
            <div className="text-base font-extrabold text-white">{val}</div>
            <div className="text-[9.5px] text-white/50 uppercase tracking-widest mt-0.5">{lbl}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-white/75 relative z-10">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-bold text-white">{online}</span> students online
      </div>
    </div>
  )
}
