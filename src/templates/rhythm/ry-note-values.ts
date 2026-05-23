import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Note { name: string; beats: number }
const NOTES: Note[] = [
  { name: 'whole note',     beats: 4 },
  { name: 'half note',      beats: 2 },
  { name: 'quarter note',   beats: 1 },
  { name: 'eighth note',    beats: 0.5 },
  { name: 'sixteenth note', beats: 0.25 },
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
  const note = pick(NOTES)
  if (d === 'easy' || (d === 'medium' && Math.random() < 0.6)) {
    const correct = BEAT_LABEL(note.beats)
    return {
      questionText: `In 4/4, how many beats does a ${note.name} get?`,
      correctAnswer: correct,
      answerFormat: 'multiple-choice',
      choices: mcOptions(correct, NOTES.map((n) => BEAT_LABEL(n.beats))),
    }
  }
  if (d === 'hard' && Math.random() < 0.4) {
    // arithmetic combo
    const a = pick(NOTES)
    const b = pick(NOTES)
    const total = a.beats + b.beats
    return {
      questionText: `A ${a.name} + a ${b.name} = how many beats?`,
      correctAnswer: BEAT_LABEL(total),
      answerFormat: 'multiple-choice',
      choices: mcOptions(BEAT_LABEL(total), [BEAT_LABEL(total), BEAT_LABEL(a.beats), BEAT_LABEL(b.beats), BEAT_LABEL(a.beats * 2)]),
    }
  }
  // beats → note name
  const correct = note.name
  return {
    questionText: `Which note gets ${BEAT_LABEL(note.beats)} in 4/4?`,
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: mcOptions(correct, NOTES.map((n) => n.name)),
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `ry-note-values-${d}`,
  topicId: 'ry-note-values',
  category: 'rhythm',
  title: 'Note values',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
