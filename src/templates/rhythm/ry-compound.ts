import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'

interface CompoundSig {
  label: string         // '6/8'
  topNumber: number     // 6
  bigBeats: number      // 2
  feel: string          // 'compound duple'
}

const SIGS: CompoundSig[] = [
  { label: '6/8',  topNumber: 6,  bigBeats: 2, feel: 'compound duple' },
  { label: '9/8',  topNumber: 9,  bigBeats: 3, feel: 'compound triple' },
  { label: '12/8', topNumber: 12, bigBeats: 4, feel: 'compound quadruple' },
]

type Form =
  | 'big-beats'        // How many big beats per measure?
  | 'eighths-per-beat' // How many eighth notes in one big beat?
  | 'beat-note'        // What note gets the big beat?
  | 'grouping'         // Compound meter is grouped in...

const FORMS: Form[] = ['big-beats', 'eighths-per-beat', 'beat-note', 'grouping']

function makeProblem(d: Difficulty): GeneratedProblem {
  const sig = pick(SIGS)
  const form = pick(FORMS)

  let question = ''
  let correct = ''
  let choices: string[] = []
  let explain: string | undefined

  switch (form) {
    case 'big-beats': {
      question = `In ${sig.label} (${sig.feel}), how many big beats per measure?`
      correct = String(sig.bigBeats)
      choices = ['2', '3', '4', '6']
      if (!choices.includes(correct)) choices[0] = correct
      explain = `${sig.label}: ${sig.topNumber} eighths grouped into ${sig.bigBeats} big beats of 3.`
      break
    }
    case 'eighths-per-beat': {
      question = `In ${sig.label}, how many eighth notes are in ONE big beat?`
      correct = '3'
      choices = ['2', '3', '4', '6']
      explain = 'Compound meter groups eighths in threes per big beat.'
      break
    }
    case 'beat-note': {
      question = `In ${sig.label}, what note value gets one big beat?`
      correct = 'dotted quarter'
      choices = ['quarter', 'dotted quarter', 'dotted eighth', 'half']
      explain = 'Three eighth notes tied together = a dotted quarter.'
      break
    }
    case 'grouping': {
      question = `Compound meter (like ${sig.label}) groups eighth notes in...`
      correct = 'threes'
      choices = ['twos', 'threes', 'fours', 'fives']
      explain = 'Compound = each big beat divides into 3 smaller notes.'
      break
    }
  }

  return {
    questionText: question,
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: shuffle(choices).map((v) => ({ label: v, value: v })),
    checkWork: d !== 'hard' ? explain : undefined,
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
