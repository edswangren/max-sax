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
  // Chill keeps the friendly framing. Mid/Demon swap to half-step labels so
  // the student starts internalizing the actual interval measurement.
  const majorLabel = d === 'easy' ? 'Major (happy/bright)' : 'Major (4 half-steps)'
  const minorLabel = d === 'easy' ? 'Minor (sad/dark)'     : 'Minor (3 half-steps)'
  return {
    questionText: 'Major 3rd or Minor 3rd?',
    correctAnswer: isMajor ? 'Major' : 'Minor',
    answerFormat: 'multiple-choice',
    choices: shuffle([
      { label: majorLabel, value: 'Major' },
      { label: minorLabel, value: 'Minor' },
    ]),
    audioSpec: { notes, gapMs: d === 'hard' ? -1200 : 50, timbre: 'clean' }, // negative gap → overlap
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
