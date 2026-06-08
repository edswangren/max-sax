import { describe, it, expect, beforeEach, vi } from 'vitest'
import { runMigrations } from '../store/migrate'

const PROGRESS_KEY = 'maxsax-progress'
const SESSIONS_KEY = 'maxsax-sessions'
const FLAG = 'maxsax-migrated-sight-reading'

function mockStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => { m.set(k, String(v)) },
    removeItem: (k: string) => { m.delete(k) },
    clear: () => m.clear(),
    key: (i: number) => [...m.keys()][i] ?? null,
    get length() { return m.size },
  }
}

function tp(attempted: number, correct: number) {
  return { attempted, correct, lastPracticed: '2026-01-01', bestStreak: correct, byDifficulty: {} }
}

describe('note-reading → sight-reading migration', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', mockStorage())
  })

  it('remaps moved topics, merges collisions, drops trivial ones', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      version: 1,
      byTopic: {
        'nr-phrase': tp(10, 8),          // → sr-melody
        'nr-ledger-below': tp(10, 5),    // → sr-range
        'nr-above-staff': tp(20, 12),    // → sr-range (merge)
        'nr-lines': tp(10, 9),           // dropped
        'sk-keysig-flats': tp(10, 7),    // untouched
      },
    }))
    localStorage.setItem(SESSIONS_KEY, JSON.stringify({
      version: 1,
      sessions: [
        { id: 'a', topicId: 'nr-phrase' },
        { id: 'b', topicId: 'nr-lines' },   // dropped
        { id: 'c', topicId: 'sk-keysig-flats' },
      ],
    }))

    runMigrations()

    const prog = JSON.parse(localStorage.getItem(PROGRESS_KEY)!).byTopic
    expect(prog['nr-phrase']).toBeUndefined()
    expect(prog['nr-lines']).toBeUndefined()
    expect(prog['sr-melody']).toEqual(tp(10, 8))
    // sr-range merged from ledger-below + above-staff
    expect(prog['sr-range'].attempted).toBe(30)
    expect(prog['sr-range'].correct).toBe(17)
    expect(prog['sk-keysig-flats']).toEqual(tp(10, 7))

    const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY)!).sessions
    expect(sessions.map((s: { topicId: string }) => s.topicId).sort())
      .toEqual(['sk-keysig-flats', 'sr-melody'])

    expect(localStorage.getItem(FLAG)).toBe('1')
  })

  it('is a no-op on second run', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, byTopic: { 'nr-phrase': tp(10, 8) } }))
    runMigrations() // migrates
    runMigrations() // flag set → skip
    const prog = JSON.parse(localStorage.getItem(PROGRESS_KEY)!).byTopic
    expect(prog['sr-melody']).toBeDefined()
    expect(Object.keys(prog)).toEqual(['sr-melody'])
  })
})
