import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

const SPACES = ['F4', 'A4', 'C5', 'E5']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const note = pick(SPACES)
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
      choices: SPACES.map((n) => ({ label: pcOf(n), value: pcOf(n) })),
      hint: 'Spaces of the staff spell FACE.',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Spaces spell F-A-C-E.' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-spaces-${d}`,
  topicId: 'nr-spaces',
  category: 'note-reading',
  title: 'Spaces of the staff',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
