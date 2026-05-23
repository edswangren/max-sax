import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Pair { name: string; semis: number; label: string }
const PAIRS: Pair[] = [
  { name: 'P4',  semis: 5,  label: 'P4 (Perfect 4th)' },
  { name: 'P5',  semis: 7,  label: 'P5 (Perfect 5th)' },
  { name: 'P8',  semis: 12, label: 'P8 (Octave)' },
]

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? PAIRS.filter((p) => p.name !== 'P4') : PAIRS
  const p = pick(pool)
  const notes = [
    { midi: 60, durationMs: 700 },
    { midi: 60 + p.semis, durationMs: 700 },
  ]
  return {
    questionText: 'Which perfect interval is this?',
    correctAnswer: p.name,
    answerFormat: 'multiple-choice',
    choices: shuffle(PAIRS).map((x) => ({ label: x.label, value: x.name })),
    audioSpec: { notes, gapMs: 50 },
    hint: d === 'easy' ? 'P5 sounds "open / hollow". Octave sounds like "the same note".' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `et-perfect-${d}`,
  topicId: 'et-perfect',
  category: 'ear-training',
  title: 'Perfect intervals',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
