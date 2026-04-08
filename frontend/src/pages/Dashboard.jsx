<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout       from '../components/Layout'
import RealTimeBar  from '../components/RealTimeBar'
import EventBanner  from '../components/EventBanner'
import SummaryCard  from '../components/SummaryCard'
import dataApi      from '../api/dataApi'

const FALLBACK_NEWS = [
  { _id:'1', title:'University Ranked 5th Nationally in Engineering Research',  category:'Academic',        imageEmoji:'🏛️', author:'Communications',  createdAt:new Date() },
  { _id:'2', title:'Faculty of Science Awarded $2.4M Grant for Climate Research',category:'Research',        imageEmoji:'🔬', author:'Research Office', createdAt:new Date() },
  { _id:'3', title:"Men's Basketball Team Advances to National Quarter-Finals",   category:'Sports',          imageEmoji:'🏆', author:'Sports Dept',     createdAt:new Date() },
  { _id:'4', title:'Convocation Ceremony 2025 Scheduled for June 14–16',         category:'Event',           imageEmoji:'🎓', author:'Registry',        createdAt:new Date() },
  { _id:'5', title:'New Student Services Portal Launched',                        category:'Administrative',  imageEmoji:'📋', author:'IT Department',   createdAt:new Date() },
]
const FALLBACK_ANN = [
  { _id:'1', title:'Final Exam Timetable Published',          description:'Check the portal for your personal schedule.',                    priority:'urgent',  badge:'Urgent',   department:'Examinations Board', createdAt:new Date() },
  { _id:'2', title:'Semester 2 Course Registration Now Open', description:'Open March 25 – April 15. Log in to add or drop courses.',        priority:'info',    badge:'New',      department:'Registrar',          createdAt:new Date() },
  { _id:'3', title:'Scholarship Application Deadline Apr 30', description:'Merit and need-based applications for 2025/26 close April 30.',   priority:'warning', badge:'Reminder', department:'Financial Aid',       createdAt:new Date() },
  { _id:'4', title:'Library Database Access Extended',        description:'Scopus and JSTOR are now free for all registered students.',       priority:'success', badge:'Info',     department:'Library',            createdAt:new Date() },
]

const tagMap   = { Academic:'tag-academic', Research:'tag-research', Sports:'tag-sports', Event:'tag-event', Administrative:'tag-admin' }
const badgeMap = { Urgent:'badge-red', New:'badge-green', Reminder:'badge-orange', Info:'badge-blue' }
const priorityBorder = { urgent:'border-l-red-500', info:'border-l-blue-500', success:'border-l-unigreen', warning:'border-l-accent' }

export default function Dashboard() {
  const { user } = useAuth()
  const [news,  setNews]  = useState(FALLBACK_NEWS)
  const [ann,   setAnn]   = useState(FALLBACK_ANN)
  const [stats, setStats] = useState({ totalStudents:12840, activeCourses:386, upcomingEvents:8, facultyMembers:524 })

  useEffect(() => {
    dataApi.getNews(5).then(d => d.length && setNews(d))
    dataApi.getAnnouncements(4).then(d => d.length && setAnn(d))
    dataApi.getStats().then(d => Object.keys(d).length && setStats(d))
  }, [])

  return (
    <Layout>
      <RealTimeBar />
      <EventBanner onRegister={() => {}} onLearnMore={() => {}} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SummaryCard title="Total Students"  value={stats.totalStudents?.toLocaleString()} delta="4.2% vs last year" icon="👥" color="blue" live />
        <SummaryCard title="Active Courses"  value={stats.activeCourses?.toLocaleString()} delta="12 new this sem"   icon="📚" color="green" />
        <SummaryCard title="Upcoming Events" value={stats.upcomingEvents?.toLocaleString()} delta="3 this week"      icon="🏆" color="orange" live />
        <SummaryCard title="Faculty Members" value={stats.facultyMembers?.toLocaleString()} delta="18 new appts"     icon="🎓" color="info" />
      </div>

      {/* News + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* News */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
              News &amp; Updates
            </h2>
            <Link to="/news#news" className="text-xs font-bold text-primary bg-primary-pale px-3 py-1 rounded-xl hover:bg-primary hover:text-white transition-all">View all →</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {news.map(n => (
              <div key={n._id} className="card flex gap-3 p-3.5 cursor-pointer hover:shadow-md hover:border-primary/20 hover:translate-x-0.5 transition-all">
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">{n.imageEmoji||'📰'}</div>
                <div className="flex-1 min-w-0">
                  <span className={`tag ${tagMap[n.category]||'tag-academic'}`}>{n.category}</span>
                  <div className="text-sm font-bold text-slate-700 leading-snug mb-0.5">{n.title}</div>
                  <div className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} · {n.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
              Announcements
            </h2>
            <Link to="/news#announcements" className="text-xs font-bold text-primary bg-primary-pale px-3 py-1 rounded-xl hover:bg-primary hover:text-white transition-all">View all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {ann.map(a => (
              <div key={a._id} className={`card p-3.5 border-l-4 cursor-pointer hover:shadow-md transition-all ${priorityBorder[a.priority]||'border-l-slate-300'}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-xs font-bold text-slate-700 leading-snug flex-1">{a.title}</div>
                  <span className={`badge ${badgeMap[a.badge]||'badge-blue'} text-[9px] flex-shrink-0`}>{a.badge}</span>
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">{a.description}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9.5px] font-bold text-primary">{a.department}</span>
                  <span className="text-[9.5px] text-slate-400">{new Date(a.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
=======
import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import { useAuth } from '../context/AuthContext'

function completionScore(user) {
  const fields = [user?.name, user?.email, user?.studentId, user?.faculty]
  const filled = fields.filter(Boolean).length
  return `${Math.round((filled / fields.length) * 100)}%`
}

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-pagebg md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="px-4 py-6 md:px-8">
          <section className="mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-[#224764] to-sportgreen text-[#fff8ef] shadow-2xl shadow-[rgba(23,50,77,0.16)]">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.5fr,1fr] lg:p-10">
              <div>
                <div className="inline-flex rounded-full border border-[#fff8ef]/10 bg-[#fff8ef]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#fff8ef]/70">
                  Season Ready
                </div>
                <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                  Welcome back, {user?.name || 'User'}.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#fff8ef]/74">
                  This refreshed dashboard keeps profile quality, access level, and student identity visible at a glance.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="/profile" className="btn-primary">
                    Open Profile Studio
                  </a>
                  <a
                    href="/dashboard/module"
                    className="inline-flex items-center justify-center rounded-2xl border border-[#fff8ef]/15 bg-[#fff8ef]/10 px-5 py-3 text-sm font-semibold text-[#fff8ef] transition hover:bg-[#fff8ef]/15"
                  >
                    Open Sports Module
                  </a>
                  <a
                    href="/settings"
                    className="inline-flex items-center justify-center rounded-2xl border border-[#fff8ef]/15 bg-[#fff8ef]/10 px-5 py-3 text-sm font-semibold text-[#fff8ef] transition hover:bg-[#fff8ef]/15"
                  >
                    Review Settings
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[28px] border border-[#fff8ef]/10 bg-[#fff8ef]/10 p-5 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.28em] text-[#fff8ef]/55">Current Role</div>
                  <div className="mt-3 text-3xl font-black capitalize">{user?.role || 'student'}</div>
                  <div className="mt-2 text-sm text-[#fff8ef]/74">Permissions and dashboard access are synchronized with your account type.</div>
                </div>
                <div className="rounded-[28px] border border-[#fff8ef]/14 bg-[#d88c4f]/16 p-5">
                  <div className="text-xs uppercase tracking-[0.28em] text-[#fff1de]/84">Profile Completion</div>
                  <div className="mt-3 text-3xl font-black">{completionScore(user)}</div>
                  <div className="mt-2 text-sm text-[#fff1de]/80">Complete faculty and student ID details for a stronger profile.</div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard title="Account Type" value={user?.role || 'student'} detail="Assigned from your platform permissions">
              ◉
            </SummaryCard>
            <SummaryCard title="Profile Status" value={user?.faculty && user?.studentId ? 'Ready' : 'Needs Work'} detail="Based on required academic fields">
              ✓
            </SummaryCard>
            <SummaryCard title="Faculty" value={user?.faculty || 'Not set'} detail="Displayed across your sport identity">
              ⌘
            </SummaryCard>
            <SummaryCard title="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'} detail="First recorded account activity">
              ◌
            </SummaryCard>
          </section>

          <section className="mt-8">
            <div className="card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Momentum</div>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Recent profile activity</h3>
                </div>
                <div className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-semibold text-primary">Live account view</div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ['Profile available', 'Your account is authenticated and ready to edit.'],
                  ['Faculty captured', user?.faculty ? user.faculty : 'Faculty is still missing from your profile.'],
                  ['Student identity', user?.studentId ? `Student ID ${user.studentId}` : 'Student ID has not been added yet.'],
                ].map(([title, description]) => (
                  <div key={title} className="flex flex-col gap-4 rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4 sm:flex-row">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fffdf8] text-lg shadow-sm">
                      •
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{title}</div>
                      <div className="mt-1 text-sm leading-6 text-[#6f675d]">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
>>>>>>> origin/main
