import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

// Palm keys: D6 through F#6. Mirror of fg-palm-keys.
const PALM = ['D6', 'Eb6', 'E6', 'F6', 'F#6']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const target = pick(PALM)
  const pc = pcOf(target)
  const distractorPool = PALM.filter((n) => pcOf(n) !== pc)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([target, ...distractors]).map((v) => ({ label: pcOf(v), value: v }))
  return {
    questionText: `Pick the palm-key fingering for ${pc}.`,
    correctAnswer: target,
    answerFormat: 'fingering-pick',
    choices,
    hint: d === 'easy' ? 'Palm keys live in the upper-left palm cluster.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `fg-note-to-fingering-palm-${d}`,
  topicId: 'fg-note-to-fingering-palm',
  category: 'fingerings',
  title: 'Note → fingering (palm keys)',
  difficulty: d,
  answerFormat: 'fingering-pick',
  generate: () => makeProblem(d),
}))
