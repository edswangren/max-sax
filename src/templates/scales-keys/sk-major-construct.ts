import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { buildScale, noteNameToMidi, pitchClassToSemitone } from '../../utils/music'

const EASY_ROOTS  = ['C', 'F', 'G', 'Bb', 'D']
const MID_ROOTS   = [...EASY_ROOTS, 'Eb', 'A', 'Ab']
const HARD_ROOTS  = [...MID_ROOTS, 'Db', 'E', 'B', 'Gb']

// Pick a sensible starting octave for the scale audio. Anchor the root in C4-B4
// so the full ascending scale stays under MIDI 84 (C6).
function rootMidiFor(root: string): number {
  const explicit = noteNameToMidi(`${root}4`)
  if (explicit !== undefined) return explicit
  const semi = pitchClassToSemitone(root)
  return semi === undefined ? 60 : 60 + semi
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const roots = d === 'easy' ? EASY_ROOTS : d === 'medium' ? MID_ROOTS : HARD_ROOTS
  const root = pick(roots)
  const scale = buildScale(root, 'major')
  const answer = scale.join(', ')
  const rootMidi = rootMidiFor(root)
  const scaleIntervals = [0, 2, 4, 5, 7, 9, 11, 12]
  const audioNotes = scaleIntervals.map((semi) => ({ midi: rootMidi + semi, durationMs: 320 }))
  return {
    questionText: `List the notes of the ${root} major scale (ascending, no octave needed).`,
    correctAnswer: answer,
    acceptableAnswers: [answer, scale.join(',')],
    answerFormat: 'note-sequence',
    hint: 'Pattern: W W H W W W H. Use one letter per scale degree.',
    checkWork: `${root} major: ${scale.join(' – ')}`,
    feedbackAudioSpec: { notes: audioNotes, gapMs: 0, timbre: 'clean' },
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-major-construct-${d}`,
  topicId: 'sk-major-construct',
  category: 'scales-keys',
  title: 'Build a major scale',
  difficulty: d,
  answerFormat: 'note-sequence',
  generate: () => makeProblem(d),
}))
