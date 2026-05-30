import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

// Mirror of fg-octave-key — D5 through C6.
const EASY = ['D5', 'E5', 'G5', 'A5', 'B5']
const MID  = [...EASY, 'F5', 'C6', 'Bb5']
const HARD = [...MID, 'Eb5', 'G#5', 'F#5', 'C#6']

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY : d === 'medium' ? MID : HARD
  const target = pick(pool)
  const pc = pcOf(target)
  const distractorPool = pool.filter((n) => pcOf(n) !== pc)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([target, ...distractors]).map((v) => ({ label: pcOf(v), value: v }))
  return {
    questionText: `Pick the fingering for ${pc} (octave-key range).`,
    correctAnswer: target,
    answerFormat: 'fingering-pick',
    choices,
    hint: d === 'easy' ? 'Top-left circle = octave key.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `fg-note-to-fingering-octave-${d}`,
  topicId: 'fg-note-to-fingering-octave',
  category: 'fingerings',
  title: 'Note → fingering (octave key)',
  difficulty: d,
  answerFormat: 'fingering-pick',
  generate: () => makeProblem(d),
}))
