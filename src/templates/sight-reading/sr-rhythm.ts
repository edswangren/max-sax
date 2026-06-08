import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { shuffle } from '../../utils/random'
import { generateExcerpt, excerptOptionsFor, type Excerpt } from '../../utils/music'

// Multi-bar rhythm reading. Single pitch (B4) keeps the focus on rhythm.
// Student picks the counting string that matches the printed rhythm.

function singlePitchStaff(ex: Excerpt): string {
  const toks: string[] = []
  let cur = 0
  for (const n of ex.notes) {
    if (n.bar !== cur) { toks.push('|'); cur = n.bar }
    toks.push(n.isRest ? `${n.durCode}r` : `B4/${n.durCode}`)
  }
  return toks.join(',')
}

/** Counting string in the app's "1 (2) & 3 e a 4" convention, one segment per bar. */
function countingFor(ex: Excerpt): string {
  const bars: string[][] = Array.from({ length: ex.bars }, () => [])
  // onset map per bar: cell index (0..15) → 'note' | 'rest'
  const onsets: Record<number, Record<number, 'note' | 'rest'>> = {}
  for (const n of ex.notes) {
    const cell = Math.round((n.beat - 1) * 4)
    onsets[n.bar] = onsets[n.bar] ?? {}
    onsets[n.bar][cell] = n.isRest ? 'rest' : 'note'
  }
  for (let bar = 0; bar < ex.bars; bar++) {
    const map = onsets[bar] ?? {}
    for (let beat = 0; beat < 4; beat++) {
      const base = beat * 4
      const down = map[base]
      bars[bar].push(down === 'note' ? `${beat + 1}` : `(${beat + 1})`)
      if (map[base + 1] === 'note') bars[bar].push('e')
      if (map[base + 2] === 'note') bars[bar].push('&')
      if (map[base + 3] === 'note') bars[bar].push('a')
    }
  }
  return bars.map((b) => b.join(' ')).join(' | ')
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const opts = { ...excerptOptionsFor(d), keys: ['C major'], accidentalDensity: 0 }
  const ex = generateExcerpt(opts)
  const correct = countingFor(ex)

  // Distractors: countings of other random rhythms of the same shape.
  const distractors = new Set<string>()
  let guard = 0
  while (distractors.size < 3 && guard++ < 40) {
    const c = countingFor(generateExcerpt(opts))
    if (c !== correct) distractors.add(c)
  }
  const choices = shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))

  return {
    questionText: 'Which counting matches this rhythm?',
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices,
    staffSpec: {
      clef: 'treble',
      timeSignature: ex.timeSignature,
      notes: singlePitchStaff(ex),
      width: ex.width,
      endBar: true,
    },
    hint: d === 'easy' ? 'Tap the beat 1-2-3-4. "&" = the "and" between beats.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-rhythm-${d}`,
  topicId: 'sr-rhythm',
  category: 'sight-reading',
  title: 'Rhythm reading',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
