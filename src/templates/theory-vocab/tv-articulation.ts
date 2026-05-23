import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Entry { name: string; symbol: string; meaning: string }

const ENTRIES: Entry[] = [
  { name: 'staccato', symbol: 'dot above/below the note',      meaning: 'short and detached' },
  { name: 'accent',   symbol: '> above/below the note',         meaning: 'play with extra emphasis' },
  { name: 'tenuto',   symbol: 'short flat line above the note', meaning: 'hold for full value with slight stress' },
  { name: 'marcato',  symbol: '^ above the note',               meaning: 'heavily marked, stronger than an accent' },
  { name: 'slur',     symbol: 'curved line over multiple notes', meaning: 'play smoothly connected — only tongue the first note' },
  { name: 'fermata',  symbol: 'curved line with a dot (an "eye")', meaning: 'hold the note longer than its value' },
  { name: 'legato',   symbol: '(usually written as a word)',     meaning: 'play smoothly and connected' },
]

function mcOptions(correct: string, pool: string[], n = 4) {
  const distractors = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const e = pick(ENTRIES)
  const meanings = ENTRIES.map((x) => x.meaning)
  const names = ENTRIES.map((x) => x.name)

  if (d !== 'easy' && Math.random() < 0.4) {
    return {
      questionText: `Which articulation means "${e.meaning}"?`,
      correctAnswer: e.name,
      answerFormat: 'multiple-choice',
      choices: mcOptions(e.name, names),
    }
  }
  return {
    questionText: `What does "${e.name}" mean?`,
    correctAnswer: e.meaning,
    answerFormat: 'multiple-choice',
    choices: mcOptions(e.meaning, meanings),
    hint: d === 'easy' ? `Symbol: ${e.symbol}` : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `tv-articulation-${d}`,
  topicId: 'tv-articulation',
  category: 'theory-vocab',
  title: 'Articulation marks',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
