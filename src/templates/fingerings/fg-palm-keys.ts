import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'

// Palm-key range: D6 through F#6
const PALM = ['D6', 'Eb6', 'E6', 'F6', 'F#6']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const note = pick(PALM)
  const pc = pcOf(note)
  const choicesSrc = PALM.map(pcOf)
  return {
    questionText: 'Which palm-key note does this fingering play?',
    correctAnswer: pc,
    answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
    choices: d === 'hard' ? undefined : choicesSrc.map((p) => ({ label: p, value: p })),
    fingeringSpec: { note },
    hint: d === 'easy' ? 'Palm keys stack on the upper-left of the diagram (palm cluster).' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `fg-palm-keys-${d}`,
  topicId: 'fg-palm-keys',
  category: 'fingerings',
  title: 'Palm keys',
  difficulty: d,
  answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
  generate: () => makeProblem(d),
}))
