import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface TS { sig: string; top: number; beatUnit: string; feel: string }

const EASY_TS: TS[] = [
  { sig: '4/4', top: 4, beatUnit: 'quarter note', feel: 'common time' },
  { sig: '3/4', top: 3, beatUnit: 'quarter note', feel: 'waltz' },
  { sig: '2/4', top: 2, beatUnit: 'quarter note', feel: 'march' },
]
const MID_TS: TS[] = [
  ...EASY_TS,
  { sig: '6/8',  top: 6, beatUnit: 'eighth note',  feel: 'compound duple' },
  { sig: '2/2',  top: 2, beatUnit: 'half note',    feel: 'cut time / alla breve' },
]
const HARD_TS: TS[] = [
  ...MID_TS,
  { sig: '9/8',  top: 9, beatUnit: 'eighth note',  feel: 'compound triple' },
  { sig: '12/8', top: 12, beatUnit: 'eighth note', feel: 'compound quadruple' },
  { sig: '5/4',  top: 5, beatUnit: 'quarter note', feel: 'irregular' },
]

function mcOptions(correct: string, pool: string[], n = 4) {
  const distractors = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY_TS : d === 'medium' ? MID_TS : HARD_TS
  const t = pick(pool)
  const mode = pick(['top', 'beat-unit', 'feel'] as const)

  if (mode === 'top') {
    return {
      questionText: `In ${t.sig}, how many of the beat-unit notes fit in a measure?`,
      correctAnswer: String(t.top),
      answerFormat: 'integer',
      hint: 'The top number tells you how many.',
    }
  }
  if (mode === 'beat-unit') {
    const correct = t.beatUnit
    const all = ['whole note', 'half note', 'quarter note', 'eighth note', 'sixteenth note']
    return {
      questionText: `In ${t.sig}, which note gets the beat (the bottom number)?`,
      correctAnswer: correct,
      answerFormat: 'multiple-choice',
      choices: mcOptions(correct, all),
    }
  }
  // feel
  const allFeels = HARD_TS.map((x) => x.feel)
  return {
    questionText: `${t.sig} is best described as:`,
    correctAnswer: t.feel,
    answerFormat: 'multiple-choice',
    choices: mcOptions(t.feel, allFeels),
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `ry-timesig-math-${d}`,
  topicId: 'ry-timesig-math',
  category: 'rhythm',
  title: 'Time signature math',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
