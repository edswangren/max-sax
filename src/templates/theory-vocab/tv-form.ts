import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Entry { term: string; meaning: string }

const ENTRIES: Entry[] = [
  { term: 'D.C. (Da Capo)',    meaning: 'go back to the beginning' },
  { term: 'D.S. (Dal Segno)',  meaning: 'go back to the sign (𝄋)' },
  { term: 'Fine',              meaning: 'the end (stop here)' },
  { term: 'D.C. al Fine',      meaning: 'back to the beginning, then play until Fine' },
  { term: 'D.S. al Fine',      meaning: 'back to the sign, then play until Fine' },
  { term: 'D.C. al Coda',      meaning: 'back to the beginning, then jump to the Coda when marked' },
  { term: 'D.S. al Coda',      meaning: 'back to the sign, then jump to the Coda when marked' },
  { term: 'Coda',              meaning: 'a separate closing section' },
  { term: '1st ending',        meaning: 'play this only the first time through' },
  { term: '2nd ending',        meaning: 'play this on the repeat (skip the 1st ending)' },
  { term: 'Repeat sign (𝄆 𝄇)', meaning: 'play this section again' },
]

const EASY = ENTRIES.filter((e) => ['D.C. (Da Capo)','D.S. (Dal Segno)','Fine','Coda','Repeat sign (𝄆 𝄇)'].includes(e.term))

function mcOptions(correct: string, pool: string[], n = 4) {
  const distractors = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1)
  return shuffle([correct, ...distractors]).map((v) => ({ label: v, value: v }))
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = d === 'easy' ? EASY : ENTRIES
  const e = pick(pool)
  const meanings = ENTRIES.map((x) => x.meaning)
  return {
    questionText: `What does "${e.term}" mean?`,
    correctAnswer: e.meaning,
    answerFormat: 'multiple-choice',
    choices: mcOptions(e.meaning, meanings),
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `tv-form-${d}`,
  topicId: 'tv-form',
  category: 'theory-vocab',
  title: 'Form & repeat signs',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
