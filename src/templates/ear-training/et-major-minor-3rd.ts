import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

function makeProblem(d: Difficulty): GeneratedProblem {
  const isMajor = Math.random() < 0.5
  const sep = isMajor ? 4 : 3
  const base = pick([50, 52, 55, 57, 60, 62, 65, 67])
  const notes = d === 'hard'
    // play simultaneously (block dyad) for harder mode — emulate via 0 gap & overlapping durations
    ? [{ midi: base, durationMs: 1200 }, { midi: base + sep, durationMs: 1200 }]
    : [{ midi: base, durationMs: 700 }, { midi: base + sep, durationMs: 700 }]
  return {
    questionText: 'Major 3rd or Minor 3rd?',
    correctAnswer: isMajor ? 'Major' : 'Minor',
    answerFormat: 'multiple-choice',
    choices: shuffle([
      { label: 'Major (happy/bright)', value: 'Major' },
      { label: 'Minor (sad/dark)',     value: 'Minor' },
    ]),
    audioSpec: { notes, gapMs: d === 'hard' ? -1200 : 50 }, // negative gap → overlap
    hint: d === 'easy' ? 'Major = brighter / "happy". Minor = darker / "sad".' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `et-major-minor-3rd-${d}`,
  topicId: 'et-major-minor-3rd',
  category: 'ear-training',
  title: 'Major vs minor 3rd',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
