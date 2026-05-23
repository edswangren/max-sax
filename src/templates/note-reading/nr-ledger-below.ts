import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

// Sax low range: written notes below the treble staff bottom (E4)
// D4 (just below), C4 (1st ledger), B3 (below middle C), Bb3 (with flat)
const NOTES = ['D4', 'C4', 'B3', 'Bb3']

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
      hint: 'Just below the staff: D, then middle C, then B, then low B♭.',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Include the accidental if there is one (B vs B♭).' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-ledger-below-${d}`,
  topicId: 'nr-ledger-below',
  category: 'note-reading',
  title: 'Ledger lines below',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
