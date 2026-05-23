import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { majorKeyFromCount, vexKeySignature } from '../../utils/music'

function chooseCount(d: Difficulty): number {
  if (d === 'easy')   return pick([1, 2])
  if (d === 'medium') return pick([1, 2, 3, 4])
  return pick([1, 2, 3, 4, 5, 6, 7])
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const count = chooseCount(d)
  const key = majorKeyFromCount(count)
  const vexKey = vexKeySignature(key)
  const allMajorKeys = ['C major','G major','D major','A major','E major','B major','F# major','C# major']
  const distractors = shuffle(allMajorKeys.filter((k) => k !== key)).slice(0, 3)
  const choices = shuffle([key, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: `This key signature has ${count} sharp${count === 1 ? '' : 's'}. What major key is it?`,
    correctAnswer: key,
    answerFormat: 'multiple-choice',
    choices,
    staffSpec: { clef: 'treble', keySignature: vexKey, notes: '' },
    hint: d === 'easy' ? 'Order of sharps: F C G D A E B. The key is a half step UP from the last sharp.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-keysig-sharps-${d}`,
  topicId: 'sk-keysig-sharps',
  category: 'scales-keys',
  title: 'Key signatures — sharps',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
