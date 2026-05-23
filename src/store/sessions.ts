import type { Difficulty } from '../templates/types'

export interface Mistake {
  userAnswer: string
  correctAnswer: string
}

export interface Session {
  id: string
  date: string
  topicId: string
  difficulty: Difficulty
  totalProblems: number
  correct: number
  mistakes: Mistake[]
}

interface SessionStore {
  version: 1
  sessions: Session[]
}

const STORAGE_KEY = 'maxsax-sessions'

function load(): SessionStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { version: 1, sessions: [] }
}

function save(store: SessionStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function saveSession(session: Omit<Session, 'id' | 'date'>): Session {
  const store = load()
  const full: Session = {
    ...session,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  }
  store.sessions.push(full)
  save(store)
  return full
}

export function getSessions(): Session[] {
  return load().sessions
}
