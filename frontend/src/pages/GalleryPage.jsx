import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import axiosInstance from '../api/axios'

const FEATURED = [
  { id:'f1', title:'Convocation 2024', sub:'Main Auditorium · June 2024', bg:'from-blue-900 to-primary', featured:true, tag:'Ceremonies', img:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80' },
  { id:'f2', title:'Campus Gardens', sub:'Central Gardens · Spring 2025', bg:'from-green-900 to-unigreen', featured:false, tag:'Campus Life', img:'https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80' },
  { id:'f3', title:'Sports Complex', sub:'East Campus · March 2025', bg:'from-orange-900 to-accent', featured:false, tag:'Sports', img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id:'f4', title:'Central Library', sub:'Level 3 Reading Hall', bg:'from-sky-900 to-sky-500', featured:false, tag:'Campus Life', img:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80' },
  { id:'f5', title:'Science Labs', sub:'New Research Wing · 2025', bg:'from-purple-900 to-purple-600', featured:false, tag:'Academic', img:'https://images.unsplash.com/photo-1532094349884-543559be49b9?w=400&q=80' },
]

const CATEGORIES = ['All', 'Campus Life', 'Academic', 'Sports', 'Ceremonies', 'Events', 'Students']

const STATIC_PHOTOS = [
  { id:'p1',  title:'Morning at the Quad',        sub:'Main Square · 2025',           tag:'Campus Life', bg:'from-green-800 to-teal-600',   img:'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&q=80' },
  { id:'p2',  title:'Student Lounge',             sub:'Block A Common Room',           tag:'Campus Life', bg:'from-slate-700 to-slate-500',  img:'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80' },
  { id:'p3',  title:'Campus Pathway',             sub:'Tree-lined Walk · Autumn 2024',tag:'Campus Life', bg:'from-yellow-800 to-amber-600', img:'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&q=80' },
  { id:'p4',  title:'Cafeteria Hours',            sub:'Main Cafeteria · Block B',      tag:'Campus Life', bg:'from-orange-700 to-amber-500', img:'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80' },
  { id:'p5',  title:'Sunset Over Campus',         sub:'Rooftop View · Block G',        tag:'Campus Life', bg:'from-orange-900 to-rose-600',  img:'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=400&q=80' },
  { id:'p6',  title:'The Reading Garden',         sub:'Library Courtyard',             tag:'Campus Life', bg:'from-green-900 to-emerald-600',img:'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=400&q=80' },
  { id:'p7',  title:'Lecture in Progress',        sub:'Lecture Hall B1 · 2025',        tag:'Academic',   bg:'from-blue-900 to-indigo-600',  img:'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80' },
  { id:'p8',  title:'Research Lab Work',          sub:'Chemistry Wing · Block C',      tag:'Academic',   bg:'from-purple-800 to-violet-600',img:'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80' },
  { id:'p9',  title:'Group Study Session',        sub:'Library Floor 2 · 2025',        tag:'Academic',   bg:'from-sky-800 to-blue-500',     img:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80' },
  { id:'p10', title:'Annual Research Symposium',  sub:'Main Auditorium · April 2025',  tag:'Academic',   bg:'from-indigo-900 to-primary',   img:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80' },
  { id:'p11', title:'Graduation Hall Setup',      sub:'Main Auditorium · May 2025',    tag:'Academic',   bg:'from-blue-800 to-sky-500',     img:'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80' },
  { id:'p12', title:'Football Finals 2024',       sub:'University Stadium · Nov 2024', tag:'Sports',     bg:'from-green-900 to-unigreen',   img:'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80' },
  { id:'p13', title:'Swimming Gala',              sub:'Aquatic Centre · March 2025',   tag:'Sports',     bg:'from-cyan-900 to-sky-500',     img:'https://images.unsplash.com/photo-1560090995-03632a599967?w=400&q=80' },
  { id:'p14', title:'Basketball Tournament',      sub:'Sports Hall · Feb 2025',        tag:'Sports',     bg:'from-orange-800 to-amber-500', img:'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80' },
  { id:'p15', title:'Athletics Day',              sub:'University Track · May 2025',   tag:'Sports',     bg:'from-red-800 to-orange-500',   img:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
  { id:'p16', title:'Volleyball Interuni',        sub:'Sports Complex · April 2025',   tag:'Sports',     bg:'from-yellow-800 to-orange-500',img:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80' },
  { id:'p17', title:'Convocation 2023',           sub:'Main Auditorium · June 2023',   tag:'Ceremonies', bg:'from-blue-900 to-primary',     img:'https://images.unsplash.com/photo-1627556704302-624286467c65?w=400&q=80' },
  { id:'p18', title:"Dean's Award Night",         sub:'Faculty Club · November 2024',  tag:'Ceremonies', bg:'from-amber-900 to-yellow-600', img:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80' },
  { id:'p19', title:'Sports Awards Ceremony',     sub:'Grand Hall · December 2024',    tag:'Ceremonies', bg:'from-green-900 to-teal-500',   img:'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80' },
  { id:'p20', title:'Cultural Night 2024',        sub:'Open Air Theatre · April 2024', tag:'Events',     bg:'from-purple-900 to-pink-600',  img:'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80' },
  { id:'p21', title:'Career Fair 2025',           sub:'Convention Centre · April 2025',tag:'Events',     bg:'from-blue-800 to-indigo-500',  img:'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80' },
  { id:'p22', title:'Engineering Expo',           sub:'Block E · February 2025',       tag:'Events',     bg:'from-orange-900 to-accent',    img:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80' },
  { id:'p23', title:'International Food Festival',sub:'Main Square · September 2024',  tag:'Events',     bg:'from-red-800 to-pink-500',     img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' },
  { id:'p24', title:'Art Exhibition Opening',     sub:'Arts Block Gallery · Jan 2025', tag:'Events',     bg:'from-purple-800 to-violet-500',img:'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80' },
  { id:'p25', title:'Tree Planting Day',          sub:'Campus Grounds · Earth Day 2025',tag:'Events',    bg:'from-green-800 to-lime-500',   img:'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80' },
  { id:'p26', title:'Hackathon 2025',             sub:'IT Block · July 2025',          tag:'Events',     bg:'from-slate-800 to-blue-600',   img:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80' },
  { id:'p27', title:'Freshers on Campus',         sub:'Main Square · February 2025',   tag:'Students',   bg:'from-sky-800 to-cyan-500',     img:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80' },
  { id:'p28', title:'Study Buddies',              sub:'Central Library · 2025',        tag:'Students',   bg:'from-green-800 to-emerald-500',img:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80' },
  { id:'p29', title:'Project Presentation',       sub:'Engineering Block · March 2025',tag:'Students',   bg:'from-indigo-800 to-blue-500',  img:'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&q=80' },
  { id:'p30', title:'Campus Friends',             sub:'Central Gardens · 2025',        tag:'Students',   bg:'from-pink-800 to-rose-500',    img:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80' },
]

const FACULTIES = ['Faculty of Engineering','Faculty of Science','Faculty of Arts','Faculty of Business','Faculty of Medicine','Faculty of Law','Faculty of Education','Faculty of IT','Other']

function dbItemToPhoto(item) {
  return {
    id:     item._id,
    title:  item.title,
    sub:    item.subtitle || '',
    tag:    item.tag      || 'Campus Life',
    bg:     item.bgClass  || 'from-slate-700 to-slate-500',
    img:    item.imageUrl || '',
    emoji:  item.emoji    || '🖼️',
    fromDB: true,
  }
}

function FeaturedCell({ item, onClick }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <div onClick={onClick} className={`relative cursor-pointer overflow-hidden group transition-transform hover:scale-[1.025] hover:z-10 ${item.featured ? 'row-span-2' : ''}`}>
      {item.img && !imgErr ? (
        <img src={item.img} alt={item.title} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${item.bg}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
        <div className="text-white text-xs font-bold">{item.title}</div>
        <div className="text-white/65 text-[10px]">{item.sub}</div>
      </div>
    </div>
  )
}

function MasonryCard({ item, tall, onClick }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <div onClick={onClick} className={`relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02] ${tall ? 'h-52' : 'h-32'} mb-3`}>
      {item.img && !imgErr ? (
        <img src={item.img} alt={item.title} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${item.bg} flex items-center justify-center text-3xl`}>{item.emoji || '🖼️'}</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
        <div className="text-white text-[10.5px] font-bold leading-tight">{item.title}</div>
        <div className="text-white/60 text-[9px]">{item.sub}</div>
      </div>
      <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{item.tag}</span>
      </div>
      {item.fromDB && (
        <div className="absolute top-1.5 right-1.5">
          <span className="bg-primary/80 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">New</span>
        </div>
      )}
    </div>
  )
}

function GalleryModal({ item, onClose }) {
  const [imgErr, setImgErr] = useState(false)
  if (!item) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-display text-base font-bold text-slate-900">{item.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{item.tag}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs hover:bg-slate-200">✕</button>
        </div>
        <div className="h-56 rounded-xl overflow-hidden mb-4">
          {item.img && !imgErr ? (
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${item.bg} flex items-center justify-center text-6xl`}>{item.emoji || '🖼️'}</div>
          )}
        </div>
        <div className="font-bold text-slate-900 mb-1">{item.title}</div>
        <div className="text-sm text-slate-400">{item.sub}</div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary px-4 py-2 text-sm">Close</button>
          {item.img && !imgErr && (
            <a href={item.img} target="_blank" rel="noreferrer" className="btn-primary px-4 py-2 text-sm">View Full</a>
          )}
        </div>
      </div>
    </div>
  )
}

function MediaClubModal({ onClose }) {
  const [form, setForm]         = useState({ name:'', studentId:'', faculty:'', email:'', phone:'', interest:'' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)
  function handleChange(e) { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })) }
  function handleSubmit(e) { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setSubmitted(true) }, 1200) }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-display text-lg font-bold text-slate-900">Join Media Club</div>
            <div className="text-xs text-slate-400 mt-0.5">University Photography &amp; Media Society</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs hover:bg-slate-200">✕</button>
        </div>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
            <div className="font-bold text-slate-900 text-base mb-1">Application Submitted!</div>
            <div className="text-sm text-slate-500 mb-5">We will review your application and get back to you within 3–5 working days.</div>
            <button onClick={onClose} className="btn-primary px-6 py-2 text-sm">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                <input required name="name" value={form.name} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Student ID *</label>
                <input required name="studentId" value={form.studentId} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="e.g. 2022CS0112" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Faculty *</label>
              <select required name="faculty" value={form.faculty} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                <option value="">Select your faculty</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">University Email *</label>
                <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="id@university.edu" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Optional" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Why do you want to join? *</label>
              <textarea required name="interest" value={form.interest} onChange={handleChange} rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Tell us about your interest in photography / media..." />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 text-sm">{loading ? 'Submitting...' : 'Submit Application'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function UploadModal({ onClose, onSuccess }) {
  const [studentId,  setStudentId]  = useState('')
  const [caption,    setCaption]    = useState('')
  const [event,      setEvent]      = useState('')
  const [file,       setFile]       = useState(null)
  const [preview,    setPreview]    = useState(null)
  const [submitted,  setSubmitted]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  function handleFile(e) {
    const picked = e.target.files[0]
    if (!picked) return
    setFile(picked)
    setPreview(URL.createObjectURL(picked))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!file) { setError('Please select a photo to upload.'); return }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('photo',       file)
      fd.append('title',       caption || event || 'Untitled')
      fd.append('subtitle',    event)
      fd.append('tag',         'Campus Life')
      fd.append('submittedBy', studentId)

      await axiosInstance.post('/gallery', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSubmitted(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-display text-lg font-bold text-slate-900">Submit Photos</div>
            <div className="text-xs text-slate-400 mt-0.5">Share your campus moments</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs hover:bg-slate-200">✕</button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
            <div className="font-bold text-slate-900 text-base mb-1">Photo Submitted!</div>
            <div className="text-sm text-slate-500 mb-5">Your photo will be reviewed and may appear in the gallery once approved by an admin.</div>
            <button onClick={onClose} className="btn-primary px-6 py-2 text-sm">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Photo picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Photo *</label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary transition-colors bg-slate-50 overflow-hidden">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-48 object-cover" />
                ) : (
                  <div className="py-8 text-center">
                    <div className="text-3xl mb-2">📸</div>
                    <div className="text-xs font-semibold text-slate-500">Click to choose a photo</div>
                    <div className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP — max 10 MB</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </label>
              {file && (
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-slate-500 truncate">{file.name}</span>
                  <button type="button" onClick={() => { setFile(null); setPreview(null) }}
                    className="text-[10px] text-red-400 hover:text-red-600 ml-2 flex-shrink-0">Remove</button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Student ID *</label>
              <input required value={studentId} onChange={e => setStudentId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="e.g. 2022CS0112" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Event / Location</label>
              <input value={event} onChange={e => setEvent(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="e.g. Sports Day 2025, Main Quad" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Caption</label>
              <input value={caption} onChange={e => setCaption(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Brief description of the photo" />
            </div>

            {error && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={loading || !file}
                className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50">
                {loading ? 'Uploading…' : 'Submit Photo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [selected,   setSelected]   = useState(null)
  const [showJoin,   setShowJoin]   = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [activeTag,  setActiveTag]  = useState('All')
  const [dbPhotos,   setDbPhotos]   = useState([])
  const [loadingDB,  setLoadingDB]  = useState(true)

  async function fetchGallery() {
    try {
      const res   = await axiosInstance.get('/gallery')
      const items = (res.data?.data || []).map(dbItemToPhoto)
      setDbPhotos(items)
    } catch {
      setDbPhotos([])
    } finally {
      setLoadingDB(false)
    }
  }

  useEffect(() => { fetchGallery() }, [])

  // DB photos appear first so newly approved uploads are visible at the top
  const allPhotos  = [...dbPhotos, ...STATIC_PHOTOS]
  const totalCount = allPhotos.length + FEATURED.length
  const filtered   = activeTag === 'All' ? allPhotos : allPhotos.filter(p => p.tag === activeTag)

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
          Campus Gallery
          <span className="text-xs font-bold text-primary bg-primary-pale px-2 py-0.5 rounded-lg">
            {loadingDB ? '…' : totalCount} photos
          </span>
        </h2>
        <button onClick={() => setShowUpload(true)} className="text-xs font-bold text-primary bg-primary-pale border border-primary/18 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all">
          📤 Submit Photos
        </button>
      </div>

      {/* Featured mosaic */}
      <div className="grid grid-cols-3 grid-rows-2 gap-2 rounded-2xl overflow-hidden mb-6" style={{ height: 400 }}>
        {FEATURED.map(item => <FeaturedCell key={item.id} item={item} onClick={() => setSelected(item)} />)}
      </div>

      {/* New uploads banner */}
      {dbPhotos.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-green-600 to-teal-500 p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">🆕</div>
          <div>
            <div className="font-bold text-white text-sm">{dbPhotos.length} new photo{dbPhotos.length !== 1 ? 's' : ''} added to the gallery!</div>
            <div className="text-white/75 text-xs mt-0.5">Recently approved community submissions appear at the top of the photo library.</div>
          </div>
        </div>
      )}

      {/* Media Club CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-light p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">📷</div>
        <div className="flex-1">
          <div className="font-display font-bold text-white text-base">University Media Club</div>
          <div className="text-white/75 text-xs mt-0.5 leading-relaxed">Passionate about photography? Join our media club to cover university events, learn from peers, and get your shots featured in the gallery.</div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => setShowUpload(true)} className="px-4 py-2 text-xs font-bold bg-white/20 text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all">📤 Submit Photos</button>
          <button onClick={() => setShowJoin(true)}   className="px-4 py-2 text-xs font-bold bg-white text-primary rounded-xl hover:bg-white/90 transition-all">✦ Join Club</button>
        </div>
      </div>

      {/* Category filter tabs */}
      <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
        <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
        Photo Library
      </h2>
      <div className="flex gap-2 flex-wrap mb-5">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveTag(cat)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${activeTag === cat ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 hover:bg-primary-pale hover:text-primary'}`}>
            {cat}
            {cat !== 'All' && <span className="ml-1 opacity-60">{allPhotos.filter(p => p.tag === cat).length}</span>}
          </button>
        ))}
      </div>

      {/* Masonry photo grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {filtered.map((item, i) => (
          <MasonryCard key={item.id} item={item} tall={i % 5 === 0} onClick={() => setSelected(item)} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center py-12 text-slate-400 text-sm">No photos in this category yet.</p>
        )}
      </div>

      {/* Submit prompt */}
      <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-4 flex items-center gap-3 bg-slate-50/70">
        <div className="text-2xl">📸</div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-700">Have photos from a university event?</div>
          <div className="text-xs text-slate-400">Upload them and they may be featured in the official gallery.</div>
        </div>
        <button onClick={() => setShowUpload(true)} className="text-xs font-bold text-primary bg-primary-pale border border-primary/18 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all flex-shrink-0">Upload →</button>
      </div>

      {selected   && <GalleryModal   item={selected}   onClose={() => setSelected(null)} />}
      {showJoin   && <MediaClubModal onClose={() => setShowJoin(false)} />}
      {showUpload && <UploadModal    onClose={() => setShowUpload(false)} onSuccess={fetchGallery} />}
    </Layout>
  )
}