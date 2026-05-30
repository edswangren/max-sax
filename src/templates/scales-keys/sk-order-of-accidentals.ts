import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { shuffle } from '../../utils/random'
import { ORDER_OF_SHARPS, ORDER_OF_FLATS } from '../../utils/music'

function ordinal(n: number): string {
  const t = n % 10, h = n % 100
  if (h >= 11 && h <= 13) return `${n}th`
  if (t === 1) return `${n}st`
  if (t === 2) return `${n}nd`
  if (t === 3) return `${n}rd`
  return `${n}th`
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const useSharps = Math.random() < 0.5
  const order = useSharps ? ORDER_OF_SHARPS : ORDER_OF_FLATS
  const label = useSharps ? 'sharp' : 'flat'
  const maxPos = d === 'easy' ? 4 : d === 'medium' ? 5 : 7
  const pos = Math.floor(Math.random() * maxPos) + 1  // 1..maxPos
  const answer = order[pos - 1]
  const distractorPool = order.filter((n) => n !== answer)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([answer, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: `Order of ${label}s: which ${label} is added ${ordinal(pos)}?`,
    correctAnswer: answer,
    answerFormat: 'multiple-choice',
    choices,
    hint: d === 'easy'
      ? useSharps ? 'Sharps: F-C-G-D-A-E-B (Father Charles Goes Down And Ends Battle).'
                  : 'Flats: B-E-A-D-G-C-F (BEAD-Greatest Common Factor).'
      : undefined,
    checkWork: `${label}s in order: ${order.join(', ')}.`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-order-of-accidentals-${d}`,
  topicId: 'sk-order-of-accidentals',
  category: 'scales-keys',
  title: 'Order of sharps & flats',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
