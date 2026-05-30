import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

// Reference (in-tune) MIDI: A4 (concert) — sax players hear this in tuners constantly.
const REF_MIDI = 69

interface DetuneCase { cents: number; coarse: 'sharp' | 'in tune' | 'flat'; label: string }

const EASY_CASES: DetuneCase[] = [
  { cents: -30, coarse: 'flat',    label: '−30¢ (clearly flat)' },
  { cents:   0, coarse: 'in tune', label: 'in tune' },
  { cents:  30, coarse: 'sharp',   label: '+30¢ (clearly sharp)' },
]

const MID_CASES: DetuneCase[] = [
  ...EASY_CASES,
  { cents: -15, coarse: 'flat',  label: '−15¢ (a bit flat)' },
  { cents:  15, coarse: 'sharp', label: '+15¢ (a bit sharp)' },
]

const HARD_CASES = MID_CASES

function makeProblem(d: Difficulty): GeneratedProblem {
  const cases = d === 'easy' ? EASY_CASES : d === 'medium' ? MID_CASES : HARD_CASES
  const c = pick(cases)
  // Reference tone (in tune), short gap, then the test tone with the per-note
  // detune. Two-note compare is how band tuning actually works.
  const notes = [
    { midi: REF_MIDI, durationMs: 700, detuneCents: 0 },
    { midi: REF_MIDI, durationMs: 1200, detuneCents: c.cents },
  ]
  const audioSpec = { notes, gapMs: 150, timbre: 'clean' as const }

  if (d === 'hard') {
    // Exact cents answer: 5 choices, all from the case pool.
    const choicesValues = HARD_CASES.map((x) => `${x.cents > 0 ? '+' : ''}${x.cents}¢`)
    const answer = `${c.cents > 0 ? '+' : ''}${c.cents}¢`
    return {
      questionText: 'How far off is this note from in tune?',
      correctAnswer: answer,
      answerFormat: 'multiple-choice',
      choices: shuffle(choicesValues).map((v) => ({ label: v, value: v })),
      audioSpec,
      checkWork: `Reference: A4 / 440 Hz. Offset: ${answer}.`,
    }
  }

  // Easy / medium: coarse classification.
  return {
    questionText: 'Is this note sharp, in tune, or flat?',
    correctAnswer: c.coarse,
    answerFormat: 'multiple-choice',
    choices: shuffle([
      { label: 'Sharp (too high)', value: 'sharp' },
      { label: 'In tune',          value: 'in tune' },
      { label: 'Flat (too low)',   value: 'flat' },
    ]),
    audioSpec,
    hint: d === 'easy' ? 'Sharp = too high. Flat = too low. The reference is concert A.' : undefined,
    checkWork: `Reference: A4. Heard: ${c.label}.`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `et-tuning-${d}`,
  topicId: 'et-tuning',
  category: 'ear-training',
  title: 'Tuning — sharp / flat / in tune',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
