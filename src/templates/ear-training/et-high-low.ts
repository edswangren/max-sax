import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

function gap(d: Difficulty): number {
  // semitone separation
  if (d === 'easy') return pick([12, 14, 16, 19])    // octave or wider
  if (d === 'medium') return pick([5, 6, 7, 8, 9])   // 4th to 6th
  return pick([1, 2, 3, 4])                          // 2nd to 4th
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const base = 60 // C4
  const sep = gap(d)
  const firstHigher = Math.random() < 0.5
  const a = base
  const b = base + sep
  const notes = firstHigher
    ? [{ midi: b, durationMs: 700 }, { midi: a, durationMs: 700 }]
    : [{ midi: a, durationMs: 700 }, { midi: b, durationMs: 700 }]
  const correct = firstHigher ? 'first' : 'second'
  return {
    questionText: 'Which note is higher — the 1st or the 2nd?',
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: [
      { label: '1st note', value: 'first' },
      { label: '2nd note', value: 'second' },
    ],
    audioSpec: { notes, gapMs: 80 },
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `et-high-low-${d}`,
  topicId: 'et-high-low',
  category: 'ear-training',
  title: 'High vs low',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
