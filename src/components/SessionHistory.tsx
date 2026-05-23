import { Link } from 'react-router-dom'
import { getSessions } from '../store/sessions'
import { getTopic } from '../data/catalog'

export default function SessionHistory() {
  const sessions = getSessions().slice().reverse()

  return (
    <div>
      <Link to="/" className="text-brass text-sm hover:underline mb-4 inline-block">&larr; Home</Link>
      <h1 className="text-2xl font-black mb-6">Session History</h1>

      {sessions.length === 0 ? (
        <p className="text-cream/70 text-center py-12">
          No sessions yet. <Link to="/" className="text-brass hover:underline">Go practice!</Link>
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-lighter text-left text-cream/70">
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Topic</th>
                <th className="pb-2 pr-4">Difficulty</th>
                <th className="pb-2 pr-4 text-right">Score</th>
                <th className="pb-2 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const pct = Math.round((s.correct / s.totalProblems) * 100)
                const date = new Date(s.date)
                const topic = getTopic(s.topicId)
                return (
                  <tr key={s.id} className="border-b border-ink-lighter/50">
                    <td className="py-2 pr-4 text-cream/70">
                      {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2 pr-4">
                      <Link to={`/practice/${s.topicId}`} className="text-brass hover:underline">
                        {topic?.title ?? s.topicId}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 capitalize text-cream/70">{s.difficulty}</td>
                    <td className="py-2 pr-4 text-right font-mono text-white">{s.correct}/{s.totalProblems}</td>
                    <td className="py-2 text-right">
                      <span className={`font-bold ${
                        pct >= 80 ? 'text-emerald-go' : pct >= 60 ? 'text-amber-400' : 'text-maroon'
                      }`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
