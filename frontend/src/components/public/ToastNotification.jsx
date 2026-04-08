export default function ToastNotification({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-24 z-[70] w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-sliit-gold/40 bg-[#0c1528] px-4 py-3 text-sm text-white shadow-gold-glow"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-sliit-gold">✓</span>
        <p className="leading-6">{message}</p>
      </div>
    </div>
  )
}
