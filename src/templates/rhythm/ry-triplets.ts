import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Q { question: string; correct: string; choices: string[]; explain?: string }

const QUESTIONS: Q[] = [
  { question: 'An eighth-note triplet plays 3 notes in the time of how many regular eighths?',
    correct: '2', choices: ['1','2','3','4'], explain: 'Triplet = 3 in the time of 2.' },
  { question: 'A quarter-note triplet fills the time of how many regular quarters?',
    correct: '2', choices: ['1','2','3','4'] },
  { question: 'How is an eighth-note triplet usually counted?',
    correct: 'trip-le-t', choices: ['1 & a','1 e & a','trip-le-t','1 2 3'], explain: 'Many players say "trip-le-t" or "1-and-a" but the 3 notes are even within 1 beat.' },
  { question: 'A "tuplet" is...',
    correct: 'an irregular grouping that doesn\'t fit the meter normally',
    choices: ['a triplet only','any pair of notes','an irregular grouping that doesn\'t fit the meter normally','a tied pair'] },
  { question: 'Sixteenth-note triplets play how many notes in 1 beat?',
    correct: '6', choices: ['3','4','6','8'], explain: 'Each eighth triplet has 3; doubled in sixteenths = 6 in a beat.' },
]

function makeProblem(d: Difficulty): GeneratedProblem {
  const q = pick(QUESTIONS)
  const choices = shuffle(q.choices).map((v) => ({ label: v, value: v }))
  return {
    questionText: q.question,
    correctAnswer: q.correct,
    answerFormat: 'multiple-choice',
    choices,
    checkWork: d !== 'hard' ? q.explain : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `ry-triplets-${d}`,
  topicId: 'ry-triplets',
  category: 'rhythm',
  title: 'Triplets',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
