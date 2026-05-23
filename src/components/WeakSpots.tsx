import { Link } from 'react-router-dom'
import { getWeakSpots } from '../store/weakspots'
import { getTopic } from '../data/catalog'

export default function WeakSpots() {
  const spots = getWeakSpots(10)

  return (
    <div>
      <Link to="/" className="text-brass text-sm hover:underline mb-4 inline-block">&larr; Home</Link>
      <h1 className="text-2xl font-black mb-2">Weak Spots</h1>
      <p className="text-sm text-cream/70 mb-6">Topics that keep tripping you up. Time for revenge.</p>

      {spots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-cream/70 text-lg">No weak spots yet.</p>
          <p className="text-cream/50 text-sm mt-1">Either you haven't practiced or you're just built different.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {spots.map((s) => {
            const topic = getTopic(s.topicId)
            const pct = Math.round(s.errorRate * 100)
            return (
              <div key={s.topicId} className="border border-maroon/30 rounded-xl p-4 bg-maroon/5 flex items-center justify-between">
                <div>
                  <span className="text-sm text-white font-bold">{topic?.title ?? s.topicId}</span>
                  <p className="text-xs text-cream/70 mt-1">
                    {s.errorCount} errors / {s.totalSeen} seen &middot;{' '}
                    <span className="text-maroon font-bold">{pct}% error rate</span>
                  </p>
                </div>
                <Link
                  to={`/practice/${s.topicId}`}
                  className="bg-maroon text-white font-bold px-3 py-1 rounded-lg text-sm hover:bg-maroon-dim transition-colors shrink-0"
                >
                  Fix it
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
