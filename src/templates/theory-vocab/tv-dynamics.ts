import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Entry { symbol: string; name: string; meaning: string }

const ENTRIES: Entry[] = [
  { symbol: 'pp',  name: 'pianissimo',     meaning: 'very soft' },
  { symbol: 'p',   name: 'piano',          meaning: 'soft' },
  { symbol: 'mp',  name: 'mezzo-piano',    meaning: 'medium soft' },
  { symbol: 'mf',  name: 'mezzo-forte',    meaning: 'medium loud' },
  { symbol: 'f',   name: 'forte',          meaning: 'loud' },
  { symbol: 'ff',  name: 'fortissimo',     meaning: 'very loud' },
  { symbol: 'cresc.', name: 'crescendo',   meaning: 'gradually louder' },
  { symbol: 'dim.',   name: 'diminuendo',  meaning: 'gradually softer' },
  { symbol: 'sfz', name: 'sforzando',      meaning: 'sudden strong accent' },
]

const EASY_POOL = ENTRIES.slice(0, 6)

function mcOptions(correct: string, pool: string[], n = 4): { label: string; value: string }[] {
  const distractors = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(difficulty: Difficulty): GeneratedProblem {
  const pool = difficulty === 'easy' ? EASY_POOL : ENTRIES
  const e = pick(pool)
  const meaningPool = ENTRIES.map((x) => x.meaning)
  const symPool = ENTRIES.map((x) => x.symbol)

  // direction varies by difficulty
  const mode = difficulty === 'easy' ? 'symbol-to-meaning'
    : difficulty === 'medium' ? (Math.random() < 0.5 ? 'symbol-to-meaning' : 'meaning-to-symbol')
    : pick(['symbol-to-meaning', 'meaning-to-symbol', 'name-to-symbol'] as const)

  if (mode === 'meaning-to-symbol') {
    return {
      questionText: `Which dynamic means "${e.meaning}"?`,
      correctAnswer: e.symbol,
      answerFormat: 'multiple-choice',
      choices: mcOptions(e.symbol, symPool),
    }
  }
  if (mode === 'name-to-symbol') {
    return {
      questionText: `What's the symbol for "${e.name}"?`,
      correctAnswer: e.symbol,
      answerFormat: 'multiple-choice',
      choices: mcOptions(e.symbol, symPool),
    }
  }
  return {
    questionText: `What does "${e.symbol}" mean?`,
    correctAnswer: e.meaning,
    answerFormat: 'multiple-choice',
    choices: mcOptions(e.meaning, meaningPool),
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `tv-dynamics-${d}`,
  topicId: 'tv-dynamics',
  category: 'theory-vocab',
  title: 'Dynamics',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
