import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Note { name: string; beats: number }
const NOTES: Note[] = [
  { name: 'whole note',   beats: 4 },
  { name: 'half note',    beats: 2 },
  { name: 'quarter note', beats: 1 },
  { name: 'eighth note',  beats: 0.5 },
]

const fmt = (b: number) => {
  if (b === Math.floor(b)) return `${b} ${b === 1 ? 'beat' : 'beats'}`
  if (b === 0.75) return '¾ beat'
  if (b === 1.5)  return '1½ beats'
  if (b === 3)    return '3 beats'
  if (b === 6)    return '6 beats'
  return String(b)
}

function mcOptions(correct: string, pool: string[], n = 4) {
  const distractors = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? NOTES.slice(0, 3) : NOTES
  const n = pick(pool)
  const dotted = n.beats * 1.5
  const dottedName = `dotted ${n.name}`

  const mode = d === 'easy' ? 'forward'
    : pick(['forward', 'reverse'] as const)

  if (mode === 'reverse') {
    // beats → which dotted note
    const correct = dottedName
    return {
      questionText: `Which dotted note lasts ${fmt(dotted)} in 4/4?`,
      correctAnswer: correct,
      answerFormat: 'multiple-choice',
      choices: mcOptions(correct, NOTES.map((x) => `dotted ${x.name}`)),
      hint: 'A dot adds half the note\'s original value.',
    }
  }

  // forward: dotted name → beats
  const all = NOTES.map((x) => fmt(x.beats * 1.5))
  const allWithExtras = [...all, ...NOTES.map((x) => fmt(x.beats))]
  return {
    questionText: `How many beats is a ${dottedName} in 4/4?`,
    correctAnswer: fmt(dotted),
    answerFormat: 'multiple-choice',
    choices: mcOptions(fmt(dotted), allWithExtras),
    hint: 'Dot = adds half the original value.',
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `ry-dotted-${d}`,
  topicId: 'ry-dotted',
  category: 'rhythm',
  title: 'Dotted notes',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
