import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Q { question: string; correct: string; choices: string[]; explain?: string }

const QUESTIONS: Q[] = [
  { question: 'The side Bb key is operated by which finger/hand?',
    correct: 'right index (side of palm)', choices: ['right index (side of palm)','left thumb','left pinky','right pinky'] },
  { question: 'The side C key is operated by which?',
    correct: 'right index (side of palm)', choices: ['right index (side of palm)','left middle finger','right middle finger','left pinky'] },
  { question: 'Why would you use side Bb instead of bis Bb?',
    correct: 'when going to or from B natural (so you don\'t have to lift bis)',
    choices: ['it sounds louder','it\'s easier to reach','when going to or from B natural (so you don\'t have to lift bis)','it\'s only for tenor'],
    explain: 'Bis Bb requires keeping the bis key pressed — awkward if you also need B natural nearby.' },
  { question: 'High F♯ alternate fingering (side F♯) is used because...',
    correct: 'it\'s faster than the fork fingering in many passages',
    choices: ['it sounds different','it\'s the only way to get F♯','it\'s faster than the fork fingering in many passages','it\'s used only in altissimo'] },
  { question: 'Bis Bb is the key between which two pearls?',
    correct: 'left index (B) and left middle (A)',
    choices: ['left index (B) and left middle (A)','left middle and left ring','right index and right middle','any of the side keys'] },
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
  id: `fg-side-keys-${d}`,
  topicId: 'fg-side-keys',
  category: 'fingerings',
  title: 'Side keys',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
