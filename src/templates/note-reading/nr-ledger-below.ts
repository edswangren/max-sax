import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'

// Below the staff: D4 down to G3 (sax low range up to written E4 = staff bottom).
const CHILL = ['D4','D#4','Db4','C4','C#4','B3','Bb3']                   // 7
const MID   = [...CHILL, 'A3','Ab3','A#3']                                // 10
const DEMON = [...MID, 'G3','G#3','Gb3']                                  // 13

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
      hint: 'First ledger below the staff = middle C (C4).',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Include the accidental (B vs B♭).' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-ledger-below-${d}`,
  topicId: 'nr-ledger-below',
  category: 'note-reading',
  title: 'Ledger lines below',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
