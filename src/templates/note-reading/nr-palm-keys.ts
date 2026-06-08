import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'

const CHILL = ['D6','D#6','Eb6','E6','F6','F#6','Gb6']                      // 7
const MID   = [...CHILL, 'Db6','Fb6']                                       // 9
const DEMON = [...MID]

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
    questionText: 'Name this note (palm-key range).',
    correctAnswer: pc,
    answerFormat: 'note-name',
    staffSpec: { clef: 'treble', notes: `${note}/w` },
  }
  if (d === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: mcChoices(pc, pool),
      hint: 'Three ledger lines above the staff = palm D.',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Include the accidental.' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-palm-keys-${d}`,
  topicId: 'nr-palm-keys',
  category: 'note-reading',
  title: 'Palm-key range',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
