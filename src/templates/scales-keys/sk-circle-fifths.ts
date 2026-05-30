import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { ORDER_OF_SHARPS, ORDER_OF_FLATS } from '../../utils/music'

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

// Accumulation rule: as you move sharpward up the circle, the Nth sharp key
// adds ORDER_OF_SHARPS[N-1]. Mirror for flats.
function nextSharpAddedAt(steps: number): string {
  if (steps < 1 || steps > ORDER_OF_SHARPS.length) return ORDER_OF_SHARPS[0]
  return ORDER_OF_SHARPS[steps - 1]
}

function nextFlatAddedAt(steps: number): string {
  if (steps < 1 || steps > ORDER_OF_FLATS.length) return ORDER_OF_FLATS[0]
  return ORDER_OF_FLATS[steps - 1]
}

function makeAccumulationProblem(d: Difficulty): GeneratedProblem {
  // Pick a position 1..maxSteps and ask which accidental is the newly-added one.
  const maxSteps = d === 'medium' ? 5 : 7
  const useSharps = Math.random() < 0.5
  const steps = Math.floor(Math.random() * maxSteps) + 1   // 1..maxSteps
  const fromKey = useSharps ? CIRCLE_SHARP[steps - 1] : CIRCLE_FLAT[steps - 1]
  const toKey = useSharps ? CIRCLE_SHARP[steps] : CIRCLE_FLAT[steps]
  const answer = useSharps ? nextSharpAddedAt(steps) : nextFlatAddedAt(steps)
  const direction = useSharps ? 'up a 5th' : 'down a 5th'
  const verb = useSharps ? 'sharp' : 'flat'

  const distractorPool = (useSharps ? ORDER_OF_SHARPS : ORDER_OF_FLATS).filter((a) => a !== answer)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([answer, ...distractors]).map((v) => ({ label: v, value: v }))

  return {
    questionText: `Moving ${direction} from ${fromKey} to ${toKey}, which ${verb} is added to the key signature?`,
    correctAnswer: answer,
    answerFormat: 'multiple-choice',
    choices,
    checkWork: useSharps
      ? `Sharps accumulate in order: ${ORDER_OF_SHARPS.join(', ')}.`
      : `Flats accumulate in order: ${ORDER_OF_FLATS.join(', ')}.`,
  }
}

function makeProblem(d: Difficulty): GeneratedProblem {
  // Mid/Demon: ~40% chance of an accumulation question instead of plain key→key.
  if (d !== 'easy' && Math.random() < 0.4) return makeAccumulationProblem(d)

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
