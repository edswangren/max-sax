import type { MultipleChoiceOption } from '../types'
import { shuffle } from '../../utils/random'
import { pitchClassToSemitone } from '../../utils/music'

// Canonical pitch-class spellings — flats, no Cb/Fb/E#/B# (those only exist in context).
const CANON = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

export function canonName(semi: number): string {
  return CANON[((semi % 12) + 12) % 12]
}

/** Build a 4-option MC list: the correct answer + up to 3 distinct distractors. */
export function mcFrom(correct: string, candidates: string[]): MultipleChoiceOption[] {
  const distractors = shuffle([...new Set(candidates)].filter((c) => c && c !== correct)).slice(0, 3)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

/** Chromatic + nearby neighbour pitch-class names for plausible note-name distractors. */
export function neighborNames(correct: string, count = 3): string[] {
  const s = pitchClassToSemitone(correct)
  if (s === undefined) return []
  const out: string[] = []
  for (const o of [1, -1, 2, -2, 3, -3, 5, 7]) {
    const nm = canonName(s + o)
    if (nm !== correct && !out.includes(nm)) out.push(nm)
    if (out.length >= count) break
  }
  return out
}

/** Common band keys, for key-name distractors. */
export const KEY_POOL = [
  'C major', 'G major', 'D major', 'A major', 'E major',
  'F major', 'Bb major', 'Eb major', 'Ab major', 'Db major',
]
