import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import eventApi from '../api/eventApi'
import registrationApi from '../api/registrationApi'

export default function EventLandingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    if (id) {
      loadEvent()
      checkRegistration()
    }
  }, [id, user])

  useEffect(() => {
    if (event?.date) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const eventTime = new Date(event.date).getTime()
        const difference = eventTime - now

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          })
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [event])

  async function loadEvent() {
    try {
      setLoading(true)
      const res = await eventApi.getEventById(id)
      setEvent(res?.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function checkRegistration() {
    if (!user?.email) return
    try {
      const res = await registrationApi.getMyRegistrations()
      const registered = (res?.data || []).some(reg => reg?.event?._id === id)
      setIsRegistered(registered)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleRegister() {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setRegistering(true)
      await registrationApi.registerStudent({
        eventId: event._id,
        studentName: user.name,
        studentId: user.studentId || user._id || user.email,
        email: user.email,
        faculty: user.faculty || 'N/A',
        phone: 'N/A'
      })
      setIsRegistered(true)
    } catch (err) {
      console.error(err)
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="text-white text-xl">Event not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with concert crowd image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      
      {/* Purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/85 to-pink-800/90" />
      
      {/* Navigation Header */}
      <nav className="relative z-20 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-purple-800 font-bold text-sm">E</span>
          </div>
          <span className="text-white font-bold text-xl">EVENTIFY</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-white/90 text-sm font-medium">
          <button onClick={() => navigate('/events')} className="hover:text-white transition-colors">EVENTS</button>
          <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">DASHBOARD</button>
          <button onClick={() => navigate('/profile')} className="hover:text-white transition-colors">PROFILE</button>
          {user ? (
            <button onClick={() => navigate('/my-events')} className="hover:text-white transition-colors">MY EVENTS</button>
          ) : (
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">LOGIN</button>
          )}
        </div>
        
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Event Info */}
            <div className="text-white space-y-8">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
                  {event.title.toUpperCase()}
                </h1>
                <div className="flex items-center space-x-6 text-lg opacity-90">
                  <span>{Math.floor(Math.random() * 5) + 2} DAYS</span>
                  <span>{Math.floor(Math.random() * 50) + 20} SPEAKERS</span>
                  <span>{event.capacity || 500} PARTICIPANTS</span>
                </div>
              </div>
              
              <button
                onClick={handleRegister}
                disabled={registering || isRegistered || event.status === 'Closed'}
                className="border-2 border-white text-white px-8 py-3 font-semibold tracking-wider hover:bg-white hover:text-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering ? 'REGISTERING...' : isRegistered ? 'REGISTERED' : event.status === 'Closed' ? 'REGISTRATION CLOSED' : 'REGISTRATION NOW!'}
              </button>
            </div>

            {/* Right Side - Countdown Timer */}
            <div className="text-white">
              <div className="text-center space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  {/* Days */}
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-bold leading-none">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-sm opacity-75 mt-2">Days</div>
                  </div>
                  
                  {/* Hours */}
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-bold leading-none">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-sm opacity-75 mt-2">Hours</div>
                  </div>
                  
                  {/* Minutes */}
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-bold leading-none">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-sm opacity-75 mt-2">Minutes</div>
                  </div>
                  
                  {/* Seconds */}
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-bold leading-none">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-sm opacity-75 mt-2">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Event Details Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">VENUE</h3>
              <p className="opacity-90">{event.venue || 'TBA'}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">DATE & TIME</h3>
              <p className="opacity-90">{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">CAPACITY</h3>
              <p className="opacity-90">{event.registeredCount || 0} / {event.capacity || 500}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating dots decoration */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-4 hidden lg:block">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-white/30 rounded-full" />
        ))}
      </div>
    </div>
  )
}