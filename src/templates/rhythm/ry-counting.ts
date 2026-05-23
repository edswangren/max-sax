import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

// Each entry: how a beat is subdivided + the correct count syllables
interface Beat { description: string; count: string; alternates: string[] }

const EASY: Beat[] = [
  { description: 'one quarter note',                   count: '1',         alternates: ['one'] },
  { description: 'two eighth notes',                   count: '1 &',       alternates: ['1 and'] },
  { description: 'a quarter rest',                     count: '(1)',       alternates: ['rest', 'silent 1'] },
]
const MID: Beat[] = [
  ...EASY,
  { description: 'four sixteenth notes',               count: '1 e & a',   alternates: ['1 e and a'] },
  { description: 'an eighth + two sixteenths',         count: '1 & a',     alternates: ['1 and a'] },
  { description: 'two sixteenths + an eighth',         count: '1 e &',     alternates: ['1 e and'] },
]
const HARD: Beat[] = [
  ...MID,
  { description: 'an eighth-note triplet',             count: '1 trip let', alternates: ['1 & a', 'trip-let-1'] },
  { description: 'a dotted eighth + a sixteenth',      count: '1 . . a',   alternates: ['1 a', 'dotted 8 16'] },
]

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY : d === 'medium' ? MID : HARD
  const b = pick(pool)
  const allCounts = HARD.map((x) => x.count)
  const distractors = shuffle(allCounts.filter((c) => c !== b.count)).slice(0, 3)
  const choices = shuffle([b.count, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: `How do you count ${b.description} on beat 1?`,
    correctAnswer: b.count,
    acceptableAnswers: b.alternates,
    answerFormat: 'multiple-choice',
    choices,
    hint: d === 'easy' ? 'Sixteenths: 1 e & a. Eighths: 1 &.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `ry-counting-${d}`,
  topicId: 'ry-counting',
  category: 'rhythm',
  title: 'Counting subdivisions',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
