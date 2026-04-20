import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function EventCard({ event, onRegister, registering = false, isAdmin = false, isRegistered = false }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10) // Random initial likes
  
  const canRegister = ['Open', 'Upcoming'].includes(event?.status)
  const isClosed = !canRegister
  const disableRegister = isClosed || registering || isRegistered

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(prev => prev - 1)
    } else {
      setIsLiked(true)
      setLikeCount(prev => prev + 1)
    }
  }

  // Define color schemes based on event status
  const getStatusColors = (status) => {
    switch (status) {
      case 'Open':
        return {
          badge: 'bg-green-100 text-green-800 border border-green-200',
          border: 'border-l-green-500',
          accent: 'bg-green-50'
        }
      case 'Upcoming':
        return {
          badge: 'bg-blue-100 text-blue-800 border border-blue-200',
          border: 'border-l-blue-500',
          accent: 'bg-blue-50'
        }
      case 'Ongoing':
        return {
          badge: 'bg-orange-100 text-orange-800 border border-orange-200',
          border: 'border-l-orange-500',
          accent: 'bg-orange-50'
        }
      case 'Completed':
        return {
          badge: 'bg-purple-100 text-purple-800 border border-purple-200',
          border: 'border-l-purple-500',
          accent: 'bg-purple-50'
        }
      case 'Cancelled':
        return {
          badge: 'bg-red-100 text-red-800 border border-red-200',
          border: 'border-l-red-500',
          accent: 'bg-red-50'
        }
      case 'Closed':
        return {
          badge: 'bg-gray-100 text-gray-800 border border-gray-200',
          border: 'border-l-gray-500',
          accent: 'bg-gray-50'
        }
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 border border-gray-200',
          border: 'border-l-gray-500',
          accent: 'bg-gray-50'
        }
    }
  }

  const colors = getStatusColors(event?.status)

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Event Image with Overlay */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {event?.image ? (
          <img 
            src={`http://localhost:5004/${event.image}`}
            alt={event?.title || 'Event image'}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
              // Show fallback image
              e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
            }}
            onLoad={(e) => {
              console.log('Image loaded successfully:', e.target.src);
            }}
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-300"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
            }}
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Top overlay with price and actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Price tag */}
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-gray-900">FREE</span>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button 
              onClick={handleLike}
              className={`backdrop-blur-sm p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                isLiked 
                  ? 'bg-red-500/90 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
            {event?.status || 'Upcoming'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {event?.title || 'Event Title'}
        </h3>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-2xl font-bold text-purple-600">
                {event?.date ? new Date(event.date).getDate() : '18'}
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {event?.venue || 'Syahenna Daerah Khusus Ibutota'}
              </div>
              <div className="text-xs text-gray-500">
                {event?.date ? new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Wednesday, Indonesia'}
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className={`font-semibold ${(event?.registeredCount || 0) >= (event?.capacity || 0) ? 'text-red-600' : 'text-green-600'}`}>
              {event?.registeredCount || 0}/{event?.capacity || 100} participants
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`grid gap-3 ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <Link 
            to={`/events/${event?._id}`} 
            className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 text-center hover:border-purple-300 hover:text-purple-700 transition-colors font-medium"
          >
            View Details
          </Link>
          
          {isAdmin && (
            <>
              <Link 
                to={`/events/edit/${event?._id}`} 
                className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 text-center hover:bg-purple-200 transition-colors font-medium"
              >
                Edit
              </Link>
              <Link 
                to={`/events/${event?._id}`} 
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-center hover:bg-slate-200 transition-colors font-medium"
              >
                Students
              </Link>
            </>
          )}
          
          {!isAdmin && (
            <button
              type="button"
              disabled={disableRegister}
              onClick={() => onRegister?.(event)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                disableRegister 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {registering ? 'Registering...' : isRegistered ? 'Registered' : isClosed ? 'Closed' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
