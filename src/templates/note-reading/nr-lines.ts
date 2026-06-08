import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'

// Each "line" position can be drawn natural or with a single accidental.
// E line and F line skip the enharmonic-with-neighbor-letter spellings (E#, B#).
const CHILL = ['E4','Eb4','G4','G#4','Gb4','B4','Bb4','D5','D#5','Db5','F5','F#5']
const MID   = [...CHILL, 'Fb5']
const DEMON = [...MID]

function pcOf(note: string): string {
  return note.replace(/\d+$/, '')
}

function mcChoices(correct: string, pool: string[]): MultipleChoiceOption[] {
  const pcs = [...new Set(pool.map(pcOf))]
  const distractors = shuffle(pcs.filter((p) => p !== correct)).slice(0, 3)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(difficulty: Difficulty): GeneratedProblem {
  const pool = difficulty === 'easy' ? CHILL : difficulty === 'medium' ? MID : DEMON
  const note = pick(pool)
  const pc = pcOf(note)
  const base: GeneratedProblem = {
    questionText: 'Name this note.',
    correctAnswer: pc,
    answerFormat: 'note-name',
    staffSpec: { clef: 'treble', notes: `${note}/w` },
  }
  if (difficulty === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: mcChoices(pc, pool),
      hint: 'Middle line = B. Other lines are 3rds away (skip a letter).',
    }
  }
  if (difficulty === 'medium') {
    return { ...base, hint: 'Type the accidental too (e.g. F#, Bb).' }
  }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-lines-${d}`,
  topicId: 'nr-lines',
  category: 'note-reading',
  title: 'Lines of the staff',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
