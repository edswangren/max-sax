import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

const NOTES = ['D6', 'Eb6', 'E6', 'F6', 'F#6']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const note = pick(NOTES)
  const pc = pcOf(note)
  const base: GeneratedProblem = {
    questionText: 'Name this note (palm-key range).',
    correctAnswer: pc,
    answerFormat: 'note-name',
    staffSpec: { clef: 'treble', notes: `${note}/w` },
  }
  if (d === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: NOTES.map((n) => ({ label: pcOf(n), value: pcOf(n) })),
      hint: 'Palm keys go D → E♭ → E → F → F♯.',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Include the accidental.' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-palm-keys-${d}`,
  topicId: 'nr-palm-keys',
  category: 'note-reading',
  title: 'Palm-key range',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
