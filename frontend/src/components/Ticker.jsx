const items = [
  'Semester 2 registration closes April 15 — do not miss the deadline',
  'Faculty of Engineering Open Day — Saturday, April 5 at 9:00 AM',
  'Library extended hours: Monday–Friday, 7:00 AM–11:00 PM during exam period',
  'New sports complex inauguration ceremony — March 30 at Main Campus',
  'Scholarship applications for 2025/26 now open — visit the Financial Aid Office',
]

export default function Ticker() {
  const doubled = [...items, ...items]

  return (
    <div className="bg-primary h-8 flex items-center overflow-hidden border-b-2 border-unigreen">
      <div className="bg-unigreen text-white text-[9.5px] font-extrabold tracking-[.08em] uppercase px-4 h-full flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
        ⚡ Live
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex ticker-scroll whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="px-8 text-xs text-white/85">
              <span className="text-accent mr-2 text-[7px] align-middle">●</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
