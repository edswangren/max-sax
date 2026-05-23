import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface Q { question: string; correct: 'tie' | 'slur'; explain: string }

const QUESTIONS: Q[] = [
  { question: 'A curved line connecting two notes of the SAME pitch.',           correct: 'tie',  explain: 'Tie = same pitch. Add the values; tongue only the first note.' },
  { question: 'A curved line over multiple notes of DIFFERENT pitches.',         correct: 'slur', explain: 'Slur = different pitches. Play smooth, no tonguing between.' },
  { question: 'You add the two note values together and play one long sound.',   correct: 'tie',  explain: 'That\'s what a tie does — combines durations of same pitch.' },
  { question: 'You only tongue the first note; the rest are connected smoothly.', correct: 'slur', explain: 'Slur = legato style across notes of different pitch.' },
  { question: 'Used to extend a note across a barline.',                          correct: 'tie',  explain: 'Ties carry duration across barlines (same pitch).' },
  { question: 'Used to indicate a phrase or smooth/legato passage.',             correct: 'slur', explain: 'Slurs indicate phrasing — sing the line, don\'t tongue every note.' },
  { question: 'Two G\'s joined by a curve — what is the curve called?',          correct: 'tie',  explain: 'Same pitch joined by a curve = tie.' },
  { question: 'A G to a B to a D joined by a curve — what is it?',               correct: 'slur', explain: 'Different pitches joined by a curve = slur.' },
]

function makeProblem(d: Difficulty): GeneratedProblem {
  const q = pick(QUESTIONS)
  return {
    questionText: q.question,
    correctAnswer: q.correct,
    answerFormat: 'multiple-choice',
    choices: shuffle(['tie', 'slur']).map((v) => ({ label: v, value: v })),
    checkWork: d === 'hard' ? undefined : q.explain,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `ry-ties-slurs-${d}`,
  topicId: 'ry-ties-slurs',
  category: 'rhythm',
  title: 'Ties vs slurs',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
