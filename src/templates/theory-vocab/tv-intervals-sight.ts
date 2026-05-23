import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { noteNameToMidi, intervalFromMidis, intervalLongName, midiToNoteNameSharp } from '../../utils/music'

// Pool of starting notes within the treble staff range
const STAFF_NOTES = ['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5']

// Diatonic intervals (within a C-major frame) — easier
const DIATONIC_OFFSETS = [1, 2, 3, 4, 5, 7] // m2, M2, m3, M3, P4, P5
// Add 6ths, 7ths, octave for medium
const EXTENDED_OFFSETS = [...DIATONIC_OFFSETS, 8, 9, 11, 12]
// Add tritone, semitone variations for hard
const ALL_OFFSETS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

function chooseOffsets(d: Difficulty): number[] {
  if (d === 'easy') return DIATONIC_OFFSETS
  if (d === 'medium') return EXTENDED_OFFSETS
  return ALL_OFFSETS
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const offsets = chooseOffsets(d)
  // pick a starting note that leaves room within a reasonable range
  let attempts = 20
  let lower = pick(STAFF_NOTES)
  let offset = pick(offsets)
  let lowerMidi = noteNameToMidi(lower)!
  while ((lowerMidi + offset > 84 /* C6 */) && attempts-- > 0) {
    lower = pick(STAFF_NOTES)
    offset = pick(offsets)
    lowerMidi = noteNameToMidi(lower)!
  }
  const upperMidi = lowerMidi + offset
  const upper = midiToNoteNameSharp(upperMidi)
  const interval = intervalFromMidis(lowerMidi, upperMidi)
  const long = intervalLongName(interval)

  // Build a 4-option MC of plausible intervals
  const allOptions = ['m2','M2','m3','M3','P4','A4','P5','m6','M6','m7','M7','P8']
  const distractors = allOptions.filter((x) => x !== interval).sort(() => Math.random() - 0.5).slice(0, 3)
  const choices = [interval, ...distractors].sort(() => Math.random() - 0.5)
    .map((v) => ({ label: `${v} (${intervalLongName(v)})`, value: v }))

  return {
    questionText: `Name the interval between these two notes.`,
    correctAnswer: interval,
    acceptableAnswers: [interval, long],
    answerFormat: 'multiple-choice',
    choices,
    staffSpec: { clef: 'treble', notes: `${lower}/w, ${upper}/w` },
    hint: d === 'easy' ? 'Count the line/space steps from low to high (include both notes).' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `tv-intervals-sight-${d}`,
  topicId: 'tv-intervals-sight',
  category: 'theory-vocab',
  title: 'Intervals by sight',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
