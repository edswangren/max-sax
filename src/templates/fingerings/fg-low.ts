import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

// Low-end range: low Bb3 through middle C5 (no octave key)
const EASY  = ['G4', 'A4', 'B4', 'C5', 'D4', 'E4', 'F4']
const MID   = [...EASY, 'C4', 'Bb4', 'F#4', 'G#4']
const HARD  = [...MID, 'Bb3', 'B3', 'C#4', 'Eb4']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY : d === 'medium' ? MID : HARD
  const note = pick(pool)
  const pc = pcOf(note)
  const distractorPool = [...new Set((d === 'easy' ? EASY : MID).map(pcOf))].filter((p) => p !== pc)
  const distractors = shuffle(distractorPool).slice(0, 5)
  const choices = shuffle([pc, ...distractors]).map((p) => ({ label: p, value: p }))
  return {
    questionText: 'Which note does this fingering play?',
    correctAnswer: pc,
    answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
    choices: d === 'hard' ? undefined : choices,
    fingeringSpec: { note },
    hint: d === 'easy' ? 'Filled circles = pressed keys.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `fg-low-${d}`,
  topicId: 'fg-low',
  category: 'fingerings',
  title: 'Low-end fingerings',
  difficulty: d,
  answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
  generate: () => makeProblem(d),
}))
