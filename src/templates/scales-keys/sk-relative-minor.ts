import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { relativeMinor, relativeMajor } from '../../utils/music'

const EASY_KEYS = ['C', 'F', 'G', 'Bb', 'D']
const MID_KEYS  = [...EASY_KEYS, 'Eb', 'A', 'Ab']
const HARD_KEYS = [...MID_KEYS, 'Db', 'E', 'B', 'Gb']

function makeProblem(d: Difficulty): GeneratedProblem {
  const keys = d === 'easy' ? EASY_KEYS : d === 'medium' ? MID_KEYS : HARD_KEYS
  const root = pick(keys)
  // Direction: major → relative minor (most of the time) or minor → relative major
  const fromMajor = d === 'easy' ? true : Math.random() < 0.6

  if (fromMajor) {
    const answer = relativeMinor(`${root} major`)
    const distractorPool = keys.flatMap((k) => [`${k} minor`, `${k} major`])
      .filter((k) => k !== answer && k !== `${root} major`)
    const distractors = shuffle(distractorPool).slice(0, 3)
    const choices = shuffle([answer, ...distractors]).map((v) => ({ label: v, value: v }))
    return {
      questionText: `What's the relative minor of ${root} major?`,
      correctAnswer: answer,
      answerFormat: 'multiple-choice',
      choices,
      hint: d === 'easy' ? 'Down a minor 3rd from the major root. Same key signature.' : undefined,
      checkWork: `${root} major and ${answer} share the same key signature.`,
    }
  }

  const minorKey = `${root} minor`
  const answer = relativeMajor(minorKey)
  const distractorPool = keys.flatMap((k) => [`${k} major`, `${k} minor`])
    .filter((k) => k !== answer && k !== minorKey)
  const distractors = shuffle(distractorPool).slice(0, 3)
  const choices = shuffle([answer, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: `What's the relative major of ${minorKey}?`,
    correctAnswer: answer,
    answerFormat: 'multiple-choice',
    choices,
    hint: d === 'medium' ? 'Up a minor 3rd from the minor root.' : undefined,
    checkWork: `${minorKey} and ${answer} share the same key signature.`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-relative-minor-${d}`,
  topicId: 'sk-relative-minor',
  category: 'scales-keys',
  title: 'Relative minor / major',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
