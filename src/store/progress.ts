import type { Difficulty } from '../templates/types'

interface DifficultyStats {
  attempted: number
  correct: number
}

interface TopicProgress {
  attempted: number
  correct: number
  lastPracticed: string
  bestStreak: number
  byDifficulty: Partial<Record<Difficulty, DifficultyStats>>
}

interface ProgressStore {
  version: 1
  byTopic: Record<string, TopicProgress>
}

const STORAGE_KEY = 'maxsax-progress'

function load(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { version: 1, byTopic: {} }
}

function save(store: ProgressStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function getProgress(topicId: string): TopicProgress | undefined {
  return load().byTopic[topicId]
}

export function getAllProgress(): Record<string, TopicProgress> {
  return load().byTopic
}

export function recordSession(
  topicId: string,
  difficulty: Difficulty,
  attempted: number,
  correct: number,
) {
  const store = load()
  const existing = store.byTopic[topicId] ?? {
    attempted: 0,
    correct: 0,
    lastPracticed: '',
    bestStreak: 0,
    byDifficulty: {},
  }

  existing.attempted += attempted
  existing.correct += correct
  existing.lastPracticed = new Date().toISOString()
  if (correct > existing.bestStreak) existing.bestStreak = correct

  const diffStats = existing.byDifficulty[difficulty] ?? { attempted: 0, correct: 0 }
  diffStats.attempted += attempted
  diffStats.correct += correct
  existing.byDifficulty[difficulty] = diffStats

  store.byTopic[topicId] = existing
  save(store)
}

export function getAccuracy(topicId: string): number | null {
  const p = getProgress(topicId)
  if (!p || p.attempted === 0) return null
  return Math.round((p.correct / p.attempted) * 100)
}
