export default function FeatureHighlights({ items }) {
  return (
    <section className="sliit-section py-16">
      <div className="mb-8 max-w-3xl">
        <p className="sliit-pill">Platform Highlights</p>
        <h2 className="sliit-heading mt-5 text-5xl text-slate-950 sm:text-6xl">Everything teams and members need to discover, coordinate, and participate.</h2>
        <p className="mt-4 text-lg leading-8 text-sliit-muted">
          Built to guide members from first discovery to direct team contact, all within a clean and adaptable internal experience.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="sliit-card group animate-fade-up p-6 transition duration-300 hover:-translate-y-1 hover:border-sliit-gold/35 hover:bg-sliit-panel"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <h3 className="mt-5 text-2xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-sliit-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
