import { Link } from 'react-router-dom'

export default function CTABanner() {
  return (
    <section className="sliit-section py-4">
      <div className="overflow-hidden rounded-[2rem] border border-sliit-gold/30 bg-gradient-to-r from-sliit-soft via-sliit-panel to-sliit-gold/15 p-6 shadow-gold-glow sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="sliit-pill">Module Workflow</p>
            <h2 className="sliit-heading mt-5 text-4xl text-white sm:text-5xl">
              Need to create or update records? Use the dashboard forms instead of editing code.
            </h2>
            <p className="mt-4 text-base leading-7 text-sliit-muted">
              Sports, clubs, matches, players, facilities, and inquiries are now backed by the API so the module can adapt to any organization.
            </p>
          </div>

          <Link to="/dashboard/module/directory#sports" className="sliit-button-primary whitespace-nowrap">
            Manage Directory
          </Link>
        </div>
      </div>
    </section>
  )
}
