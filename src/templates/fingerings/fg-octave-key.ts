import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

// Octave-key range: D5 through C6
const EASY = ['D5', 'E5', 'G5', 'A5', 'B5']
const MID  = [...EASY, 'F5', 'C6', 'Bb5']
const HARD = [...MID, 'Eb5', 'G#5', 'F#5', 'C#6']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY : d === 'medium' ? MID : HARD
  const note = pick(pool)
  const pc = pcOf(note)
  const distractorPool = [...new Set((d === 'easy' ? EASY : MID).map(pcOf))].filter((p) => p !== pc)
  const distractors = shuffle(distractorPool).slice(0, 5)
  const choices = shuffle([pc, ...distractors]).map((p) => ({ label: p, value: p }))
  return {
    questionText: 'Which note does this fingering play? (Octave key included.)',
    correctAnswer: pc,
    answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
    choices: d === 'hard' ? undefined : choices,
    fingeringSpec: { note },
    hint: d === 'easy' ? 'Top-left circle = octave key.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `fg-octave-key-${d}`,
  topicId: 'fg-octave-key',
  category: 'fingerings',
  title: 'Octave-key range',
  difficulty: d,
  answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
  generate: () => makeProblem(d),
}))
