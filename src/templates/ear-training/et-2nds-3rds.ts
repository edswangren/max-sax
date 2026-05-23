import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

const SECONDS = [1, 2]   // m2, M2
const THIRDS  = [3, 4]   // m3, M3

function makeProblem(d: Difficulty): GeneratedProblem {
  const isThird = Math.random() < 0.5
  const pool = isThird ? THIRDS : SECONDS
  const sep = pick(pool)
  // Restrict pool by difficulty (easy = no minor/major mix complications)
  const adjSep = d === 'easy' ? (isThird ? 4 : 2) : sep
  const base = 60
  const notes = [
    { midi: base, durationMs: 600 },
    { midi: base + adjSep, durationMs: 600 },
  ]
  return {
    questionText: 'Is this a 2nd or a 3rd?',
    correctAnswer: isThird ? '3rd' : '2nd',
    answerFormat: 'multiple-choice',
    choices: shuffle([
      { label: '2nd', value: '2nd' },
      { label: '3rd', value: '3rd' },
    ]),
    audioSpec: { notes, gapMs: 60 },
    hint: d === 'easy' ? '2nds sound right next to each other; 3rds skip a step.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `et-2nds-3rds-${d}`,
  topicId: 'et-2nds-3rds',
  category: 'ear-training',
  title: '2nds vs 3rds',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
