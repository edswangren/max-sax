import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

const NOTES = ['G5', 'A5', 'B5', 'C6']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const note = pick(NOTES)
  const pc = pcOf(note)
  const base: GeneratedProblem = {
    questionText: 'Name this note.',
    correctAnswer: pc,
    answerFormat: 'note-name',
    staffSpec: { clef: 'treble', notes: `${note}/w` },
  }
  if (d === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: NOTES.map((n) => ({ label: pcOf(n), value: pcOf(n) })),
      hint: 'Top line is F. Above that: G, A, B, C.',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Just above the top line.' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-above-staff-${d}`,
  topicId: 'nr-above-staff',
  category: 'note-reading',
  title: 'Above the staff',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
