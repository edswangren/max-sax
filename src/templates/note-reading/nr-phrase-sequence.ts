import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { generatePhrase, vexKeySignature, type PhraseShape } from '../../utils/music'

const CHILL_KEYS = ['C major', 'F major', 'G major']
const MID_KEYS   = [...CHILL_KEYS, 'Bb major', 'Eb major', 'D major']
const DEMON_KEYS = [...MID_KEYS, 'A major', 'Ab major', 'E major']

const CHILL_SHAPES: PhraseShape[] = ['step-up', 'step-down']
const MID_SHAPES:   PhraseShape[] = ['step-up', 'step-down', 'arpeggio']
const DEMON_SHAPES: PhraseShape[] = ['step-up', 'step-down', 'arpeggio', 'neighbor', 'leap-step']

function makeProblem(d: Difficulty): GeneratedProblem {
  const keys   = d === 'easy' ? CHILL_KEYS  : d === 'medium' ? MID_KEYS  : DEMON_KEYS
  const shapes = d === 'easy' ? CHILL_SHAPES : d === 'medium' ? MID_SHAPES : DEMON_SHAPES
  const key = pick(keys)
  const shape = pick(shapes)
  const phrase = generatePhrase(key, shape)
  const names = phrase.notes.map((n) => n.name)
  const correct = names.join(', ')

  const staffSpec = {
    clef: 'treble' as const,
    keySignature: vexKeySignature(key),
    notes: phrase.notes.map((n) => `${n.spec}/q`).join(','),
    width: 360,
  }

  return {
    questionText: `Key of ${key}. Type the four notes in order, comma-separated.`,
    correctAnswer: correct,
    acceptableAnswers: [correct, names.join(','), names.join(' ')],
    answerFormat: 'note-sequence',
    staffSpec,
    hint: d === 'easy' ? 'Apply the key sig to each note. Example: "Bb, C, D, Eb"' : undefined,
    checkWork: `Notes: ${names.join(' – ')}`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-phrase-sequence-${d}`,
  topicId: 'nr-phrase-sequence',
  category: 'note-reading',
  title: 'Read the whole phrase',
  difficulty: d,
  answerFormat: 'note-sequence',
  generate: () => makeProblem(d),
}))
