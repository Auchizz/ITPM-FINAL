import { useState, useRef, useEffect } from 'react'

const RESPONSES = {
  'events today':          "Today's events: Sports Complex Inauguration at 3 PM (East Campus) and a Library Study Skills workshop at 5 PM (Block C). 🏆",
  'exam timetable':        "The Semester 2 exam timetable has been published! Log in at the student portal to view your personal schedule. 📋",
  'library hours':         "Library is open Mon–Fri 7 AM–11 PM (extended), Sat 8 AM–6 PM, Sun 10 AM–4 PM. 📚",
  'registration deadline': "Course registration closes April 15, 2025. Log in to add/drop courses now! ⏰",
  'scholarship':           "Scholarship applications for 2025/26 are open until April 30. Visit the Financial Aid Office. 🎓",
  default:                 "Thanks for your message! For urgent matters contact Student Affairs at studentaffairs@university.edu or call +94 11 123 4567.",
}

const QUICK = ['📅 Events today', '📋 Exam timetable', '📚 Library hours', '⏰ Deadline', '🎓 Scholarship']

function getReply(text) {
  const lower = text.toLowerCase()
  const key = Object.keys(RESPONSES).find(k => lower.includes(k))
  return RESPONSES[key || 'default']
}

export default function ChatBox() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Hi! I\'m the UniPortal Assistant. How can I help you today?' }
  ])
  const [input,    setInput]    = useState('')
  const [typing,   setTyping]   = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  function send(text) {
    const msg = text || input.trim()
    if (!msg) return
    setMessages(m => [...m, { from: 'user', text: msg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { from: 'bot', text: getReply(msg) }])
    }, 1100)
  }

  const now = new Date()
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 w-13 h-13 rounded-full flex items-center justify-center text-xl z-50 transition-all hover:scale-110"
        style={{ width:52, height:52, background:'linear-gradient(135deg,#1E3A8A,#3B5FC3)', boxShadow:'0 4px 18px rgba(30,58,138,.4)' }}
        title="Chat Support"
      >
        💬
        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-unigreen rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden z-50"
          style={{ boxShadow:'0 10px 32px rgba(0,0,0,.12)', animation:'slideUp .2s ease' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ background:'linear-gradient(135deg,#1E3A8A,#3B5FC3)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-base border-2 border-white/30">🎓</div>
              <div>
                <div className="text-xs font-bold text-white">UniPortal Assistant</div>
                <div className="text-[10px] text-white/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/15 text-white text-xs flex items-center justify-center hover:bg-white/25 transition-colors">
              ✕
            </button>
          </div>

          {/* Quick replies */}
          <div className="px-3 py-2 flex gap-1.5 flex-wrap border-b border-slate-100">
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q.replace(/^[^ ]+ /,''))}
                className="text-[10.5px] px-2 py-1 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-semibold hover:bg-primary-pale hover:border-primary hover:text-primary transition-all">
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 h-64 overflow-y-auto px-3 py-3 flex flex-col gap-2 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col gap-0.5 max-w-[80%] ${m.from === 'user' ? 'self-end' : 'self-start'}`}>
                <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed chat-bubble-${m.from}`}>
                  {m.text}
                </div>
                <div className={`text-[9.5px] text-slate-400 ${m.from === 'user' ? 'text-right' : ''}`}>{time}</div>
              </div>
            ))}
            {typing && (
              <div className="self-start flex gap-1 px-3 py-2 rounded-2xl bg-white border border-slate-200" style={{ boxShadow:'0 1px 3px rgba(0,0,0,.07)' }}>
                {[0,1,2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400"
                    style={{ animation:`typing 1.2s infinite ${i*.2}s` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-slate-200 flex gap-2 bg-white">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-primary focus:bg-white transition-colors"
            />
            <button onClick={() => send()}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 text-white transition-all hover:scale-105"
              style={{ background:'linear-gradient(135deg,#1E3A8A,#3B5FC3)' }}>
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typing { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
      `}</style>
    </>
  )
}
