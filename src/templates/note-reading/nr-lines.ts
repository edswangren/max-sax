import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

// Lines of the treble staff: E G B D F ("Every Good Boy Does Fine")
const LINES = ['E4', 'G4', 'B4', 'D5', 'F5']

function pcOf(note: string): string {
  return note.replace(/\d+$/, '')
}

function makeProblem(difficulty: Difficulty): GeneratedProblem {
  const note = pick(LINES)
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
      choices: LINES.map((n) => ({ label: pcOf(n), value: pcOf(n) })),
      hint: 'Lines of the staff: Every Good Boy Does Fine',
    }
  }
  if (difficulty === 'medium') {
    return { ...base, hint: 'Lines only — E G B D F' }
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
