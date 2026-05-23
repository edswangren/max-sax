import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { intervalLongName } from '../../utils/music'

interface Pair { name: string; semis: number }
const ALL: Pair[] = [
  { name: 'm2', semis: 1 }, { name: 'M2', semis: 2 },
  { name: 'm3', semis: 3 }, { name: 'M3', semis: 4 },
  { name: 'P4', semis: 5 }, { name: 'A4', semis: 6 },
  { name: 'P5', semis: 7 },
  { name: 'm6', semis: 8 }, { name: 'M6', semis: 9 },
  { name: 'm7', semis: 10 }, { name: 'M7', semis: 11 },
  { name: 'P8', semis: 12 },
]

function poolFor(d: Difficulty): Pair[] {
  if (d === 'easy')   return ALL.filter((x) => ['P5','P8','M3','M2'].includes(x.name))
  if (d === 'medium') return ALL.filter((x) => ['m3','M3','P4','P5','m6','M6','P8'].includes(x.name))
  return ALL
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = poolFor(d)
  const p = pick(pool)
  const notes = [
    { midi: 60, durationMs: 600 },
    { midi: 60 + p.semis, durationMs: 600 },
  ]
  const choicesPool = shuffle(pool).slice(0, 4)
  if (!choicesPool.find((x) => x.name === p.name)) choicesPool[0] = p
  return {
    questionText: 'Name the interval (ascending).',
    correctAnswer: p.name,
    answerFormat: 'multiple-choice',
    choices: shuffle(choicesPool).map((x) => ({ label: `${x.name} (${intervalLongName(x.name)})`, value: x.name })),
    audioSpec: { notes, gapMs: 60 },
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `et-all-intervals-${d}`,
  topicId: 'et-all-intervals',
  category: 'ear-training',
  title: 'All intervals',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
