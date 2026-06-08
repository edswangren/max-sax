// One-time localStorage migration: the old "Note Reading" strand was replaced
// by "Sight Reading". Remap progress/session topicIds so History and Weak Spots
// don't render orphaned nr-* rows. Runs once, guarded by a flag.

const FLAG = 'maxsax-migrated-sight-reading'
const PROGRESS_KEY = 'maxsax-progress'
const SESSIONS_KEY = 'maxsax-sessions'

// null = drop (trivial topics with no sight-reading equivalent).
const REMAP: Record<string, string | null> = {
  'nr-phrase': 'sr-melody',
  'nr-phrase-sequence': 'sr-line',
  'nr-pattern-id': 'sr-patterns',
  'nr-in-key': 'sr-in-context',
  'nr-courtesy-accidental': 'sr-in-context',
  'nr-ledger-below': 'sr-range',
  'nr-above-staff': 'sr-range',
  'nr-palm-keys': 'sr-range',
  'nr-altissimo': 'sr-range',
  'nr-lines': null,
  'nr-spaces': null,
  'nr-mixed': null,
}

interface DiffStats { attempted: number; correct: number }
interface TopicProgress {
  attempted: number; correct: number; lastPracticed: string; bestStreak: number
  byDifficulty: Record<string, DiffStats>
  bestTimeMs?: number; avgTimeMs?: number; timedCorrect?: number
}

function mergeProgress(a: TopicProgress, b: TopicProgress): TopicProgress {
  const byDifficulty: Record<string, DiffStats> = { ...a.byDifficulty }
  for (const [d, s] of Object.entries(b.byDifficulty ?? {})) {
    const cur = byDifficulty[d] ?? { attempted: 0, correct: 0 }
    byDifficulty[d] = { attempted: cur.attempted + s.attempted, correct: cur.correct + s.correct }
  }
  return {
    attempted: a.attempted + b.attempted,
    correct: a.correct + b.correct,
    lastPracticed: a.lastPracticed > b.lastPracticed ? a.lastPracticed : b.lastPracticed,
    bestStreak: Math.max(a.bestStreak, b.bestStreak),
    byDifficulty,
    bestTimeMs: [a.bestTimeMs, b.bestTimeMs].filter((v): v is number => v != null).reduce((m, v) => Math.min(m, v), Infinity) || undefined,
  }
}

function migrateProgress() {
  const raw = localStorage.getItem(PROGRESS_KEY)
  if (!raw) return
  const store = JSON.parse(raw) as { version: number; byTopic: Record<string, TopicProgress> }
  const next: Record<string, TopicProgress> = {}
  for (const [topicId, prog] of Object.entries(store.byTopic ?? {})) {
    const mapped = topicId in REMAP ? REMAP[topicId] : topicId
    if (mapped == null) continue // dropped
    next[mapped] = next[mapped] ? mergeProgress(next[mapped], prog) : prog
  }
  store.byTopic = next
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store))
}

function migrateSessions() {
  const raw = localStorage.getItem(SESSIONS_KEY)
  if (!raw) return
  const store = JSON.parse(raw) as { version: number; sessions: { topicId: string }[] }
  store.sessions = (store.sessions ?? [])
    .map((s) => {
      const mapped = s.topicId in REMAP ? REMAP[s.topicId] : s.topicId
      return mapped == null ? null : { ...s, topicId: mapped }
    })
    .filter((s): s is { topicId: string } => s !== null)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(store))
}

export function runMigrations(): void {
  try {
    if (localStorage.getItem(FLAG)) return
    migrateProgress()
    migrateSessions()
    localStorage.setItem(FLAG, '1')
  } catch { /* ignore — never block app boot on migration */ }
}
