import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface RhythmPattern {
  staffNotes: string   // VexFlow note spec — one bar in 4/4
  counting: string     // The correct counting string
  level: Difficulty
}

// All patterns sit on B4 (middle line of treble staff) — single pitch keeps the
// drill focused on rhythm. Time signature is 4/4 throughout.
const PATTERNS: RhythmPattern[] = [
  { staffNotes: 'B4/q,B4/q,B4/q,B4/q',                              counting: '1 2 3 4',                    level: 'easy' },
  { staffNotes: 'B4/h,B4/q,B4/q',                                   counting: '1 (2) 3 4',                  level: 'easy' },
  { staffNotes: 'B4/q,B4/q,B4/h',                                   counting: '1 2 3 (4)',                  level: 'easy' },
  { staffNotes: 'B4/8,B4/8,B4/q,B4/q,B4/q',                         counting: '1 & 2 3 4',                  level: 'medium' },
  { staffNotes: 'B4/q,B4/8,B4/8,B4/q,B4/q',                         counting: '1 2 & 3 4',                  level: 'medium' },
  { staffNotes: 'B4/8,B4/8,B4/8,B4/8,B4/q,B4/q',                    counting: '1 & 2 & 3 4',                level: 'medium' },
  { staffNotes: 'B4/8,B4/8,B4/8,B4/8,B4/8,B4/8,B4/8,B4/8',          counting: '1 & 2 & 3 & 4 &',            level: 'hard' },
  { staffNotes: 'B4/q,B4/8,B4/8,B4/8,B4/8,B4/q',                    counting: '1 2 & 3 & 4',                level: 'hard' },
  { staffNotes: 'B4/8,B4/8,B4/q,B4/8,B4/8,B4/q',                    counting: '1 & 2 3 & 4',                level: 'hard' },
]

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = PATTERNS.filter((p) => d === 'hard' ? true : d === 'medium' ? p.level !== 'hard' : p.level === 'easy')
  const target = pick(pool)
  const distractorPool = PATTERNS.filter((p) => p.counting !== target.counting).map((p) => p.counting)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([target.counting, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: 'Which counting matches this rhythm?',
    correctAnswer: target.counting,
    answerFormat: 'multiple-choice',
    choices,
    staffSpec: { clef: 'treble', timeSignature: '4/4', notes: target.staffNotes, width: 360 },
    hint: d === 'easy' ? 'Tap your foot on each beat — 1, 2, 3, 4.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `ry-sight-read-${d}`,
  topicId: 'ry-sight-read',
  category: 'rhythm',
  title: 'Sight-read a rhythm',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
