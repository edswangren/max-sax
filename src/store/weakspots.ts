import { getSessions } from './sessions'

export interface WeakSpot {
  topicId: string
  errorCount: number
  totalSeen: number
  errorRate: number
}

export function getWeakSpots(limit = 10): WeakSpot[] {
  const sessions = getSessions()
  const errorMap = new Map<string, { errors: number; total: number }>()

  for (const session of sessions) {
    const entry = errorMap.get(session.topicId) ?? { errors: 0, total: 0 }
    entry.errors += session.mistakes.length
    entry.total += session.totalProblems
    errorMap.set(session.topicId, entry)
  }

  return [...errorMap.entries()]
    .map(([topicId, data]) => ({
      topicId,
      errorCount: data.errors,
      totalSeen: data.total,
      errorRate: data.total > 0 ? data.errors / data.total : 0,
    }))
    .filter((w) => w.errorCount > 0)
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, limit)
}
