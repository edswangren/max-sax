import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'

// Altissimo basics — above palm F#. Tall staff to fit the ledger stack.
const CHILL = ['G6','G#6','Gb6','A6','A#6','Ab6','B6','Bb6','C7','C#7']     // 10
const MID   = [...CHILL, 'Cb7','D7','Db7']                                   // 13
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
    questionText: 'Name this altissimo note.',
    correctAnswer: pc,
    answerFormat: 'note-name',
    staffSpec: { clef: 'treble', notes: `${note}/w`, height: 170 },
  }
  if (d === 'easy') {
    return {
      ...base,
      answerFormat: 'multiple-choice',
      choices: mcChoices(pc, pool),
      hint: 'Altissimo starts at G (one step above palm F♯).',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Count ledger lines carefully — they stack fast up here.' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-altissimo-${d}`,
  topicId: 'nr-altissimo',
  category: 'note-reading',
  title: 'Altissimo basics',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
