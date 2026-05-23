import { Link } from 'react-router-dom'
import { categories, type CategoryId } from '../data/catalog'
import { hasTemplates } from '../templates/registry'
import { getAllProgress } from '../store/progress'
import { pick } from '../utils/random'
import CategoryIcon from './CategoryIcon'
import EagleLogo from './EagleLogo'

interface CatStyle {
  accent: string
  bg: string
  border: string
  pill: string
  glow: string
}

const STYLES: Record<CategoryId, CatStyle> = {
  'note-reading':  { accent: 'text-brass',     bg: 'bg-brass/10',     border: 'border-brass/40',     pill: 'bg-brass/20 text-brass',         glow: 'hover:shadow-[0_0_28px_rgba(245,181,15,0.35)]' },
  'scales-keys':   { accent: 'text-royal-glow',bg: 'bg-royal/15',     border: 'border-royal/50',     pill: 'bg-royal/25 text-royal-glow',     glow: 'hover:shadow-[0_0_28px_rgba(29,78,216,0.4)]' },
  'rhythm':        { accent: 'text-emerald-go',bg: 'bg-emerald-go/10',border: 'border-emerald-go/35',pill: 'bg-emerald-go/20 text-emerald-go',glow: 'hover:shadow-[0_0_28px_rgba(52,201,126,0.32)]' },
  'fingerings':    { accent: 'text-tangerine', bg: 'bg-tangerine/10', border: 'border-tangerine/35', pill: 'bg-tangerine/20 text-tangerine',  glow: 'hover:shadow-[0_0_28px_rgba(251,146,60,0.32)]' },
  'theory-vocab':  { accent: 'text-amethyst',  bg: 'bg-amethyst/10',  border: 'border-amethyst/35',  pill: 'bg-amethyst/20 text-amethyst',    glow: 'hover:shadow-[0_0_28px_rgba(168,85,247,0.32)]' },
  'ear-training':  { accent: 'text-electric',  bg: 'bg-electric/10',  border: 'border-electric/35',  pill: 'bg-electric/20 text-electric',    glow: 'hover:shadow-[0_0_28px_rgba(34,211,238,0.32)]' },
}

const greetings = [
  "Let's get it, Max.",
  "Sax time. Pull up the reed.",
  "4th chair? Not for long.",
  "Honor Band 1's secret weapon.",
  "Cougars... wait, Eagles. In the house.",
  "Daily reps. That's how chairs flip.",
  "Welcome back, legend.",
  "The horn's not gonna play itself.",
  "TBA Exemplary band has standards. Match 'em.",
]

export default function Landing() {
  const progress = getAllProgress()
  const greeting = pick(greetings)
  const totalPracticed = Object.values(progress).filter((p) => p?.attempted > 0).length

  return (
    <div>
      {/* School pride banner — Canyon Ridge Golden Eagles + Honor Band */}
      <div className="mb-6 rounded-2xl overflow-hidden border-2 border-brass/60 shadow-[0_0_32px_rgba(29,78,216,0.3)] animate-pop-in">
        <div className="bg-gradient-to-br from-royal-dim via-royal to-royal-glow p-5 flex items-center gap-4 relative">
          {/* Subtle gold piping at top and bottom — band-uniform vibe */}
          <div className="absolute inset-x-0 top-0 h-1 bg-brass" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-brass" />

          <EagleLogo size={64} variant="gold" className="shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
          <div className="min-w-0">
            <p className="text-brass text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] leading-none">
              Canyon Ridge Middle School
            </p>
            <h2 className="text-white text-xl sm:text-2xl font-black leading-tight mt-0.5">
              <span className="text-brass">Golden</span> Eagles Band
            </h2>
            <p className="text-brass-glow text-xs sm:text-sm font-bold mt-0.5">
              Honor Band 1 · 6th grade
            </p>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-6">
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
              {/* Royal+gold progress bar — school colors */}
              <div className="h-1.5 bg-ink-lighter">
                <div
                  className="h-full bg-gradient-to-r from-royal via-brass to-brass-glow transition-all"
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
        <Link to="/settings" className="text-cream/60 hover:text-royal-glow transition-colors">Settings</Link>
      </div>
    </div>
  )
}
