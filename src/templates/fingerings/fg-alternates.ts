import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Q { question: string; correct: string; choices: string[]; explain?: string }

const QUESTIONS: Q[] = [
  { question: 'Going from A to Bb to A smoothly — which Bb is easiest?',
    correct: 'bis Bb', choices: ['bis Bb','side Bb','1-and-1 Bb','thumb Bb'],
    explain: 'Bis is right next to the A key — minimal movement.' },
  { question: 'Going from B natural to Bb — which Bb works?',
    correct: 'side Bb', choices: ['side Bb','bis Bb','either works the same','none'],
    explain: 'Bis Bb fights with B natural; side Bb keeps your left hand free.' },
  { question: 'F♯ in a fast scale passage — best fingering choice?',
    correct: 'side F♯', choices: ['fork F♯','side F♯','altissimo F♯','low B'],
    explain: 'Side F♯ is closer to the surrounding notes in most scales.' },
  { question: '"1-and-1 Bb" means...',
    correct: 'left index + right index together (chromatic-friendly Bb)',
    choices: [
      'left index + right index together (chromatic-friendly Bb)',
      'pressing bis Bb twice',
      'one octave above plus one below',
      'only available on tenor',
    ],
    explain: 'Left index (B key) + right index (F key) together produces Bb — useful for chromatic runs.' },
  { question: 'Why have multiple fingerings for the same note?',
    correct: 'different fingerings make different passages easier',
    choices: ['they sound different','different fingerings make different passages easier','one is for alto, another for tenor','they don\'t — pick one and stick'],
    explain: 'Alternate fingerings save motion and prevent awkward jumps in fast passages.' },
]

function makeProblem(_d: Difficulty): GeneratedProblem {
  const q = pick(QUESTIONS)
  return {
    questionText: q.question,
    correctAnswer: q.correct,
    answerFormat: 'multiple-choice',
    choices: shuffle(q.choices).map((v) => ({ label: v, value: v })),
    checkWork: q.explain,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `fg-alternates-${d}`,
  topicId: 'fg-alternates',
  category: 'fingerings',
  title: 'Alternate fingerings',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
