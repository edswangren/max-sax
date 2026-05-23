import { Link } from 'react-router-dom'
import { categories, type CategoryId } from '../data/catalog'
import { hasTemplates } from '../templates/registry'
import { getAllProgress } from '../store/progress'
import { pick } from '../utils/random'
import CategoryIcon from './CategoryIcon'

interface CatStyle {
  accent: string        // text + ring
  bg: string            // tinted fill
  border: string
  pill: string          // icon pill bg
  glow: string          // hover glow
}

const STYLES: Record<CategoryId, CatStyle> = {
  'note-reading':  { accent: 'text-brass',     bg: 'bg-brass/10',     border: 'border-brass/35',     pill: 'bg-brass/20 text-brass',         glow: 'hover:shadow-[0_0_28px_rgba(245,181,15,0.32)]' },
  'scales-keys':   { accent: 'text-maroon',    bg: 'bg-maroon/10',    border: 'border-maroon/35',    pill: 'bg-maroon/20 text-maroon',       glow: 'hover:shadow-[0_0_28px_rgba(209,41,50,0.32)]' },
  'rhythm':        { accent: 'text-emerald-go',bg: 'bg-emerald-go/10',border: 'border-emerald-go/35',pill: 'bg-emerald-go/20 text-emerald-go',glow: 'hover:shadow-[0_0_28px_rgba(52,201,126,0.32)]' },
  'fingerings':    { accent: 'text-tangerine', bg: 'bg-tangerine/10', border: 'border-tangerine/35', pill: 'bg-tangerine/20 text-tangerine', glow: 'hover:shadow-[0_0_28px_rgba(251,146,60,0.32)]' },
  'theory-vocab':  { accent: 'text-amethyst',  bg: 'bg-amethyst/10',  border: 'border-amethyst/35',  pill: 'bg-amethyst/20 text-amethyst',   glow: 'hover:shadow-[0_0_28px_rgba(168,85,247,0.32)]' },
  'ear-training':  { accent: 'text-electric', bg: 'bg-electric/10',  border: 'border-electric/35',  pill: 'bg-electric/20 text-electric',   glow: 'hover:shadow-[0_0_28px_rgba(34,211,238,0.32)]' },
}

const greetings = [
  "Let's get it, Max.",
  "Sax time. Pull up the reed.",
  "4th chair? Not for long.",
  "Honors Band 1's secret weapon.",
  "Canyon Ridge in the house.",
  "Daily reps. That's how chairs flip.",
  "Welcome back, legend.",
  "The horn's not gonna play itself.",
]

export default function Landing() {
  const progress = getAllProgress()
  const greeting = pick(greetings)
  const totalPracticed = Object.values(progress).filter((p) => p?.attempted > 0).length

  return (
    <div>
      {/* Hero */}
      <div className="mb-7 animate-pop-in">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-maroon/20 border border-maroon/40 text-maroon text-xs font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-maroon animate-pulse" />
          Canyon Ridge · Honors Band 1
        </div>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-2">{greeting}</h1>
        <p className="text-cream/70 text-sm">
          Pick a category and run some reps. <span className="text-brass font-bold">{totalPracticed}</span>
          <span className="text-cream/50"> of {categories.length} categories practiced.</span>
        </p>
      </div>

      {/* Category grid */}
      <div className="grid gap-4">
        {categories.map((c) => {
          const s = STYLES[c.id]
          const ready = c.topics.filter((t) => hasTemplates(t.id))
          const practiced = c.topics.filter((t) => progress[t.id]?.attempted > 0)
          const total = c.topics.length
          const pct = total > 0 ? (practiced.length / total) * 100 : 0

          return (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className={`group relative block rounded-2xl border ${s.border} ${s.bg} ${s.glow} hover:border-white/35 active:scale-[0.985] transition-all overflow-hidden`}
            >
              <div className="flex items-center gap-4 p-5">
                <div className={`shrink-0 w-14 h-14 rounded-xl ${s.pill} flex items-center justify-center`}>
                  <CategoryIcon catId={c.id} className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`font-black text-xl ${s.accent} leading-tight`}>{c.name}</h2>
                  <p className="text-cream/70 text-sm mt-0.5">{c.tagline}</p>
                  <p className="text-cream/50 text-xs mt-1">
                    {ready.length}/{total} topics ready · {practiced.length} practiced
                  </p>
                </div>
                <span className={`text-2xl ${s.accent} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}>→</span>
              </div>
              {/* progress bar at the bottom edge */}
              <div className="h-1.5 bg-ink-lighter">
                <div
                  className="h-full bg-gradient-to-r from-maroon via-brass to-emerald-go transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 flex gap-6 justify-center text-sm">
        <Link to="/history" className="text-cream/60 hover:text-brass transition-colors">Session History</Link>
        <Link to="/weak-spots" className="text-cream/60 hover:text-maroon transition-colors">Weak Spots</Link>
        <Link to="/settings" className="text-cream/60 hover:text-electric transition-colors">Settings</Link>
      </div>
    </div>
  )
}
