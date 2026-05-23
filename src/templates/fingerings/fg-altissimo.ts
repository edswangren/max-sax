import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Q { question: string; correct: string; choices: string[]; explain?: string }

const QUESTIONS: Q[] = [
  { question: 'Altissimo notes start above which note?',
    correct: 'palm F♯ (F♯6)',
    choices: ['middle C','top-line F (F5)','palm F♯ (F♯6)','high C (C7)'],
    explain: 'Standard sax range tops out at palm F♯. Anything higher is altissimo.' },
  { question: 'The biggest factor in playing altissimo cleanly is...',
    correct: 'voicing — using throat/oral cavity to support the high partial',
    choices: ['biting harder','blowing louder','voicing — using throat/oral cavity to support the high partial','using a softer reed'] },
  { question: 'A common altissimo G fingering uses which set of main pearls?',
    correct: 'no main pearls (just front-F or specific side key combos)',
    choices: ['all 6 main pearls','top 3 left pearls only','no main pearls (just front-F or specific side key combos)','bottom 3 right pearls'],
    explain: 'Altissimo fingerings rarely use the standard pearls in the same way — they exploit overtones.' },
  { question: 'Overtone exercises help altissimo because...',
    correct: 'they train your embouchure & voicing to lock on higher harmonics',
    choices: ['they\'re fun warmups','they train your embouchure & voicing to lock on higher harmonics','they require new fingerings','they\'re only for advanced reeds'] },
  { question: 'Front-F fingering is...',
    correct: 'the key above the B key (used to slot into altissimo positions)',
    choices: ['the same as palm F','the key above the B key (used to slot into altissimo positions)','only on tenor','a side key for F♯ only'] },
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
  id: `fg-altissimo-${d}`,
  topicId: 'fg-altissimo',
  category: 'fingerings',
  title: 'Altissimo intro',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
