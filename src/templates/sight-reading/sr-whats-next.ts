import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { generatePhrase, buildScale, vexKeySignature, type PhraseShape } from '../../utils/music'
import { mcFrom } from './_shared'

// Eyes ahead: weak readers read note-by-note. Show the start of a pattern,
// predict where it goes next.
const CHILL_KEYS = ['C major', 'F major', 'G major']
const MID_KEYS   = [...CHILL_KEYS, 'Bb major', 'Eb major', 'D major']
const DEMON_KEYS = [...MID_KEYS, 'A major', 'Ab major', 'E major']

const CHILL_SHAPES: PhraseShape[] = ['step-up', 'step-down', 'arpeggio']
const MID_SHAPES:   PhraseShape[] = ['step-up', 'step-down', 'arpeggio', 'neighbor']
const DEMON_SHAPES: PhraseShape[] = ['step-up', 'step-down', 'arpeggio', 'neighbor', 'leap-step']

function makeProblem(d: Difficulty): GeneratedProblem {
  const keys   = d === 'easy' ? CHILL_KEYS  : d === 'medium' ? MID_KEYS  : DEMON_KEYS
  const shapes = d === 'easy' ? CHILL_SHAPES : d === 'medium' ? MID_SHAPES : DEMON_SHAPES
  const key = pick(keys)
  const phrase = generatePhrase(key, pick(shapes))
  const shown = phrase.notes.slice(0, 3)
  const next = phrase.notes[3]
  const correct = next.name

  const root = key.replace(/ major$/, '')
  const scale = buildScale(root, 'major')
  const candidates = [...scale, ...shown.map((n) => n.name)]

  return {
    questionText: 'This pattern continues. What is the NEXT note?',
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: mcFrom(correct, candidates),
    staffSpec: {
      clef: 'treble',
      keySignature: vexKeySignature(key),
      notes: shown.map((n) => `${n.spec}/q`).join(','),
      width: 320,
    },
    hint: d === 'easy' ? 'Find the shape: stepping up? skipping? Keep it going.' : undefined,
    checkWork: `Full pattern: ${phrase.notes.map((n) => n.name).join(' – ')}.`,
    feedbackAudioSpec: { notes: phrase.notes.map((n) => ({ midi: n.midi, durationMs: 380 })), timbre: 'reed' },
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-whats-next-${d}`,
  topicId: 'sr-whats-next',
  category: 'sight-reading',
  title: 'Eyes ahead',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
