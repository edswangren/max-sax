import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Rest { name: string; beats: number; lookLike: string }
const RESTS: Rest[] = [
  { name: 'whole rest',     beats: 4,    lookLike: 'block hanging down from the 4th line' },
  { name: 'half rest',      beats: 2,    lookLike: 'block sitting on the 3rd line' },
  { name: 'quarter rest',   beats: 1,    lookLike: 'squiggly Z/lightning shape' },
  { name: 'eighth rest',    beats: 0.5,  lookLike: 'flag with one curl' },
  { name: 'sixteenth rest', beats: 0.25, lookLike: 'flag with two curls' },
]

const BEAT_LABEL = (b: number) =>
  b === 4 ? '4 beats' :
  b === 2 ? '2 beats' :
  b === 1 ? '1 beat' :
  b === 0.5 ? '½ beat' :
  b === 0.25 ? '¼ beat' :
  `${b} beats`

function mcOptions(correct: string, pool: string[], n = 4) {
  const distractors = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const r = pick(RESTS)
  if (d === 'easy' || (d === 'medium' && Math.random() < 0.5)) {
    const correct = BEAT_LABEL(r.beats)
    return {
      questionText: `In 4/4, how long is a ${r.name}?`,
      correctAnswer: correct,
      answerFormat: 'multiple-choice',
      choices: mcOptions(correct, RESTS.map((x) => BEAT_LABEL(x.beats))),
    }
  }
  if (d === 'hard') {
    const correct = r.name
    return {
      questionText: `Which rest looks like a ${r.lookLike}?`,
      correctAnswer: correct,
      answerFormat: 'multiple-choice',
      choices: mcOptions(correct, RESTS.map((x) => x.name)),
    }
  }
  const correct = r.name
  return {
    questionText: `Which rest lasts ${BEAT_LABEL(r.beats)} in 4/4?`,
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: mcOptions(correct, RESTS.map((x) => x.name)),
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `ry-rests-${d}`,
  topicId: 'ry-rests',
  category: 'rhythm',
  title: 'Rests',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
