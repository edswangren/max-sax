import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { majorKeyFromCount, vexKeySignature } from '../../utils/music'

function chooseCount(d: Difficulty): number {
  const easyRange = [-2, -1, 0, 1, 2]
  const midRange = [-4,-3,-2,-1,0,1,2,3,4]
  const hardRange = [-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7]
  const range = d === 'easy' ? easyRange : d === 'medium' ? midRange : hardRange
  return pick(range)
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const count = chooseCount(d)
  const key = majorKeyFromCount(count)
  const vexKey = vexKeySignature(key)

  const allKeys = [
    'C major','G major','D major','A major','E major','B major','F# major','C# major',
    'F major','Bb major','Eb major','Ab major','Db major','Gb major','Cb major',
  ]
  const distractors = shuffle(allKeys.filter((k) => k !== key)).slice(0, 3)
  const choices = shuffle([key, ...distractors]).map((v) => ({ label: v, value: v }))

  return {
    questionText: `What major key uses this signature?`,
    correctAnswer: key,
    answerFormat: 'multiple-choice',
    choices,
    staffSpec: { clef: 'treble', keySignature: vexKey, notes: '' },
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-keysig-full-${d}`,
  topicId: 'sk-keysig-full',
  category: 'scales-keys',
  title: 'Key signatures — all',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
