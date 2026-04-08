import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pagebg p-6">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-primary opacity-20 mb-4">404</div>
        <div className="font-display text-2xl font-bold text-slate-900 mb-2">Page Not Found</div>
        <p className="text-slate-500 text-sm mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary px-8 py-3 text-sm">← Back to Dashboard</Link>
      </div>
    </div>
  )
}
