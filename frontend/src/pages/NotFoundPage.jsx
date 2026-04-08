<<<<<<< HEAD
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pagebg p-6">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-primary opacity-20 mb-4">404</div>
        <div className="font-display text-2xl font-bold text-slate-900 mb-2">Page Not Found</div>
        <p className="text-slate-500 text-sm mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary px-8 py-3 text-sm">← Back to Dashboard</Link>
=======
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage(){
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pagebg p-6">
      <div className="card text-center max-w-md">
        <h2 className="text-3xl font-bold text-primary">404</h2>
        <p className="mt-2 text-[#6f675d]">Page not found</p>
        <div className="mt-4">
          <Link to="/" className="btn-primary">Go home</Link>
        </div>
>>>>>>> origin/main
      </div>
    </div>
  )
}
