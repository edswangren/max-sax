import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'
import { applyKeySignatureToLetter, vexKeySignature } from '../../utils/music'

// Treble staff positions (E4..F5) used as the "name this note" target.
// The note spec passed to Staff carries no accidental — VexFlow renders just
// the letter on the line/space, and the staff key signature implies the
// actual pitch. Student must apply the key sig themselves.
const STAFF_POSITIONS = ['E4','F4','G4','A4','B4','C5','D5','E5','F5']

const CHILL_KEYS = ['G major', 'F major']
const MID_KEYS   = ['G major', 'D major', 'A major', 'F major', 'Bb major', 'Eb major']
const DEMON_KEYS = [
  'G major','D major','A major','E major','B major','F# major',
  'F major','Bb major','Eb major','Ab major','Db major',
]

function letterOf(note: string): string { return note[0].toUpperCase() }

function pickPosition(majorKey: string): string {
  // 60% pick a position altered by the key sig, 40% pick an unaltered one.
  // Keeps the student honest — they can't just auto-apply the sharp/flat.
  const altered = STAFF_POSITIONS.filter((p) => applyKeySignatureToLetter(letterOf(p), majorKey) !== letterOf(p))
  const unaltered = STAFF_POSITIONS.filter((p) => applyKeySignatureToLetter(letterOf(p), majorKey) === letterOf(p))
  if (altered.length === 0) return pick(STAFF_POSITIONS)
  if (unaltered.length === 0) return pick(altered)
  return Math.random() < 0.6 ? pick(altered) : pick(unaltered)
}

function mcChoices(correct: string, key: string): MultipleChoiceOption[] {
  // Distractor pool: every staff letter as-altered-by-key, plus the natural
  // version of any altered letter (the common student error).
  const altered = STAFF_POSITIONS.map((p) => applyKeySignatureToLetter(letterOf(p), key))
  const naturals = STAFF_POSITIONS.map((p) => letterOf(p))
  const pool = [...new Set([...altered, ...naturals])].filter((p) => p !== correct)
  const distractors = shuffle(pool).slice(0, 3)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const keys = d === 'easy' ? CHILL_KEYS : d === 'medium' ? MID_KEYS : DEMON_KEYS
  const key = pick(keys)
  const position = pickPosition(key)
  const letter = letterOf(position)
  const correctAnswer = applyKeySignatureToLetter(letter, key)

  const base: GeneratedProblem = {
    questionText: `Key of ${key}. Name this note.`,
    correctAnswer,
    answerFormat: 'note-name',
    staffSpec: {
      clef: 'treble',
      keySignature: vexKeySignature(key),
      notes: `${position}/w`,
    },
  }
  if (d === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: mcChoices(correctAnswer, key),
      hint: 'Check the key signature at the start of the staff first.',
    }
  }
  if (d === 'medium') {
    return { ...base, hint: 'Read the key sig before the note.' }
  }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-in-key-${d}`,
  topicId: 'nr-in-key',
  category: 'note-reading',
  title: 'Notes in a key signature',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
