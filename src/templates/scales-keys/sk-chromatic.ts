import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { chromaticNext } from '../../utils/music'

const NATURALS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const ALL = ['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab']

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? NATURALS : ALL
  const from = pick(pool)
  const direction = Math.random() < 0.5 ? 'up' : 'down'
  const answer = chromaticNext(from, direction)
  const distractorPool = ALL.filter((n) => n !== answer && n !== from)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([answer, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: `Going ${direction.toUpperCase()} chromatically from ${from}, the next note is?`,
    correctAnswer: answer,
    answerFormat: 'multiple-choice',
    choices,
    hint: d === 'easy' ? 'Chromatic = move by one half-step.' : undefined,
    checkWork: `One half-step ${direction} from ${from} is ${answer}.`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-chromatic-${d}`,
  topicId: 'sk-chromatic',
  category: 'scales-keys',
  title: 'Chromatic next-note',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
