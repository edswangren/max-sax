import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { buildScale } from '../../utils/music'

const EASY_ROOTS  = ['C', 'F', 'G', 'Bb', 'D']
const MID_ROOTS   = [...EASY_ROOTS, 'Eb', 'A', 'Ab']
const HARD_ROOTS  = [...MID_ROOTS, 'Db', 'E', 'B', 'Gb']

function makeProblem(d: Difficulty): GeneratedProblem {
  const roots = d === 'easy' ? EASY_ROOTS : d === 'medium' ? MID_ROOTS : HARD_ROOTS
  const root = pick(roots)
  const scale = buildScale(root, 'major')
  const answer = scale.join(', ')
  return {
    questionText: `List the notes of the ${root} major scale (ascending, no octave needed).`,
    correctAnswer: answer,
    acceptableAnswers: [answer, scale.join(',')],
    answerFormat: 'note-sequence',
    hint: 'Pattern: W W H W W W H. Use one letter per scale degree.',
    checkWork: `${root} major: ${scale.join(' – ')}`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-major-construct-${d}`,
  topicId: 'sk-major-construct',
  category: 'scales-keys',
  title: 'Build a major scale',
  difficulty: d,
  answerFormat: 'note-sequence',
  generate: () => makeProblem(d),
}))
