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