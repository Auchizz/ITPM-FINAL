import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage(){
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pagebg p-6">
      <div className="card text-center max-w-md">
        <h2 className="text-3xl font-bold">404</h2>
        <p className="mt-2 text-slate-600">Page not found</p>
        <div className="mt-4">
          <Link to="/" className="btn-primary">Go home</Link>
        </div>
      </div>
    </div>
  )
}
