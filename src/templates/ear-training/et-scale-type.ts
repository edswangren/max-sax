import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface ScaleType { name: string; intervals: number[]; label: string }
const TYPES: ScaleType[] = [
  { name: 'Major',         intervals: [0,2,4,5,7,9,11,12],         label: 'Major (do re mi…)' },
  { name: 'Natural Minor', intervals: [0,2,3,5,7,8,10,12],         label: 'Natural Minor (sad)' },
  { name: 'Chromatic',     intervals: [0,1,2,3,4,5,6,7,8,9,10,11,12], label: 'Chromatic (every half-step)' },
  { name: 'Whole Tone',    intervals: [0,2,4,6,8,10,12],           label: 'Whole Tone (dreamy)' },
]

function poolFor(d: Difficulty): ScaleType[] {
  if (d === 'easy')   return TYPES.filter((t) => ['Major','Natural Minor'].includes(t.name))
  if (d === 'medium') return TYPES.filter((t) => ['Major','Natural Minor','Chromatic'].includes(t.name))
  return TYPES
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = poolFor(d)
  const t = pick(pool)
  // Scale-type fingerprint shouldn't depend on the root; vary it so the student
  // can't memorize C-only patterns.
  const topInterval = t.intervals[t.intervals.length - 1]
  const rootChoices = [50, 52, 55, 57, 60, 62, 65, 67].filter((r) => r + topInterval <= 84)
  const root = pick(rootChoices.length ? rootChoices : [60])
  const notes = t.intervals.map((semi) => ({ midi: root + semi, durationMs: 320 }))
  return {
    questionText: 'What kind of scale is this?',
    correctAnswer: t.name,
    answerFormat: 'multiple-choice',
    choices: shuffle(TYPES).map((x) => ({ label: x.label, value: x.name })),
    audioSpec: { notes, gapMs: 0 },
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `et-scale-type-${d}`,
  topicId: 'et-scale-type',
  category: 'ear-training',
  title: 'Scale type by ear',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
