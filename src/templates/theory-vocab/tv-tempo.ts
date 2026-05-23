import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Entry { name: string; meaning: string; bpm?: string }

const ENTRIES: Entry[] = [
  { name: 'Largo',       meaning: 'very slow',                     bpm: '40–60' },
  { name: 'Adagio',      meaning: 'slow',                          bpm: '66–76' },
  { name: 'Andante',     meaning: 'walking pace',                  bpm: '76–108' },
  { name: 'Moderato',    meaning: 'moderate',                      bpm: '108–120' },
  { name: 'Allegro',     meaning: 'fast and lively',               bpm: '120–168' },
  { name: 'Presto',      meaning: 'very fast',                     bpm: '168–200' },
  { name: 'Accelerando', meaning: 'gradually getting faster' },
  { name: 'Ritardando',  meaning: 'gradually getting slower' },
  { name: 'A tempo',     meaning: 'return to original tempo' },
  { name: 'Rubato',      meaning: 'with flexible timing' },
]

const EASY = ENTRIES.slice(0, 6)

function mcOptions(correct: string, pool: string[], n = 4) {
  const distractors = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY : ENTRIES
  const e = pick(pool)
  const allMeanings = ENTRIES.map((x) => x.meaning)
  const allNames = ENTRIES.map((x) => x.name)

  if (d !== 'easy' && Math.random() < 0.5) {
    return {
      questionText: `Which tempo marking means "${e.meaning}"?`,
      correctAnswer: e.name,
      answerFormat: 'multiple-choice',
      choices: mcOptions(e.name, allNames),
    }
  }
  return {
    questionText: `What does "${e.name}" mean?`,
    correctAnswer: e.meaning,
    answerFormat: 'multiple-choice',
    choices: mcOptions(e.meaning, allMeanings),
    hint: e.bpm ? `Around ${e.bpm} bpm` : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `tv-tempo-${d}`,
  topicId: 'tv-tempo',
  category: 'theory-vocab',
  title: 'Tempo markings',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
