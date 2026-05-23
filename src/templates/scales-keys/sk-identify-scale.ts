import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { buildScale } from '../../utils/music'

const EASY_ROOTS = ['C', 'F', 'G', 'Bb', 'D']
const MID_ROOTS  = [...EASY_ROOTS, 'Eb', 'A', 'Ab']
const HARD_ROOTS = [...MID_ROOTS, 'Db', 'E', 'B']

function makeProblem(d: Difficulty): GeneratedProblem {
  const roots = d === 'easy' ? EASY_ROOTS : d === 'medium' ? MID_ROOTS : HARD_ROOTS
  const root = pick(roots)
  const scale = buildScale(root, 'major')
  const display = scale.join('  ')
  const key = `${root} major`
  const allKeys = HARD_ROOTS.map((r) => `${r} major`)
  const distractors = shuffle(allKeys.filter((k) => k !== key)).slice(0, 3)
  const choices = shuffle([key, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: `Name this scale:  ${display}`,
    correctAnswer: key,
    answerFormat: 'multiple-choice',
    choices,
    hint: d === 'easy' ? 'The first note is the key.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-identify-scale-${d}`,
  topicId: 'sk-identify-scale',
  category: 'scales-keys',
  title: 'Name the scale',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
