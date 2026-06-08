import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { generatePhrase, vexKeySignature, intervalFromMidis, intervalLongName, type PhraseShape } from '../../utils/music'

// Read by distance, not letter. Name the melodic interval between two notes.
const CHILL_KEYS = ['C major', 'F major', 'G major']
const MID_KEYS   = [...CHILL_KEYS, 'Bb major', 'Eb major', 'D major']
const DEMON_KEYS = [...MID_KEYS, 'A major', 'Eb major', 'Ab major']

const CHILL_SHAPES: PhraseShape[] = ['step-up', 'step-down', 'arpeggio']
const MID_SHAPES:   PhraseShape[] = ['step-up', 'step-down', 'arpeggio', 'leap-step']
const DEMON_SHAPES: PhraseShape[] = ['arpeggio', 'leap-step', 'neighbor', 'step-up']

const INTERVAL_POOL = ['m2', 'M2', 'm3', 'M3', 'P4', 'P5', 'M6', 'P8']

function makeProblem(d: Difficulty): GeneratedProblem {
  const keys   = d === 'easy' ? CHILL_KEYS  : d === 'medium' ? MID_KEYS  : DEMON_KEYS
  const shapes = d === 'easy' ? CHILL_SHAPES : d === 'medium' ? MID_SHAPES : DEMON_SHAPES
  const key = pick(keys)
  const phrase = generatePhrase(key, pick(shapes))
  const midis = phrase.notes.map((n) => n.midi)

  // Pick a consecutive pair that isn't a unison.
  let i = 0
  for (let tries = 0; tries < 6; tries++) {
    const cand = Math.floor(Math.random() * (midis.length - 1))
    if (midis[cand] !== midis[cand + 1]) { i = cand; break }
    i = cand
  }
  const correct = intervalFromMidis(midis[i], midis[i + 1])

  const staffSpec = {
    clef: 'treble' as const,
    keySignature: vexKeySignature(key),
    notes: phrase.notes.map((n) => `${n.spec}/q`).join(','),
    width: 360,
    highlightIndex: i,
  }
  const questionText = 'What is the interval from the gold note to the very next note?'
  const feedbackAudioSpec = {
    notes: [midis[i], midis[i + 1]].map((m) => ({ midi: m, durationMs: 460 })),
    timbre: 'reed' as const,
  }

  if (d === 'hard') {
    return {
      questionText: questionText + ' (e.g. M3, P5)',
      correctAnswer: correct,
      answerFormat: 'interval',
      staffSpec,
      checkWork: `${intervalLongName(correct)}.`,
      feedbackAudioSpec,
    }
  }
  const distractors = shuffle(INTERVAL_POOL.filter((v) => v !== correct)).slice(0, 3)
  return {
    questionText,
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: shuffle([correct, ...distractors]).map((v) => ({ label: intervalLongName(v), value: v })),
    staffSpec,
    hint: d === 'easy' ? 'Count letter names: line-to-line or space-to-space is a 3rd.' : undefined,
    feedbackAudioSpec,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-intervals-${d}`,
  topicId: 'sr-intervals',
  category: 'sight-reading',
  title: 'Read the leaps',
  difficulty: d,
  answerFormat: d === 'hard' ? 'interval' : 'multiple-choice',
  generate: () => makeProblem(d),
}))
