import { useState, useEffect } from 'react'

const BANNERS = [
  { tag:'Featured Event',  title:'Annual Research Symposium 2025',          date:'April 12, 2025', loc:'Main Auditorium, Block A',  aud:'500 seats available' },
  { tag:'Deadline Alert',  title:'Semester 2 Registration Closes April 15', date:'Deadline: April 15', loc:'Online — Student Portal', aud:'All enrolled students' },
  { tag:'New Facility',    title:'State-of-the-Art Sports Complex Now Open',date:'March 30, 2025',  loc:'East Campus',               aud:'Free entry for all' },
]

export default function EventBanner({ onRegister, onLearnMore }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const b = BANNERS[idx]

  return (
    <div className="relative rounded-2xl min-h-[240px] flex flex-col justify-end p-8 overflow-hidden mb-6"
      style={{ background:'linear-gradient(135deg,#1E3A8A 0%,#1a4299 50%,#3B5FC3 100%)', boxShadow:'0 8px 28px rgba(30,58,138,.2)' }}>

      {/* Decorative circles */}
      <div className="absolute rounded-full border-[44px] border-white/5" style={{ width:380, height:380, right:-60, top:-80 }} />
      <div className="absolute rounded-full border border-white/8" style={{ width:160, height:160, right:140, top:20 }} />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/14 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{b.tag}
        </div>
        <h2 className="font-display text-2xl font-bold text-white leading-tight mb-3 max-w-lg">{b.title}</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          {[['📅', b.date], ['📍', b.loc], ['👥', b.aud]].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-1.5 text-white/75 text-sm">
              <span className="w-5 h-5 rounded bg-white/15 flex items-center justify-center text-[9px]">{icon}</span>
              {text}
            </div>
          ))}
        </div>

      </div>

      {/* Dots */}
      <div className="absolute bottom-5 right-6 flex gap-1.5 z-10">
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className="border-none cursor-pointer transition-all rounded-full"
            style={{ width: i === idx ? 18 : 6, height: 6, background: i === idx ? '#fff' : 'rgba(255,255,255,.35)', borderRadius: i === idx ? 3 : '50%' }} />
        ))}
      </div>
    </div>
  )
}