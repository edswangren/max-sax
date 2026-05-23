import { Link } from 'react-router-dom'
import { categories } from '../data/catalog'
import { hasTemplates } from '../templates/registry'
import { getAllProgress } from '../store/progress'
import { pick } from '../utils/random'

const categoryColors: { border: string; accent: string }[] = [
  { border: 'border-brass/40',         accent: 'text-brass' },
  { border: 'border-maroon/40',        accent: 'text-maroon' },
  { border: 'border-emerald-go/40',    accent: 'text-emerald-go' },
  { border: 'border-amber-400/40',     accent: 'text-amber-400' },
  { border: 'border-purple-400/40',    accent: 'text-purple-400' },
  { border: 'border-sky-400/40',       accent: 'text-sky-400' },
]

const greetings = [
  "Let's get it, Max.",
  "Sax time. Pull up the reed.",
  "4th chair? Not for long.",
  "Honors Band 1 in the house.",
  "Canyon Ridge's secret weapon checking in.",
  "Bro woke up and chose practice.",
  "Welcome back, legend.",
  "Daily reps. That's how chairs flip.",
]

export default function Landing() {
  const progress = getAllProgress()
  const greeting = pick(greetings)

  return (
    <div>
      <h1 className="text-3xl font-black mb-1">{greeting}</h1>
      <p className="text-cream/70 text-sm mb-8">Pick a category and run some reps.</p>
      <div className="grid gap-5">
        {categories.map((c, idx) => {
          const colors = categoryColors[idx % categoryColors.length]
          const ready = c.topics.filter((t) => hasTemplates(t.id))
          const practiced = c.topics.filter((t) => progress[t.id]?.attempted > 0)
          const total = c.topics.length
          const pct = total > 0 ? (practiced.length / total) * 100 : 0

          return (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className={`border rounded-xl p-5 bg-ink-light ${colors.border} hover:border-white/40 transition-all block group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`font-bold text-lg ${colors.accent}`}>{c.name}</h2>
                  <p className="text-cream/70 text-sm">{c.tagline}</p>
                  <p className="text-cream/50 text-xs mt-1">
                    {ready.length}/{total} topics ready &middot; {practiced.length} practiced
                  </p>
                </div>
                <span className="text-cream/60 group-hover:text-white text-xl transition-colors">&rarr;</span>
              </div>
              <div className="mt-3 h-2 bg-ink-lighter rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-maroon to-brass rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 flex gap-6 justify-center">
        <Link to="/history" className="text-sm text-cream/60 hover:text-brass transition-colors">Session History</Link>
        <Link to="/weak-spots" className="text-sm text-cream/60 hover:text-maroon transition-colors">Weak Spots</Link>
        <Link to="/settings" className="text-sm text-cream/60 hover:text-brass transition-colors">Settings</Link>
      </div>
    </div>
  )
}
