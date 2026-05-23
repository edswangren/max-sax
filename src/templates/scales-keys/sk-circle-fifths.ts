import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

// Circle of fifths order (going clockwise / sharpward)
const CIRCLE_SHARP = ['C','G','D','A','E','B','F#','C#']
// Going flatward (counter-clockwise)
const CIRCLE_FLAT  = ['C','F','Bb','Eb','Ab','Db','Gb','Cb']

function fifthUp(key: string): string {
  const i = CIRCLE_SHARP.indexOf(key)
  if (i >= 0 && i < CIRCLE_SHARP.length - 1) return CIRCLE_SHARP[i + 1]
  // for flat keys: F → C, Bb → F, etc. (flat side, fifth up means closer to C)
  const j = CIRCLE_FLAT.indexOf(key)
  if (j > 0) return CIRCLE_FLAT[j - 1]
  return 'C'
}

function fifthDown(key: string): string {
  const i = CIRCLE_FLAT.indexOf(key)
  if (i >= 0 && i < CIRCLE_FLAT.length - 1) return CIRCLE_FLAT[i + 1]
  const j = CIRCLE_SHARP.indexOf(key)
  if (j > 0) return CIRCLE_SHARP[j - 1]
  return 'C'
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const easyKeys = ['C','G','D','F','Bb']
  const midKeys  = ['C','G','D','A','F','Bb','Eb','Ab']
  const hardKeys = [...CIRCLE_SHARP, ...CIRCLE_FLAT.slice(1)]
  const keys = d === 'easy' ? easyKeys : d === 'medium' ? midKeys : hardKeys

  const root = pick(keys)
  const direction = Math.random() < 0.5 ? 'up' : 'down'
  const answer = direction === 'up' ? fifthUp(root) : fifthDown(root)

  const distractors = shuffle(hardKeys.filter((k) => k !== answer)).slice(0, 3)
  const choices = shuffle([answer, ...distractors]).map((v) => ({ label: v, value: v }))

  return {
    questionText: `What's a perfect 5th ${direction} from ${root}?`,
    correctAnswer: answer,
    answerFormat: 'multiple-choice',
    choices,
    hint: d === 'easy'
      ? 'A 5th UP adds a sharp / removes a flat. A 5th DOWN adds a flat / removes a sharp.'
      : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-circle-fifths-${d}`,
  topicId: 'sk-circle-fifths',
  category: 'scales-keys',
  title: 'Circle of fifths',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
