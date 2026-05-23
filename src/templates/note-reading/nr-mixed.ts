import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

const STAFF = ['E4','F4','G4','A4','B4','C5','D5','E5','F5']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const note = pick(STAFF)
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
      choices: ['E','F','G','A','B','C','D'].map((p) => ({ label: p, value: p })),
      hint: 'Lines: EGBDF. Spaces: FACE.',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Type just the letter (e.g. F).' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-mixed-${d}`,
  topicId: 'nr-mixed',
  category: 'note-reading',
  title: 'Lines & spaces mixed',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
