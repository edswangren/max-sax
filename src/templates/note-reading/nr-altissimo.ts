import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

// Altissimo basics — notes above palm F#
const NOTES = ['G6', 'A6', 'B6', 'C7']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const note = pick(NOTES)
  const pc = pcOf(note)
  const base: GeneratedProblem = {
    questionText: 'Name this altissimo note.',
    correctAnswer: pc,
    answerFormat: 'note-name',
    staffSpec: { clef: 'treble', notes: `${note}/w`, height: 170 },
  }
  if (d === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: NOTES.map((n) => ({ label: pcOf(n), value: pcOf(n) })),
      hint: 'Altissimo starts at G (above palm F♯) and climbs up.',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Way above the staff — count carefully.' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-altissimo-${d}`,
  topicId: 'nr-altissimo',
  category: 'note-reading',
  title: 'Altissimo basics',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
