import { useParams, Link } from 'react-router-dom'
import { getCategory } from '../data/catalog'
import { hasTemplates } from '../templates/registry'
import { getAccuracy } from '../store/progress'

export default function TopicList() {
  const { catId = '' } = useParams()
  const cat = getCategory(catId)

  if (!cat) {
    return <p className="text-center text-cream/70 py-12">Category not found.</p>
  }

  return (
    <div>
      <Link to="/" className="text-brass text-sm hover:underline mb-4 inline-block">&larr; All categories</Link>
      <h1 className="text-2xl font-black mb-1">{cat.name}</h1>
      <p className="text-sm text-cream/70 mb-6">{cat.tagline}</p>

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
                  <span className="bg-brass text-ink font-bold px-3 py-1 rounded-lg text-sm">Go</span>
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
              className={`${base} cursor-pointer hover:border-brass/50 hover:shadow-[0_0_18px_rgba(212,160,23,0.25)] active:scale-[0.97]`}
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
