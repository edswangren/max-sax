import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { buildScale } from '../../utils/music'

const EASY_ROOTS = ['A', 'D', 'E', 'G']
const MID_ROOTS  = [...EASY_ROOTS, 'C', 'B', 'F']
const HARD_ROOTS = [...MID_ROOTS, 'Bb', 'Eb', 'F#', 'C#']

function makeProblem(d: Difficulty): GeneratedProblem {
  const roots = d === 'easy' ? EASY_ROOTS : d === 'medium' ? MID_ROOTS : HARD_ROOTS
  const root = pick(roots)
  const scale = buildScale(root, 'natural-minor')
  const answer = scale.join(', ')
  return {
    questionText: `List the notes of the ${root} natural minor scale (ascending).`,
    correctAnswer: answer,
    acceptableAnswers: [answer, scale.join(',')],
    answerFormat: 'note-sequence',
    hint: 'Natural minor pattern: W H W W H W W',
    checkWork: `${root} natural minor: ${scale.join(' – ')}`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-natural-minor-${d}`,
  topicId: 'sk-natural-minor',
  category: 'scales-keys',
  title: 'Natural minor scales',
  difficulty: d,
  answerFormat: 'note-sequence',
  generate: () => makeProblem(d),
}))
