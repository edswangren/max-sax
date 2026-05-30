import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { enharmonicEquivalents } from '../../utils/music'

// Pitch classes that actually have a common enharmonic spelling.
const EASY = ['A#', 'Bb', 'C#', 'Db', 'F#', 'Gb']
const MID  = [...EASY, 'D#', 'Eb', 'G#', 'Ab']
// At demon difficulty we also throw "E#" and "Cb" which sound like F and B.
const HARD_EXTRA: Array<{ from: string; to: string }> = [
  { from: 'E#', to: 'F' },
  { from: 'Fb', to: 'E' },
  { from: 'B#', to: 'C' },
  { from: 'Cb', to: 'B' },
]

function makeProblem(d: Difficulty): GeneratedProblem {
  if (d === 'hard' && Math.random() < 0.35) {
    const swap = pick(HARD_EXTRA)
    const distractorPool = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].filter((n) => n !== swap.to)
    const distractors = shuffle(distractorPool).slice(0, 3)
    const choices = shuffle([swap.to, ...distractors]).map((v) => ({ label: v, value: v }))
    return {
      questionText: `What's the enharmonic equivalent of ${swap.from}?`,
      correctAnswer: swap.to,
      answerFormat: 'multiple-choice',
      choices,
      checkWork: `${swap.from} and ${swap.to} are the same key — different spelling.`,
    }
  }

  const pool = d === 'easy' ? EASY : MID
  const from = pick(pool)
  const eqs = enharmonicEquivalents(from)
  const answer = eqs[0]
  const distractorPool = pool.filter((n) => n !== from && n !== answer)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([answer, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: `What's the enharmonic equivalent of ${from}?`,
    correctAnswer: answer,
    answerFormat: 'multiple-choice',
    choices,
    hint: d === 'easy' ? 'Same sound, different spelling — flip sharp ↔ flat.' : undefined,
    checkWork: `${from} = ${answer} on the keyboard.`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-enharmonic-${d}`,
  topicId: 'sk-enharmonic',
  category: 'scales-keys',
  title: 'Enharmonic equivalents',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
