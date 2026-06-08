import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'
import { applyKeySignatureToLetter, vexKeySignature } from '../../utils/music'

// Key sig PLUS an explicit accidental on the note — the accidental wins.
// Trains the common error of reading the key sig but ignoring courtesy /
// cancellation accidentals.
const STAFF_POSITIONS = ['E4','F4','G4','A4','B4','C5','D5','E5','F5']

const CHILL_KEYS = ['G major', 'D major', 'F major', 'Bb major']
const MID_KEYS   = [...CHILL_KEYS, 'A major', 'Eb major']
const DEMON_KEYS = [
  'G major','D major','A major','E major','B major','F# major',
  'F major','Bb major','Eb major','Ab major',
]

function letterOf(note: string): string { return note[0].toUpperCase() }

interface Problem {
  pos: string                     // 'F4'
  acc: '#' | 'b' | 'n'            // accidental drawn on the staff
  correctAnswer: string           // 'F#', 'Fb', 'F'
}

function makeRandomProblem(key: string): Problem {
  const pos = pick(STAFF_POSITIONS)
  const letter = letterOf(pos)
  const keySigAlteredTo = applyKeySignatureToLetter(letter, key)
  const isKeyAltered = keySigAlteredTo !== letter

  // Three useful situations:
  //   1. Natural sign cancels a key-sig sharp/flat → pitch is the natural letter.
  //   2. Sharp on a position the key sig already sharpened (redundant courtesy) → still sharp.
  //   3. Flat on a position the key sig sharpened (or vice versa) → contradicts.
  // We pick whichever is musically plausible.
  let acc: '#' | 'b' | 'n'
  let correctAnswer: string
  if (isKeyAltered) {
    // Mix between cancellation (natural) and an opposite accidental.
    const choice = Math.random()
    if (choice < 0.55) {
      acc = 'n'
      correctAnswer = letter
    } else if (keySigAlteredTo.endsWith('#')) {
      // Was sharp; courtesy adds flat (rare but possible).
      acc = 'b'
      correctAnswer = letter + 'b'
    } else {
      acc = '#'
      correctAnswer = letter + '#'
    }
  } else {
    // Unaltered position; the explicit accidental is the whole story.
    const choice = Math.random()
    if (choice < 0.5) {
      acc = '#'
      correctAnswer = letter + '#'
    } else {
      acc = 'b'
      correctAnswer = letter + 'b'
    }
  }
  return { pos, acc, correctAnswer }
}

function mcChoices(correct: string, letter: string): MultipleChoiceOption[] {
  const pool = [letter, letter + '#', letter + 'b']
  const distractors = shuffle(pool.filter((v) => v !== correct)).slice(0, 2)
  // 4th distractor: a different staff letter, randomized.
  const otherLetters = ['E','F','G','A','B','C','D'].filter((L) => L !== letter)
  const otherLetter = pick(otherLetters)
  const fourth = otherLetter + (Math.random() < 0.5 ? '' : '#')
  return shuffle([correct, ...distractors, fourth]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const keys = d === 'easy' ? CHILL_KEYS : d === 'medium' ? MID_KEYS : DEMON_KEYS
  const key = pick(keys)
  const p = makeRandomProblem(key)
  const letter = letterOf(p.pos)
  const noteSpec = `${letter}${p.acc}${p.pos.slice(1)}/w`

  const base: GeneratedProblem = {
    questionText: `Key of ${key}. Name this note (read the accidental).`,
    correctAnswer: p.correctAnswer,
    answerFormat: 'note-name',
    staffSpec: {
      clef: 'treble',
      keySignature: vexKeySignature(key),
      notes: noteSpec,
    },
  }
  if (d === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: mcChoices(p.correctAnswer, letter),
      hint: 'An explicit accidental on the note overrides the key signature.',
    }
  }
  if (d === 'medium') {
    return { ...base, hint: 'The accidental on the note wins over the key sig.' }
  }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-courtesy-accidental-${d}`,
  topicId: 'nr-courtesy-accidental',
  category: 'note-reading',
  title: 'Courtesy & cancellation accidentals',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
