import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Layout  from '../components/Layout'
import dataApi from '../api/dataApi'

const FALLBACK_NEWS = [
  {
    _id:'1', title:'University Ranked 5th Nationally in Engineering Research Output 2024',
    category:'Academic', imageEmoji:'🏛️', img:'', author:'University Communications', createdAt:new Date(),
    body:`The university has achieved a remarkable milestone, climbing to 5th place nationally in engineering research output according to the 2024 National Research Rankings report released this week.\n\nThe ranking reflects a 23% increase in published research papers over the previous year, with particular strength in civil engineering, electrical systems, and materials science. The Faculty of Engineering contributed over 340 peer-reviewed publications and secured 12 international research partnerships during the assessment period.\n\n"This achievement is a testament to the dedication of our academic staff and the quality of our postgraduate research programmes," said the Dean of Engineering. "We are committed to pushing this further in the coming years."\n\nThe university's research output was assessed across four key metrics: volume of publications, citation impact, international collaboration, and industry-linked research. The institution scored in the top 10% nationally across all four categories.\n\nPlans are already underway to expand the research wing with a new laboratory complex scheduled to open in early 2026.`,
  },
  {
    _id:'2', title:'Faculty of Science Awarded $2.4M Grant for Climate Research',
    category:'Research', imageEmoji:'🔬', img:'green', author:'Research Office', createdAt:new Date(),
    body:`The Faculty of Science has been awarded a $2.4 million research grant from the National Science Foundation to fund a three-year study into climate change adaptation strategies for coastal communities.\n\nThe project, titled "Resilient Coasts: Data-Driven Adaptation Models for Small Island Developing States," will be led by Professor Nadia Fernandez of the Department of Environmental Sciences, in collaboration with researchers from two international partner universities.\n\nThe grant will fund a dedicated research team of eight, including four postdoctoral fellows and two PhD students. Field research will be conducted across five coastal regions, with data collection beginning in the second quarter of 2025.\n\n"This funding allows us to address one of the most pressing challenges of our time with rigorous, locally relevant science," said Professor Fernandez. "Our findings will be shared directly with policymakers to inform adaptation planning."\n\nThe Faculty of Science has now secured over $7 million in external research funding in the current academic year, a record for the institution.`,
  },
  {
    _id:'3', title:"Men's Basketball Team Advances to National Quarter-Finals",
    category:'Sports', imageEmoji:'🏆', img:'orange', author:'Sports Department', createdAt:new Date(),
    body:`The university's men's basketball team has secured their place in the national quarter-finals after a thrilling 78–71 victory over cross-town rivals at the National University Sports Championship regional round.\n\nCaptain Marcus Osei led the team with 24 points and 9 rebounds, while second-year guard Priya Nair contributed 18 points off the bench in what the coaching staff described as their most complete performance of the season.\n\nThe team, seeded 4th in the northern region, has now won 11 of their last 13 games following a mid-season tactical shift to a full-court press defence.\n\n"The boys have worked incredibly hard this semester — balancing their studies and training at this level is no easy feat," said Head Coach Bernard Lim. "We're going to the quarter-finals and we believe we can go all the way."\n\nThe quarter-final fixture is scheduled for the 18th of next month. The university invites all students and staff to attend and support the team. Tickets are available free of charge from the Sports Office.`,
  },
  {
    _id:'4', title:'Convocation Ceremony 2025 Scheduled for June 14–16',
    category:'Event', imageEmoji:'🎓', img:'blue', author:'Registry', createdAt:new Date(),
    body:`The Registry has confirmed that the 2025 Convocation Ceremony will be held across three days from June 14 to 16 at the Main Auditorium, Block A. This year's ceremony will celebrate over 1,800 graduating students across all faculties.\n\nThe schedule is as follows:\n- June 14 (Morning): Faculty of Engineering & Faculty of Science\n- June 14 (Afternoon): Faculty of Arts & Faculty of Education\n- June 15 (Morning): Faculty of Business & Faculty of Law\n- June 15 (Afternoon): Faculty of Medicine\n- June 16: Postgraduate & Honours Students\n\nGraduating students are required to collect their academic regalia from the Registry Counter (Block A, Room 102) no later than June 10. Each graduate is allocated two guest tickets. Additional tickets may be requested subject to availability.\n\nA graduation rehearsal will be held on May 24 from 9:00 AM to 1:00 PM. Attendance is compulsory for all graduating students.\n\nFor queries, contact the Registry at registry@university.edu.`,
  },
  {
    _id:'5', title:'New Student Services Portal Launched',
    category:'Administrative', imageEmoji:'📋', img:'purple', author:'IT Department', createdAt:new Date(),
    body:`The IT Department is pleased to announce the official launch of the new Student Services Portal, a unified digital platform designed to streamline access to all administrative student services.\n\nThe portal consolidates over 20 previously separate systems into a single, mobile-friendly interface. Students can now manage course registration, fee payments, transcript requests, accommodation applications, and library services all from one login.\n\nKey features of the new portal include:\n- Real-time course availability and timetable builder\n- Integrated fee payment with multiple payment methods\n- Digital transcript and certification requests with 3-day turnaround\n- Accommodation portal with room preference selection\n- Live chat support with administrative staff\n\n"This has been two years in the making and we're proud of what we've built," said the Director of IT Services. "Student feedback from the pilot phase was overwhelmingly positive, with 91% of testers rating the experience as excellent or very good."\n\nAll students can access the portal at portal.university.edu using their existing student credentials. A tutorial walkthrough is available on the portal homepage.`,
  },
  {
    _id:'6', title:'Professor Amara Wins National Award for Excellence in Teaching 2025',
    category:'Academic', imageEmoji:'🥇', img:'', author:'Communications', createdAt:new Date(),
    body:`Professor Yemi Amara of the Department of Mathematics has been named the recipient of the 2025 National Award for Excellence in University Teaching, presented by the Higher Education Teaching Council.\n\nProfessor Amara, who has taught at the university for 14 years, was recognised for her innovative approach to teaching undergraduate mathematics, particularly her development of a flipped-classroom model that has significantly improved first-year pass rates from 64% to 89% over four years.\n\n"I teach because I believe every student is capable of understanding mathematics — they just need the right environment and support," said Professor Amara upon receiving the award. "This belongs to my students as much as it belongs to me."\n\nThe award is presented annually to one academic nationally and includes a $25,000 research grant to further innovative teaching practice. Professor Amara plans to use the grant to develop open-access mathematics learning materials for students at under-resourced institutions.\n\nA campus celebration in her honour will be held in the Faculty Common Room on Friday at 3:00 PM. All staff and students are welcome to attend.`,
  },
]

const FALLBACK_ANN = [
  { _id:'1', title:'Final Exam Timetable Published — Check Now',       description:'Semester 2 timetable is now available on the student portal. Please verify your personal schedule and report any clashes to the Examinations Board immediately via exams@university.edu. The deadline to report clashes is April 20.',                           priority:'urgent',  badge:'Urgent',   department:'Examinations Board', createdAt:new Date() },
  { _id:'2', title:'Semester 2 Course Registration Now Open',          description:'Course registration for Semester 2 is open from March 25 to April 15. Log in to the Student Portal to add, drop, or swap courses. Students who miss the deadline will not be able to make changes until the late registration window opens in Week 3.',  priority:'info',    badge:'New',      department:'Academic Registrar', createdAt:new Date() },
  { _id:'3', title:'Scholarship Application Deadline — April 30',      description:'Merit and need-based scholarship applications for the 2025/26 academic year close on April 30. Eligible students must have a GPA of 3.0 or above. Application forms are available at the Financial Aid Office or online at aid.university.edu.',          priority:'warning', badge:'Reminder', department:'Financial Aid',       createdAt:new Date() },
  { _id:'4', title:'Library Database Access Extended to All Students', description:'Scopus and JSTOR academic databases are now available free of charge to all registered students. Access is via the Library portal using your student credentials. The extension covers the full 2025 academic year and includes full-text access.',        priority:'success', badge:'Info',     department:'University Library',  createdAt:new Date() },
  { _id:'5', title:'Parking Policy Update — Block C Restricted Zones', description:'Block C parking bays will be restricted from April 1 to April 14 due to construction works. Alternative parking is available at Block F (Level 2) and the Overflow Car Park near the East Gate. Shuttle service will operate every 20 minutes.',        priority:'info',    badge:'Info',     department:'Campus Operations',  createdAt:new Date() },
]

const tagMap      = { Academic:'tag-academic', Research:'tag-research', Sports:'tag-sports', Event:'tag-event', Administrative:'tag-admin' }
const badgeMap    = { Urgent:'badge-red', New:'badge-green', Reminder:'badge-orange', Info:'badge-blue' }
const borderMap   = { urgent:'border-l-red-500', info:'border-l-blue-500', success:'border-l-green-500', warning:'border-l-orange-400' }
const imgColorMap = { '':'from-primary to-primary-light', green:'from-green-900 to-unigreen', blue:'from-blue-900 to-blue-500', orange:'from-orange-900 to-accent', purple:'from-purple-900 to-purple-600' }

function ArticleModal({ article, onClose }) {
  if (!article) return null
  const paragraphs = article.body.split('\n\n')
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box w-full max-w-2xl p-0 overflow-hidden"
        style={{ maxHeight:'90vh', display:'flex', flexDirection:'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero */}
        <div className={`h-40 bg-gradient-to-br ${imgColorMap[article.img||''] || imgColorMap['']} flex items-center justify-center text-6xl flex-shrink-0`}>
          {article.imageEmoji || '📰'}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`tag ${tagMap[article.category]||'tag-academic'}`}>{article.category}</span>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs hover:bg-slate-200 flex-shrink-0">✕</button>
          </div>

          <h2 className="font-display text-xl font-bold text-slate-900 leading-snug mb-2">{article.title}</h2>

          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-primary-pale flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
              {article.author?.[0] || 'U'}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700">{article.author}</div>
              <div className="text-[10px] text-slate-400">
                {new Date(article.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {paragraphs.map((para, i) => (
              para.startsWith('-') ? (
                <ul key={i} className="space-y-1 pl-1">
                  {para.split('\n').filter(l => l.startsWith('-')).map((line, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {line.slice(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">{para}</p>
              )
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="btn-primary px-5 py-2 text-sm">Close</button>
        </div>
      </div>
    </div>
  )
}

function AllArticlesModal({ news, onClose, onSelect }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box w-full max-w-2xl p-0 overflow-hidden"
        style={{ maxHeight:'90vh', display:'flex', flexDirection:'column' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="font-display text-lg font-bold text-slate-900">All Articles</div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs hover:bg-slate-200">✕</button>
        </div>
        <div className="overflow-y-auto p-4 space-y-2">
          {news.map(n => (
            <div
              key={n._id}
              onClick={() => { onClose(); onSelect(n) }}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary/25 hover:bg-primary-pale cursor-pointer transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${imgColorMap[n.img||'']} flex items-center justify-center text-2xl flex-shrink-0`}>
                {n.imageEmoji || '📰'}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`tag ${tagMap[n.category]||'tag-academic'} mb-1`}>{n.category}</span>
                <div className="text-sm font-bold text-slate-800 leading-snug">{n.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{n.author} · {new Date(n.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
              </div>
              <span className="text-primary text-sm flex-shrink-0">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NewsPage() {
  const [news,           setNews]           = useState(FALLBACK_NEWS)
  const [ann,            setAnn]            = useState(FALLBACK_ANN)
  const [selectedArticle,setSelectedArticle] = useState(null)
  const [showAllArticles,setShowAllArticles] = useState(false)
  const location = useLocation()

  useEffect(() => {
    dataApi.getNews(10).then(d => d.length && setNews(d))
    dataApi.getAnnouncements(10).then(d => d.length && setAnn(d))
  }, [])

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior:'smooth', block:'start' }), 100)
    }
  }, [location.hash])

  return (
    <Layout>
      {/* News section */}
      <div id="news" className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
          News &amp; Updates
        </h2>
        <button
          onClick={() => setShowAllArticles(true)}
          className="text-xs font-bold text-primary bg-primary-pale px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all"
        >
          All articles →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {news.map(n => (
          <div
            key={n._id}
            onClick={() => setSelectedArticle(n)}
            className="card p-0 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className={`h-28 bg-gradient-to-br ${imgColorMap[n.img||''] || imgColorMap['']} flex items-center justify-center text-4xl`}>
              {n.imageEmoji||'📰'}
            </div>
            <div className="p-4">
              <span className={`tag ${tagMap[n.category]||'tag-academic'}`}>{n.category}</span>
              <div className="text-sm font-bold text-slate-900 leading-snug mb-1.5">{n.title}</div>
              <div className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} · {n.author}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Announcements section */}
      <div id="announcements" className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
          Announcements
        </h2>
        <span className="text-xs font-bold text-primary bg-primary-pale px-3 py-1.5 rounded-xl">All announcements →</span>
      </div>

      <div className="flex flex-col gap-3 max-w-3xl">
        {ann.map(a => (
          <div key={a._id} className={`card border-l-4 cursor-pointer hover:shadow-md transition-all ${borderMap[a.priority]||'border-l-slate-300'}`}>
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="text-sm font-bold text-slate-700 flex-1">{a.title}</div>
              <span className={`badge ${badgeMap[a.badge]||'badge-blue'} text-[9px] flex-shrink-0`}>{a.badge}</span>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed mb-2">{a.description}</div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-primary">{a.department}</span>
              <span className="text-[10px] text-slate-400">{new Date(a.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      {showAllArticles  && (
        <AllArticlesModal
          news={news}
          onClose={() => setShowAllArticles(false)}
          onSelect={n => setSelectedArticle(n)}
        />
      )}
    </Layout>
  )
}