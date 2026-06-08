import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'

// Full treble staff (E4 to F5) with accidentals at increasing density.
const CHILL = [
  'E4','Eb4',
  'F4','F#4',
  'G4','G#4','Gb4',
  'A4','Ab4',
  'B4','Bb4',
  'C5','C#5',
  'D5','D#5','Db5',
  'E5','Eb5',
  'F5','F#5',
] // 20 entries
const MID   = [...CHILL, 'A#4', 'Cb5']                  // 22
const DEMON = [...MID, 'Fb5']                           // 23

function pcOf(n: string): string { return n.replace(/\d+$/, '') }

function mcChoices(correct: string, pool: string[]): MultipleChoiceOption[] {
  const pcs = [...new Set(pool.map(pcOf))]
  const distractors = shuffle(pcs.filter((p) => p !== correct)).slice(0, 3)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? CHILL : d === 'medium' ? MID : DEMON
  const note = pick(pool)
  const pc = pcOf(note)
  const base: GeneratedProblem = {
    questionText: 'Name this note.',
    correctAnswer: pc,
    answerFormat: 'note-name',
    staffSpec: { clef: 'treble', notes: `${note}/w` },
  }
  if (d === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: mcChoices(pc, pool),
      hint: 'Read the accidental in front of the note.',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Include the accidental — F vs F#.' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-mixed-${d}`,
  topicId: 'nr-mixed',
  category: 'note-reading',
  title: 'Lines & spaces mixed',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
