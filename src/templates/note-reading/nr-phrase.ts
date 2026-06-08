import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'
import { buildScale, generatePhrase, vexKeySignature, type PhraseShape } from '../../utils/music'

const CHILL_KEYS = ['C major', 'F major', 'G major']
const MID_KEYS   = [...CHILL_KEYS, 'Bb major', 'Eb major', 'D major']
const DEMON_KEYS = [...MID_KEYS, 'A major', 'Ab major', 'E major']

const CHILL_SHAPES: PhraseShape[] = ['step-up', 'step-down']
const MID_SHAPES:   PhraseShape[] = ['step-up', 'step-down', 'arpeggio', 'neighbor']
const DEMON_SHAPES: PhraseShape[] = ['step-up', 'step-down', 'arpeggio', 'neighbor', 'leap-step']

type Attribute = 'first' | 'last' | 'highest' | 'lowest' | 'third'

const ATTR_LABEL: Record<Attribute, string> = {
  first:   'FIRST note',
  last:    'LAST note',
  highest: 'HIGHEST note',
  lowest:  'LOWEST note',
  third:   '3rd note',
}

function pickAttribute(): Attribute {
  return pick(['first', 'last', 'highest', 'lowest', 'third'] as Attribute[])
}

function answerFor(attr: Attribute, names: string[], midis: number[]): string {
  switch (attr) {
    case 'first':   return names[0]
    case 'last':    return names[names.length - 1]
    case 'third':   return names[2]
    case 'highest': return names[midis.indexOf(Math.max(...midis))]
    case 'lowest':  return names[midis.indexOf(Math.min(...midis))]
  }
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const keys   = d === 'easy' ? CHILL_KEYS  : d === 'medium' ? MID_KEYS  : DEMON_KEYS
  const shapes = d === 'easy' ? CHILL_SHAPES : d === 'medium' ? MID_SHAPES : DEMON_SHAPES
  const key = pick(keys)
  const shape = pick(shapes)
  const phrase = generatePhrase(key, shape)

  const attr = pickAttribute()
  const names = phrase.notes.map((n) => n.name)
  const midis = phrase.notes.map((n) => n.midi)
  const correctAnswer = answerFor(attr, names, midis)

  const staffSpec = {
    clef: 'treble' as const,
    keySignature: vexKeySignature(key),
    notes: phrase.notes.map((n) => `${n.spec}/q`).join(','),
    width: 360,
  }

  const base: GeneratedProblem = {
    questionText: `Key of ${key}. What's the ${ATTR_LABEL[attr]} in this phrase?`,
    correctAnswer,
    answerFormat: 'note-name',
    staffSpec,
  }
  if (d === 'easy' || d === 'medium') {
    // Distractors: the other phrase names, padded from the scale if phrase
    // has duplicates. Always 4 plausible choices, never a "—" filler.
    const root = key.replace(/ major$/, '')
    const scaleNames = buildScale(root, 'major')
    const phraseUnique = [...new Set(names)].filter((n) => n !== correctAnswer)
    const scaleExtras = scaleNames.filter((n) => n !== correctAnswer && !phraseUnique.includes(n))
    const pool = [...phraseUnique, ...shuffle(scaleExtras)]
    const distractors: MultipleChoiceOption[] = pool.slice(0, 3).map((v) => ({ label: v, value: v }))
    const choices = shuffle([{ label: correctAnswer, value: correctAnswer }, ...distractors])
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices,
      hint: d === 'easy' ? 'Scan the phrase before answering. Check the key sig first.' : undefined,
    }
  }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-phrase-${d}`,
  topicId: 'nr-phrase',
  category: 'note-reading',
  title: 'Phrase reading',
  difficulty: d,
  answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
  generate: () => makeProblem(d),
}))
