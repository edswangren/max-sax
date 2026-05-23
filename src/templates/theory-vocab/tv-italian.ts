import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Entry { term: string; meaning: string }

const ENTRIES: Entry[] = [
  { term: 'legato',     meaning: 'smoothly connected' },
  { term: 'staccato',   meaning: 'short and detached' },
  { term: 'dolce',      meaning: 'sweetly' },
  { term: 'espressivo', meaning: 'expressively' },
  { term: 'cantabile',  meaning: 'in a singing style' },
  { term: 'marcato',    meaning: 'marked, with emphasis' },
  { term: 'subito',     meaning: 'suddenly' },
  { term: 'molto',      meaning: 'very (a lot)' },
  { term: 'poco',       meaning: 'a little' },
  { term: 'meno mosso', meaning: 'less motion (slower)' },
  { term: 'più mosso',  meaning: 'more motion (faster)' },
  { term: 'mezzo',      meaning: 'half / medium' },
  { term: 'simile',     meaning: 'similar — continue in the same manner' },
  { term: 'attacca',    meaning: 'go right into the next section' },
]

const EASY = ENTRIES.slice(0, 7)

function mcOptions(correct: string, pool: string[], n = 4) {
  const distractors = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY : ENTRIES
  const e = pick(pool)
  const meanings = ENTRIES.map((x) => x.meaning)
  const terms = ENTRIES.map((x) => x.term)

  if (d === 'hard' && Math.random() < 0.5) {
    return {
      questionText: `Which Italian term means "${e.meaning}"?`,
      correctAnswer: e.term,
      answerFormat: 'multiple-choice',
      choices: mcOptions(e.term, terms),
    }
  }
  return {
    questionText: `What does "${e.term}" mean?`,
    correctAnswer: e.meaning,
    answerFormat: 'multiple-choice',
    choices: mcOptions(e.meaning, meanings),
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `tv-italian-${d}`,
  topicId: 'tv-italian',
  category: 'theory-vocab',
  title: 'Italian terms',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
