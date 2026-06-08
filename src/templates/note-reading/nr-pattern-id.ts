import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { generatePhrase, vexKeySignature, type PhraseShape } from '../../utils/music'

const CHILL_KEYS = ['C major', 'F major', 'G major']
const MID_KEYS   = [...CHILL_KEYS, 'Bb major', 'Eb major', 'D major']
const DEMON_KEYS = [...MID_KEYS, 'A major', 'Ab major', 'E major']

const CHILL_SHAPES: PhraseShape[] = ['step-up', 'step-down', 'arpeggio']
const MID_SHAPES:   PhraseShape[] = ['step-up', 'step-down', 'arpeggio', 'neighbor']
const DEMON_SHAPES: PhraseShape[] = ['step-up', 'step-down', 'arpeggio', 'neighbor', 'leap-step']

// All shapes map to one of these 4 high-level categories for the student.
type Category = 'Scale fragment' | 'Arpeggio (1-3-5)' | 'Neighbor tone' | 'Leap + step'

const SHAPE_CATEGORY: Record<PhraseShape, Category> = {
  'step-up':   'Scale fragment',
  'step-down': 'Scale fragment',
  'arpeggio':  'Arpeggio (1-3-5)',
  'neighbor':  'Neighbor tone',
  'leap-step': 'Leap + step',
}

const ALL_CATEGORIES: Category[] = ['Scale fragment', 'Arpeggio (1-3-5)', 'Neighbor tone', 'Leap + step']

function makeProblem(d: Difficulty): GeneratedProblem {
  const keys   = d === 'easy' ? CHILL_KEYS  : d === 'medium' ? MID_KEYS  : DEMON_KEYS
  const shapes = d === 'easy' ? CHILL_SHAPES : d === 'medium' ? MID_SHAPES : DEMON_SHAPES
  const key = pick(keys)
  const shape = pick(shapes)
  const phrase = generatePhrase(key, shape)
  const correct = SHAPE_CATEGORY[shape]

  const staffSpec = {
    clef: 'treble' as const,
    keySignature: vexKeySignature(key),
    notes: phrase.notes.map((n) => `${n.spec}/q`).join(','),
    width: 360,
  }

  return {
    questionText: `What kind of pattern is this?`,
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: shuffle(ALL_CATEGORIES).map((c) => ({ label: c, value: c })),
    staffSpec,
    hint: d === 'easy' ? 'Stepwise = scale. 1-3-5 = arpeggio. Up-then-down = neighbor.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-pattern-id-${d}`,
  topicId: 'nr-pattern-id',
  category: 'note-reading',
  title: 'Pattern recognition',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
