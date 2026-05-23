import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Q { question: string; correct: string; choices: string[]; explain?: string }

const QUESTIONS: Q[] = [
  { question: 'In 6/8 (compound feel), how many big beats per measure?',
    correct: '2', choices: ['1','2','3','6'], explain: '6/8 = two big beats, each made of three eighths.' },
  { question: 'In 6/8, what note gets the big beat?',
    correct: 'dotted quarter', choices: ['quarter','dotted quarter','eighth','half'] },
  { question: 'How many eighth notes are in one big beat of 6/8?',
    correct: '3', choices: ['2','3','4','6'] },
  { question: 'In 9/8 (compound triple), how many big beats per measure?',
    correct: '3', choices: ['2','3','6','9'] },
  { question: 'In 12/8 (compound quadruple), how many big beats per measure?',
    correct: '4', choices: ['3','4','6','12'] },
  { question: 'Compound meter is grouped in...',
    correct: 'threes', choices: ['twos','threes','fours','fives'], explain: 'Compound = each big beat divides into 3 smaller notes.' },
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
  id: `ry-compound-${d}`,
  topicId: 'ry-compound',
  category: 'rhythm',
  title: 'Compound meter (6/8)',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
