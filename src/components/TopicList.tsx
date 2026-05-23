import { useParams, Link } from 'react-router-dom'
import { getCategory, type CategoryId } from '../data/catalog'
import { hasTemplates } from '../templates/registry'
import { getAccuracy } from '../store/progress'
import CategoryIcon from './CategoryIcon'

const CAT_ACCENT: Record<CategoryId, { text: string; glow: string; pill: string }> = {
  'note-reading':  { text: 'text-brass',     glow: 'hover:shadow-[0_0_22px_rgba(245,181,15,0.28)] hover:border-brass/50',         pill: 'bg-brass/20 text-brass' },
  'scales-keys':   { text: 'text-maroon',    glow: 'hover:shadow-[0_0_22px_rgba(209,41,50,0.28)] hover:border-maroon/50',         pill: 'bg-maroon/20 text-maroon' },
  'rhythm':        { text: 'text-emerald-go',glow: 'hover:shadow-[0_0_22px_rgba(52,201,126,0.28)] hover:border-emerald-go/50',    pill: 'bg-emerald-go/20 text-emerald-go' },
  'fingerings':    { text: 'text-tangerine', glow: 'hover:shadow-[0_0_22px_rgba(251,146,60,0.28)] hover:border-tangerine/50',     pill: 'bg-tangerine/20 text-tangerine' },
  'theory-vocab':  { text: 'text-amethyst',  glow: 'hover:shadow-[0_0_22px_rgba(168,85,247,0.28)] hover:border-amethyst/50',      pill: 'bg-amethyst/20 text-amethyst' },
  'ear-training':  { text: 'text-electric',  glow: 'hover:shadow-[0_0_22px_rgba(34,211,238,0.28)] hover:border-electric/50',      pill: 'bg-electric/20 text-electric' },
}

export default function TopicList() {
  const { catId = '' } = useParams()
  const cat = getCategory(catId)

  if (!cat) {
    return <p className="text-center text-cream/70 py-12">Category not found.</p>
  }

  const accent = CAT_ACCENT[cat.id]

  return (
    <div>
      <Link to="/" className={`${accent.text} text-sm hover:underline mb-4 inline-block`}>&larr; All categories</Link>

      <div className="flex items-center gap-3 mb-4">
        <div className={`shrink-0 w-12 h-12 rounded-xl ${accent.pill} flex items-center justify-center`}>
          <CategoryIcon catId={cat.id} className="w-6 h-6" />
        </div>
        <div>
          <h1 className={`text-2xl font-black ${accent.text} leading-tight`}>{cat.name}</h1>
          <p className="text-sm text-cream/70">{cat.tagline}</p>
        </div>
      </div>

      <div className="grid gap-3">
        {cat.topics.map((t) => {
          const ready = hasTemplates(t.id)
          const accuracy = getAccuracy(t.id)

          const inner = (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-bold">{t.title}</span>
                </div>
                <p className="text-xs text-cream/60 mt-1 truncate">{t.blurb}</p>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                {accuracy !== null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    accuracy >= 80 ? 'bg-emerald-go/20 text-emerald-go' :
                    accuracy >= 60 ? 'bg-amber-400/20 text-amber-400' :
                    'bg-maroon/20 text-maroon'
                  }`}>
                    {accuracy}%
                  </span>
                )}
                {ready ? (
                  <span className="bg-brass text-ink font-bold px-3 py-1 rounded-lg text-sm shadow-[0_0_10px_rgba(245,181,15,0.5)]">Go</span>
                ) : (
                  <span className="text-xs text-cream/40 italic">Soon</span>
                )}
              </div>
            </>
          )

          const base = "border border-ink-lighter rounded-xl p-4 bg-ink-light flex items-center justify-between transition-all duration-150"
          return ready ? (
            <Link
              key={t.id}
              to={`/practice/${t.id}`}
              className={`${base} cursor-pointer ${accent.glow} active:scale-[0.97]`}
            >
              {inner}
            </Link>
          ) : (
            <div key={t.id} className={`${base} opacity-60`}>{inner}</div>
          )
        })}
      </div>
    </div>
  )
}
