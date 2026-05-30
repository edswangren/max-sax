import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

// Mirror of fg-low — the student picks the FINGERING for a given note name.
const EASY  = ['G4', 'A4', 'B4', 'C5', 'D4', 'E4', 'F4']
const MID   = [...EASY, 'C4', 'Bb4', 'F#4', 'G#4']
const HARD  = [...MID, 'Bb3', 'B3', 'C#4', 'Eb4']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY : d === 'medium' ? MID : HARD
  const target = pick(pool)
  const pc = pcOf(target)
  // Distractors: other notes in this range that have a different pitch class.
  const distractorPool = pool.filter((n) => pcOf(n) !== pc)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([target, ...distractors]).map((v) => ({ label: pcOf(v), value: v }))
  return {
    questionText: `Pick the fingering for ${pc}.`,
    correctAnswer: target,
    answerFormat: 'fingering-pick',
    choices,
    hint: d === 'easy' ? 'Filled circles = pressed keys.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `fg-note-to-fingering-low-${d}`,
  topicId: 'fg-note-to-fingering-low',
  category: 'fingerings',
  title: 'Note → fingering (low end)',
  difficulty: d,
  answerFormat: 'fingering-pick',
  generate: () => makeProblem(d),
}))
