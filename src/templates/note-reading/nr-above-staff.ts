import type { ProblemTemplate, GeneratedProblem, Difficulty, MultipleChoiceOption } from '../types'
import { pick, shuffle } from '../../utils/random'

const CHILL = ['G5','G#5','Gb5','A5','A#5','Ab5','B5','Bb5','C6','C#6']    // 10
const MID   = [...CHILL, 'Cb6','D6','Db6']                                  // 13
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
      hint: 'Top line = F. Next space up = G, then A, B, C…',
    }
  }
  if (d === 'medium') return { ...base, hint: 'Include the accidental.' }
  return base
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `nr-above-staff-${d}`,
  topicId: 'nr-above-staff',
  category: 'note-reading',
  title: 'Above the staff',
  difficulty: d,
  answerFormat: d === 'easy' ? 'multiple-choice' : 'note-name',
  generate: () => makeProblem(d),
}))
